import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { portfolioData } from '../data/portfolio';

const ProjectDetail = () => {
    const { id } = useParams<{ id: string }>();
    const project = portfolioData.projects.find((p) => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!project) {
        return (
            <div className="project-detail-page">
                <div className="project-detail-inner" style={{ textAlign: 'center' }}>
                    <h1 className="project-detail-title">Proje Bulunamadı</h1>
                    <Link to="/" className="project-detail-back">
                        ← Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        );
    }

    const cleanName = project.name.split('(')[0].trim();
    const subtitle = project.name.split('(')[1]?.replace(')', '') ?? project.desc;

    return (
        <div className="project-detail-page">
            <div className="project-detail-inner">
                <Link to="/" className="project-detail-back">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Geri Dön
                </Link>

                <h1 className="project-detail-title">{cleanName}</h1>
                <p className="project-detail-sub">{subtitle}</p>

                <div className="project-detail-tags">
                    {project.tech.map((t) => (
                        <span key={t} className="project-detail-tag">{t}</span>
                    ))}
                </div>

                {project.details?.story && (
                    <section className="project-detail-section">
                        <h2>Hikayesi ve Motivasyonum</h2>
                        <p className="project-detail-story">{project.details.story}</p>
                    </section>
                )}

                {project.details?.technical && project.details.technical.length > 0 && (
                    <section className="project-detail-section">
                        <h2>Teknik Derinlik</h2>
                        {project.details.technical.map((item, i) => (
                            <div key={i} className="project-detail-tech-item">
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                            </div>
                        ))}
                    </section>
                )}

                <div className="project-detail-footer">© 2026 Talha Kaya</div>
            </div>
        </div>
    );
};

export default ProjectDetail;
