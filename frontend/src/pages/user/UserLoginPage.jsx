import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../admin/AuthPages.css';

function UserLoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authService.isAuthenticated()) {
            const user = authService.getUser();
            if (user && user.is_admin) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            const data = await authService.userLogin(formData.email, formData.password);

            if (data && data.access_token) {
                authService.setAuth(data.access_token, data.user);
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            const serverMessage = err.response?.data?.error || err.message;
            setError(`Login failed: ${serverMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">
                            <span className="logo-icon">✦</span>
                            <span>Blog Platform</span>
                        </Link>
                        <h1>User Login</h1>
                        <p>Sign in to create posts and comments</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="user@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register">Register</Link>
                        </p>
                        <p>
                            <Link to="/admin/login">Admin Login →</Link>
                        </p>
                        <Link to="/" className="back-to-blog">
                            ← Back to Blog
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserLoginPage;
