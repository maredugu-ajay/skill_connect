import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import { Send, X, MessageCircle } from 'lucide-react';

const ChatWindow = ({ receiverId, receiverName, onClose }) => {
    const { user } = useAuth();
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await api.get(`/chat/${receiverId}`);
                setMessages(data);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };
        if (receiverId) fetchMessages();
    }, [receiverId]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            // Only add message if it belongs to this chat
            if (message.sender._id === receiverId || message.receiver._id === receiverId) {
                setMessages((prev) => [...prev, message]);
            }
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, receiverId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const { data } = await api.post('/chat', {
                receiver: receiverId,
                message: newMessage,
            });
            setMessages((prev) => [...prev, data]);
            setNewMessage('');
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-t-xl rounded-bl-xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-primary p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    <span className="font-bold">{receiverName}</span>
                </div>
                <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm mt-4">Start a conversation...</div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender._id === user._id || msg.sender === user._id;
                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] p-3 rounded-xl text-sm ${isMe
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                    }`}>
                                    <p>{msg.message}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
                <button
                    type="submit"
                    className="p-2 bg-primary text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    disabled={!newMessage.trim()}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
