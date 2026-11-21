/* Mangala yapay zekası, sayfayı dondurmasın diye ayrı bir iş parçacığında çalışır.
   Model (ONNX), oyun sonu tablosu ve WebAssembly dosyası ilk açılışta indirilir. */
import * as ort from 'onnxruntime-web/wasm';
import { type Board, type Endgame, type Player, endgameOffsets } from './engine.ts';
import { search, type Evaluator } from './mcts.ts';

export type Level = 'kolay' | 'orta' | 'zor';

export type WorkerIn =
    | { type: 'init' }
    | { type: 'think'; id: number; board: Board; player: Player; level: Level };

export type WorkerOut =
    | { type: 'progress'; ratio: number }
    | { type: 'ready' }
    | { type: 'error'; message: string }
    | { type: 'move'; id: number; action: number; value: number; sims: number; ms: number };

const BASE = '/mangala/';
const DB_MAX_K = 12;
// sunucu Content-Length vermezse ilerleme çubuğu için bilinen boyutlar
const FILES = [
    { name: 'ort-wasm-simd-threaded.wasm', size: 11210254 },
    { name: 'model.onnx', size: 3039012 },
    { name: 'endgame12.bin.gz', size: 753296 },
];

const LEVELS: Record<Level, { sims: number; timeMs?: number; minSims?: number; sample: boolean }> = {
    kolay: { sims: 24, sample: true },
    orta: { sims: 200, sample: false },
    zor: { sims: 1600, timeMs: 3500, minSims: 400, sample: false },
};

const post = (msg: WorkerOut) => self.postMessage(msg);

let session: ort.InferenceSession | null = null;
let db: Endgame | null = null;

const loaded = new Array(FILES.length).fill(0);
const reportProgress = () => {
    const total = FILES.reduce((s, f) => s + f.size, 0);
    post({ type: 'progress', ratio: Math.min(1, loaded.reduce((a, b) => a + b, 0) / total) });
};

const download = async (i: number): Promise<Uint8Array> => {
    const res = await fetch(BASE + FILES[i].name);
    if (!res.ok || !res.body) throw new Error(`${FILES[i].name} indirilemedi (${res.status})`);
    const reader = res.body.getReader();
    const parts: Uint8Array[] = [];
    let n = 0;
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        parts.push(value);
        n += value.length;
        loaded[i] = Math.min(n, FILES[i].size);
        reportProgress();
    }
    const out = new Uint8Array(n);
    let o = 0;
    for (const p of parts) {
        out.set(p, o);
        o += p.length;
    }
    loaded[i] = FILES[i].size;
    reportProgress();
    return out;
};

const gunzip = async (data: Uint8Array): Promise<Uint8Array> => {
    // sunucu dosyayı zaten açıp gönderdiyse gzip imzası olmaz
    if (data[0] !== 0x1f || data[1] !== 0x8b) return data;
    const stream = new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
};

const init = async () => {
    const [wasm, model, dbGz] = await Promise.all([download(0), download(1), download(2)]);
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.wasmBinary = wasm.buffer as ArrayBuffer;
    // kütüphanenin yardımcı modülü de bizim sunucudan (paketleyici yolunu bozmasın)
    ort.env.wasm.wasmPaths = { mjs: new URL(BASE + 'ort-wasm-simd-threaded.mjs', self.location.origin).href };
    session = await ort.InferenceSession.create(model, { executionProviders: ['wasm'] });
    const raw = await gunzip(dbGz);
    const offsets = endgameOffsets(DB_MAX_K);
    if (raw.length !== offsets[DB_MAX_K + 1]) throw new Error('oyun sonu tablosu bozuk');
    db = { table: new Int8Array(raw.buffer, raw.byteOffset, raw.byteLength), offsets, maxK: DB_MAX_K };
};

const evaluate: Evaluator = async (states) => {
    if (!session) throw new Error('model yüklenmedi');
    const x = new BigInt64Array(states.length * 14);
    states.forEach((s, i) => s.forEach((v, j) => (x[i * 14 + j] = BigInt(Math.min(v, 48)))));
    const out = await session.run({ board: new ort.Tensor('int64', x, [states.length, 14]) });
    const p = out.policy.data as Float32Array;
    const v = out.value.data as Float32Array;
    return {
        policy: states.map((_, i) => p.slice(i * 6, i * 6 + 6)),
        value: Array.from(v),
    };
};

const think = async (board: Board, player: Player, level: Level) => {
    const cfg = LEVELS[level];
    const t0 = performance.now();
    const r = await search(board, player, evaluate, {
        sims: cfg.sims,
        timeMs: cfg.timeMs,
        minSims: cfg.minSims,
        batch: 8,
        db,
    });
    let action = 0;
    if (cfg.sample) {
        // kolay seviye: ziyaret sayısıyla orantılı rastgele seçer, bazen hata yapar
        const total = r.visits.reduce((a, b) => a + b, 0);
        let u = Math.random() * total;
        for (let a = 0; a < 6; a++) {
            u -= r.visits[a];
            if (r.visits[a] > 0 && u <= 0) {
                action = a;
                break;
            }
        }
    } else {
        for (let a = 1; a < 6; a++) if (r.visits[a] > r.visits[action]) action = a;
    }
    if (r.visits[action] === 0) action = r.visits.findIndex((v) => v > 0);
    return { action, value: r.value, sims: r.sims, ms: performance.now() - t0 };
};

let initPromise: Promise<void> | null = null;

self.onmessage = async (e: MessageEvent<WorkerIn>) => {
    const msg = e.data;
    try {
        if (msg.type === 'init') {
            initPromise ??= init();
            await initPromise;
            post({ type: 'ready' });
        } else if (msg.type === 'think') {
            await initPromise;
            const r = await think(msg.board, msg.player, msg.level);
            post({ type: 'move', id: msg.id, ...r });
        }
    } catch (err) {
        post({ type: 'error', message: err instanceof Error ? err.message : String(err) });
    }
};
