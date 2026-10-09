import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatbot } from './ChatbotContext';

const MakapakaFullscreen = () => {
    const { messages, isTyping, sendMessage, isFullscreenOpen, closeFullscreen } = useChatbot();
    const [input, setInput] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const messagesRef = useRef<HTMLDivElement>(null);
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
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages, isTyping, isFullscreenOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreenOpen) handleClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isFullscreenOpen, handleClose]);

    const handleSend = () => {
        const value = input.trim();
        if (!value) return;
        setInput('');
        sendMessage(value);
    };

    const className = `chat-fullscreen ${isFullscreenOpen ? 'active' : ''} ${isClosing ? 'closing' : ''}`.trim();

    return (
        <div className={className} onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
            <div className="fs-card">
                <div className="fs-header">
                    <div className="fs-title">makapaka</div>
                    <button type="button" className="fs-close" onClick={handleClose} aria-label="Kapat (ESC)">
                        ✕
                    </button>
                </div>

                <div className="fs-messages" ref={messagesRef}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`fs-msg${msg.role === 'user' ? ' user' : ''}`}>
                            <div className="fs-msg-label">{msg.role === 'user' ? 'Sen' : 'Makapaka'}</div>
                            <div className="fs-msg-text">{msg.content}</div>
                        </div>
                    ))}
                    {isTyping && <div className="fs-typing">yazıyor...</div>}
                </div>

                <div className="fs-input-box">
                    <input
                        className="fs-input"
                        ref={inputRef}
                        type="text"
                        placeholder="Bir şey sor..."
                        autoComplete="off"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="phone-send-btn"
                        onClick={handleSend}
                        disabled={isTyping || !input.trim()}
                        aria-label="Gönder"
                    >
                        ↗
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MakapakaFullscreen;
