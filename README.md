# Talha Kaya — Kişisel Portföy

**🌐 [talhakaya.net](https://talhakaya.net)**

Data Scientist & Machine Learning Engineer olarak projelerimi, yarışma deneyimlerimi ve okuduğum makalelere dair notlarımı paylaştığım kişisel sitem. Hazır şablon veya UI kütüphanesi kullanmadan sıfırdan tasarlandı.

## Öne Çıkanlar

- **Makapaka — yapay zeka asistanı:** Ziyaretçilerin benim hakkımda soru sorabildiği, Gemini tabanlı bir sohbet botu. Yalnızca portföy verisine dayanarak cevap veriyor; cevaplar parça parça (streaming) akıyor.
- **Blog:** Okuduğum yapay zeka makalelerinin Türkçe incelemeleri. Paragraf ve listenin yanında formül, akış şeması, zaman çizelgesi, bellek diyagramı gibi 15'ten fazla özel içerik bloğu destekleyen bir içerik motoruyla yazılıyor.
- **Yarışmalar:** TEKNOFEST, Data League, GFAST, HSD Ideathon ve diğerlerinde ne yaptığımız, neden ve nasıl yaptığımız.
- **Açık / koyu tema** ve tüm sayfalarda mobil uyumlu tasarım.

## Teknolojiler

| Alan | Kullanılanlar |
| --- | --- |
| Arayüz | React 19, TypeScript, React Router, saf CSS |
| Build | Vite (Rolldown) |
| Yapay zeka | Google Gemini 2.5 Flash |
| Sunucu tarafı | Netlify Functions |
| Veri | Firebase Firestore (iletişim formu, ziyaretçi sayacı) |
| Yayın | Netlify |

## Mimari

```
Tarayıcı ──► Netlify CDN (statik sayfalar, güvenlik başlıkları)
   │
   ├──► /.netlify/functions/chat ──► Gemini API
   │      (sistem talimatı ve API anahtarı sunucuda tutulur;
   │       girdi doğrulama, origin kontrolü ve hız sınırı burada yapılır)
   │
   └──► Firestore (iletişim mesajları, sayaç — erişim firestore.rules ile sınırlı)
```

**Performans ve SEO**

- Build sırasında her rota (blog yazıları ve proje sayfaları dahil) kendi `title`, `description`, canonical, Open Graph ve JSON-LD etiketleriyle ayrı bir HTML dosyası olarak üretilir. Bu sayede arama motorları ve sosyal medya önizlemeleri JavaScript çalıştırmadan doğru içeriği görür.
- `sitemap.xml`, `robots.txt` ve gerçek 404 yanıtları otomatik oluşturulur.
- Firebase SDK yalnızca ihtiyaç duyulduğunda yüklenir; böylece ilk açılış hafif kalır.

**Güvenlik**

- Content Security Policy, HSTS, X-Frame-Options, Referrer-Policy ve Permissions-Policy başlıkları kullanılır.
- Gizli anahtarlar yalnızca sunucu tarafındaki ortam değişkenlerinde tutulur.
- Firestore kuralları ziyaretçilerin yalnızca doğrulanmış kayıt eklemesine izin verir; okuma, değiştirme ve silme kapalıdır.

## Proje Yapısı

```
├── build/                  # Vite eklentisi: sayfa üretimi, sitemap, güvenlik başlıkları
├── netlify/
│   ├── functions/chat.mts  # Gemini proxy fonksiyonu
│   └── lib/                # Asistanın sistem talimatı
├── public/                 # Görseller, ikonlar, CV
├── src/
│   ├── components/         # Arayüz bileşenleri
│   ├── data/               # Portföy verisi ve blog içerikleri
│   ├── pages/              # Sayfalar
│   ├── seo/                # Rota bazlı meta veriler
│   └── services/           # Firebase ve chatbot istemcisi
└── firestore.rules         # Firestore erişim kuralları
```

## Yerelde Çalıştırma

```bash
npm install
npm run dev
```

Proje kök dizinine bir `.env` dosyası ekleyin:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Yalnızca sunucu tarafı (VITE_ öneki olmadan)
GEMINI_API_KEY=
```

Chatbot bir Netlify Function kullandığı için yerelde denemek isterseniz siteyi Netlify CLI ile başlatın:

```bash
npx netlify-cli dev
```

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Tip kontrolü + production build (`dist/`) |
| `npm run preview` | Production build'i güvenlik başlıklarıyla yerelde önizleme |
| `npm run lint` | ESLint |

## İletişim

- 🌐 [talhakaya.net](https://talhakaya.net)
- 💼 [LinkedIn](https://www.linkedin.com/in/talha-kaya-aa5255340)
- 📊 [Kaggle](https://www.kaggle.com/talh4kaya)
- ✉️ talh4kaya@gmail.com
