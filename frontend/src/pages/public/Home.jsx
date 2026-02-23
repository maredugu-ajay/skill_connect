import { Link } from 'react-router-dom';
import { Search, ArrowRight, Star, Code, Music, Briefcase, Camera, Dumbbell, Globe, CheckCircle, Zap, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const categories = [
        { name: 'Development', icon: <Code size={28} />, count: '120+ Trainers', color: 'from-blue-500 to-cyan-400', bg: 'bg-blue-50', text: 'text-blue-600' },
        { name: 'Business', icon: <Briefcase size={28} />, count: '80+ Trainers', color: 'from-purple-500 to-pink-400', bg: 'bg-purple-50', text: 'text-purple-600' },
        { name: 'Design', icon: <Camera size={28} />, count: '50+ Trainers', color: 'from-pink-500 to-rose-400', bg: 'bg-pink-50', text: 'text-pink-600' },
        { name: 'Fitness', icon: <Dumbbell size={28} />, count: '40+ Trainers', color: 'from-green-500 to-emerald-400', bg: 'bg-green-50', text: 'text-green-600' },
        { name: 'Music', icon: <Music size={28} />, count: '30+ Trainers', color: 'from-yellow-500 to-orange-400', bg: 'bg-yellow-50', text: 'text-yellow-600' },
        { name: 'Language', icon: <Globe size={28} />, count: '60+ Trainers', color: 'from-indigo-500 to-violet-400', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    ];

    const howItWorks = [
        { icon: <Search size={32} />, title: "Find a Trainer", desc: "Browse profiles, reviews, and skills to find your perfect match.", color: "bg-blue-100 text-blue-600" },
        { icon: <Zap size={32} />, title: "Book a Session", desc: "Choose a time that works for you and book instantly.", color: "bg-purple-100 text-purple-600" },
        { icon: <Award size={32} />, title: "Master Skills", desc: "Connect 1-on-1 via video call and level up your game.", color: "bg-green-100 text-green-600" },
    ];

    const testimonials = [
        { name: 'Sarah Jenkins', role: 'Learner', text: "I found an amazing piano teacher in minutes. The platform is so easy to use!", rating: 5, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
        { name: 'Mike Thompson', role: 'Trainer', text: "Skill Connect helped me double my student base. The dashboard is fantastic.", rating: 5, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
        { name: 'Emma Wilson', role: 'Learner', text: "Great quality trainers and secure payments. Highly recommended!", rating: 4, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="font-sans overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-3xl animate-pulse"></div>
                    <div className="absolute top-40 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-green-200/30 to-teal-200/30 blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-blue-600 font-semibold text-sm shadow-sm"
                    >
                        🚀 Launch your learning journey today
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight drop-shadow-sm"
                    >
                        Master a New Skill with <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
                            Expert Trainers
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xl text-gray-700/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
                    >
                        Connect with top-rated mentors for 1-on-1 coaching in coding, fitness, music, and more. Elevate your potential.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/trainers" className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            Find a Trainer <Search size={20} className="group-hover:scale-110 transition-transform" />
                        </Link>
                        <Link to="/signup" className="group w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-800 font-bold rounded-full shadow-md border border-white/50 hover:bg-white hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            Become a Trainer <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-16 pt-8 border-t border-gray-200/50 flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
                    >
                        {['Google', 'Microsoft', 'Spotify', 'Udemy', 'Coursera'].map((brand, i) => (
                            <span key={i} className="text-xl md:text-2xl font-bold text-gray-500 hover:text-gray-700 cursor-default">{brand}</span>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Simple Steps</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">How Skill Connect Works</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200/60 -translate-y-1/2 z-0"></div>

                        {howItWorks.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative z-10 bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/50 text-center hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${step.color} bg-opacity-20`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-purple-600 font-bold tracking-wider uppercase text-sm">Discover</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Explore Categories</h2>
                        </div>
                        <Link to="/trainers" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                            View All <ArrowRight size={20} />
                        </Link>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                    >
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className={`bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group cursor-pointer border border-white/60`}
                            >
                                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${cat.color} text-white shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                                    {cat.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                                <p className="text-xs text-gray-600 font-medium">{cat.count}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <Link to="/trainers" className="md:hidden mt-8 flex items-center justify-center gap-2 text-primary font-bold">
                        View All Categories <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Featured Feature Section */}
            <section className="py-24 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-300/40 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300/40 rounded-full blur-3xl"></div>

                            <div className="relative grid grid-cols-2 gap-4">
                                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" className="rounded-2xl shadow-2xl w-full h-64 object-cover transform translate-y-8" alt="Students learning" />
                                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80" className="rounded-2xl shadow-2xl w-full h-64 object-cover transform -translate-y-8" alt="Remote learning" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">World-Class Learning <br /><span className="text-primary">Right at Your Fingertips</span></h2>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Whether you want to learn a new language, master coding, or get fit, Skill Connect brings expert trainers directly to you.
                                </p>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    { title: "Verified Expert Trainers", desc: "Every trainer is vetted for quality and expertise." },
                                    { title: "Secure Payment Protection", desc: "Your money is safe until you're satisfied." },
                                    { title: "Flexible Scheduling", desc: "Book sessions that fit your busy lifestyle." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                                            <CheckCircle size={14} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.title}</h4>
                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/signup" className="inline-block px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl">
                                Join Now for Free
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Testimonials</span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">Trusted by 10,000+ Learners</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/50 relative hover:-translate-y-1 transition-transform"
                            >
                                <div className="absolute -top-4 right-8 text-6xl text-blue-100 font-serif leading-none">"</div>
                                <div className="flex gap-1 text-yellow-500 mb-6">
                                    {[...Array(t.rating)].map((_, r) => <Star key={r} size={18} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-700 mb-8 italic relative z-10 leading-relaxed">"{t.text}"</p>
                                <div className="flex items-center gap-4 border-t pt-6 border-gray-200/50">
                                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                                        <p className="text-xs text-primary font-semibold uppercase">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-primary rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                        {/* Background circles */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

                        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                            <h2 className="text-3xl md:text-5xl font-bold leading-tight">Ready to Start Your Journey?</h2>
                            <p className="text-blue-100 text-lg md:text-xl">Join our community of learners and trainers today. Unlock your potential with Skill Connect.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/signup" className="px-8 py-4 bg-white text-primary font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                                    Get Started for Free
                                </Link>
                                <Link to="/trainers" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors">
                                    Browse Trainers
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
