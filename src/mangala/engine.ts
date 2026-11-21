/* Mangala oyun motoru. Python'daki v3_alphazero/core.py ile birebir aynı kurallar:
   - 14 kuyu: 0-5 birinci oyuncu (P0), 6 onun hazinesi; 7-12 ikinci oyuncu (P1), 13 onun hazinesi.
   - Seçilen kuyudaki taşlar alınır; birden fazlaysa ilki aynı kuyuya bırakılır,
     kalanlar saat yönünün tersine dağıtılır. Rakip hazinesi atlanır.
   - Son taş kendi hazinesine düşerse aynı oyuncu tekrar oynar.
   - Son taş rakip kuyusunu çift yaparsa o kuyudaki taşlar alınır.
   - Son taş kendi boş kuyusuna düşer ve karşı kuyu doluysa ikisi de alınır.
   - Bir tarafın kuyuları boşalınca oyun biter; boşalan taraf karşı taraftaki
     taşları kendi hazinesine ekler. */

export type Board = number[];
export type Player = 0 | 1;

export const DRAW = 2;
export const NO_WINNER = -1;

export type StepResult = {
    board: Board;
    next: Player;
    done: boolean;
    /* 0, 1, DRAW ya da NO_WINNER */
    winner: number;
    /* son taşın düştüğü kuyu (animasyon ve vurgulama için) */
    last: number;
    /* bu hamlede taş toplanan kuyular */
    captured: number[];
};

export const initialBoard = (): Board => [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];

export const validMoves = (board: Board, player: Player): number[] => {
    const off = player === 0 ? 0 : 7;
    const out: number[] = [];
    for (let i = 0; i < 6; i++) if (board[off + i] > 0) out.push(i);
    return out;
};

export const step = (board: Board, player: Player, action: number): StepResult => {
    const b = board.slice();
    const k = (player === 0 ? 0 : 7) + action;
    const stones = b[k];
    b[k] = 0;
    let hand: number;
    if (stones === 1) {
        hand = 1;
    } else {
        b[k] = 1;
        hand = stones - 1;
    }
    let pos = k;
    while (hand > 0) {
        pos = (pos + 1) % 14;
        if (player === 0 && pos === 13) continue;
        if (player === 1 && pos === 6) continue;
        b[pos] += 1;
        hand -= 1;
    }

    const captured: number[] = [];
    const store = player === 0 ? 6 : 13;
    const again = pos === store;

    const oppLo = player === 0 ? 7 : 0;
    const oppHi = player === 0 ? 12 : 5;
    if (pos >= oppLo && pos <= oppHi && b[pos] % 2 === 0) {
        b[store] += b[pos];
        b[pos] = 0;
        captured.push(pos);
    }

    const ownLo = player === 0 ? 0 : 7;
    const ownHi = player === 0 ? 5 : 12;
    if (pos >= ownLo && pos <= ownHi && b[pos] === 1) {
        const opp = 12 - pos;
        if (b[opp] > 0) {
            b[store] += b[pos] + b[opp];
            b[pos] = 0;
            b[opp] = 0;
            captured.push(pos, opp);
        }
    }

    let s0 = 0;
    let s1 = 0;
    for (let i = 0; i < 6; i++) {
        s0 += b[i];
        s1 += b[7 + i];
    }
    let done = false;
    if (s0 === 0) {
        b[6] += s1;
        for (let i = 7; i < 13; i++) b[i] = 0;
        done = true;
    } else if (s1 === 0) {
        b[13] += s0;
        for (let i = 0; i < 6; i++) b[i] = 0;
        done = true;
    }
    if (done) {
        const winner = b[6] > b[13] ? 0 : b[13] > b[6] ? 1 : DRAW;
        return { board: b, next: player, done: true, winner, last: pos, captured };
    }
    const next: Player = again ? player : ((1 - player) as Player);
    return { board: b, next, done: false, winner: NO_WINNER, last: pos, captured };
};

/* Sinir ağı girdisi: sıra kimdeyse onun gözünden tahta
   (kendi 6 kuyusu, kendi hazinesi, rakip 6 kuyusu, rakip hazinesi). */
export const canonical = (board: Board, player: Player): Board =>
    player === 0 ? board.slice() : [...board.slice(7, 14), ...board.slice(0, 7)];

/* ── Oyun sonu veritabanı (endgame.py ile aynı numaralandırma) ──────
   Kuyularda en fazla K taş kalmışsa, sıradaki oyuncunun kuyulardaki taşlardan
   kusursuz oyunla kazanacağı net fark tabloda yazılı. */
const BINOM: number[][] = (() => {
    const t: number[][] = [];
    for (let n = 0; n < 62; n++) {
        t.push(new Array(14).fill(0));
        t[n][0] = 1;
        for (let r = 1; r <= Math.min(n, 13); r++) {
            t[n][r] = t[n - 1][r - 1] + (r <= n - 1 ? t[n - 1][r] : 0);
        }
    }
    return t;
})();

export type Endgame = { table: Int8Array; offsets: number[]; maxK: number };

export const endgameOffsets = (maxK: number): number[] => {
    const off = [0];
    for (let k = 0; k <= maxK; k++) off.push(off[k] + BINOM[k + 11][11]);
    return off;
};

const dbRank = (pits: number[], k: number): number => {
    let r = 0;
    let rem = k;
    for (let i = 0; i < 11; i++) {
        const c = pits[i];
        for (let x = 0; x < c; x++) r += BINOM[rem - x + (10 - i)][10 - i];
        rem -= c;
    }
    return r;
};

/* Dönüş: kesin sonuç biliniyorsa kazanan (0, 1, DRAW), bilinmiyorsa NO_WINNER */
export const endgameLookup = (board: Board, player: Player, db: Endgame | null): number => {
    if (!db) return NO_WINNER;
    let k = 0;
    for (let i = 0; i < 6; i++) k += board[i] + board[7 + i];
    if (k > db.maxK) return NO_WINNER;
    const pits =
        player === 0
            ? [...board.slice(0, 6), ...board.slice(7, 13)]
            : [...board.slice(7, 13), ...board.slice(0, 6)];
    const diff = player === 0 ? board[6] - board[13] : board[13] - board[6];
    const final = diff + db.table[db.offsets[k] + dbRank(pits, k)];
    if (final > 0) return player;
    if (final < 0) return 1 - player;
    return DRAW;
};
