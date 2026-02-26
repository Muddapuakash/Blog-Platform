import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentSection from '../components/blog/CommentSection';
import postService from '../services/postService';
import './PostPage.css';

function PostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPost();
    }, [slug]);

    const loadPost = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await postService.getPostBySlug(slug);
            setPost(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Post not found');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="post-page">
                <div className="container container-narrow">
                    <div className="loading-container">
                        <div className="spinner spinner-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="post-page">
                <div className="container container-narrow">
                    <div className="error-state">
                        <h2>Post Not Found</h2>
                        <p>{error || 'The post you are looking for does not exist.'}</p>
                        <Link to="/" className="btn btn-primary">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const imageUrl = post.featured_image
        ? `http://localhost:5000${post.featured_image}`
        : null;

    return (
        <div className="post-page">
            <div className="container container-narrow">
                {/* Back Link */}
                <Link to="/" className="back-link">
                    ← Back to all posts
                </Link>

                <article className="post-article">
                    {/* Post Header */}
                    <header className="post-header">
                        {post.tags && post.tags.length > 0 && (
                            <div className="tags mb-2">
                                {post.tags.map((tag) => (
                                    <Link key={tag.id} to={`/tag/${tag.slug}`} className="tag">
                                        {tag.name}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <h1 className="post-title">{post.title}</h1>

                        <div className="post-meta">
                            <span className="post-author">By {post.author}</span>
                            <span className="post-date">{formatDate(post.published_at || post.created_at)}</span>
                            {post.comment_count > 0 && (
                                <span className="post-comments">
                                    {post.comment_count} comment{post.comment_count !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </header>

                    {/* Featured Image */}
                    {imageUrl && (
                        <div className="post-featured-image">
                            <img
                                src={imageUrl}
                                alt={post.title}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    {/* Post Content */}
                    <div
                        className="post-content blog-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>

                {/* Comments Section */}
                <CommentSection postId={post.id} />
            </div>
        </div>
    );
}

export default PostPage;
