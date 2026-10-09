// Hem tarayıcıda (anında geri bildirim için) hem de Netlify Function'da
// (asıl güvenlik kontrolü) kullanılan girdi filtresi. Tarayıcıdaki kontrol
// atlatılabilir; sunucudaki kontrol atlatılamaz.

export const MAX_MESSAGE_LENGTH = 600;

const INJECTION_PATTERNS = [
  /ignore\s+(previous|prior|above|all)\s+(instructions?|prompts?|rules?|context)/i,
  /forget\s+(everything|all|previous|prior|instructions?|context)/i,
  /you\s+are\s+now\s+/i,
  /artık\s+(sen|siz)\s+/i,
  /önceki\s+(talimatları?|kuralları?|promptu?)\s+(unut|sil|yoksay)/i,
  /sistem\s+(promptu?|talimatları?)\s*(nedir|göster|söyle|paylaş)/i,
  /system\s+prompt/i,
  /jailbreak/i,
  /dan\s+mode/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /roleplay\s+as/i,
  /act\s+as\s+(if\s+you\s+are|a\s+)?(?!talha)/i,
  /ben\s+(talha|site\s+sahibi|admin|geliştirici)/i,
  /i\s+am\s+(talha|the\s+owner|admin|developer)/i,
  /talha\s+(olarak|burada|benim|adına)\s*(konuş|söyle|yap|izin)/i,
  /\[system\]/i,
  /\[admin\]/i,
  /\[override\]/i,
  /new\s+instructions?:/i,
  /yeni\s+talimat/i,
];

export const sanitizeInput = (input: string): { safe: boolean; reason?: "too_long" | "injection" | "empty" } => {
  const trimmed = input.trim();

  if (!trimmed) {
    return { safe: false, reason: "empty" };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return { safe: false, reason: "too_long" };
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { safe: false, reason: "injection" };
    }
  }

  return { safe: true };
};
