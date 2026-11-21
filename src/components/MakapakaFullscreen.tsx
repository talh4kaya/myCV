import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatbot } from './useChatbot';
import { MakapakaWindow } from './HeroCard';

/* Tam ekran sohbet: ana sayfadaki makapaka penceresinin büyük hali.
   Arkası bulanık; boşluğa tıklayınca, çarpıyla ya da Esc ile kapanır. */
const MakapakaFullscreen = () => {
    const { messages, isFullscreenOpen, closeFullscreen } = useChatbot();
    const [isClosing, setIsClosing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            closeFullscreen();
        }, 250);
    }, [closeFullscreen]);

    useEffect(() => {
        if (isFullscreenOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullscreenOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreenOpen) handleClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isFullscreenOpen, handleClose]);

    const className = `chat-fullscreen ${isFullscreenOpen ? 'active' : ''} ${isClosing ? 'closing' : ''}`.trim();

    return (
        <div className={className} onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
            <div className="mk-full">
                <div className="hc2 hc2-full" role="dialog" aria-label="makapaka sohbeti">
                    <MakapakaWindow
                        full
                        shown={messages}
                        onClose={handleClose}
                        onPlus={() => inputRef.current?.focus()}
                        inputRef={inputRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default MakapakaFullscreen;
