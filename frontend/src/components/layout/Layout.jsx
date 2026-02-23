import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from '../common/Chatbot';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 35%, #f0fdf4 70%, #eff6ff 100%)' }}>
            <Navbar />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            {isAuthenticated && <Chatbot />}
            <Footer />
        </div>
    );
};

export default Layout;
