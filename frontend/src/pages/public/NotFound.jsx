import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-lg"
            >
                {/* Big 404 */}
                <div className="relative mb-8">
                    <h1 className="text-[150px] md:text-[200px] font-black leading-none bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <GraduationCap size={48} className="text-indigo-500" />
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-3">Page Not Found</h2>
                <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                    Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-0.5 transition-all"
                    >
                        <Home size={18} /> Go Home
                    </Link>
                    <Link
                        to="/trainers"
                        className="flex items-center gap-2 px-8 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:-translate-y-0.5 transition-all"
                    >
                        <Search size={18} /> Browse Trainers
                    </Link>
                </div>

                <button onClick={() => window.history.back()} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-indigo-600 transition-colors group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Go Back
                </button>
            </motion.div>
        </div>
    );
};

export default NotFound;
