import { Link } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-code">404</div>
                <h1>Page Not Found</h1>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <div className="not-found-actions">
                    <Link to="/" className="btn btn-primary">
                        Go to Homepage
                    </Link>
                    <Link to="/admin" className="btn btn-outline">
                        Admin Panel
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
