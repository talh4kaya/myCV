import { useEffect, useRef, useState } from 'react';
import { useChatbot } from './useChatbot';
import { MAX_MESSAGE_LENGTH } from '../services/chatGuard';

/**
 * v4 tasarımındaki "telefon ekranı" chatbot kartı.
 * Görsel olarak mockup'ın birebir aynısı, ama Gemini'ye bağlı gerçek sohbet.
 */
const MakapakaCard = () => {
    const { messages, isTyping, sendMessage } = useChatbot();
    const [input, setInput] = useState('');
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        const value = input.trim();
        if (!value) return;
        setInput('');
        sendMessage(value);
    };

    return (
        <div className="project-thumb project-thumb-chat" id="chatbot">
            <div className="mobile-phone-screen">
                <div className="phone-top-row">
                    <h2 className="app-greeting">Talha hakkında ne sormak istersin?</h2>
                    <div className="card-top-label">makapaka</div>
                </div>

                <div className="phone-body-content" ref={bodyRef}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`assistant-msg-bubble${msg.role === 'user' ? ' user' : ''}`}
                        >
                            <p>{msg.content}</p>
                        </div>
                    ))}
                    {isTyping && <div className="phone-typing">yazıyor...</div>}
                </div>

                <div className="phone-bottom-bar">
                    <div className="phone-input-box">
                        <input
                            type="text"
                            className="phone-input-field"
                            placeholder="Bir şey sor..."
                            autoComplete="off"
                            maxLength={MAX_MESSAGE_LENGTH}
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
        </div>
    );
};

export default MakapakaCard;
