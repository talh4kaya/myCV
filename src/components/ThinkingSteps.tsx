import { useEffect, useId, useState } from 'react';
import type { ChatMessage, ThinkingStep } from './useChatbot';

type Thinking = NonNullable<ChatMessage['thinking']>;

// Elenen olasılıklar, kendinden önceki ana adımın altında girintili gösterilir
type StepGroup = { step: ThinkingStep; ruledOut: ThinkingStep[] };

const groupSteps = (steps: ThinkingStep[]): StepGroup[] => {
    const groups: StepGroup[] = [];
    for (const step of steps) {
        const parent = groups[groups.length - 1];
        if (step.ruledOut && parent) parent.ruledOut.push(step);
        else groups.push({ step, ruledOut: [] });
    }
    return groups;
};

const formatSeconds = (ms: number) =>
    `${(ms / 1000).toLocaleString('tr-TR', { maximumFractionDigits: ms < 10_000 ? 1 : 0 })} sn`;

const Timeline = ({ steps, live }: { steps: ThinkingStep[]; live: boolean }) => {
    const groups = groupSteps(steps);
    return (
        <ol className="think-timeline">
            {groups.map((group, i) => {
                const isCurrent = live && i === groups.length - 1;
                return (
                    <li key={i} className={`think-step${isCurrent ? ' is-current' : ''}${group.step.ruledOut ? ' is-out' : ''}`}>
                        <span className="think-dot" aria-hidden="true" />
                        <span className="think-text">{group.step.text}</span>
                        {!live && group.ruledOut.length > 0 && (
                            <span className="think-count">{group.ruledOut.length} elendi</span>
                        )}
                        {group.ruledOut.length > 0 && (
                            <ul className="think-sub">
                                {group.ruledOut.map((sub, j) => (
                                    <li key={j} className="think-step is-out">
                                        <span className="think-dot" aria-hidden="true" />
                                        <span className="think-text">{sub.text}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                );
            })}
        </ol>
    );
};

/**
 * Makapaka'nın cevap öncesi düşünme adımları.
 * - Düşünürken: canlı sayaç + adımlar geldikçe beliren zaman çizelgesi
 * - Cevap başlayınca: "1,8 sn düşündü · 1 elendi" özetine katlanır, tıklanınca açılır
 */
const ThinkingSteps = ({ thinking }: { thinking: Thinking }) => {
    const live = thinking.durationMs === undefined;
    const [now, setNow] = useState(() => Date.now());
    const [open, setOpen] = useState(false);
    const panelId = useId();

    useEffect(() => {
        if (!live) return;
        const id = setInterval(() => setNow(Date.now()), 100);
        return () => clearInterval(id);
    }, [live]);

    const ruledOutCount = thinking.steps.filter((s) => s.ruledOut).length;

    if (live) {
        return (
            <div className="think is-live" role="status" aria-live="polite">
                <div className="think-head">
                    <span className="think-shimmer">Düşünüyor</span>
                    <span className="think-time">{formatSeconds(Math.max(0, now - thinking.startedAt))}</span>
                </div>
                {thinking.steps.length > 0 && <Timeline steps={thinking.steps} live />}
            </div>
        );
    }

    // Adım üretilmediyse (hata mesajı, format dışı cevap) özet gösterme
    if (thinking.steps.length === 0) return null;

    return (
        <div className={`think${open ? ' is-open' : ''}`}>
            <button
                type="button"
                className="think-head think-toggle"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
            >
                <span>{formatSeconds(thinking.durationMs ?? 0)} düşündü</span>
                {ruledOutCount > 0 && <span className="think-meta">· {ruledOutCount} elendi</span>}
                <svg className="think-chevron" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <div className="think-panel" id={panelId}>
                <div className="think-panel-inner">
                    <Timeline steps={thinking.steps} live={false} />
                </div>
            </div>
        </div>
    );
};

export default ThinkingSteps;
