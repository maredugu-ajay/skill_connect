import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { BookOpen, Calendar, Star, Clock, ArrowRight, MoreHorizontal, MessageCircle, X, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import ChatWindow from '../../components/chat/ChatWindow';

const LearnerDashboard = () => {
    const { user } = useAuth();
    const socket = useSocket();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChat, setActiveChat] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings');
                setBookings(data);
            } catch (err) {
                console.error("Failed to fetch bookings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('booking_status_updated', (updatedBooking) => {
            setBookings(prev => prev.map(booking =>
                booking._id === updatedBooking._id ? { ...booking, status: updatedBooking.status } : booking
            ));
            const statusLabel = updatedBooking.status.charAt(0).toUpperCase() + updatedBooking.status.slice(1);
            showToast(`Booking ${statusLabel}! Your session was ${updatedBooking.status}.`,
                updatedBooking.status === 'accepted' ? 'success' : 'error');
        });
        return () => socket.off('booking_status_updated');
    }, [socket]);

    const stats = [
        { label: 'Active Courses', value: '3', icon: <BookOpen size={22} />, gradient: 'from-blue-500 to-cyan-400', bg: 'from-blue-50 to-cyan-50', text: 'text-blue-600' },
        { label: 'Upcoming Sessions', value: bookings.filter(b => b.status === 'accepted').length.toString(), icon: <Calendar size={22} />, gradient: 'from-purple-500 to-pink-400', bg: 'from-purple-50 to-pink-50', text: 'text-purple-600' },
        { label: 'Hours Learned', value: '12h', icon: <Clock size={22} />, gradient: 'from-green-500 to-emerald-400', bg: 'from-green-50 to-emerald-50', text: 'text-green-600' },
        { label: 'Reviews Given', value: '5', icon: <Star size={22} />, gradient: 'from-yellow-400 to-orange-400', bg: 'from-yellow-50 to-orange-50', text: 'text-yellow-600' },
    ];

    const recommended = [
        { title: 'Advanced Python Design Patterns', tag: 'New', tagGradient: 'from-blue-500 to-indigo-500', desc: 'Upgrade your backend skills with real-world patterns' },
        { title: 'UI/UX Fundamentals', tag: 'Popular', tagGradient: 'from-purple-500 to-pink-500', desc: 'Learn to design beautiful, intuitive apps' }
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted': return { bar: 'border-l-green-500', bg: 'bg-green-50', badge: 'bg-green-100 text-green-700' };
            case 'pending': return { bar: 'border-l-amber-400', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700' };
            case 'rejected': return { bar: 'border-l-red-400', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700' };
            default: return { bar: 'border-l-gray-300', bg: 'bg-gray-50', badge: 'bg-gray-100 text-gray-700' };
        }
    };

    const handleOpenChat = (booking) => {
        const trainerUserId = booking.trainer?.user?._id;
        const trainerName = booking.trainer?.user?.name;
        if (trainerUserId && trainerName) setActiveChat({ id: trainerUserId, name: trainerName });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white font-semibold max-w-sm backdrop-blur-sm
                            ${toast.type === 'success' ? 'bg-green-500/90' : toast.type === 'error' ? 'bg-red-500/90' : 'bg-indigo-500/90'}`}
                    >
                        <span className="flex-1">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="p-1 rounded-full hover:bg-white/20 transition"><X size={14} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Welcome Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl"
            >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 left-10 w-40 h-40 bg-pink-300/20 rounded-full blur-2xl" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-semibold mb-3">
                            <Sparkles size={14} /> Your Learning Hub
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black mb-2">
                            Welcome back, <span className="text-yellow-300">{user?.name?.split(' ')[0]}</span>! 👋
                        </h1>
                        <p className="text-white/80 text-lg">
                            You have <strong>{bookings.filter(b => b.status === 'accepted').length}</strong> upcoming sessions. Keep up the momentum!
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-5 py-3">
                        <TrendingUp size={24} className="text-yellow-300" />
                        <div>
                            <p className="text-white font-black text-xl">Level 3</p>
                            <p className="text-white/70 text-xs font-medium">Intermediate Learner</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={`card-premium p-5 bg-gradient-to-br ${stat.bg}`}
                    >
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 text-white shadow-lg`}>
                            {stat.icon}
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                        <p className={`text-xs font-bold ${stat.text} uppercase tracking-wide mt-1`}>{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Sessions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 card-premium p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-gray-900">Your Sessions</h2>
                        <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="flex items-center justify-center h-32 gap-3">
                                <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
                                <span className="text-gray-400 font-medium">Loading...</span>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                <div className="text-4xl mb-3">📅</div>
                                <h3 className="font-bold text-gray-700 mb-1">No sessions yet</h3>
                                <p className="text-gray-400 text-sm">Book a session with a trainer to get started!</p>
                            </div>
                        ) : (
                            bookings.map((booking, i) => {
                                const s = getStatusStyle(booking.status);
                                return (
                                    <div key={i} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border-l-4 ${s.bar} ${s.bg} gap-3 group hover:shadow-sm transition-all`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-black text-white text-lg shadow-md">
                                                {booking.trainer?.user?.name?.[0] || 'T'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{booking.trainer?.user?.name || 'Trainer'}</h4>
                                                <p className="text-sm text-gray-500 mt-0.5">{booking.message || 'No description'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 pl-16 sm:pl-0">
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-800">{new Date(booking.date).toLocaleString()}</p>
                                                <span className={`inline-block text-xs px-3 py-1 rounded-full font-bold capitalize mt-1 ${s.badge}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            {booking.trainer?.user?._id && (
                                                <button
                                                    onClick={() => handleOpenChat(booking)}
                                                    title="Message Trainer"
                                                    className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                                                >
                                                    <MessageCircle size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>

                {/* Recommended */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card-premium p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-gray-900">Recommended</h2>
                        <button className="text-indigo-500 hover:text-indigo-700 text-sm font-bold transition-colors">View All</button>
                    </div>
                    <div className="space-y-4">
                        {recommended.map((item, i) => (
                            <div key={i} className="p-5 border border-gray-100 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer bg-white group">
                                <span className={`text-xs font-black px-3 py-1 rounded-full text-white bg-gradient-to-r ${item.tagGradient} inline-block mb-3`}>
                                    {item.tag}
                                </span>
                                <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{item.title}</h4>
                                <p className="text-sm text-gray-400 mt-2 leading-relaxed">{item.desc}</p>
                                <div className="mt-4 flex items-center text-indigo-600 text-sm font-bold gap-1 group-hover:gap-2 transition-all">
                                    Learn More <ArrowRight size={15} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {activeChat && (
                <ChatWindow receiverId={activeChat.id} receiverName={activeChat.name} onClose={() => setActiveChat(null)} />
            )}
        </motion.div>
    );
};

export default LearnerDashboard;
