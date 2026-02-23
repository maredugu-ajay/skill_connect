import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Users, DollarSign, Calendar, TrendingUp, Check, X, Clock, MessageCircle, Sparkles, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import ChatWindow from '../../components/chat/ChatWindow';

const TrainerDashboard = () => {
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
        socket.on('new_booking', (newBooking) => {
            setBookings(prev => {
                if (prev.find(b => b._id === newBooking._id)) return prev;
                showToast(`New booking from ${newBooking.learner?.name || 'a student'}!`, 'info');
                return [newBooking, ...prev];
            });
        });
        return () => socket.off('new_booking');
    }, [socket]);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}`, { status });
            setBookings(bookings.map(book => book._id === id ? { ...book, status } : book));
            showToast(`Booking ${status} successfully!`, status === 'accepted' ? 'success' : 'error');
        } catch (err) {
            showToast("Failed to update status", 'error');
        }
    };

    const stats = [
        { label: 'Total Students', value: '24', icon: <Users size={22} />, gradient: 'from-blue-500 to-cyan-400', bg: 'from-blue-50 to-cyan-50', change: '+8%' },
        { label: 'Total Earnings', value: '$1,250', icon: <DollarSign size={22} />, gradient: 'from-green-500 to-emerald-400', bg: 'from-green-50 to-emerald-50', change: '+12%' },
        { label: 'Sessions This Month', value: bookings.filter(b => b.status === 'accepted').length.toString(), icon: <Calendar size={22} />, gradient: 'from-purple-500 to-pink-400', bg: 'from-purple-50 to-pink-50', change: '+5%' },
        { label: 'Profile Views', value: '156', icon: <TrendingUp size={22} />, gradient: 'from-orange-400 to-red-400', bg: 'from-orange-50 to-red-50', change: '+20%' },
    ];

    const getStatusBadge = (status) => ({
        pending: 'bg-amber-100 text-amber-700 border-amber-200',
        accepted: 'bg-green-100 text-green-700 border-green-200',
        rejected: 'bg-red-100 text-red-700 border-red-200',
    }[status] || 'bg-gray-100 text-gray-700 border-gray-200');

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative">
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
                        <Bell size={18} />
                        <span className="flex-1">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="p-1 rounded-full hover:bg-white/20 transition"><X size={14} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl"
            >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-semibold mb-3">
                            <Sparkles size={14} /> Trainer Control Center
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black mb-2">
                            Hello, <span className="text-yellow-300">{user?.name?.split(' ')[0]}</span>! 🎓
                        </h1>
                        <p className="text-white/80 text-lg">
                            Manage your bookings, students, and earnings all in one place.
                        </p>
                    </div>
                    <Link
                        to="/edit-profile"
                        className="flex-shrink-0 px-6 py-3 bg-white text-purple-700 font-black rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        ✏️ Edit Profile
                    </Link>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={`card-premium p-6 bg-gradient-to-br ${stat.bg}`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg`}>
                                {stat.icon}
                            </div>
                            <span className="text-xs font-black text-green-600 bg-green-100 px-2.5 py-1 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Booking Requests Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-premium overflow-hidden"
            >
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">Booking Requests</h2>
                        <p className="text-gray-400 text-sm mt-0.5">Manage all incoming session requests</p>
                    </div>
                    <div className="px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 font-bold text-sm">
                        {bookings.filter(b => b.status === 'pending').length} Pending
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                <th className="px-8 py-5">Student</th>
                                <th className="px-8 py-5">Date & Time</th>
                                <th className="px-8 py-5">Message</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="5" className="px-8 py-12 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
                                        <span className="text-gray-400 font-medium">Loading requests...</span>
                                    </div>
                                </td></tr>
                            ) : bookings.length === 0 ? (
                                <tr><td colSpan="5" className="px-8 py-16 text-center">
                                    <div className="text-4xl mb-3">📭</div>
                                    <h3 className="font-bold text-gray-700 mb-1">No booking requests yet</h3>
                                    <p className="text-gray-400 text-sm">Complete your profile to attract more students.</p>
                                </td></tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black shadow-sm">
                                                    {booking.learner?.name?.[0] || 'S'}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 block">{booking.learner?.name || 'Unknown User'}</span>
                                                    <span className="text-xs text-gray-400">Learner</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                                                <Clock size={15} className="text-gray-400" />
                                                {new Date(booking.date).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 ml-5">{new Date(booking.date).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-8 py-5 text-gray-600 text-sm max-w-xs truncate">{booking.message || 'No message'}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1.5 rounded-xl text-xs font-black border capitalize ${getStatusBadge(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex gap-2 items-center">
                                                <button
                                                    onClick={() => setActiveChat({ id: booking.learner._id, name: booking.learner.name })}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="Message Student"
                                                >
                                                    <MessageCircle size={17} />
                                                </button>
                                                {booking.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(booking._id, 'accepted')}
                                                            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 shadow-sm transition-all"
                                                        >
                                                            <Check size={13} /> Accept
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(booking._id, 'rejected')}
                                                            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                                                        >
                                                            <X size={13} /> Decline
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status !== 'pending' && (
                                                    <span className="text-xs text-gray-400 italic">Action taken</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {activeChat && (
                <ChatWindow receiverId={activeChat.id} receiverName={activeChat.name} onClose={() => setActiveChat(null)} />
            )}
        </motion.div>
    );
};

export default TrainerDashboard;
