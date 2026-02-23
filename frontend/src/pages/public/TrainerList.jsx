import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, MapPin, DollarSign, BookOpen, Star, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TrainerList = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTrainers = async (keyword = '') => {
        setLoading(true);
        try {
            const { data } = await api.get(`/trainers?keyword=${keyword}`);
            setTrainers(data);
            setError('');
        } catch (err) {
            setError('Failed to load trainers. Please try again later.');
            setTrainers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTrainers(); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTrainers(searchTerm);
    };

    const avatarColors = [
        'from-blue-500 to-cyan-400',
        'from-purple-500 to-pink-400',
        'from-green-500 to-emerald-400',
        'from-orange-500 to-amber-400',
        'from-rose-500 to-pink-500',
        'from-indigo-500 to-violet-500',
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 text-center shadow-2xl">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '28px 28px' }} />
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-white text-sm font-semibold mb-4">
                        <Sparkles size={14} /> 500+ Expert Trainers Available
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                        Find Your Perfect Mentor
                    </h1>
                    <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                        Search by skill, technology, or expertise. Get matched with top-rated trainers.
                    </p>

                    {/* Premium Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
                            <div className="flex items-center flex-1 px-5 py-1">
                                <Search size={20} className="text-gray-400 mr-3 flex-shrink-0" />
                                <input
                                    type="text"
                                    className="w-full py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none font-medium text-base bg-transparent"
                                    placeholder="e.g. React, Python, Digital Marketing..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex items-center gap-2 m-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
                            >
                                <Search size={18} />
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {loading ? 'Loading...' : `${trainers.length} Trainers Found`}
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">Showing all available trainers</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold cursor-pointer hover:border-indigo-300 hover:text-indigo-600 transition-all">
                    <SlidersHorizontal size={16} />
                    Filters
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="w-14 h-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                    <p className="text-gray-500 font-medium">Finding the best trainers for you...</p>
                </div>
            ) : error ? (
                <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-red-600 font-semibold text-lg">{error}</p>
                </div>
            ) : trainers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4 text-4xl">🔍</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No trainers found</h3>
                    <p className="text-gray-500">Try a different search term or browse all trainers.</p>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
                    {trainers.map((trainer, idx) => (
                        <motion.div
                            key={trainer._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="card-premium group flex flex-col overflow-hidden"
                        >
                            {/* Card Header with gradient */}
                            <div className={`h-20 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} relative`}>
                                <div className="absolute inset-0 opacity-20"
                                    style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
                            </div>

                            <div className="px-6 pt-0 pb-6 flex flex-col flex-1 -mt-10">
                                {/* Avatar & badge */}
                                <div className="flex items-end justify-between mb-4">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-2xl font-black shadow-lg border-4 border-white`}>
                                        {trainer.user?.name?.charAt(0) || 'T'}
                                    </div>
                                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-white border border-gray-100 text-gray-600 shadow-sm capitalize">
                                        {trainer.mode === 'both' ? '🌐 Online & Offline' : trainer.mode === 'online' ? '💻 Online' : '📍 Offline'}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                    {trainer.user?.name || 'Expert Trainer'}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-5 leading-relaxed">
                                    {trainer.bio || 'Expert trainer ready to help you achieve your goals.'}
                                </p>

                                <div className="mt-auto space-y-2.5">
                                    <div className="flex items-center text-sm text-gray-500 gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                            <BookOpen size={14} className="text-indigo-500" />
                                        </div>
                                        <span className="truncate font-medium">{trainer.skills?.join(', ') || 'Multiple Skills'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-pink-50 flex items-center justify-center flex-shrink-0">
                                            <MapPin size={14} className="text-pink-500" />
                                        </div>
                                        <span className="font-medium">{trainer.location || 'Remote'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                                <DollarSign size={14} className="text-green-500" />
                                            </div>
                                            <span className="font-bold text-gray-800 text-base">
                                                {trainer.price ? `$${trainer.price}/hr` : 'Contact for price'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-sm font-semibold text-gray-700">{trainer.rating || '4.8'}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={`/trainers/${trainer._id}`}
                                    className="mt-5 block w-full text-center py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all shine"
                                >
                                    View Profile →
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrainerList;
