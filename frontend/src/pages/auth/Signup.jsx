import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, ArrowRight, GraduationCap, BookOpen, Star } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'learner'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        try {
            const { confirmPassword, ...signupData } = formData;
            const response = await api.post('/auth/signup', signupData);
            if (response.data && response.data.token) {
                const { token, ...user } = response.data;
                login(user, token);
                navigate('/dashboard');
            } else {
                setError('Invalid server response');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await api.post('/auth/google', {
                token: credentialResponse.credential,
                role: formData.role
            });
            if (res.data && res.data.token) {
                const { token, ...user } = res.data;
                login(user, token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Google Signup Failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <GraduationCap className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SkillConnect</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Create your account</h1>
                        <p className="text-gray-500 font-medium">Join thousands of learners and expert trainers</p>
                    </div>

                    {error && (
                        <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-red-600 font-bold text-xs">!</div>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-premium pl-11" placeholder="John Doe" />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-premium pl-11" placeholder="you@example.com" />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">I want to join as</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['learner', 'trainer'].map(role => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role })}
                                        className={`relative flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border-2 transition-all font-semibold text-sm capitalize ${formData.role === role
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100'
                                                : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:bg-indigo-50/50'
                                            }`}
                                    >
                                        {role === 'learner' ? <BookOpen size={22} /> : <Star size={22} />}
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                        {formData.role === role && (
                                            <span className="absolute top-2 right-2 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                                                <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input-premium pl-11" placeholder="Min 6 characters" />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="input-premium pl-11" placeholder="Confirm your password" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full btn-primary py-3.5 rounded-xl text-base mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Creating account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">Create Account <ArrowRight size={18} /></span>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-sm text-gray-400 font-medium">or sign up with</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Signup Failed')}
                            text="signup_with"
                        />
                    </div>

                    <p className="text-center mt-6 text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Sign in</Link>
                    </p>
                </div>
            </div>

            {/* Right Side — Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob" />
                    <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
                </div>
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-white">SkillConnect</span>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-5xl font-black text-white leading-tight mb-4">
                                Start your<br /><span className="text-white/70">journey today 🚀</span>
                            </h2>
                            <p className="text-white/80 text-lg leading-relaxed max-w-sm">
                                Join thousands of learners connecting with expert trainers for 1-on-1 personalized coaching.
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                            <div className="flex gap-1 mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
                            </div>
                            <p className="text-white/90 italic mb-4 leading-relaxed">"I learned Python in just 4 weeks with my mentor. The experience was absolutely incredible!"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-bold">R</div>
                                <div>
                                    <p className="text-white font-bold text-sm">Rahul Verma</p>
                                    <p className="text-white/60 text-xs">Python Learner</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-white/50 text-sm">© 2025 SkillConnect. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
