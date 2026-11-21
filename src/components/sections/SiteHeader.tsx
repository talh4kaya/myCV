import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useChatbot } from '../useChatbot';
import ThemeToggle from '../ThemeToggle';

/* Üst menü (Notion'un menüsü gibi): logo tam ortada; solda Projeler, Yarışmalar,
   Blog, Chatbot; sağda Hakkımda, Özgeçmiş, tema düğmesi ve yuvarlak
   "İletişime Geç" butonu. Dar ekranda logo sola geçer, sağda buton ve
   hamburger kalır; linkler hamburgerle açılan panelde. */
const SiteHeader = () => {
    const { openFullscreen } = useChatbot();
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    const [menuOpen, setMenuOpen] = useState(false);
    // sayfa biraz kayınca "İletişime Geç" siyaha döner
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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

    const leftLinks = (
        <>
            <a href="#all-projects" onClick={(e) => goToSection(e, 'all-projects')}>Projeler</a>
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
        </>
    );

    const rightLinks = (
        <>
            <a href="#contact" onClick={(e) => goToSection(e, 'contact')}>Hakkımda</a>
            <a href="/TalhaKayaCV.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
                Özgeçmiş
            </a>
        </>
    );

    return (
        <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
            <div className="header-inner nv">
                <nav className="nv-links nv-left" aria-label="Ana menü">{leftLinks}</nav>

                <Link to="/" className="logo nv-logo" aria-label="Ana sayfa">
                    <img src="/me.png" alt="Talha Kaya" className="logo-img" />
                </Link>

                <div className="nv-right">
                    <nav className="nv-links nv-right-links" aria-label="Diğer">{rightLinks}</nav>
                    <ThemeToggle />
                    <a href="#contact" onClick={(e) => goToSection(e, 'contact')} className="nv-cta">
                        İletişime Geç
                    </a>
                    <button
                        type="button"
                        className={`nv-burger${menuOpen ? ' open' : ''}`}
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                        aria-expanded={menuOpen}
                    >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                    </button>
                </div>

                {/* dar ekranda hamburgerle açılan panel */}
                <nav className={`nv-panel${menuOpen ? ' open' : ''}`} aria-label="Menü">
                    {leftLinks}
                    {rightLinks}
                    <a href="#contact" onClick={(e) => goToSection(e, 'contact')} className="nv-cta nv-panel-cta">
                        İletişime Geç
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default SiteHeader;
