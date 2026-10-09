import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { readings } from '../data/readings';
import SiteHeader from '../components/sections/SiteHeader';
import SiteFooter from '../components/sections/SiteFooter';

const Blog = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <>
        <div className="blog-page">
            <SiteHeader />

            <div className="blog-inner">
                <div className="blog-header">
                    <div className="section-label">Talha Kaya</div>
                    <h1 className="blog-title">
                        Blog<span style={{ color: 'var(--red)' }}>.</span>
                    </h1>
                    <p className="blog-subtitle">
                        Okuduğum makaleler, notlar ve düşünceler.
                    </p>
                </div>

                <div className="blog-grid">
                    {readings.map((r) => (
                        <Link to={`/blog/${r.id}`} key={r.id} className="blog-card">
                            {/* Kapak */}
                            <div className={`blog-card-cover ${r.color}`}>
                                {r.image && (
                                    <img
                                        src={r.image}
                                        alt=""
                                        aria-hidden="true"
                                        className="blog-card-cover-img"
                                    />
                                )}
                                <div className="blog-card-cover-overlay">
                                    <span className="blog-card-cover-label">{r.tags[0]}</span>
                                    <span className="blog-card-year">{r.year}</span>
                                </div>
                            </div>

                            {/* İçerik */}
                            <div className="blog-card-body">
                                <h2 className="blog-card-title">{r.title}</h2>
                                <p className="blog-card-excerpt">{r.excerpt}</p>
                                <div className="blog-card-footer">
                                    <span className="blog-card-source">{r.source}</span>
                                    <span className="blog-card-read">Oku →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
        <SiteFooter />
        </>
    );
};

export default Blog;
