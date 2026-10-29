import { useState, useCallback, useRef, type ReactNode } from 'react';
import { ChatbotContext, type ChatMessage, type ThinkingStep } from './useChatbot';
import { getGeminiResponseStream } from '../services/gemini';
import { sanitizeInput } from '../services/chatGuard';
import { savePromptToFirebase } from '../services/firebase';

// Gemini adımları milisaniyeler içinde ürettiği için her adım en az bu kadar
// ekranda kalır; cevap metni de adımlar gösterilip bitince akmaya başlar.
const STEP_REVEAL_MS = 450;

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

        // Önce boş bir bot mesajı ekle; düşünme adımları ve cevap geldikçe güncellenir
        setMessages(prev => [...prev, { role: 'bot', content: '', thinking: { steps: [], startedAt: Date.now() } }]);

        const updateLast = (fn: (msg: ChatMessage) => ChatMessage) =>
            setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role !== 'bot') return prev;
                return [...prev.slice(0, -1), fn(last)];
            });

        const appendText = (chunk: string) =>
            updateLast(msg => ({
                ...msg,
                content: msg.content + chunk,
                // İlk cevap parçasıyla düşünme süresi sabitlenir
                thinking: msg.thinking && msg.thinking.durationMs === undefined
                    ? { ...msg.thinking, durationMs: Date.now() - msg.thinking.startedAt }
                    : msg.thinking,
            }));

        // Adımları sırayla göster, bu sırada gelen cevap metnini biriktir
        const queue: ThinkingStep[] = [];
        let revealing = false;
        let pendingText = '';
        let cancelled = false;
        let resolveDrained = () => {};
        const drained = new Promise<void>(resolve => { resolveDrained = resolve; });
        let streamDone = false;

        const flushText = () => {
            if (cancelled || !pendingText) return;
            appendText(pendingText);
            pendingText = '';
        };
        const revealNext = () => {
            if (cancelled) return;
            const step = queue.shift();
            if (!step) {
                revealing = false;
                flushText();
                if (streamDone) resolveDrained();
                return;
            }
            revealing = true;
            updateLast(msg => msg.thinking
                ? { ...msg, thinking: { ...msg.thinking, steps: [...msg.thinking.steps, step] } }
                : msg);
            setTimeout(revealNext, STEP_REVEAL_MS);
        };

        try {
            await getGeminiResponseStream(trimmed, {
                onStep: (stepText, ruledOut) => {
                    queue.push({ text: stepText, ruledOut });
                    if (!revealing) revealNext();
                },
                onText: (chunk) => {
                    pendingText += chunk;
                    if (!revealing) flushText();
                },
            });
            streamDone = true;
            if (!revealing) {
                flushText();
                resolveDrained();
            }
            await drained;
        } catch {
            cancelled = true;
            updateLast(() => ({ role: 'bot', content: 'Sistem Hatası: Bağlantı koptu.' }));
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
