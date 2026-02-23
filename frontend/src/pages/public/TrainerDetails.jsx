import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { MapPin, DollarSign, BookOpen, Clock, Award, Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const TrainerDetails = () => {
    const { id } = useParams();
    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                const { data } = await api.get(`/trainers/${id}`);
                setTrainer(data);
            } catch (err) {
                setError('Trainer not found');
            } finally {
                setLoading(false);
            }
        };
        fetchTrainer();
    }, [id]);

    if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div></div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold text-xl">{error}</div>;
    if (!trainer) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="bg-white p-2 rounded-full">
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700 border-4 border-white">
                                {trainer.user?.name?.charAt(0)}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-6 py-2 bg-primary text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                                Book Now
                            </button>
                            <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600">
                                <MessageSquare size={20} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{trainer.user?.name}</h1>
                        <p className="text-gray-500 font-medium mt-1">{trainer.qualifications || 'Certified Trainer'}</p>

                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <MapPin size={16} /> {trainer.location || 'Remote'}
                            </div>
                            <div className="flex items-center gap-1">
                                <DollarSign size={16} /> ${trainer.price}/hr
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={16} /> {trainer.experience || '1+'} Years Exp.
                            </div>
                            <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                                <Star size={16} fill="currentColor" /> 5.0 (12 Reviews)
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 space-y-8"
                >
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {trainer.bio || "No bio provided yet."}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                            {trainer.skills?.map((skill, index) => (
                                <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Training Mode</h3>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Award className="text-primary" />
                            <span className="font-medium text-gray-700 capitalize">
                                {trainer.mode === 'both' ? 'Online & Offline' : trainer.mode} Training
                            </span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary to-blue-700 p-6 rounded-3xl shadow-lg text-white">
                        <h3 className="font-bold text-lg mb-2">Want to learn with {trainer.user?.name}?</h3>
                        <p className="text-blue-100 text-sm mb-6">Book a session today and start your journey.</p>
                        <button className="w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-colors">
                            Check Availability
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TrainerDetails;
