import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostList from '../components/blog/PostList';
import TagFilter from '../components/blog/TagFilter';
import postService from '../services/postService';
import './HomePage.css';

function HomePage() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tagsLoading, setTagsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        loadPosts();
        loadTags();
    }, [page]);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await postService.getPosts(page, 9);
            setPosts(data.posts);
            setTotalPages(data.pages);
            setHasMore(data.has_next);
        } catch (err) {
            console.error('Failed to load posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadTags = async () => {
        try {
            setTagsLoading(true);
            const data = await postService.getTags();
            setTags(data.tags);
        } catch (err) {
            console.error('Failed to load tags:', err);
        } finally {
            setTagsLoading(false);
        }
    };

    return (
        <div className="home-page">
            <div className="container">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Welcome to Our <span className="accent">Blog</span>
                        </h1>
                        <p className="hero-subtitle">
                            Discover insightful articles, stories, and ideas from our community of writers.
                        </p>
                    </div>
                    <div className="hero-decoration">
                        <div className="decoration-circle c1"></div>
                        <div className="decoration-circle c2"></div>
                        <div className="decoration-circle c3"></div>
                    </div>
                </section>

                {/* Tags Filter */}
                <TagFilter tags={tags} loading={tagsLoading} />

                {/* Posts Section */}
                <section className="posts-section">
                    <h2 className="section-title">Latest Articles</h2>
                    <PostList
                        posts={posts}
                        loading={loading}
                        emptyMessage="No articles published yet. Check back soon!"
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="btn btn-outline"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                ← Previous
                            </button>
                            <span className="pagination-info">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className="btn btn-outline"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!hasMore}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default HomePage;
