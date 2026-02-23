import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, ArrowRight, GraduationCap, Zap, Star, Users, BookOpen } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', formData);
            if (response.data && response.data.token) {
                const { token, ...user } = response.data;
                login(user, token);
                navigate('/dashboard');
            } else {
                setError('Invalid server response');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await api.post('/auth/google', { token: credentialResponse.credential });
            if (res.data && res.data.token) {
                const { token, ...user } = res.data;
                login(user, token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Google Login Failed');
        }
    };

    const features = [
        { icon: <Star size={18} className="text-yellow-400" />, text: '10,000+ Happy Learners' },
        { icon: <Users size={18} className="text-blue-400" />, text: '500+ Expert Trainers' },
        { icon: <BookOpen size={18} className="text-green-400" />, text: '50+ Skill Categories' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Side — Illustration Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                {/* Animated blobs */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob" />
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-blue-300/15 rounded-full blur-2xl animate-blob" style={{ animationDelay: '4s' }} />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '32px 32px'
                    }}
                />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-white">SkillConnect</span>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-5xl font-black text-white leading-tight mb-4">
                                Welcome<br />
                                <span className="text-white/70">back! 👋</span>
                            </h2>
                            <p className="text-white/80 text-lg leading-relaxed max-w-sm">
                                Sign in to continue your learning journey with world-class expert trainers.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="space-y-4">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                                        {f.icon}
                                    </div>
                                    <span className="text-white font-semibold">{f.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-white/50 text-sm">© 2025 SkillConnect. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side — Form */}
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
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Sign in to your account</h1>
                        <p className="text-gray-500 font-medium">Access your personalized learning dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-red-600 font-bold text-xs">!</div>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input-premium pl-11"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <Link to="/forgot-password" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="input-premium pl-11"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full btn-primary py-3.5 rounded-xl text-base ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-sm text-gray-400 font-medium">or continue with</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                        />
                    </div>

                    <p className="text-center mt-6 text-sm text-gray-500">
                        New to Skill Connect?{' '}
                        <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                            Create a free account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
