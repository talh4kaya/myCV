import { useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { predictNext } from '../services/wordPredict';

type Props = {
    className: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    maxLength: number;
    inputRef?: RefObject<HTMLInputElement | null>;
};

/* Yazarken cümlenin devamını soluk gri olarak öneren giriş kutusu.
   Tab ya da → ile (imleç sondayken), dokunmatikte öneriye dokunarak kabul
   edilir; Enter her zaman yalnızca yazılanı gönderir.
   Öneri, giriş kutusunun üstüne yerleştirilmiş görünmez bir kopya ile
   çizilir: kopyadaki yazı saydam, yalnızca önerinin kendisi görünür. */
const PredictiveInput = ({ className, value, onChange, onSubmit, maxLength, inputRef }: Props) => {
    const ownRef = useRef<HTMLInputElement>(null);
    const ref = inputRef ?? ownRef;
    const mirrorRef = useRef<HTMLDivElement>(null);
    const [focused, setFocused] = useState(false);
    const [fits, setFits] = useState(true);

    const suggestion = useMemo(
        () => (value.length + 1 < maxLength ? predictNext(value) : ''),
        [value, maxLength],
    );
    const showGhost = focused && fits && suggestion !== '';

    // kopyanın yazı tipini ve iç boşluğunu giriş kutusununkiyle eşitle.
    // Yazılan metin kutuya sığmıyorsa öneriyi gösterme (yazı kayınca hizası
    // bozulurdu); önerinin sığmayan kısmı "…" ile kesilir.
    useLayoutEffect(() => {
        const input = ref.current;
        const mirror = mirrorRef.current;
        if (!input || !mirror) return;
        const cs = getComputedStyle(input);
        mirror.style.font = cs.font;
        mirror.style.letterSpacing = cs.letterSpacing;
        mirror.style.padding = cs.padding;
        mirror.style.left = `${input.offsetLeft}px`;
        mirror.style.top = `${input.offsetTop}px`;
        mirror.style.width = `${input.offsetWidth}px`;
        mirror.style.height = `${input.offsetHeight}px`;
        mirror.style.lineHeight = `${input.clientHeight}px`;
        const typedWidth = (mirror.querySelector('.predict-typed') as HTMLElement | null)?.offsetWidth ?? 0;
        setFits(typedWidth < input.clientWidth - 24);
    }, [value, suggestion, ref]);

    const accept = () => {
        onChange(value + suggestion);
        ref.current?.focus();
    };

    return (
        <>
            <input
                ref={ref}
                type="text"
                className={className}
                placeholder="Bir şey sor..."
                autoComplete="off"
                maxLength={maxLength}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        onSubmit();
                        return;
                    }
                    const atEnd = e.currentTarget.selectionStart === value.length;
                    if (showGhost && atEnd && (e.key === 'Tab' || e.key === 'ArrowRight')) {
                        e.preventDefault();
                        accept();
                    }
                }}
            />
            <div className="predict-mirror" ref={mirrorRef} aria-hidden="true">
                <span>
                    <span className="predict-typed">{value}</span>
                    {showGhost && (
                        <span
                            className="predict-ghost"
                            onPointerDown={(e) => {
                                // giriş kutusu odağı kaybetmesin
                                e.preventDefault();
                                accept();
                            }}
                        >
                            {suggestion}
                        </span>
                    )}
                </span>
            </div>
        </>
    );
};

export default PredictiveInput;
