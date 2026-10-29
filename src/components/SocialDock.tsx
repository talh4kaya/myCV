import { useEffect, useRef } from 'react';

type DockItem = {
    label: string;
    href: string;
    icon: string;
};

const ITEMS: DockItem[] = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/talha-kaya-aa5255340', icon: '/icons/tiles/linkedin.png' },
    { label: 'E-posta', href: 'mailto:talh4kaya@gmail.com', icon: '/icons/tiles/gmail.png' },
    { label: 'GitHub', href: 'https://github.com/talh4kaya', icon: '/icons/tiles/github.png' },
    { label: 'Hugging Face', href: 'https://huggingface.co/talh4kaya', icon: '/icons/tiles/huggingface.png' },
    { label: 'Kaggle', href: 'https://www.kaggle.com/talh4kaya', icon: '/icons/tiles/kaggle-social.png' },
];

const BASE_SIZE = 38;
const MAX_SCALE = 1.7;
// İmlecin kaç piksel yakınındaki ikonların büyüyeceği
const RANGE = 130;

/**
 * macOS Dock tarzı sosyal medya ikonları: imleç yaklaştıkça ikon ve
 * komşuları yumuşakça büyür, üzerine gelinen ikonun adı üstte görünür.
 * Dokunmatik cihazlarda ve "hareketi azalt" tercihinde büyütme kapalıdır.
 */
const SocialDock = () => {
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const frame = useRef(0);
    const enabled = useRef(false);

    useEffect(() => {
        const query = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
        const update = () => { enabled.current = query.matches; };
        update();
        query.addEventListener('change', update);
        return () => {
            query.removeEventListener('change', update);
            cancelAnimationFrame(frame.current);
        };
    }, []);

    const resize = (mouseX: number | null) => {
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            for (const el of itemRefs.current) {
                if (!el) continue;
                let scale = 1;
                if (mouseX !== null) {
                    const rect = el.getBoundingClientRect();
                    const distance = Math.abs(mouseX - (rect.left + rect.width / 2));
                    if (distance < RANGE) {
                        // Kosinüs eğrisi: merkezde en büyük, kenara doğru yumuşakça azalır
                        scale += (MAX_SCALE - 1) * (Math.cos((distance / RANGE) * Math.PI) + 1) / 2;
                    }
                }
                el.style.setProperty('--dock-size', `${(BASE_SIZE * scale).toFixed(1)}px`);
            }
        });
    };

    return (
        <nav
            className="dock"
            aria-label="Sosyal medya hesapları"
            style={{ '--dock-base': `${BASE_SIZE}px`, '--dock-max': MAX_SCALE } as React.CSSProperties}
            onPointerMove={(e) => { if (enabled.current) resize(e.clientX); }}
            onPointerLeave={() => resize(null)}
        >
            {ITEMS.map((item, i) => {
                const external = item.href.startsWith('http');
                return (
                    <a
                        key={item.label}
                        ref={(el) => { itemRefs.current[i] = el; }}
                        href={item.href}
                        className="dock-item"
                        aria-label={item.label}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                        <span className="dock-tooltip" aria-hidden="true">{item.label}</span>
                        <img src={item.icon} alt="" width={BASE_SIZE} height={BASE_SIZE} />
                    </a>
                );
            })}
        </nav>
    );
};

export default SocialDock;
