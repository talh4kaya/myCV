import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useChatbot } from '../useChatbot';
import ThemeToggle from '../ThemeToggle';

const SiteHeader = () => {
    const { openFullscreen } = useChatbot();
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    const goToSection = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setMenuOpen(false);
        if (isHome) {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate(`/#${id}`);
        }
    };

    return (
        <header className="site-header">
            <div className="header-inner">
                <div className="header-left">
                    <div className="logo-col">
                        <Link to="/" className="logo" aria-label="Ana sayfa">
                            <img src="/me.png" alt="Talha Kaya" className="logo-img" />
                        </Link>
                    </div>
                    <div className={`nav-col${menuOpen ? ' open' : ''}`}>
                        <nav className="main-nav">
                            <a href="#projects" onClick={(e) => goToSection(e, 'projects')}>Projeler</a>
                            <Link to="/yarismalarim" onClick={() => setMenuOpen(false)}>Yarışmalar</Link>
                            <Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    openFullscreen();
                                }}
                            >
                                Chatbot
                            </button>
                            <a href="#contact" onClick={(e) => goToSection(e, 'contact')}>Hakkımda</a>
                            <a
                                href="/TalhaKayaCV.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMenuOpen(false)}
                            >
                                Özgeçmiş
                            </a>
                            {/* sadece mobil menüde görünür */}
                            <a
                                href="#contact"
                                className="nav-contact-mobile"
                                onClick={(e) => goToSection(e, 'contact')}
                            >
                                İletişime Geç
                            </a>
                        </nav>
                    </div>
                </div>
                <div className="header-right">
                    <a href="#contact" onClick={(e) => goToSection(e, 'contact')} className="link-arrow">
                        İletişime Geç
                    </a>
                    <ThemeToggle />
                    <button
                        type="button"
                        className={`menu-btn${menuOpen ? ' open' : ''}`}
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                        aria-expanded={menuOpen}
                    >
                        <span className="menu-btn-icon">+</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default SiteHeader;
