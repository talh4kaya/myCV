import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../lib/chatPrompt";
import { ThinkingParser, type ChatEvent } from "../lib/thinkingParser";
import { sanitizeInput } from "../../src/services/chatGuard";

// Gemini anahtarı SADECE burada, sunucu tarafında okunur.
// Netlify > Site configuration > Environment variables altında GEMINI_API_KEY
// olarak tanımlanmalı (VITE_ öneki OLMADAN — VITE_ önekli değişkenler
// tarayıcı bundle'ına gömülür ve herkes tarafından okunabilir).
const API_KEY = process.env.GEMINI_API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Önce sabit model denenir (davranışı öngörülebilir); kullanımdan kalkar veya
// hata verirse Google'ın her zaman güncel Flash modelini gösteren takma ada
// düşülür — böylece model emekliye ayrıldığında chatbot susmaz.
// İstenirse Netlify'da GEMINI_MODEL ortam değişkeniyle ana model değiştirilebilir.
const MODELS = [process.env.GEMINI_MODEL || "gemini-2.5-flash", "gemini-flash-latest"];

const startStream = async (message: string) => {
  let lastError: unknown;
  for (const model of MODELS) {
    try {
      return await ai!.models.generateContentStream({
        model,
        contents: [{ role: "user", parts: [{ text: message }] }],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          maxOutputTokens: 1200,
          // 2.5 modellerinde "düşünme"yi kapatmak cevabı hızlandırır;
          // yeni modeller bu ayarı farklı yönetiyor, onlara gönderilmez.
          ...(model.startsWith("gemini-2.5") ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
        },
      });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

const MAX_BODY_BYTES = 4_000;

// Basit, en iyi çaba (best-effort) IP bazlı hız sınırı. Fonksiyon örneği
// sıcak kaldığı sürece geçerlidir; asıl maliyet tavanı için Google Cloud
// Console'da anahtara günlük kota da konulmalı.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > RATE_LIMIT;
};

// "null" veya bozuk bir Origin başlığı URL ayrıştırmasını patlatmasın
const isSameOrigin = (req: Request): boolean => {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
};

const json = (status: number, body: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export default async (req: Request, context: { ip?: string }) => {
  if (req.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  // Sadece kendi sitemizden gelen tarayıcı isteklerini kabul et
  // (başka sitelerin bu uç noktayı kendi sayfalarında kullanmasını engeller).
  if (!isSameOrigin(req)) {
    return json(403, { error: "forbidden" });
  }

  const ip = context.ip ?? req.headers.get("x-nf-client-connection-ip") ?? "unknown";
  if (isRateLimited(ip)) {
    return json(429, { error: "rate_limited" });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json(413, { error: "too_large" });
  }

  let message: unknown;
  try {
    message = (JSON.parse(raw) as { message?: unknown }).message;
  } catch {
    return json(400, { error: "bad_request" });
  }
  if (typeof message !== "string") {
    return json(400, { error: "bad_request" });
  }

  const check = sanitizeInput(message);
  if (!check.safe) {
    return json(400, { error: check.reason ?? "bad_request" });
  }

  if (!ai) {
    return json(503, { error: "not_configured" });
  }

  try {
    const result = await startStream(message.trim());

    // Yanıt NDJSON: her satır bir olay — {"t":"step",...} düşünme adımı,
    // {"t":"text",...} cevap parçası. İstemci adımları zaman çizelgesinde gösterir.
    const encoder = new TextEncoder();
    const parser = new ThinkingParser();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (events: ChatEvent[]) => {
          for (const event of events) controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        };
        try {
          for await (const chunk of result) {
            if (chunk.text) send(parser.push(chunk.text));
          }
        } catch {
          // stream ortasında koparsa elimizdekiyle bitir
        } finally {
          send(parser.flush());
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    // Hata ayrıntısını (anahtar, kota bilgisi vb.) istemciye sızdırma
    return json(502, { error: "upstream_error" });
  }
};
