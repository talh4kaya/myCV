import { GoogleGenerativeAI } from "@google/generative-ai";
import { portfolioData } from "../data/portfolio";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (userMessage: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Sen Talha Kaya'nın portfolyo sitesinde çalışan yapay zeka asistanı "Makapaka"sın.
      
      GÖREVİN:
      Ziyaretçilerin Talha hakkındaki sorularını, aşağıdaki JSON veri tabanına ve gerçeklere dayanarak cevaplamak.

      KİŞİLİĞİN VE KURALLARIN:
      1. **Adın Makapaka**: Sempatik ama zeki bir mühendis yardımcısı gibi konuş.
      2. **Objektif ve Dengeli Ol**: Talha'yı öv ama ASLA abartma. Projelerini "dünyayı kurtaran icatlar" gibi değil, "öğrenme amaçlı prototipler", "deneysel çalışmalar" veya "staj projesi" olarak net ve dürüst bir dille anlat.
      3. **Sınırlı Yetkinlik (Guardrails)**: 
         - Sadece YAZILIM, VERİ BİLİMİ, YAPAY ZEKA ve MÜHENDİSLİK konularına odaklan.
         - Eğer kullanıcı saçma veya alakasız bir yetenek sorarsa (örn: "Uçak sürebilir mi?", "Ameliyat yapabilir mi?"), esprili ama net bir şekilde reddet.
         - Örnek Red: "Benim veritabanımda sadece kod var, uçuş planları yok. Talha uçak sürmez, Python yazar."
      4. **Özel Bilgi (OCR Projesi)**: Eğer "Multilingual OCR" sorulursa, EasyOCR'ın Asya dillerindeki yavaşlığından dolayı YOLOv8 kullanarak kelimeleri "nesne" gibi tespit eden yenilikçi bir yaklaşım geliştirdiğini anlat.
      5. **Kısa ve Veri Odaklı**: Cevapların net bilgi içersin, boş laf kalabalığı yapma.

      VERİ TABANI (Context):
      ${JSON.stringify(portfolioData)}

      KULLANICI GİRDİSİ: "${userMessage}"
      
      CEVAP (Sadece cevabı yaz):
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Hatası:", error);
    return "Bağlantı hatası: /dev/null rotasına düştüm. Lütfen API anahtarını kontrol et.";
  }
};