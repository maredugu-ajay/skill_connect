import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, GraduationCap, Zap, ArrowRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const categories = [
        { name: 'Programming & Development', path: '/trainers?keyword=programming' },
        { name: 'Data Science & AI', path: '/trainers?keyword=data science' },
        { name: 'Business & Finance', path: '/trainers?keyword=business' },
        { name: 'Communication Skills', path: '/trainers?keyword=communication' },
        { name: 'Sports & Fitness', path: '/trainers?keyword=fitness' },
        { name: 'Music & Arts', path: '/trainers?keyword=music' },
        { name: 'Career & Interview Prep', path: '/trainers?keyword=career' },
        { name: 'Language Learning', path: '/trainers?keyword=language' },
        { name: 'Personal Development', path: '/trainers?keyword=development' },
    ];

    const socials = [
        { icon: <Instagram size={18} />, href: '#', color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500' },
        { icon: <Linkedin size={18} />, href: '#', color: 'hover:bg-blue-600' },
        { icon: <Twitter size={18} />, href: '#', color: 'hover:bg-blue-400' },
        { icon: <Youtube size={18} />, href: '#', color: 'hover:bg-red-600' },
        { icon: <Facebook size={18} />, href: '#', color: 'hover:bg-blue-700' },
    ];

    return (
        <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black text-gray-400">
            {/* Top gradient border */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* Background glow effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative container mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/50 group-hover:shadow-indigo-500/50 transition-shadow">
                                <GraduationCap className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xl font-black text-white block leading-none">Skill</span>
                                <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent leading-none">Connect</span>
                            </div>
                        </Link>

                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                            Connecting learners with world-class trainers. Discover, learn, and grow with expert 1-on-1 coaching.
                        </p>

                        {/* Contact */}
                        <div className="space-y-3 mb-8 text-sm">
                            <a href="mailto:support@skillconnect.com" className="flex items-center gap-3 text-gray-400 hover:text-indigo-400 transition-colors group">
                                <div className="w-8 h-8 rounded-xl bg-gray-800 group-hover:bg-indigo-900/50 flex items-center justify-center transition-colors">
                                    <Mail size={14} />
                                </div>
                                support@skillconnect.com
                            </a>
                            <a href="tel:+919876543210" className="flex items-center gap-3 text-gray-400 hover:text-indigo-400 transition-colors group">
                                <div className="w-8 h-8 rounded-xl bg-gray-800 group-hover:bg-indigo-900/50 flex items-center justify-center transition-colors">
                                    <Phone size={14} />
                                </div>
                                +91-9876543210
                            </a>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center">
                                    <MapPin size={14} />
                                </div>
                                Hyderabad, India
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="flex gap-3">
                            {socials.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    className={`w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:-translate-y-1 ${social.color}`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="lg:col-span-5">
                        <h3 className="text-white font-black text-lg mb-6">Skill Categories</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                            {categories.map((cat, idx) => (
                                <Link
                                    key={idx}
                                    to={cat.path}
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors group"
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:w-2.5 transition-all`} />
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="lg:col-span-3">
                        <h3 className="text-white font-black text-lg mb-6">Get Started</h3>
                        <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-sm border border-indigo-700/40 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold">
                                <Zap size={16} className="text-yellow-400" />
                                Join 10,000+ Learners
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Start your skill-building journey today with expert mentors.
                            </p>
                            <Link
                                to="/signup"
                                className="flex items-center gap-2 w-full justify-center py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-900/50"
                            >
                                Create Free Account <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} <span className="text-indigo-400 font-semibold">SkillConnect</span>. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-500">
                        <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
