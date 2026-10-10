import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { portfolioData } from '../data/portfolio';
import SiteHeader from '../components/sections/SiteHeader';
import SiteFooter from '../components/sections/SiteFooter';

const BackLink = () => (
    <Link to="/#all-projects" className="project-detail-back">
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
        Projeler
    </Link>
);

const ProjectDetail = () => {
    const { id } = useParams<{ id: string }>();
    const project = portfolioData.projects.find((p) => p.id === id);

    // Bir projeden diğerine geçince de sayfanın başına dön
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!project) {
        return (
            <>
                <SiteHeader />
                <main className="project-detail-page" style={{ textAlign: 'center' }}>
                    <h1 className="project-detail-title">Proje bulunamadı</h1>
                    <BackLink />
                </main>
                <SiteFooter />
            </>
        );
    }

    const cleanName = project.name.split('(')[0].trim();
    const subtitle = project.name.split('(')[1]?.replace(')', '') ?? project.desc;

    return (
        <>
            <SiteHeader />

            <main className="project-detail-page">
                <BackLink />

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
            </main>

            <SiteFooter />
        </>
    );
};

export default ProjectDetail;
