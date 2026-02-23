import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { MapPin, DollarSign, BookOpen, Clock, Star, User, X, MessageCircle, CheckCircle, ArrowLeft, Globe, Video, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ChatWindow from '../../components/chat/ChatWindow';
import { motion } from 'framer-motion';

const TrainerProfile = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingMessage, setBookingMessage] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState('');
    const [showChat, setShowChat] = useState(false);

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                const { data } = await api.get(`/trainers/${id}`);
                setTrainer(data);
            } catch (err) {
                setError('Failed to load trainer details.');
            } finally {
                setLoading(false);
            }
        };
        fetchTrainer();
    }, [id]);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await api.get(`/reviews/${id}`);
                setReviews(data);
            } catch (err) {
                console.error('Failed to fetch reviews');
            }
        };
        if (id) fetchReviews();
    }, [id]);

    const handleBookSession = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) { navigate('/login'); return; }
        if (user.role === 'trainer') { alert("Trainers cannot book sessions."); return; }
        setBookingLoading(true);
        try {
            await api.post('/bookings', { trainer: trainer._id, date: bookingDate, message: bookingMessage });
            setBookingSuccess('Booking request sent successfully!');
            setTimeout(() => { setIsBookingModalOpen(false); setBookingSuccess(''); setBookingDate(''); setBookingMessage(''); }, 2000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to book session');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) { navigate('/login'); return; }
        setReviewLoading(true);
        setReviewError('');
        setReviewSuccess('');
        try {
            const { data } = await api.post('/reviews', { trainerId: id, rating: reviewRating, comment: reviewComment });
            setReviews([data, ...reviews]);
            setReviewSuccess('Review submitted successfully!');
            setReviewComment('');
            setReviewRating(5);
            // Refresh trainer to update rating
            const trainerRes = await api.get(`/trainers/${id}`);
            setTrainer(trainerRes.data);
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setReviewLoading(false);
        }
    };

    const toggleChat = () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        setShowChat(prev => !prev);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-14 h-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
            <p className="text-gray-500 font-medium">Loading trainer profile...</p>
        </div>
    );
    if (error) return <div className="text-center text-red-500 py-10 bg-red-50 rounded-2xl">{error}</div>;
    if (!trainer) return <div className="text-center py-10">Trainer not found</div>;

    const avatarGradients = ['from-blue-500 to-cyan-400', 'from-purple-500 to-pink-400', 'from-green-500 to-emerald-400', 'from-orange-500 to-amber-400'];
    const gradient = avatarGradients[trainer.user?.name?.charCodeAt(0) % 4 || 0];

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : (trainer.rating || 0).toFixed(1);

    return (
        <div className="max-w-5xl mx-auto space-y-6 relative">
            <Link to="/trainers" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Trainers
            </Link>

            {/* Hero Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-premium overflow-hidden">
                <div className={`h-40 md:h-52 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={toggleChat} className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-full hover:bg-white/30 transition-all">
                            <MessageCircle size={17} /> Message
                        </button>
                        <button onClick={() => setIsBookingModalOpen(true)} className="flex items-center gap-2 px-5 py-2 bg-white text-indigo-700 font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            Book Session
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    <div className="flex items-end gap-5 -mt-12 mb-6">
                        <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-white flex-shrink-0`}>
                            {trainer.user?.name?.charAt(0) || <User />}
                        </div>
                        <div className="pb-2">
                            <h1 className="text-3xl font-black text-gray-900">{trainer.user?.name}</h1>
                            <p className="text-gray-500 font-medium mt-0.5">{trainer.skills?.join(' • ')}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {[
                            { icon: <MapPin size={15} className="text-rose-500" />, label: trainer.location || 'Remote', bg: 'bg-rose-50 border-rose-100' },
                            { icon: <DollarSign size={15} className="text-green-500" />, label: trainer.price ? `$${trainer.price}/hr` : 'Contact for price', bg: 'bg-green-50 border-green-100' },
                            { icon: <Clock size={15} className="text-blue-500" />, label: trainer.experience ? `${trainer.experience} Yrs Experience` : 'Experienced', bg: 'bg-blue-50 border-blue-100' },
                            { icon: <Star size={15} className="text-yellow-500 fill-yellow-400" />, label: `${avgRating} Rating (${reviews.length} reviews)`, bg: 'bg-yellow-50 border-yellow-100' },
                        ].map((item, i) => (
                            <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold text-gray-700 ${item.bg}`}>
                                {item.icon} {item.label}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* About */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-premium p-8">
                        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen size={20} className="text-indigo-500" /> About Me
                        </h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{trainer.bio || "No biography provided."}</p>
                    </motion.div>

                    {/* Qualifications */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-premium p-8">
                        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-500" /> Qualifications
                        </h2>
                        {trainer.qualifications ? (
                            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl">
                                <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                                <p className="text-gray-700 font-medium">{trainer.qualifications}</p>
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No specific qualifications listed.</p>
                        )}
                    </motion.div>

                    {/* ★ Reviews Section */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-premium p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <Star size={20} className="text-yellow-500" /> Reviews & Ratings
                            </h2>
                            <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-100">
                                <Star size={16} className="text-yellow-500 fill-yellow-400" />
                                <span className="font-black text-gray-800">{avgRating}</span>
                                <span className="text-gray-400 text-sm">({reviews.length})</span>
                            </div>
                        </div>

                        {/* Submit Review Form */}
                        {isAuthenticated && user?.role === 'learner' && (
                            <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100 rounded-2xl">
                                <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
                                {reviewSuccess && (
                                    <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                                        <CheckCircle size={16} /> {reviewSuccess}
                                    </div>
                                )}
                                {reviewError && (
                                    <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                                        <span className="font-bold">!</span> {reviewError}
                                    </div>
                                )}
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    {/* Star Rating Picker */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="p-1 transition-transform hover:scale-125"
                                                >
                                                    <Star
                                                        size={28}
                                                        className={`transition-colors ${star <= (hoverRating || reviewRating)
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-300'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Comment</label>
                                        <textarea
                                            rows="3"
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            required
                                            placeholder="Share your experience with this trainer..."
                                            className="input-premium resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={reviewLoading}
                                        className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all ${reviewLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        <Send size={16} />
                                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Reviews List */}
                        {reviews.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-2xl">
                                <div className="text-4xl mb-3">⭐</div>
                                <h3 className="font-bold text-gray-700 mb-1">No reviews yet</h3>
                                <p className="text-gray-400 text-sm">Be the first to leave a review for this trainer!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review, idx) => (
                                    <div key={idx} className="p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-sm transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-sm">
                                                    {review.learner?.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">{review.learner?.name || 'Anonymous'}</h4>
                                                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-premium p-6">
                        <h3 className="font-black text-gray-900 mb-5">Training Mode</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Online', icon: <Video size={16} />, available: ['online', 'both'].includes(trainer.mode) },
                                { label: 'In-Person', icon: <Globe size={16} />, available: ['offline', 'both'].includes(trainer.mode) },
                            ].map((mode, i) => (
                                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${mode.available ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className={`flex items-center gap-2.5 font-semibold text-sm ${mode.available ? 'text-green-700' : 'text-gray-400'}`}>{mode.icon} {mode.label}</div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${mode.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>{mode.available ? 'Available ✓' : 'N/A'}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={`p-6 rounded-3xl bg-gradient-to-br ${gradient} text-white`}>
                        <h3 className="font-black text-lg mb-2">Ready to start?</h3>
                        <p className="text-white/80 text-sm mb-4">Book a 1-on-1 session and start your learning journey today.</p>
                        <button onClick={() => setIsBookingModalOpen(true)} className="w-full py-3 bg-white text-indigo-700 font-black rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:-translate-y-0.5">
                            Book a Session →
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Booking Modal */}
            {isBookingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
                        <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"><X size={16} className="text-gray-600" /></button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-black`}>{trainer.user?.name?.charAt(0)}</div>
                            <div><h2 className="text-xl font-black text-gray-900">Book a Session</h2><p className="text-gray-400 text-sm">with {trainer.user?.name}</p></div>
                        </div>
                        {bookingSuccess ? (
                            <div className="py-8 text-center">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-green-600" /></div>
                                <p className="text-green-700 font-bold text-lg">{bookingSuccess}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleBookSession} className="space-y-5">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Date & Time</label><input type="datetime-local" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="input-premium" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Message to Trainer</label><textarea rows="4" placeholder="Briefly describe what you want to learn..." value={bookingMessage} onChange={(e) => setBookingMessage(e.target.value)} className="input-premium resize-none" /></div>
                                <button type="submit" disabled={bookingLoading} className={`w-full btn-primary py-3.5 rounded-xl ${bookingLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>{bookingLoading ? 'Sending Request...' : 'Confirm Booking →'}</button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}

            {showChat && trainer.user && <ChatWindow receiverId={trainer.user._id} receiverName={trainer.user.name} onClose={() => setShowChat(false)} />}
        </div>
    );
};

export default TrainerProfile;
