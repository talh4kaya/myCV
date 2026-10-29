// Gemini artık doğrudan tarayıcıdan çağrılmıyor: API anahtarı ve sistem
// talimatı sunucuda (netlify/functions/chat.mts) duruyor. Burası sadece
// o fonksiyona istek atıp cevabı parça parça okuyor.
//
// Fonksiyon NDJSON döner: her satır ya bir düşünme adımı
// ({"t":"step","text":...,"out":bool}) ya da bir cevap parçası ({"t":"text","v":...}).
const CHAT_ENDPOINT = "/.netlify/functions/chat";
const FIRST_CHUNK_TIMEOUT_MS = 20_000;

const NETWORK_ERROR_MSG =
  "Şu anda asistana ulaşamıyorum — bağlantın yavaş olabilir veya kullandığın ağ bu servise izin vermiyor olabilir. Sorularını doğrudan Talha'ya iletmek için sayfanın altındaki iletişim formunu ya da talh4kaya@gmail.com adresini kullanabilirsin.";
const GENERIC_ERROR_MSG =
  "Asistan şu anda yanıt veremiyor. Birazdan tekrar dene veya sayfanın altındaki iletişim bölümünden Talha'ya direkt yazabilirsin.";
const RATE_LIMIT_MSG =
  "Biraz hızlı gidiyoruz :) Bir dakika bekleyip tekrar sorabilirsin.";
const BLOCKED_MSG = "Bu tür mesajlara yanıt veremiyorum.";

export type StreamHandlers = {
  onStep: (text: string, ruledOut: boolean) => void;
  onText: (chunk: string) => void;
};

type ServerEvent = { t: "step"; text: string; out: boolean } | { t: "text"; v: string };

const parseLine = (line: string): ServerEvent | null => {
  try {
    const event = JSON.parse(line) as ServerEvent;
    if (event.t === "step" && typeof event.text === "string") return event;
    if (event.t === "text" && typeof event.v === "string") return event;
  } catch {
    // bozuk satırı atla
  }
  return null;
};

export const getGeminiResponseStream = async (
  userMessage: string,
  { onStep, onText }: StreamHandlers,
): Promise<void> => {
  // İlk olay için timeout — stream başladıktan sonra zaten hızlı gelir
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FIRST_CHUNK_TIMEOUT_MS);

  try {
    const res = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
      signal: controller.signal,
    });

    if (res.status === 429) {
      onText(RATE_LIMIT_MSG);
      return;
    }
    if (res.status === 400) {
      onText(BLOCKED_MSG);
      return;
    }
    if (!res.ok || !res.body) {
      onText(GENERIC_ERROR_MSG);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let receivedText = false;

    const handle = (line: string) => {
      const event = line.trim() ? parseLine(line) : null;
      if (!event) return;
      clearTimeout(timer);
      if (event.t === "step") {
        onStep(event.text, Boolean(event.out));
      } else if (event.v) {
        receivedText = true;
        onText(event.v);
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newline: number;
      while ((newline = buffer.indexOf("\n")) !== -1) {
        handle(buffer.slice(0, newline));
        buffer = buffer.slice(newline + 1);
      }
    }
    handle(buffer);

    if (!receivedText) onText(GENERIC_ERROR_MSG);
  } catch {
    onText(NETWORK_ERROR_MSG);
  } finally {
    clearTimeout(timer);
  }
};
