import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import commentService from '../../services/commentService';

function MyCommentsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        try {
            setLoading(true);
            const data = await commentService.getUserComments();
            setComments(data.comments || []);
        } catch (err) {
            setError('Failed to load comments');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await commentService.deleteUserComment(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (err) {
            alert('Failed to delete comment');
            console.error(err);
        }
    };

    const startEdit = (comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };

    const handleUpdate = async (commentId) => {
        if (!editContent.trim()) {
            alert('Comment cannot be empty');
            return;
        }

        try {
            await commentService.updateUserComment(commentId, editContent);
            setEditingId(null);
            setEditContent('');
            setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: editContent } : c));
        } catch (err) {
            alert('Failed to update comment');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner spinner-lg"></div>
            </div>
        );
    }

    return (
        <div className="my-comments-container">
            <header className="page-header">
                <div>
                    <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
                    <h1>My Comments</h1>
                    <p className="page-subtitle">View and manage the feedback you've left on blog posts.</p>
                </div>
            </header>

            {error && <div className="alert alert-error mb-4">{error}</div>}

            {comments.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <h3>No Comments Yet</h3>
                    <p>You haven't joined the conversation on any posts yet.</p>
                    <Link to="/" className="btn btn-primary">Browse Blog</Link>
                </div>
            ) : (
                <div className="comments-list">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment-card">
                            <div className="comment-header">
                                <div className="comment-meta">
                                    <span className="comment-target">
                                        On: <Link to={`/blog/${comment.post_slug}`}>{comment.post_title}</Link>
                                    </span>
                                    <span className="comment-date">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="comment-body">
                                {editingId === comment.id ? (
                                    <div className="edit-area">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows="4"
                                            className="form-input"
                                        />
                                        <div className="form-actions mt-3">
                                            <button
                                                onClick={() => handleUpdate(comment.id)}
                                                className="btn btn-success btn-sm"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="btn btn-outline btn-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="comment-text">{comment.content}</p>
                                        <div className="comment-actions">
                                            <button
                                                onClick={() => startEdit(comment)}
                                                className="btn btn-outline btn-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyCommentsPage;
