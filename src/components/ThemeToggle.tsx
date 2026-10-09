import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';

const getInitialTheme = (): Theme =>
    (document.documentElement.getAttribute('data-theme') as Theme) ?? 'dark';

const ThemeToggle = () => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // özel sekmede localStorage kapalı olabilir — tema yine de uygulanır
        }
    }, [theme]);

    const next = theme === 'dark' ? 'light' : 'dark';

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(next)}
            aria-label={next === 'light' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            title={next === 'light' ? 'Açık tema' : 'Koyu tema'}
        >
            {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
            )}
        </button>
    );
};

export default ThemeToggle;
