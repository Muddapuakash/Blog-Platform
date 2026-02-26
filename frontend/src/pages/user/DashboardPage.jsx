import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './DashboardPage.css';

function UserDashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            const currentUser = authService.getUser();
            if (!currentUser) {
                navigate('/login');
                return;
            }

            if (currentUser.is_admin) {
                navigate('/admin');
                return;
            }

            setUser(currentUser);

            try {
                const data = await authService.getDashboard();
                setStats(data.stats);
            } catch (error) {
                console.error('Failed to load dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [navigate]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner spinner-lg"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-content-area">
            <header className="page-header">
                <h1>Welcome, {user?.username}!</h1>
                <p className="page-subtitle">Manage your contributions and track your performance.</p>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats?.total_posts || 0}</span>
                        <span className="stat-label">Your Posts</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💬</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats?.total_comments || 0}</span>
                        <span className="stat-label">Your Comments</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <section className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/user/posts/create" className="action-card">
                        <span className="action-icon">✏️</span>
                        <span className="action-title">Create New Post</span>
                        <span className="action-desc">Share your thoughts with the world</span>
                    </Link>

                    <Link to="/user/posts" className="action-card">
                        <span className="action-icon">📁</span>
                        <span className="action-title">Manage My Posts</span>
                        <span className="action-desc">Edit or update your existing articles</span>
                    </Link>

                    <Link to="/user/comments" className="action-card">
                        <span className="action-icon">💬</span>
                        <span className="action-title">My Comments</span>
                        <span className="action-desc">View and manage your feedback</span>
                    </Link>

                    <Link to="/" className="action-card">
                        <span className="action-icon">🌐</span>
                        <span className="action-title">View Blog</span>
                        <span className="action-desc">Read the latest articles from the community</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default UserDashboardPage;
