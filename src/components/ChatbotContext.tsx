import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { getGeminiResponseStream } from '../services/gemini';
import { sanitizeInput } from '../services/chatGuard';
import { savePromptToFirebase } from '../services/firebase';

export type ChatMessage = {
    role: 'bot' | 'user';
    content: string;
};

type ChatbotContextValue = {
    messages: ChatMessage[];
    isTyping: boolean;
    sendMessage: (text: string) => Promise<void>;
    isFullscreenOpen: boolean;
    openFullscreen: () => void;
    closeFullscreen: () => void;
};

const ChatbotContext = createContext<ChatbotContextValue | undefined>(undefined);

const INITIAL_MESSAGE: ChatMessage = {
    role: 'bot',
    content:
        "Merhaba! Ben Makapaka, Talha'nın yapay zeka asistanıyım. Projeler, stajlar veya yetkinlikler hakkında merak ettiklerini sorabilirsin.",
};

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
    const [isTyping, setIsTyping] = useState(false);
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
    const inFlight = useRef(false);

    const sendMessage = useCallback(async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || inFlight.current) return;
        inFlight.current = true;

        setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
        setIsTyping(true);

        // ── GÜVENLİK KATMANI: Input kontrolü ──
        const check = sanitizeInput(trimmed);
        if (!check.safe) {
            const blockMsg = check.reason === 'too_long'
                ? 'Mesajın çok uzun. Lütfen daha kısa bir soru yaz.'
                : 'Bu tür mesajlara yanıt veremiyorum.';
            setMessages(prev => [...prev, { role: 'bot', content: blockMsg }]);
            setIsTyping(false);
            inFlight.current = false;
            return;
        }

        savePromptToFirebase(trimmed);

        // Önce boş bir bot mesajı ekle, stream geldikçe üzerine yaz
        setMessages(prev => [...prev, { role: 'bot', content: '' }]);

        try {
            await getGeminiResponseStream(trimmed, (chunk) => {
                setIsTyping(false);
                setMessages(prev => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last?.role === 'bot') {
                        updated[updated.length - 1] = {
                            ...last,
                            content: last.content + chunk,
                        };
                    }
                    return updated;
                });
            });
        } catch {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'bot', content: 'Sistem Hatası: Bağlantı koptu.' };
                return updated;
            });
        } finally {
            setIsTyping(false);
            inFlight.current = false;
        }
    }, []);

    const openFullscreen = useCallback(() => setIsFullscreenOpen(true), []);
    const closeFullscreen = useCallback(() => setIsFullscreenOpen(false), []);

    return (
        <ChatbotContext.Provider
            value={{ messages, isTyping, sendMessage, isFullscreenOpen, openFullscreen, closeFullscreen }}
        >
            {children}
        </ChatbotContext.Provider>
    );
};

export const useChatbot = () => {
    const ctx = useContext(ChatbotContext);
    if (!ctx) throw new Error('useChatbot must be used within ChatbotProvider');
    return ctx;
};
