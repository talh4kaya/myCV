import { useEffect, useState } from 'react';
import { getVisitorCount } from '../../services/firebase';

const formatTRT = () => {
    const now = new Date(Date.now() + 3 * 60 * 60 * 1000);
    return now.toISOString().slice(11, 19);
};

const SiteFooter = () => {
    const [clock, setClock] = useState(formatTRT);
    const [visitors, setVisitors] = useState<number | null>(null);

    useEffect(() => {
        const id = setInterval(() => setClock(formatTRT()), 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        let mounted = true;

        // 5 sn timeout — şirket firewall'ı Firebase'i bloklarsa hang etmesin
        const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));

        Promise.race([getVisitorCount(), timeout])
            .then((result) => {
                if (mounted && typeof result === 'number') setVisitors(result);
            })
            .catch(() => {
                // sessiz fail — sayaç görünmez kalır
            });

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <footer className="site-footer">
            <p>© 2026 Talha Kaya</p>
            <div className="footer-time-block">
                <p className="footer-time">TRT <span>{clock}</span></p>
                <p className="footer-sub">111 163</p>
                {visitors !== null && (
                    <p className="footer-sub">
                        <span className="visitor-dot"></span>
                        {visitors} ziyaretçi
                    </p>
                )}
            </div>
            <div className="footer-links">
                <p><a href="mailto:talh4kaya@gmail.com">talh4kaya@gmail.com</a></p>
                <p>
                    <a href="https://www.linkedin.com/in/talha-kaya-aa5255340" target="_blank" rel="noopener noreferrer">
                        linkedin.com/in/talha-kaya
                    </a>
                </p>
                <p>
                    <a href="https://github.com/talh4kaya" target="_blank" rel="noopener noreferrer">
                        github.com/talh4kaya
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default SiteFooter;
