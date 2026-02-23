import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Save, User, DollarSign, BookOpen, MapPin, Briefcase, FileText, ArrowLeft, CheckCircle, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const EditProfile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.role !== 'trainer') navigate('/dashboard');
    }, [user, navigate]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        skills: '', experience: '', location: '', price: '', mode: 'online', qualifications: '', bio: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/trainers/profile');
                if (data && data._id) {
                    setFormData({
                        skills: data.skills ? data.skills.join(', ') : '',
                        experience: data.experience || '',
                        location: data.location || '',
                        price: data.price || '',
                        mode: data.mode || 'online',
                        qualifications: data.qualifications || '',
                        bio: data.bio || ''
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');
        try {
            const payload = { ...formData, skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean) };
            await api.post('/trainers/profile', payload);
            setSuccess('Profile updated successfully!');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-14 h-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
            <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
    );

    const inputClass = "input-premium";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5";

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
            <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>

            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <GraduationCap size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black">Edit Your Profile</h1>
                        <p className="text-white/70 mt-1">Update your details to attract more students</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="card-premium p-8">
                {error && (
                    <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-red-600 font-bold text-xs">!</div>
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm">
                        <CheckCircle size={18} className="text-green-500" />
                        <span className="font-medium">{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}><Briefcase size={15} className="text-indigo-500" /> Experience (Years)</label>
                            <input type="number" name="experience" value={formData.experience} onChange={handleChange} className={inputClass} placeholder="e.g. 5" />
                        </div>
                        <div>
                            <label className={labelClass}><DollarSign size={15} className="text-green-500" /> Hourly Rate ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} placeholder="e.g. 50" />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}><BookOpen size={15} className="text-purple-500" /> Skills (Comma separated)</label>
                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} className={inputClass} placeholder="e.g. React, Node.js, Python, Digital Marketing" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}><MapPin size={15} className="text-rose-500" /> Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="e.g. New York, USA" />
                        </div>
                        <div>
                            <label className={labelClass}>Training Mode</label>
                            <select name="mode" value={formData.mode} onChange={handleChange} className={inputClass}>
                                <option value="online">🌐 Online</option>
                                <option value="offline">📍 Offline (In-Person)</option>
                                <option value="both">🔄 Both</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}><FileText size={15} className="text-blue-500" /> Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} placeholder="Tell students about yourself, your teaching style, and experience..." />
                    </div>

                    <div>
                        <label className={labelClass}>Qualifications & Certifications</label>
                        <textarea name="qualifications" value={formData.qualifications} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Your degrees, certifications, and achievements..." />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving}
                            className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-0.5 transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            <Save size={18} />
                            {isSaving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default EditProfile;
