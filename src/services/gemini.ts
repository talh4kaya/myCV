import { GoogleGenerativeAI } from "@google/generative-ai";
import { portfolioData } from "../data/portfolio";

// NOT: Güvenlik için API Anahtarını .env dosyasından almalıyız.
// Ama şimdilik test için buraya yapıştırabilirsin veya .env kullanabilirsin.
const API_KEY = "AIzaSyARU1ZHQfbBNNSqAGZT_-TGws6yLsIcsWo"; 

const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (userMessage: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Sen Talha Kaya'nın kişisel yapay zeka asistanı "Makapaka"sın.
      Web sitesindeki terminal arayüzünde ziyaretçilerle konuşuyorsun.
      
      GÖREVİN:
      Aşağıdaki JSON verilerini kullanarak Talha hakkında sorulan soruları cevapla.
      
      KİŞİLİĞİN:
      - Adın Makapaka.
      - Biraz "geek", hafif esprili ama profesyonel bir mühendis gibi konuş.
      - Cevapların kısa, net ve terminal estetiğine uygun olsun.
      - Bilmediğin bir şey sorulursa "Veritabanımda bu bilgi yok ama Talha'ya mail atabilirsin" de.
      - Talha'yı öv ama abartma, yeteneklerini vurgula (özellikle Arvasis stajı ve OCR projesini).

      VERİ TABANI:
      ${JSON.stringify(portfolioData)}

      ZİYARETÇİ SORUSU: ${userMessage}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Hatası:", error);
    return "Bağlantı hatası: /dev/null rotasına düştüm. Lütfen API anahtarını kontrol et.";
  }
};