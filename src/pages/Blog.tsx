import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { readings } from '../data/readings';
import SiteHeader from '../components/sections/SiteHeader';
import SiteFooter from '../components/sections/SiteFooter';
import BackLink from '../components/BackLink';

const Blog = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <>
        <div className="blog-page">
            <SiteHeader />

            <BackLink />

            <section className="page-hero">
                <div className="page-hero-top">
                    <div>
                        <h1>Blog.</h1>
                        <p className="page-hero-sub">
                            Okuduğum makaleler üzerine notlarım ve düşüncelerim.
                        </p>
                    </div>
                    <img src="/icon-desk.png" alt="" className="page-hero-icon page-hero-icon-wide" />
                </div>
            </section>

            <section className="blog-list">
                {readings.map((r) => (
                    <Link to={`/blog/${r.id}`} key={r.id} className="blog-card">
                        <div className={`blog-card-cover ${r.color}`}>
                            {r.image && (
                                <img
                                    src={r.image}
                                    alt=""
                                    aria-hidden="true"
                                    className="blog-card-cover-img"
                                />
                            )}
                        </div>

                        <p className="blog-card-meta">{r.tags[0]} · {r.year}</p>
                        <h2 className="blog-card-title">{r.title}</h2>
                        <p className="blog-card-excerpt">{r.excerpt}</p>
                        <div className="blog-card-footer">
                            <span className="blog-card-source">{r.source}</span>
                            <span className="blog-card-read" aria-hidden="true">→</span>
                        </div>
                    </Link>
                ))}
            </section>
        </div>
        <SiteFooter />
        </>
    );
};

export default Blog;
