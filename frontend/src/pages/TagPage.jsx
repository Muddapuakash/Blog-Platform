import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostList from '../components/blog/PostList';
import TagFilter from '../components/blog/TagFilter';
import postService from '../services/postService';
import './TagPage.css';

function TagPage() {
    const { slug } = useParams();
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tagsLoading, setTagsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setPage(1);
        loadPostsByTag();
        loadTags();
    }, [slug]);

    useEffect(() => {
        if (page > 1) {
            loadPostsByTag();
        }
    }, [page]);

    const loadPostsByTag = async () => {
        try {
            setLoading(true);
            const data = await postService.getPostsByTag(slug, page, 9);
            setPosts(data.posts);
            setCurrentTag(data.tag);
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
        <div className="tag-page">
            <div className="container">
                {/* Tag Header */}
                <header className="tag-header">
                    <span className="tag-label">Browsing Tag</span>
                    <h1 className="tag-name">
                        {currentTag ? currentTag.name : slug}
                    </h1>
                    <p className="tag-count">
                        {posts.length > 0
                            ? `${posts.length} article${posts.length !== 1 ? 's' : ''} found`
                            : 'No articles with this tag'
                        }
                    </p>
                </header>

                {/* Tags Filter */}
                <TagFilter tags={tags} activeTag={slug} loading={tagsLoading} />

                {/* Posts */}
                <section className="posts-section">
                    <PostList
                        posts={posts}
                        loading={loading}
                        emptyMessage={`No articles with tag "${currentTag?.name || slug}" yet.`}
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

export default TagPage;
