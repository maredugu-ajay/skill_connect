import { useAuth } from '../../context/AuthContext';
import LearnerDashboard from './LearnerDashboard';
import TrainerDashboard from './TrainerDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    // Fallback if role is missing or unknown
    if (!user?.role) return <div>Invalid user role data.</div>;

    if (user.role === 'trainer') {
        return <TrainerDashboard />;
    }

    // Default to Learner dashboard
    return <LearnerDashboard />;
};

export default Dashboard;
