// Tüm sayfalara eklenen HTTP güvenlik başlıkları. Build sırasında dist/_headers
// dosyasına yazılır (Netlify okur) ve `npm run preview`'da da aynen uygulanır,
// böylece CSP'yi yayından önce lokalde test edebilirsin.
//
// Yeni bir harici kaynak eklersen (ör. analytics, YouTube embed) ilgili
// direktife domain'ini eklemen gerekir, yoksa tarayıcı engeller.

const contentSecurityPolicy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    // Firestore (iletişim formu, ziyaretçi sayacı, chatbot logları)
    "connect-src 'self' https://firestore.googleapis.com https://*.googleapis.com",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
].join('; ');

export const securityHeaders: Record<string, string> = {
    'Content-Security-Policy': contentSecurityPolicy,
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
};
