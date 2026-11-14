import { useEffect, useRef, type RefObject } from 'react';

/* Ana sayfa girişinde imlecin arkasından dökülen ince toz efekti.
   Performans için:
   - tek canvas, sabit boyutlu parçacık havuzu (typed array, çöp toplama yok)
   - döngü yalnızca ekranda parçacık varken döner, boşta hiç çalışmaz
   - giriş bölümü görünmüyorsa, sekme arka plandaysa ya da cihaz dokunmatikse
     / hareket azaltma açıksa hiç başlamaz */

const MAX = 900;           // aynı anda en fazla parçacık
const SPAWN_STEP = 2;      // imleç bu kadar piksel ilerledikçe bir parçacık
const MAX_PER_MOVE = 14;   // tek fare olayında en fazla parçacık
const DPR_CAP = 1.5;       // çok yüksek çözünürlükte gereksiz piksel çizmesin

type Props = { targetRef: RefObject<HTMLElement | null> };

const CursorTrail = ({ targetRef }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const target = targetRef.current;
        if (!canvas || !target) return;

        const media = window.matchMedia('(pointer: fine) and (min-width: 900px) and (prefers-reduced-motion: no-preference)');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // parçacık durumu: konum, hız, kalan ömür, toplam ömür, boyut
        const x = new Float32Array(MAX);
        const y = new Float32Array(MAX);
        const vx = new Float32Array(MAX);
        const vy = new Float32Array(MAX);
        const life = new Float32Array(MAX);
        const maxLife = new Float32Array(MAX);
        const size = new Float32Array(MAX);
        let count = 0;

        let width = 0;
        let height = 0;
        let dpr = 1;
        let color = '#f7f7f8';
        let raf = 0;
        let last = 0;
        let lastX = -1;
        let lastY = -1;
        let visible = true;

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const readColor = () => {
            color = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || color;
        };

        const spawn = (px: number, py: number, mvx: number, mvy: number) => {
            if (count >= MAX) return;
            const i = count++;
            x[i] = px + (Math.random() - 0.5) * 14;
            y[i] = py + (Math.random() - 0.5) * 14;
            // imlecin yönünden biraz alır, etrafa saçılır, sonra yavaşça aşağı süzülür
            vx[i] = mvx * 0.03 + (Math.random() - 0.5) * 0.9;
            vy[i] = mvy * 0.03 + (Math.random() - 0.3) * 0.7;
            maxLife[i] = life[i] = 0.9 + Math.random() * 1.2; // saniye
            size[i] = 0.6 + Math.random() * 1.5;
        };

        const frame = (now: number) => {
            const dt = Math.min((now - last) / 16.667, 3); // 60 fps'e göre adım
            last = now;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = color;

            let i = 0;
            while (i < count) {
                life[i] -= dt / 60;
                if (life[i] <= 0) {
                    // ölen parçacığın yerine sondakini koy (sıra önemli değil)
                    count--;
                    x[i] = x[count]; y[i] = y[count];
                    vx[i] = vx[count]; vy[i] = vy[count];
                    life[i] = life[count]; maxLife[i] = maxLife[count]; size[i] = size[count];
                    continue;
                }
                vy[i] += 0.022 * dt;           // yerçekimi
                vx[i] *= 1 - 0.02 * dt;        // hava sürtünmesi
                x[i] += vx[i] * dt;
                y[i] += vy[i] * dt;
                ctx.globalAlpha = (life[i] / maxLife[i]) * 0.85;
                ctx.fillRect(x[i], y[i], size[i], size[i]);
                i++;
            }
            ctx.globalAlpha = 1;

            raf = count > 0 ? requestAnimationFrame(frame) : 0;
        };

        const start = () => {
            if (raf) return;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        };

        const onMove = (e: PointerEvent) => {
            if (!visible || e.pointerType !== 'mouse') return;
            const r = target.getBoundingClientRect();
            const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
            if (!inside) { lastX = -1; return; }

            if (lastX < 0) { lastX = e.clientX; lastY = e.clientY; return; }
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const dist = Math.hypot(dx, dy);
            const n = Math.min(Math.floor(dist / SPAWN_STEP), MAX_PER_MOVE);
            if (n === 0) return;
            // hızlı hareketlerde boşluk kalmasın diye yol boyunca dağıt
            for (let k = 1; k <= n; k++) {
                const t = k / n;
                spawn(lastX + dx * t, lastY + dy * t, dx, dy);
            }
            lastX = e.clientX;
            lastY = e.clientY;
            start();
        };

        const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
        const themeObserver = new MutationObserver(readColor);

        let active = false;
        const enable = () => {
            if (active) return;
            active = true;
            readColor();
            resize();
            window.addEventListener('pointermove', onMove, { passive: true });
            window.addEventListener('resize', resize);
            io.observe(target);
            themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        };
        const disable = () => {
            if (!active) return;
            active = false;
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('resize', resize);
            io.disconnect();
            themeObserver.disconnect();
            if (raf) cancelAnimationFrame(raf);
            raf = 0;
            count = 0;
            ctx.clearRect(0, 0, width, height);
        };

        const sync = () => (media.matches ? enable() : disable());
        sync();
        media.addEventListener('change', sync);

        return () => {
            media.removeEventListener('change', sync);
            disable();
        };
    }, [targetRef]);

    return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />;
};

export default CursorTrail;
