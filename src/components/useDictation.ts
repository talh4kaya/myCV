import { useCallback, useEffect, useRef, useState } from 'react';

/* Tarayıcının kendi konuşma tanıma özelliğiyle dikte (Web Speech API).
   Konuşulanlar Türkçe olarak yazıya çevrilir; kutuda önceden yazılı olan
   metnin sonuna eklenir. Tarayıcı desteklemiyorsa supported false döner ve
   mikrofon butonu gösterilmez. */

type RecognitionResult = { isFinal: boolean; 0: { transcript: string } };
type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> };
type Recognition = {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((e: RecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start: () => void;
    stop: () => void;
};
type RecognitionCtor = new () => Recognition;

const getCtor = (): RecognitionCtor | null => {
    if (typeof window === 'undefined') return null;
    const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
    return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

export const useDictation = (text: string, setText: (v: string) => void) => {
    const [listening, setListening] = useState(false);
    const recRef = useRef<Recognition | null>(null);
    const baseRef = useRef('');
    const supported = getCtor() !== null;

    const stop = useCallback(() => {
        recRef.current?.stop();
    }, []);

    const start = useCallback(() => {
        const Ctor = getCtor();
        if (!Ctor) return;
        const rec = new Ctor();
        rec.lang = 'tr-TR';
        rec.continuous = true;
        rec.interimResults = true;
        baseRef.current = text.trim() ? `${text.trim()} ` : '';
        rec.onresult = (e) => {
            let finalText = '';
            let interim = '';
            for (let i = 0; i < e.results.length; i++) {
                const r = e.results[i];
                if (r.isFinal) finalText += r[0].transcript;
                else interim += r[0].transcript;
            }
            setText((baseRef.current + finalText + interim).replace(/\s+/g, ' ').trimStart());
        };
        rec.onend = () => {
            setListening(false);
            recRef.current = null;
        };
        rec.onerror = () => {
            setListening(false);
        };
        recRef.current = rec;
        setListening(true);
        rec.start();
    }, [text, setText]);

    useEffect(() => () => recRef.current?.stop(), []);

    const toggle = useCallback(() => (listening ? stop() : start()), [listening, start, stop]);

    return { supported, listening, toggle, stop };
};
