/* AlphaZero tarzı Monte Carlo ağaç araması (core.py'deki aramanın tarayıcı karşılığı).
   W, düğüme gelen hamleyi yapan oyuncunun (ebeveynde sıradaki oyuncu) gözünden
   toplam değerdir. Mangala'da aynı oyuncu üst üste oynayabildiği için işaret,
   iki oyuncuya bakılarak çevrilir; sıra her hamlede değişiyor varsayılmaz.
   Tarayıcıda her ağ çağrısının sabit bir maliyeti olduğu için yapraklar
   "sanal kayıp" ile küçük gruplar halinde seçilip birlikte değerlendirilir. */
import { type Board, type Endgame, type Player, DRAW, NO_WINNER, endgameLookup, step, validMoves, canonical } from './engine.ts';

type Node = {
    board: Board;
    player: Player;
    done: boolean;
    winner: number;
    N: number;
    W: number;
    P: number;
    children: (Node | null)[];
    expanded: boolean;
    parent: Node | null;
};

export type Evaluator = (states: Board[]) => Promise<{ policy: Float32Array[]; value: number[] }>;

export type SearchOptions = {
    sims: number;
    /* süre sınırı (ms); dolunca en az minSims yapılmışsa arama biter */
    timeMs?: number;
    minSims?: number;
    batch?: number;
    cPuct?: number;
    db?: Endgame | null;
};

export type SearchResult = {
    visits: number[];
    /* her hamlenin kök oyuncusu gözünden ortalama değeri (-1..1), ziyaret yoksa NaN */
    q: number[];
    /* kök oyuncusunun kazanma beklentisi (-1..1) */
    value: number;
    sims: number;
};

const C_PUCT = 1.5;
const FPU = 0.25;

const makeNode = (board: Board, player: Player, parent: Node | null, P: number): Node => ({
    board,
    player,
    done: false,
    winner: NO_WINNER,
    N: 0,
    W: 0,
    P,
    children: [null, null, null, null, null, null],
    expanded: false,
    parent,
});

const select = (root: Node, cPuct: number): Node => {
    let n = root;
    while (n.expanded && !n.done) {
        const sqrtN = Math.sqrt(Math.max(n.N, 1));
        // ziyaret edilmemiş çocuklar ebeveynin ortalamasından biraz düşük başlar
        let parentQ = 0;
        if (n.N > 0 && n.parent) {
            parentQ = n.W / n.N;
            if (n.parent.player !== n.player) parentQ = -parentQ;
        }
        let best = -Infinity;
        let bestC: Node | null = null;
        for (const c of n.children) {
            if (!c) continue;
            const q = c.N > 0 ? c.W / c.N : parentQ - FPU;
            const u = q + (cPuct * c.P * sqrtN) / (1 + c.N);
            if (u > best) {
                best = u;
                bestC = c;
            }
        }
        if (!bestC) break;
        n = bestC;
    }
    return n;
};

const backup = (leaf: Node, refPlayer: Player, value: number) => {
    let n: Node | null = leaf;
    while (n) {
        n.N += 1;
        if (n.parent) n.W += n.parent.player === refPlayer ? value : -value;
        n = n.parent;
    }
};

/* sanal kayıp: seçilen yolu geçici olarak "kötü" gösterir ki aynı grupta
   başka yapraklar seçilsin; değerlendirmeden sonra geri alınır */
const virtualLoss = (leaf: Node, sign: 1 | -1) => {
    let n: Node | null = leaf;
    while (n) {
        n.N += sign;
        if (n.parent) n.W -= sign;
        n = n.parent;
    }
};

const terminalValue = (n: Node): number => (n.winner === DRAW ? 0 : n.winner === 0 ? 1 : -1);

const expand = (n: Node, policy: Float32Array, db: Endgame | null) => {
    const moves = validMoves(n.board, n.player);
    let total = 0;
    for (const a of moves) total += policy[a];
    for (const a of moves) {
        const r = step(n.board, n.player, a);
        const child = makeNode(r.board, r.next, n, total > 0 ? policy[a] / total : 1 / moves.length);
        if (r.done) {
            child.done = true;
            child.winner = r.winner;
        } else {
            // oyun sonu veritabanındaysa kesin sonuç: düğüm "bitmiş" sayılır
            const w = endgameLookup(r.board, r.next, db);
            if (w !== NO_WINNER) {
                child.done = true;
                child.winner = w;
            }
        }
        n.children[a] = child;
    }
    n.expanded = true;
};

export const search = async (
    board: Board,
    player: Player,
    evaluate: Evaluator,
    opts: SearchOptions,
): Promise<SearchResult> => {
    const cPuct = opts.cPuct ?? C_PUCT;
    const batch = Math.max(1, opts.batch ?? 8);
    const db = opts.db ?? null;
    const minSims = opts.minSims ?? 0;
    const t0 = performance.now();
    const root = makeNode(board, player, null, 1);

    let sims = 0;
    while (sims < opts.sims) {
        if (opts.timeMs !== undefined && sims >= minSims && performance.now() - t0 > opts.timeMs) break;

        // ilk turda kökün kendisi değerlendirilir; sonra gruplar halinde yapraklar
        const want = root.expanded ? Math.min(batch, opts.sims - sims) : 1;
        const leaves: Node[] = [];
        for (let tries = 0; leaves.length < want && tries < want * 2; tries++) {
            const leaf = select(root, cPuct);
            if (leaf.done) {
                // bitmiş oyun: değer kesin, ağa sormaya gerek yok
                backup(leaf, 0, terminalValue(leaf));
                sims++;
                continue;
            }
            if (leaves.includes(leaf)) continue;
            virtualLoss(leaf, 1);
            leaves.push(leaf);
        }
        if (leaves.length === 0) continue;

        const out = await evaluate(leaves.map((l) => canonical(l.board, l.player)));
        leaves.forEach((leaf, i) => {
            virtualLoss(leaf, -1);
            expand(leaf, out.policy[i], db);
            backup(leaf, leaf.player, out.value[i]);
        });
        sims += leaves.length;
    }

    const visits = root.children.map((c) => (c ? c.N : 0));
    const q = root.children.map((c) => {
        if (!c || c.N === 0) return NaN;
        // çocuğun W'si kökte hamleyi yapanın (kök oyuncusunun) gözünden
        return c.W / c.N;
    });
    let bestA = -1;
    for (let a = 0; a < 6; a++) if (bestA < 0 || visits[a] > visits[bestA]) bestA = a;
    return { visits, q, value: Number.isNaN(q[bestA]) ? 0 : q[bestA], sims };
};
