import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import postService from '../../services/postService';
import './MyPostsPage.css';

function MyPostsPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await postService.getUserPosts();
            setPosts(data.posts || []);
        } catch (err) {
            setError('Failed to load your posts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            setDeletingId(postId);
            await postService.deleteUserPost(postId);
            setPosts(prev => prev.filter(p => p.id !== postId));
        } catch (err) {
            alert('Failed to delete post: ' + (err.response?.data?.error || 'Unknown error'));
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleStatusChange = async (postId, newStatus) => {
        try {
            await postService.updateUserPost(postId, { status: newStatus });
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: newStatus } : p));
        } catch (err) {
            alert('Failed to update post status');
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner spinner-lg"></div>
            </div>
        );
    }

    return (
        <div className="my-posts-page">
            <header className="page-header">
                <div>
                    <h1>My Posts</h1>
                    <p className="page-subtitle">Manage and track your published and draft articles.</p>
                </div>
                <Link to="/user/posts/create" className="btn btn-primary">
                    + Create New Post
                </Link>
            </header>

            {error && <div className="alert alert-error mb-4">{error}</div>}

            {posts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No Posts Yet</h3>
                    <p>Start sharing your ideas with the world.</p>
                    <Link to="/user/posts/create" className="btn btn-primary">
                        Create Your First Post
                    </Link>
                </div>
            ) : (
                <div className="table-container">
                    <table className="posts-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Comments</th>
                                <th>Created</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id}>
                                    <td>
                                        <Link to={`/blog/${post.slug}`} className="post-title-link">
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td>
                                        <select
                                            value={post.status}
                                            onChange={(e) => handleStatusChange(post.id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </td>
                                    <td>
                                        <span className="comment-count-badge">
                                            {post.comment_count || 0}
                                        </span>
                                    </td>
                                    <td>{formatDate(post.created_at)}</td>
                                    <td>
                                        <div className="actions">
                                            <Link
                                                to={`/user/posts/edit/${post.id}`}
                                                className="btn btn-outline btn-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="btn btn-danger btn-sm"
                                                disabled={deletingId === post.id}
                                            >
                                                {deletingId === post.id ? '...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MyPostsPage;
