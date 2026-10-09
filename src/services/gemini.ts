// Gemini artık doğrudan tarayıcıdan çağrılmıyor: API anahtarı ve sistem
// talimatı sunucuda (netlify/functions/chat.mts) duruyor. Burası sadece
// o fonksiyona istek atıp cevabı parça parça okuyor.
const CHAT_ENDPOINT = "/.netlify/functions/chat";
const FIRST_CHUNK_TIMEOUT_MS = 20_000;

const NETWORK_ERROR_MSG =
  "Şu anda asistana ulaşamıyorum — bağlantın yavaş olabilir veya kullandığın ağ bu servise izin vermiyor olabilir. Sorularını doğrudan Talha'ya iletmek için sayfanın altındaki iletişim formunu ya da talh4kaya@gmail.com adresini kullanabilirsin.";
const GENERIC_ERROR_MSG =
  "Asistan şu anda yanıt veremiyor. Birazdan tekrar dene veya sayfanın altındaki iletişim bölümünden Talha'ya direkt yazabilirsin.";
const RATE_LIMIT_MSG =
  "Biraz hızlı gidiyoruz :) Bir dakika bekleyip tekrar sorabilirsin.";
const BLOCKED_MSG = "Bu tür mesajlara yanıt veremiyorum.";

// Streaming version — chunk'ları onChunk callback'i ile döker
export const getGeminiResponseStream = async (
  userMessage: string,
  onChunk: (chunk: string) => void,
): Promise<void> => {
  // İlk chunk için timeout — stream başladıktan sonra zaten hızlı gelir
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
      onChunk(RATE_LIMIT_MSG);
      return;
    }
    if (res.status === 400) {
      onChunk(BLOCKED_MSG);
      return;
    }
    if (!res.ok || !res.body) {
      onChunk(GENERIC_ERROR_MSG);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let received = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      if (text) {
        if (!received) {
          received = true;
          clearTimeout(timer);
        }
        onChunk(text);
      }
    }

    if (!received) onChunk(GENERIC_ERROR_MSG);
  } catch {
    onChunk(NETWORK_ERROR_MSG);
  } finally {
    clearTimeout(timer);
  }
};
