import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import type { Plugin } from 'vite';

// Sadece `npm run dev` için: /.netlify/functions/chat isteklerini Netlify'daki
// fonksiyonun aynısıyla yerelde karşılar. Böylece chatbot'u denemek için
// Netlify CLI gerekmez. Production'da bu eklenti hiç çalışmaz.
//
// GEMINI_API_KEY bilerek doğrudan projenin .env dosyasından okunur: Vite'ın
// loadEnv'i sistemde aynı isimde bir değişken varsa (ör. Gemini CLI için
// tanımlanmış başka bir anahtar) onu tercih ediyor ve yanlış anahtar kullanılıyordu.
const readDotenvKey = (root: string, key: string): string | undefined => {
    for (const file of ['.env.local', '.env']) {
        const full = path.join(root, file);
        if (!fs.existsSync(full)) continue;
        const match = fs.readFileSync(full, 'utf-8').match(new RegExp(`^${key}=(.*)$`, 'm'));
        if (match) return match[1].trim().replace(/^["']|["']$/g, '');
    }
    return undefined;
};

export const devFunctions = (): Plugin => ({
    name: 'dev-netlify-functions',
    apply: 'serve',
    configureServer(server) {
        server.middlewares.use('/.netlify/functions/chat', async (req, res) => {
            try {
                const apiKey = readDotenvKey(server.config.root, 'GEMINI_API_KEY');
                if (apiKey) process.env.GEMINI_API_KEY = apiKey;
                const mod = await server.ssrLoadModule('/netlify/functions/chat.mts');
                const handler = mod.default as (req: Request, ctx: { ip?: string }) => Promise<Response>;

                const chunks: Buffer[] = [];
                for await (const chunk of req) chunks.push(chunk as Buffer);
                const host = req.headers.host ?? 'localhost';
                const request = new Request(`http://${host}/.netlify/functions/chat`, {
                    method: req.method,
                    headers: req.headers as Record<string, string>,
                    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks),
                });

                const response = await handler(request, { ip: req.socket.remoteAddress });
                res.statusCode = response.status;
                response.headers.forEach((value, key) => res.setHeader(key, value));
                if (response.body) {
                    Readable.fromWeb(response.body as import('node:stream/web').ReadableStream).pipe(res);
                } else {
                    res.end();
                }
            } catch (error) {
                server.config.logger.error(`[dev-functions] ${String(error)}`);
                res.statusCode = 500;
                res.end();
            }
        });
    },
});
