import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, GraduationCap, Zap, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/80 backdrop-blur-2xl shadow-lg border-b border-white/50'
                    : 'bg-white/60 backdrop-blur-xl border-b border-white/30'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow">
                                <GraduationCap className="text-white w-5 h-5" />
                            </div>
                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full border-2 border-white flex items-center justify-center">
                                <Zap className="w-1.5 h-1.5 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                Skill
                            </span>
                            <span className="text-lg font-black text-gray-800 -mt-1 tracking-tight">
                                Connect
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/">Home</NavLink>
                        {user?.role !== 'trainer' && (
                            <NavLink to="/trainers">Find Trainers</NavLink>
                        )}

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 ml-3">
                                <NavLink to="/dashboard">
                                    <LayoutDashboard size={16} className="inline -mt-0.5 mr-1" />
                                    Dashboard
                                </NavLink>

                                <div className="h-5 w-px bg-gray-200 mx-1" />

                                {/* User Avatar */}
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                        {user?.name?.[0]?.toUpperCase() || <User size={14} />}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{user?.name}</span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 ml-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-5 py-2 text-sm font-bold text-white rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-white/50 shadow-xl">
                    <div className="px-4 py-4 space-y-1">
                        <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
                        {user?.role !== 'trainer' && (
                            <MobileNavLink to="/trainers" onClick={() => setIsOpen(false)}>Find Trainers</MobileNavLink>
                        )}
                        {isAuthenticated ? (
                            <>
                                <MobileNavLink to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</MobileNavLink>
                                <div className="pt-2 border-t border-gray-100 mt-2">
                                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                            {user?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-gray-800">{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 mt-2">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-center font-semibold text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Sign In</Link>
                                <Link to="/signup" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-center font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

const NavLink = ({ to, children }) => (
    <Link
        to={to}
        className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-all"
    >
        {children}
    </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block px-3 py-2.5 text-base font-semibold text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
    >
        {children}
    </Link>
);

export default Navbar;
