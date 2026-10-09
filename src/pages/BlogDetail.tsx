import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { readings, type BlogBlock } from '../data/readings';
import SiteHeader from '../components/sections/SiteHeader';
import SiteFooter from '../components/sections/SiteFooter';

/* ---------- reading time ---------- */
function calcReadingTime(blocks: BlogBlock[]): number {
    const w = (s: string) => s.trim() ? s.split(/\s+/).length : 0;
    const words = blocks.reduce((acc, b) => {
        switch (b.type) {
            case 'p': case 'h2': case 'h3': case 'quote': case 'pre': case 'callout':
                return acc + w(b.text);
            case 'list': case 'ordered': case 'problems':
                return acc + b.items.reduce((a, s) => a + w(s), 0);
            case 'architecture':
                return acc + b.pillars.reduce((a, s) => a + w(s), 0) + w(b.result);
            case 'formula': {
                let n = w(b.equation);
                if (b.rows) n += b.rows.reduce((a, r) => a + w(r.label) + w(r.value), 0);
                if (b.note) n += w(b.note);
                return acc + n;
            }
            case 'timeline':
                return acc + w(b.parent) + b.items.reduce((a, r) => a + w(r.time) + w(r.text), 0);
            case 'scale':
                return acc + w(b.question) + b.examples.reduce((a, e) => a + w(e.item), 0);
            case 'stats':
                return acc + b.headers.reduce((a, h) => a + w(h), 0) +
                    b.rows.reduce((a, r) => a + w(r.label) + w(r.before) + w(r.after), 0) +
                    (b.notes ?? []).reduce((a, n) => a + w(n), 0);
            case 'pipeline':
                return acc + b.steps.reduce((a, s) => a + w(s.label) + (s.sub ? w(s.sub) : 0), 0) +
                    (b.note ? w(b.note) : 0);
            case 'transform':
                return acc + b.fromItems.reduce((a, s) => a + w(s), 0) + w(b.toItem) +
                    w(b.fromLabel) + w(b.toLabel) + (b.note ? w(b.note) : 0);
            case 'params':
                return acc + (b.trigger ? w(b.trigger) : 0) +
                    b.params.reduce((a, p) => a + w(p.symbol) + w(p.name) + w(p.desc), 0) +
                    (b.note ? w(b.note) : 0);
            case 'membar':
                return acc + b.steps.reduce((a, s) =>
                    a + w(s.label) + s.bars.reduce((b2, bar) => b2 + w(bar.text), 0) + (s.note ? w(s.note) : 0), 0);
            case 'flow':
                return acc + b.steps.reduce((a, s) =>
                    s.kind === 'step' ? a + w(s.text) : a + w(s.question) + w(s.yes) + w(s.no), 0);
            case 'treemap':
                return acc + w(b.root) + b.children.reduce((a, c) =>
                    a + w(c.label) + (c.sub?.reduce((s2, s) => s2 + w(s.label) + (s.detail ? w(s.detail) : 0), 0) ?? 0), 0);
            default:
                return acc;
        }
    }, 0);
    return Math.max(1, Math.round(words / 200));
}

/* ---------- block renderer ---------- */
const renderBlock = (block: BlogBlock, i: number) => {
    switch (block.type) {
        case 'h2':
            return <h2 key={i} className="bdetail-content-h2">{block.text}</h2>;
        case 'h3':
            return <h3 key={i} className="bdetail-content-h3">{block.text}</h3>;
        case 'p': {
            if (block.link) {
                const parts = block.text.split(block.link.anchor);
                return (
                    <p key={i} className="bdetail-content-p">
                        {parts[0]}
                        <Link to={`/blog/${block.link.blogId}`} className="bdetail-inline-link">{block.link.anchor}</Link>
                        {parts[1]}
                    </p>
                );
            }
            return <p key={i} className="bdetail-content-p">{block.text}</p>;
        }
        case 'list':
            return (
                <ul key={i} className="bdetail-content-list">
                    {block.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
            );
        case 'ordered':
            return (
                <ol key={i} className="bdetail-content-ordered">
                    {block.items.map((item, j) => <li key={j}>{item}</li>)}
                </ol>
            );
        case 'quote':
            return <blockquote key={i} className="bdetail-content-quote">{block.text}</blockquote>;
        case 'callout': {
            const icon = block.variant === 'good' ? '✓' : block.variant === 'bad' ? '✗' : '→';
            const label = block.label ?? (block.variant === 'good' ? 'ile' : block.variant === 'bad' ? 'olmadan' : '');
            return (
                <div key={i} className={`bdetail-content-callout callout-${block.variant ?? 'info'}`}>
                    <span className="bdetail-callout-tag">
                        <span className="bdetail-callout-icon">{icon}</span>
                        {label && <span className="bdetail-callout-label">{label}</span>}
                    </span>
                    <span className="bdetail-callout-body">{block.text}</span>
                </div>
            );
        }
        case 'pre':
            return <pre key={i} className="bdetail-content-pre">{block.text}</pre>;

        /* ---- new structured blocks ---- */
        case 'architecture':
            return (
                <div key={i} className="bdetail-architecture">
                    <div className="bdetail-arch-pillars">
                        {block.pillars.map((p, j) => (
                            <div key={j} className="bdetail-arch-pillar">{p}</div>
                        ))}
                    </div>
                    <div className="bdetail-arch-arrow">↓</div>
                    <div className="bdetail-arch-result">{block.result}</div>
                </div>
            );

        case 'problems':
            return (
                <div key={i} className="bdetail-problems">
                    {block.items.map((item, j) => (
                        <div key={j} className="bdetail-problem-item">
                            <span className="bdetail-problem-label">Problem {j + 1}</span>
                            <span className="bdetail-problem-text">{item}</span>
                        </div>
                    ))}
                </div>
            );

        case 'formula':
            return (
                <div key={i} className="bdetail-formula">
                    <div className="bdetail-formula-eq">{block.equation}</div>
                    {block.rows && block.rows.length > 0 && (
                        <div className="bdetail-formula-rows">
                            {block.rows.map((r, j) => (
                                <div key={j} className="bdetail-formula-row">
                                    <span className="bdetail-formula-label">{r.label}</span>
                                    <span className="bdetail-formula-value">{r.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {block.note && <p className="bdetail-formula-note">{block.note}</p>}
                </div>
            );

        case 'timeline': {
            const tlv = block.variant ?? '';
            return (
                <div key={i} className={`bdetail-timeline${tlv ? ` bdetail-timeline--${tlv}` : ''}`}>
                    <div className="bdetail-timeline-parent">{block.parent}</div>
                    <div className="bdetail-timeline-items">
                        {block.items.map((item, j) => (
                            <div key={j} className="bdetail-timeline-item">
                                <span className="bdetail-timeline-time">{item.time}</span>
                                <span className="bdetail-timeline-dot" />
                                <span className="bdetail-timeline-text">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        case 'scale':
            return (
                <div key={i} className="bdetail-scale">
                    <p className="bdetail-scale-question">{block.question}</p>
                    <div className="bdetail-scale-examples">
                        {block.examples.map((e, j) => (
                            <div key={j} className="bdetail-scale-row">
                                <span className="bdetail-scale-item">{e.item}</span>
                                <span className="bdetail-scale-bar">
                                    <span
                                        className="bdetail-scale-fill"
                                        style={{ width: `${e.score * 10}%` }}
                                    />
                                </span>
                                <span className="bdetail-scale-score">{e.score}/10</span>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'stats':
            return (
                <div key={i} className="bdetail-stats">
                    <table className="bdetail-stats-table">
                        <thead>
                            <tr>
                                {block.headers.map((h, j) => <th key={j}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((r, j) => (
                                <tr key={j}>
                                    <td>{r.label}</td>
                                    <td>{r.before}</td>
                                    <td className="bdetail-stats-after">{r.after}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {block.notes && block.notes.length > 0 && (
                        <div className="bdetail-stats-notes">
                            {block.notes.map((n, j) => (
                                <span key={j} className="bdetail-stats-note">{n}</span>
                            ))}
                        </div>
                    )}
                </div>
            );

        case 'pipeline':
            return (
                <div key={i} className="bdetail-pipeline">
                    <div className="bdetail-pipeline-steps">
                        {block.steps.map((step, j) => (
                            <div key={j} className="bdetail-pipeline-item">
                                <div className={`bdetail-pipeline-box${j === block.steps.length - 1 ? ' last' : ''}`}>
                                    <span className="bdetail-pipeline-label">{step.label}</span>
                                    {step.sub && <span className="bdetail-pipeline-sub">{step.sub}</span>}
                                </div>
                                {j < block.steps.length - 1 && (
                                    <span className="bdetail-pipeline-arrow">→</span>
                                )}
                            </div>
                        ))}
                    </div>
                    {block.note && <p className="bdetail-pipeline-note">{block.note}</p>}
                </div>
            );

        case 'transform':
            return (
                <div key={i} className="bdetail-transform">
                    <div className="bdetail-transform-side">
                        <div className="bdetail-transform-boxes">
                            {block.fromItems.map((item, j) => (
                                <span key={j} className="bdetail-transform-box">{item}</span>
                            ))}
                        </div>
                        <p className="bdetail-transform-label bad">{block.fromLabel}</p>
                    </div>
                    <div className="bdetail-transform-arrow">→</div>
                    <div className="bdetail-transform-side">
                        <div className="bdetail-transform-curve">{block.toItem}</div>
                        <p className="bdetail-transform-label good">{block.toLabel}</p>
                    </div>
                    {block.note && <p className="bdetail-transform-note">{block.note}</p>}
                </div>
            );

        case 'params':
            return (
                <div key={i} className="bdetail-params">
                    {block.params.map((p, j) => (
                        <div key={j} className="bdetail-params-row">
                            <span className="bdetail-params-symbol">{p.symbol}</span>
                            <div className="bdetail-params-text">
                                <span className="bdetail-params-name">{p.name}</span>
                                <span className="bdetail-params-desc">{p.desc}</span>
                            </div>
                        </div>
                    ))}
                    {block.note && <p className="bdetail-params-note">{block.note}</p>}
                </div>
            );

        case 'treemap':
            return (
                <div key={i} className="bdetail-treemap">
                    <div className="bdetail-treemap-root">{block.root}</div>
                    <div className="bdetail-treemap-line" />
                    <div className="bdetail-treemap-children">
                        {block.children.map((child, j) => (
                            <div key={j} className={`bdetail-treemap-node${child.sub ? ' bdetail-treemap-node--parent' : ''}`}>
                                <div className="bdetail-treemap-node-label">{child.label}</div>
                                {child.sub && (
                                    <div className="bdetail-treemap-subnodes">
                                        {child.sub.map((s, k) => (
                                            <div key={k} className="bdetail-treemap-subnode">
                                                <span className="bdetail-treemap-subnode-dot" />
                                                <span className="bdetail-treemap-subnode-label">{s.label}</span>
                                                {s.detail && <span className="bdetail-treemap-subnode-detail">· {s.detail}</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'flow':
            return (
                <div key={i} className="bdetail-flow">
                    {block.steps.map((step, j) => {
                        if (step.kind === 'step') {
                            return (
                                <div key={j} className="bdetail-flow-step-wrap">
                                    {j > 0 && <div className="bdetail-flow-arrow">↓</div>}
                                    <div className="bdetail-flow-step">
                                        <span className="bdetail-flow-num">{j + 1}</span>
                                        <span className="bdetail-flow-text">{step.text}</span>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={j} className="bdetail-flow-decision-wrap">
                                <div className="bdetail-flow-arrow">↓</div>
                                <div className="bdetail-flow-question">
                                    <span className="bdetail-flow-question-icon">?</span>
                                    <span className="bdetail-flow-question-text">{step.question}</span>
                                </div>
                                <div className="bdetail-flow-arrow">↓</div>
                                <div className="bdetail-flow-branches">
                                    <div className="bdetail-flow-branch bdetail-flow-branch--yes">
                                        <span className="bdetail-flow-branch-label">evet</span>
                                        <span className="bdetail-flow-branch-text">{step.yes}</span>
                                    </div>
                                    <div className="bdetail-flow-branch bdetail-flow-branch--no">
                                        <span className="bdetail-flow-branch-label">hayır</span>
                                        <span className="bdetail-flow-branch-text">{step.no}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );

        case 'membar':
            return (
                <div key={i} className="bdetail-membar">
                    {block.steps.map((step, j) => (
                        <div key={j} className="bdetail-membar-step">
                            <span className="bdetail-membar-label">{step.label}</span>
                            <div className="bdetail-membar-track">
                                {step.bars.map((bar, k) => (
                                    <div
                                        key={k}
                                        className={`bdetail-membar-seg bdetail-membar-seg--${bar.kind}`}
                                        style={{ flex: bar.flex ?? 1 }}
                                    >
                                        {bar.text}
                                    </div>
                                ))}
                            </div>
                            {step.note && <span className="bdetail-membar-note">{step.note}</span>}
                        </div>
                    ))}
                </div>
            );

        default:
            return null;
    }
};

/* ---------- main component ---------- */
const BlogDetail = () => {
    const { id } = useParams<{ id: string }>();
    const post = readings.find((r) => r.id === id);

    const storageKey = (suffix: string) => `blog_${id}_${suffix}`;

    const [liked, setLiked] = useState(() => localStorage.getItem(storageKey('liked')) === '1');
    const [starred, setStarred] = useState(() => localStorage.getItem(storageKey('starred')) === '1');
    const [disliked, setDisliked] = useState(() => localStorage.getItem(storageKey('disliked')) === '1');

    const toggleLike = () => {
        const next = !liked;
        setLiked(next);
        localStorage.setItem(storageKey('liked'), next ? '1' : '0');
    };
    const toggleStar = () => {
        const next = !starred;
        setStarred(next);
        localStorage.setItem(storageKey('starred'), next ? '1' : '0');
    };
    const toggleDislike = () => {
        const next = !disliked;
        setDisliked(next);
        localStorage.setItem(storageKey('disliked'), next ? '1' : '0');
    };

    // id değişince (bir blogdan diğerine geçince) bileşen yeniden mount olmaz,
    // bu yüzden id'yi bağımlılığa eklemek gerekiyor — yoksa eski scroll konumunda kalır.
    useEffect(() => { window.scrollTo(0, 0); }, [id]);

    if (!post) {
        return (
            <>
                <div className="blog-detail-page">
                    <SiteHeader />
                    <div className="blog-detail-inner" style={{ textAlign: 'center', paddingTop: 160 }}>
                        <p style={{ color: 'var(--gray)' }}>Makale bulunamadı.</p>
                        <Link to="/blog" className="bdetail-back">← Blog'a Dön</Link>
                    </div>
                </div>
            </>
        );
    }

    const readingTime = post.content && post.content.length > 0 ? calcReadingTime(post.content) : null;
    const hasComment = post.comment && post.comment !== '[ Yorumunu buraya yaz ]';

    return (
        <>
            <div className="blog-detail-page">
                <SiteHeader />

                <div className="blog-detail-inner">

                    {/* Geri */}
                    <Link to="/blog" className="bdetail-back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                        </svg>
                        Blog
                    </Link>

                    {/* Kapak banner */}
                    <div className={`bdetail-cover ${post.color}`}>
                        {post.image && (
                            <img
                                key={post.id}
                                src={post.image}
                                alt=""
                                aria-hidden="true"
                                className="bdetail-cover-img"
                                loading="eager"
                            />
                        )}
                        <div className="bdetail-cover-content">
                            <div className="bdetail-tags">
                                {post.tags.map((t) => (
                                    <span key={t} className="bdetail-tag">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Başlık */}
                    <div className="bdetail-head">
                        <p className="bdetail-source">{post.source} · {post.year}</p>
                        <h1 className="bdetail-title">{post.title}</h1>
                        <p className="bdetail-authors">{post.authors}</p>

                        {/* Yazar + okuma süresi + butonlar */}
                        <div className="bdetail-meta-row">
                            <div className="bdetail-byline">
                                <span className="bdetail-byline-name">Talha Kaya</span>
                                {readingTime && (
                                    <span className="bdetail-reading-time">· {readingTime} dk okuma</span>
                                )}
                            </div>
                            <div className="bdetail-actions">
                                <button
                                    className={`bdetail-action-btn btn-heart${liked ? ' active-heart' : ''}`}
                                    onClick={toggleLike}
                                    aria-label="Beğen"
                                    title="Beğen"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </button>
                                <button
                                    className={`bdetail-action-btn btn-star${starred ? ' active-star' : ''}`}
                                    onClick={toggleStar}
                                    aria-label="Kaydet"
                                    title="Kaydet"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </button>
                                <button
                                    className={`bdetail-action-btn btn-dislike${disliked ? ' active-dislike' : ''}`}
                                    onClick={toggleDislike}
                                    aria-label="Beğenme"
                                    title="Beğenme"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                                    </svg>
                                </button>
                                <a href={post.url} target="_blank" rel="noopener noreferrer" className="bdetail-paper-link">
                                    Makaleyi Oku
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <hr className="bdetail-divider" />

                    {/* Özet */}
                    <div className="bdetail-section">
                        <h2 className="bdetail-section-title">Ne Hakkında?</h2>
                        {post.excerpt && <p className="bdetail-excerpt">{post.excerpt}</p>}
                    </div>

                    {/* Uzun blog yazısı varsa */}
                    {post.content && post.content.length > 0 && (
                        <div className="bdetail-section bdetail-article">
                            {post.content.map((block, i) => renderBlock(block, i))}
                        </div>
                    )}

                    {/* Dikkat çekici noktalar — content yoksa göster */}
                    {(!post.content || post.content.length === 0) && (
                        <div className="bdetail-section">
                            <h2 className="bdetail-section-title">Dikkat Çekici Noktalar</h2>
                            <ul className="bdetail-highlights">
                                {post.highlights.map((h, i) => (
                                    <li key={i} className="bdetail-highlight-item">
                                        <span className="bdetail-highlight-num">{String(i + 1).padStart(2, '0')}</span>
                                        <span>{h}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Yorum */}
                    {hasComment && (
                        <div className="bdetail-section">
                            <h2 className="bdetail-section-title">Düşüncelerim</h2>
                            <blockquote className="bdetail-comment">
                                {post.comment}
                            </blockquote>
                        </div>
                    )}

                    {/* Diğer yazılar */}
                    <div className="bdetail-more">
                        <h3 className="bdetail-more-title">Diğer Yazılar</h3>
                        <div className="bdetail-more-grid">
                            {readings
                                .filter((r) => r.id !== post.id)
                                .slice(0, 3)
                                .map((r) => (
                                    <Link to={`/blog/${r.id}`} key={r.id} className="bdetail-more-card">
                                        <div className={`bdetail-more-cover ${r.color}`}>
                                            {r.image && (
                                                <img
                                                    src={r.image}
                                                    alt={r.title}
                                                    className="bdetail-more-cover-img"
                                                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                                />
                                            )}
                                        </div>
                                        <p className="bdetail-more-card-title">{r.title}</p>
                                    </Link>
                                ))}
                        </div>
                    </div>

                </div>
            </div>
            <SiteFooter />
        </>
    );
};

export default BlogDetail;
