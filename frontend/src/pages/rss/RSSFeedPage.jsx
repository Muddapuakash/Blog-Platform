import { useEffect, useState } from 'react';
import rssService from '../../services/rssService';
import './RSSFeedPage.css';

function RSSFeedPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRSS();
    }, []);

    const loadRSS = async () => {
        try {
            setLoading(true);

            const xmlText = await rssService.getRSSXML();
            console.log('RSS XML:', xmlText); // 🔍 DEBUG

            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, 'application/xml');

            // 🔥 Detect XML parse errors
            const parseError = xml.querySelector('parsererror');
            if (parseError) {
                console.error('XML Parse Error:', parseError.textContent);
                throw new Error('Invalid RSS XML');
            }

            const parsedItems = Array.from(xml.querySelectorAll('item')).map(item => ({
                title: item.querySelector('title')?.textContent ?? '',
                link: item.querySelector('link')?.textContent ?? '#',
                description: item.querySelector('description')?.textContent ?? '',
                pubDate: item.querySelector('pubDate')?.textContent ?? ''
            }));

            console.log('Parsed RSS Items:', parsedItems); // 🔍 DEBUG
            setItems(parsedItems);

        } catch (err) {
            console.error(err);
            setError('Failed to load RSS feed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="rss-loading">Loading RSS feed…</div>;
    if (error) return <div className="rss-empty">{error}</div>;

    return (
        <div className="rss-page">
            <section className="rss-hero">
                <div className="rss-hero-content">
                    <h1 className="rss-hero-title">
                        📡 <span className="accent">RSS Feed</span>
                    </h1>
                    <p className="rss-hero-subtitle">
                        Latest published blog posts
                    </p>
                </div>
            </section>

            <section className="rss-section">
                <h2 className="rss-section-title">Recent Updates</h2>

                {items.length === 0 ? (
                    <div className="rss-empty">No RSS items found</div>
                ) : (
                    <div className="rss-grid">
                        {items.map((item, index) => (
                            <div key={index} className="rss-card">
                                <h3 className="rss-card-title">
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item.title}
                                    </a>
                                </h3>
                                <p className="rss-card-description">
                                    {item.description}
                                </p>
                                <div className="rss-card-meta">
                                    {item.pubDate}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default RSSFeedPage;
