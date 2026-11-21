import { useEffect, useRef, useState, type FormEvent, type RefObject } from 'react';
import { useChatbot } from './useChatbot';
import ThinkingSteps from './ThinkingSteps';
import PredictiveInput from './PredictiveInput';
import { useDictation } from './useDictation';
import { MAX_MESSAGE_LENGTH } from '../services/chatGuard';
import type { ChatMessage } from './useChatbot';

/* Ana sayfadaki büyük kart (Notion'daki ürün görselinin yerinde): açık mavi
   dalgalı arka plan üstünde sade beyaz bir pencere. İçinde yalnızca karşılama
   ve mesaj kutusu var; Makapaka sohbeti burada gerçekten çalışır, cevaplar
   pencerenin içinde akar. Ziyaretçi yazana kadar örnek bir soru cevap oynar.
   Ölçü birimi --u = kartın genişliğinin 1/1024'ü. */

// makapaka logosu: her temada beyaz yuvarlak, ince gri kenar çizgisi ve
// siyah yüz (iki göz ve L biçiminde burun); beyaz zeminde de seçilir
const MakapakaLogo = ({ className = 'hc2-logo' }: { className?: string }) => (
    <svg viewBox="0 0 1080 1080" className={className} aria-hidden="true">
        <circle className="mk-bg" cx="540" cy="540" r="505" fill="#ffffff" stroke="#c9cbd0" strokeWidth="70" />
        <g className="mk-fg" fill="#111113" transform="translate(540 540) scale(0.78) translate(-1000 -520)">
            <circle cx="686" cy="524" r="82" />
            <circle cx="1314" cy="524" r="82" />
            <path d="M852 330h84v296h190v84H852z" />
        </g>
    </svg>
);

const DEMO_Q = 'Talha, dijital dönüşüm kapsamında veriyi iş sonuçlarına nasıl dönüştürüyor?';
const DEMO_A =
    "Talha, şirketlerin dağınık verisini tek bir yerde toplayıp güvenilir hale getiriyor; ardından bu veriyi herkesin kendi yetkisiyle soru sorup grafik alabildiği yapay zekâ çözümlerine dönüştürüyor. Kısacası veriyi toplamaktan iş kararına kadar tüm yolu kuruyor.";
const DEMO_STEPS = [
    "Soru Talha'nın veri ve dijital dönüşüm işini soruyor",
    'Aktif kullanılan projelerine baktım',
    'Veriden yapay zekâya giden yolu özetledim',
];

// Ziyaretçi yazana kadar oynayan örnek sohbet: soru, düşünme adımları, yazılan cevap
const useDemo = (): ChatMessage[] => {
    const [stage, setStage] = useState({ q: false, steps: 0, chars: 0, startedAt: 0, durationMs: undefined as number | undefined });

    useEffect(() => {
        const timers: number[] = [];
        const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
        let typer = 0;
        // ana başlığın animasyonu ve kartın belirmesi bittikten sonra başlar
        const T = 3300;
        at(T, () => setStage((s) => ({ ...s, q: true })));
        at(T + 700, () => setStage((s) => ({ ...s, startedAt: Date.now() })));
        DEMO_STEPS.forEach((_, i) => at(T + 1200 + i * 1100, () => setStage((s) => ({ ...s, steps: i + 1 }))));
        at(T + 1200 + DEMO_STEPS.length * 1100, () => {
            setStage((s) => ({ ...s, durationMs: Date.now() - s.startedAt }));
            typer = window.setInterval(() => {
                setStage((s) => {
                    if (s.chars >= DEMO_A.length) window.clearInterval(typer);
                    return { ...s, chars: Math.min(DEMO_A.length, s.chars + 2) };
                });
            }, 30);
        });
        return () => {
            timers.forEach(window.clearTimeout);
            window.clearInterval(typer);
        };
    }, []);

    const out: ChatMessage[] = [];
    if (stage.q) out.push({ role: 'user', content: DEMO_Q });
    if (stage.startedAt)
        out.push({
            role: 'bot',
            content: DEMO_A.slice(0, stage.chars),
            thinking: {
                steps: DEMO_STEPS.slice(0, stage.steps).map((text) => ({ text, ruledOut: false })),
                startedAt: stage.startedAt,
                durationMs: stage.durationMs,
            },
        });
    return out;
};

/* Sohbet penceresi: başlık (makapaka), mesajlar ve mesaj kutusu. Ana
   sayfadaki kartta ve tam ekran sohbette aynı pencere kullanılır. */
type WindowProps = {
    shown: ChatMessage[];
    full?: boolean;
    onTitle?: () => void;
    onPlus?: () => void;
    onClose?: () => void;
    inputRef?: RefObject<HTMLInputElement | null>;
};

export const MakapakaWindow = ({ shown, full, onTitle, onPlus, onClose, inputRef }: WindowProps) => {
    const { isTyping, sendMessage } = useChatbot();
    const [text, setText] = useState('');
    const listRef = useRef<HTMLDivElement>(null);
    const dictation = useDictation(text, setText);

    useEffect(() => {
        const el = listRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [shown]);

    const submit = (e?: FormEvent) => {
        e?.preventDefault();
        const q = text.trim();
        if (!q || isTyping) return;
        dictation.stop();
        void sendMessage(q);
        setText('');
    };

    return (
        <div className="hc2-window">
            <section className="hc2-main">
                <button type="button" className="hc2-title" onClick={onTitle} aria-label={full ? 'makapaka' : 'makapaka sohbetini tam ekran aç'}>
                    <MakapakaLogo className="hc2-title-logo" />makapaka
                </button>
                {onClose && (
                    <button type="button" className="hc2-close" onClick={onClose} aria-label="Kapat (ESC)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                )}
                <div className="hc2-messages" ref={listRef}>
                    {shown.map((m, i) =>
                        m.role === 'user' ? (
                            <div key={i} className="hc2-msg hc2-msg-user">
                                <p>{m.content}</p>
                            </div>
                        ) : (
                            <div key={i} className="hc2-msg hc2-msg-bot">
                                <MakapakaLogo />
                                <div className="hc2-bot-body">
                                    <p className="hc2-who">makapaka</p>
                                    {m.thinking && <ThinkingSteps thinking={m.thinking} />}
                                    {m.content && <p className="hc2-bubble">{m.content}</p>}
                                </div>
                            </div>
                        ),
                    )}
                </div>

                <form className="hc2-composer" onSubmit={submit}>
                    <button type="button" className="hc2-plus" onClick={onPlus} aria-label="Yeni sohbet aç">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </button>
                    <PredictiveInput
                        className="hc2-input"
                        inputRef={inputRef}
                        value={text}
                        onChange={setText}
                        onSubmit={() => submit()}
                        maxLength={MAX_MESSAGE_LENGTH}
                        placeholder="Talha hakkında bir şey sor..."
                    />
                    {dictation.supported && (
                        <button
                            type="button"
                            className={`hc2-mic${dictation.listening ? ' is-on' : ''}`}
                            onClick={dictation.toggle}
                            aria-label={dictation.listening ? 'Dikteyi durdur' : 'Sesle yaz (dikte)'}
                            aria-pressed={dictation.listening}
                            title={dictation.listening ? 'Dinliyorum, durdurmak için tıkla' : 'Sesle yaz'}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" />
                            </svg>
                        </button>
                    )}
                    <button type="submit" className="hc2-send" aria-label="Gönder" disabled={!text.trim() || isTyping}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 19V5M6 11l6-6 6 6" />
                        </svg>
                    </button>
                </form>
            </section>
        </div>
    );
};

const HeroCard = () => {
    const { messages, openFullscreen } = useChatbot();
    const chatting = messages.some((m) => m.role === 'user');
    const demo = useDemo();
    const shown = chatting ? messages : demo;

    return (
        <div className="hc2" role="region" aria-label="Makapaka sohbet penceresi">
            {/* arka plan: açık mavi, yumuşak lekeli stüdyo zemini (CSS ile çizilir) */}
            <div className="hc2-bg" aria-hidden="true" />
            <MakapakaWindow shown={shown} onTitle={openFullscreen} onPlus={openFullscreen} />
        </div>
    );
};

export default HeroCard;
