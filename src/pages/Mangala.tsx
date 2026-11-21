import { useCallback, useEffect, useRef, useState } from 'react';
import SiteHeader from '../components/sections/SiteHeader';
import SiteFooter from '../components/sections/SiteFooter';
import BackLink from '../components/BackLink';
import { type Board, type Player, DRAW, initialBoard, step, validMoves } from '../mangala/engine.ts';
import type { Level, WorkerIn, WorkerOut } from '../mangala/ai.worker.ts';

/* Sen hep alttaki oyuncusun (kuyular 0-5, hazine 6, sağda).
   Yapay zeka üstte: kuyuları soldan sağa 12..7, hazinesi (13) solda.
   Taşlar saat yönünün tersine dağıldığı için bu yerleşim gerçek tahtayla aynı. */
const HUMAN: Player = 0;
const AI: Player = 1;

type Phase = 'loading' | 'human' | 'ai' | 'animating' | 'over' | 'error';

const LEVEL_LABEL: Record<Level, string> = { kolay: 'Kolay', orta: 'Orta', zor: 'Zor' };

/* hamlenin taş taş animasyonu için ara tahtalar: taşlar alınır, sonra birer birer bırakılır */
const sowFrames = (board: Board, player: Player, action: number): { board: Board; at: number }[] => {
    const b = board.slice();
    const k = (player === 0 ? 0 : 7) + action;
    const stones = b[k];
    let hand = stones === 1 ? 1 : stones - 1;
    b[k] = stones === 1 ? 0 : 1;
    const frames = [{ board: b.slice(), at: k }];
    let pos = k;
    while (hand > 0) {
        pos = (pos + 1) % 14;
        if ((player === 0 && pos === 13) || (player === 1 && pos === 6)) continue;
        b[pos] += 1;
        hand -= 1;
        frames.push({ board: b.slice(), at: pos });
    }
    return frames;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const Stones = ({ n }: { n: number }) => (
    <span className="mg-stones" aria-hidden="true">
        {Array.from({ length: Math.min(n, 16) }, (_, i) => (
            <i key={i} />
        ))}
    </span>
);

const Mangala = () => {
    const [board, setBoard] = useState<Board>(initialBoard);
    const [turn, setTurn] = useState<Player>(HUMAN);
    const [phase, setPhase] = useState<Phase>('loading');
    const [progress, setProgress] = useState(0);
    const [level, setLevel] = useState<Level>('orta');
    const [aiFirst, setAiFirst] = useState(false);
    const [note, setNote] = useState('');
    const [aiValue, setAiValue] = useState<number | null>(null);
    const [highlight, setHighlight] = useState<number | null>(null);
    const [captured, setCaptured] = useState<number[]>([]);
    const [winner, setWinner] = useState<number | null>(null);

    const workerRef = useRef<Worker | null>(null);
    // yeni oyun başlayınca eski oyundan gelen cevaplar ve animasyonlar yok sayılır
    const gameRef = useRef(0);
    const readyRef = useRef(false);
    const turnRef = useRef<Player>(HUMAN);
    useEffect(() => {
        turnRef.current = turn;
    }, [turn]);
    const pendingRef = useRef<((msg: WorkerOut) => void) | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const worker = new Worker(new URL('../mangala/ai.worker.ts', import.meta.url), { type: 'module' });
        workerRef.current = worker;
        worker.onmessage = (e: MessageEvent<WorkerOut>) => {
            const msg = e.data;
            if (msg.type === 'progress') setProgress(msg.ratio);
            else if (msg.type === 'ready') {
                readyRef.current = true;
                setPhase((p) => (p === 'loading' ? (turnRef.current === HUMAN ? 'human' : 'ai') : p));
            } else if (msg.type === 'error') {
                setPhase('error');
                setNote(msg.message);
            } else if (msg.type === 'move') {
                pendingRef.current?.(msg);
            }
        };
        worker.postMessage({ type: 'init' } satisfies WorkerIn);
        return () => worker.terminate();
    }, []);

    /* bir hamleyi animasyonla oynatır, sonucu döndürür */
    const playMove = useCallback(async (b: Board, player: Player, action: number, game: number) => {
        const frames = sowFrames(b, player, action);
        const per = Math.max(55, Math.min(150, 1500 / frames.length));
        setPhase('animating');
        setCaptured([]);
        for (const f of frames) {
            if (gameRef.current !== game) return null;
            setBoard(f.board);
            setHighlight(f.at);
            await wait(per);
        }
        const r = step(b, player, action);
        if (gameRef.current !== game) return null;
        if (r.captured.length > 0) {
            setCaptured(r.captured);
            await wait(260);
        }
        setBoard(r.board);
        return r;
    }, []);

    const afterMove = useCallback((r: ReturnType<typeof step>, mover: Player) => {
        if (r.done) {
            setWinner(r.winner);
            setPhase('over');
            setTurn(r.next);
            return;
        }
        if (r.next === mover) {
            setNote(mover === HUMAN ? 'Son taş hazinene düştü, bir hamle daha senin.' : 'Yapay zekanın son taşı hazinesine düştü, tekrar oynuyor.');
        } else {
            setNote('');
        }
        setTurn(r.next);
        setPhase(r.next === HUMAN ? 'human' : 'ai');
    }, []);

    // yapay zekanın sırası: worker'a sor, en az biraz "düşünüyormuş" gibi beklet
    useEffect(() => {
        if (phase !== 'ai' || !readyRef.current) return;
        const game = gameRef.current;
        const worker = workerRef.current;
        if (!worker) return;
        let cancelled = false;
        const id = Math.random();
        const t0 = performance.now();
        pendingRef.current = async (msg) => {
            if (msg.type !== 'move' || msg.id !== id || cancelled || gameRef.current !== game) return;
            pendingRef.current = null;
            setAiValue(msg.value);
            const elapsed = performance.now() - t0;
            if (elapsed < 450) await wait(450 - elapsed);
            if (cancelled || gameRef.current !== game) return;
            const r = await playMove(board, AI, msg.action, game);
            if (r) afterMove(r, AI);
        };
        worker.postMessage({ type: 'think', id, board, player: AI, level } satisfies WorkerIn);
        return () => {
            cancelled = true;
        };
        // tahta ve seviye bu turun başındaki halleriyle kullanılır
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    const onPit = async (action: number) => {
        if (phase !== 'human' || turn !== HUMAN || board[action] === 0) return;
        const game = gameRef.current;
        setNote('');
        const r = await playMove(board, HUMAN, action, game);
        if (r) afterMove(r, HUMAN);
    };

    const newGame = (first: boolean = aiFirst) => {
        gameRef.current += 1;
        pendingRef.current = null;
        setBoard(initialBoard());
        setHighlight(null);
        setCaptured([]);
        setWinner(null);
        setAiValue(null);
        setNote('');
        const starter = first ? AI : HUMAN;
        setTurn(starter);
        setPhase(readyRef.current ? (starter === HUMAN ? 'human' : 'ai') : 'loading');
    };

    const humanMoves = phase === 'human' ? validMoves(board, HUMAN) : [];

    let status: string;
    if (phase === 'loading') status = `Yapay zeka yükleniyor… %${Math.round(progress * 100)}`;
    else if (phase === 'error') status = 'Yapay zeka yüklenemedi. Sayfayı yenilemeyi dene.';
    else if (phase === 'over') {
        const diff = `${board[6]} - ${board[13]}`;
        status = winner === DRAW ? `Berabere bitti (${diff}).` : winner === HUMAN ? `Kazandın! (${diff})` : `Yapay zeka kazandı (${diff}).`;
    } else if (phase === 'ai' || (phase === 'animating' && turn === AI)) status = 'Yapay zeka düşünüyor…';
    else if (phase === 'animating') status = 'Taşlar dağılıyor…';
    else status = 'Sıra sende. Alttaki kuyulardan birini seç.';

    const pit = (i: number) => {
        const mine = i <= 5;
        const playable = mine && humanMoves.includes(i);
        const cls = [
            'mg-pit',
            mine ? 'is-mine' : 'is-ai',
            playable ? 'is-playable' : '',
            highlight === i ? 'is-last' : '',
            captured.includes(i) ? 'is-captured' : '',
        ].join(' ');
        return (
            <button
                key={i}
                type="button"
                className={cls}
                disabled={!playable}
                onClick={() => onPit(i)}
                aria-label={`${mine ? 'Senin' : 'Yapay zekanın'} ${mine ? i + 1 : 13 - i}. kuyusu, ${board[i]} taş`}
            >
                <Stones n={board[i]} />
                <span className="mg-count">{board[i]}</span>
            </button>
        );
    };

    const store = (i: number, label: string) => (
        <div className={`mg-store${highlight === i ? ' is-last' : ''}`} aria-label={`${label} hazinesi, ${board[i]} taş`}>
            <span className="mg-store-label">{label}</span>
            <Stones n={board[i]} />
            <span className="mg-count">{board[i]}</span>
        </div>
    );

    const aiPct = aiValue === null ? null : Math.round(((aiValue + 1) / 2) * 100);

    return (
        <>
            <SiteHeader />
            <main>
                <BackLink />

                <section className="page-hero">
                    <div className="page-hero-top">
                        <div>
                            <h1>Mangala.</h1>
                            <p className="page-hero-sub">
                                Kendi kendine oynayarak öğrenen yapay zekama karşı bir el at. Model tamamen senin tarayıcında çalışıyor, hamlelerin hiçbir sunucuya gitmiyor.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mg-wrap">
                    <div className="mg-controls">
                        <div className="mg-seg" role="group" aria-label="Zorluk">
                            {(Object.keys(LEVEL_LABEL) as Level[]).map((l) => (
                                <button key={l} type="button" className={level === l ? 'is-on' : ''} onClick={() => setLevel(l)} aria-pressed={level === l}>
                                    {LEVEL_LABEL[l]}
                                </button>
                            ))}
                        </div>
                        <div className="mg-seg" role="group" aria-label="Kim başlasın">
                            <button type="button" className={!aiFirst ? 'is-on' : ''} onClick={() => { setAiFirst(false); newGame(false); }} aria-pressed={!aiFirst}>
                                Önce sen
                            </button>
                            <button type="button" className={aiFirst ? 'is-on' : ''} onClick={() => { setAiFirst(true); newGame(true); }} aria-pressed={aiFirst}>
                                Önce yapay zeka
                            </button>
                        </div>
                        <button type="button" className="mg-new" onClick={() => newGame()}>
                            Yeni oyun
                        </button>
                    </div>

                    <div className={`mg-board${phase === 'loading' ? ' is-loading' : ''}`}>
                        {store(13, 'Yapay zeka')}
                        <div className="mg-rows">
                            <div className="mg-row">{[12, 11, 10, 9, 8, 7].map(pit)}</div>
                            <div className="mg-row">{[0, 1, 2, 3, 4, 5].map(pit)}</div>
                        </div>
                        {store(6, 'Sen')}
                        {phase === 'loading' && (
                            <div className="mg-loading" aria-hidden="true">
                                <span style={{ transform: `scaleX(${progress})` }} />
                            </div>
                        )}
                    </div>

                    <div className="mg-status" aria-live="polite">
                        <p className="mg-status-main">{status}</p>
                        {note && phase !== 'over' && <p className="mg-status-note">{note}</p>}
                        {aiPct !== null && phase !== 'over' && (
                            <p className="mg-status-note">Yapay zekanın kendi kazanma beklentisi: %{aiPct}</p>
                        )}
                    </div>
                </section>

                <section className="mg-info">
                    <div>
                        <p className="mg-label">Nasıl çalışıyor</p>
                        <p>
                            Model AlphaZero yöntemiyle eğitildi. Hiç insan oyunu görmeden, kendisiyle oynadığı yüz binlerce oyundan öğrendi. Her hamleden önce
                            yüzlerce olası devamı deniyor; hangi dalın umut verici olduğunu bir Transformer ağı söylüyor.{' '}
                            <a className="mg-link" href="https://github.com/talh4kaya/reinforcement-Learning-Mangala" target="_blank" rel="noopener noreferrer">
                                Kodu GitHub'da.
                            </a>
                        </p>
                    </div>
                    <div>
                        <p className="mg-label">Oyun sonu</p>
                        <p>
                            Kuyularda 12 ya da daha az taş kalınca önceden hesaplanmış 2,7 milyon pozisyonluk tabloya bakıyor. Bu noktadan sonra kusursuz oynuyor.
                        </p>
                    </div>
                    <div>
                        <p className="mg-label">Kurallar</p>
                        <p>
                            Kuyudaki taşları alıp ilkini aynı kuyuya bırakarak saat yönünün tersine dağıtırsın. Son taş hazinene düşerse tekrar oynarsın. Rakip kuyusunu
                            çift yaparsan o taşlar senin olur. Son taş kendi boş kuyuna düşerse karşısındaki taşlarla birlikte alırsın. Bir tarafın kuyuları boşalınca oyun biter ve kuyuları ilk boşalan, rakibin kuyularında kalan taşları da alır.
                        </p>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </>
    );
};

export default Mangala;
