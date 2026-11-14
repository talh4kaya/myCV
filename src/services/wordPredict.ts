/* Chatbot giriş kutusu için cümle tamamlama.
   Tamamen tarayıcıda çalışır: sunucuya ya da dil modeline istek gitmez,
   ziyaretçinin yazdığı hiçbir yere gönderilmez.

   İki kademeli:
   1) Yazılan metin, sık sorulan sorulardan birinin başıysa sorunun geri
      kalanının tamamı önerilir (en isabetli tahmin).
   2) Değilse, aynı sorulardan çıkarılan kelime ikililerine (bigram) bakılır:
      yarım kelime tamamlanır, ardından her adımda en sık gelen kelime
      eklenerek birkaç kelimelik bir devam kurulur. */

const CHAIN_WORDS = 6; // ikili zincirinde en fazla eklenecek kelime

const QUESTIONS = [
    'Talha şu anda nerede çalışıyor?',
    'Talha hangi projelerde çalıştı?',
    'Talha hangi yarışmalara katıldı?',
    'Talha hangi teknolojileri kullanıyor?',
    'Talha hangi programlama dillerini biliyor?',
    'Talha hangi üniversitede okuyor?',
    'Talha ne zaman mezun olacak?',
    'Talha İngilizce biliyor mu?',
    'Talha staj arıyor mu?',
    'Talha ile nasıl iletişime geçebilirim?',
    "Talha'nın staj deneyimleri neler?",
    "Talha'nın en iyi projesi hangisi?",
    "Talha'nın GitHub hesabı var mı?",
    "Talha'yı neden işe almalıyım?",
    "İhlas Holding'de ne yapıyor?",
    'Kurumsal Data Lakehouse projesini anlatır mısın?',
    'Kurumsal AI Agent Platformu nedir?',
    'Çok dilli OCR projesini anlatır mısın?',
    'TEKNOFEST projesini anlatır mısın?',
    'Data League yarışmasında ne yaptı?',
    'Mangala AI projesi nedir?',
    'DPolitic projesi nedir?',
    'RAG konusunda deneyimi var mı?',
    'LLM ve VLM ile neler yaptı?',
    'Makine öğrenmesi projeleri neler?',
    'Bilgisayarlı görü projeleri neler?',
    'Blogda hangi makaleleri inceledi?',
    'Generative Agents makalesi hakkında ne düşünüyor?',
    'Sen kimsin?',
    'Makapaka nedir?',
];

const lower = (s: string) => s.toLocaleLowerCase('tr');
const words = (s: string) => s.split(/\s+/).filter(Boolean);
// soru işareti, virgül gibi işaretleri kelimeden ayır (tahminde kelime olarak kalsın)
const bare = (w: string) => w.replace(/[?!.,;:]+$/, '');

// kelime sıklıkları ve "bu kelimeden sonra ne geldi" tablosu (bir kez hesaplanır)
const freq = new Map<string, { word: string; n: number }>();
const next = new Map<string, Map<string, { word: string; n: number }>>();
const enders = new Set<string>(); // soruyu bitiren kelimeler ("neler?" gibi)

for (const q of QUESTIONS) {
    const raw = words(q);
    enders.add(lower(bare(raw[raw.length - 1])));
    const ws = raw.map(bare);
    ws.forEach((w, i) => {
        const key = lower(w);
        const f = freq.get(key);
        if (f) f.n++;
        else freq.set(key, { word: w, n: 1 });
        if (i > 0) {
            const prev = lower(ws[i - 1]);
            if (!next.has(prev)) next.set(prev, new Map());
            const m = next.get(prev)!;
            const e = m.get(key);
            if (e) e.n++;
            else m.set(key, { word: w, n: 1 });
        }
    });
}

const best = (entries: Iterable<{ word: string; n: number }>) => {
    let top: { word: string; n: number } | null = null;
    for (const e of entries) if (!top || e.n > top.n) top = e;
    return top?.word ?? '';
};

// son kelimeden başlayıp her adımda en sık gelen kelimeyi ekleyerek
// kısa bir devam kurar; aynı kelimeye dönerse (döngü) durur
const chain = (lastWord: string): string[] => {
    const out: string[] = [];
    const seen = new Set([lower(lastWord)]);
    let cur = lower(lastWord);
    while (out.length < CHAIN_WORDS) {
        const m = next.get(cur);
        if (!m) break;
        const w = best(m.values());
        const key = lower(w);
        if (!w || seen.has(key)) break;
        out.push(w);
        seen.add(key);
        cur = key;
    }
    // zincir bir sorunun son kelimesinde bittiyse soru işaretini de ekle
    if (out.length && enders.has(lower(out[out.length - 1]))) out[out.length - 1] += '?';
    return out;
};

/** Yazılan metne eklenecek öneri parçasını döndürür ('' = öneri yok):
 *  yarım kelimenin kalanı ve cümlenin devamı. */
export const predictNext = (text: string): string => {
    if (!text.trim() || text.length > 120) return '';
    const typed = lower(text);
    const endsWithSpace = /\s$/.test(text);

    // 1) sık sorulan bir sorunun başı mı?
    const match = QUESTIONS.find((q) => {
        const lq = lower(q);
        return lq.startsWith(typed) && lq.length > typed.length;
    });
    if (match) return match.slice(text.length);

    // 2) kelime ikilileri
    const ws = words(text);
    if (endsWithSpace) {
        return chain(bare(ws[ws.length - 1] ?? '')).join(' ');
    }

    const partial = ws[ws.length - 1] ?? '';
    if (partial.length < 2) return '';
    const lp = lower(partial);
    const prev = ws.length > 1 ? lower(bare(ws[ws.length - 2])) : '';
    // önce önceki kelimeden sonra gelenler arasında ara, yoksa tüm kelimelerde
    const pool = [...(next.get(prev)?.values() ?? [])].filter((e) => lower(e.word).startsWith(lp) && e.word.length > partial.length);
    const word = best(pool) || best([...freq.values()].filter((e) => lower(e.word).startsWith(lp) && e.word.length > partial.length));
    if (!word) return '';
    const rest = chain(word);
    return word.slice(partial.length) + (rest.length ? ' ' + rest.join(' ') : '');
};
