export const portfolioData = {
  personal: {
    name: "Talha Kaya",
    title: "Data Scientist & Machine Learning Engineer",
    university: "Sakarya Üniversitesi – Bilgisayar Mühendisliği (2022 – 2027, devam ediyor)",
    location: "İstanbul, Ümraniye",
    website: "talhakaya.net",
    languages: [
      "Türkçe (Ana Dil)",
      "İngilizce (B2 – Hazırlık Eğitimi)"
    ],
    summary:
      "Problem çözme yeteneği yüksek, tasarım bakış açısına sahip ve iletişimi güçlü bir mühendis adayıyım. Araştırmayı seviyorum, bir şeyin neden ve nasıl çalıştığını merak ediyorum. Özellikle Python ve C++ ile çalışmayı seviyorum. Teorik bilgiyi gerçek dünya problemlerine (OCR, VLM, RAG, Nesne Tespiti, Reinforcement Learning) uyarlamaya odaklanıyorum; okuduğum makaleler üzerine düşüncelerimi yazıyorum."
  },

  skills: {
    languages: ["Python", "C++", "SQL", "TypeScript", "React", "Tailwind CSS"],
    libraries: [
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "OpenCV",
      "TensorFlow",
      "PyTorch",
      "LangChain"
    ],
    areas: [
      "Makine Öğrenmesi",
      "Görüntü İşleme (Computer Vision)",
      "Reinforcement Learning",
      "Nesne Tespiti",
      "Veri Analizi",
      "RAG (Retrieval-Augmented Generation)",
      "LLM ve VLM Entegrasyonu",
      "Multi-Agent Sistemler",
      "Prompt Engineering"
    ],
    tools: ["Git/GitHub", "Docker", "FastAPI", "Qdrant", "BGE-M3"]
  },

  experience: [
    {
      company: "Dijital Varlıklar A.Ş.",
      role: "Yazılım Mühendisi Stajyeri",
      year: "2026",
      tech: ["Python", "VLM", "OCR", "RAG", "BGE-M3", "Qdrant", "LangChain"],
      description:
        "Türkiye Gazetesi'nin dijital arşivi için VLM tabanlı OCR modelleriyle çalıştım; model testleriyle çıktı doğruluğu kontrollerini gerçekleştirdim. Kurumsal bir yazılım için native RAG yapısı kullanarak RAG tabanlı sistemler geliştirdim; PDF ve web verisini otomatik çıkarma, temizleme (boilerplate ve tekrar eden içerik ayıklama) ve anlamlı parçalara (chunk) bölme için Python tabanlı bir veri işleme pipeline'ı kurdum. BGE-M3 çok dilli embedding modeli ve Qdrant vektör veritabanıyla 400'den fazla doküman parçasını semantik aramaya hazır hale getirdim. Anlamsal benzerlik ve metin doğrulaması içeren iki katmanlı bir mükerrer (dedup) tespit algoritmasıyla veri kalitesini artırdım."
    },
    {
      company: "Arvasis Yazılım Danışmanlık",
      role: "Makine Öğrenmesi Stajyeri",
      year: "2025",
      tech: ["Python", "YOLOv11", "OpenCV", "CNN", "NLP"],
      description:
        "Görüntü işleme ve nesne tespiti alanlarında çalıştım. 65 farklı dil için kelime seviyesinde dil tespiti yapabilen bir model geliştirdim. Standart Tesseract'ın yetersiz kaldığı çok dilli belgelerde YOLOv11 ile metin tespiti uygulayarak doğruluk oranını %40'tan %85'in üzerine çıkardım. Gürültü temizleme, perspektif düzeltme ve data augmentation gibi görüntü ön işleme adımlarını uyguladım."
    }
  ],

  projects: [
    {
      id: "ai-portfolio",
      name: "AI Portföy Sitesi (Bu Site)",
      tech: ["React", "TypeScript", "Vite", "Firebase", "Gemini AI"],
      desc:
        "Makale blogları, proje kartları ve Gemini destekli kişisel chatbot içeren, tamamen sıfırdan tasarlanmış full-stack portföy sitesi. Yayına alındı.",
      details: {
        story:
          "Uzun zamandır aklımda bir portföy sitesi yapmak vardı ama şablon kullanmak istemedim her şeyi kendim tasarlamak istedim. Tasarım sisteminden renk paletine, blog altyapısından chatbot entegrasyonuna kadar her parçayı sıfırdan kurdum. Amacım sadece projelerimi sergilemek değil interaktif bir cv oluşturmak benim hakkımda soru  sorabildiğiniz bir chatbot yapmak, okuduğum makaleleri bloğa dönüştüreceğim, düşüncelerimi paylaşabileceğim bir platform oluşturmaktı.",
        technical: [
          {
            title: "Tasarım Sistemi",
            content:
              "Hiçbir UI kütüphanesi kullanmadım. Tüm componentler, renkler, tipografi ve animasyonlar tamamen sıfırdan CSS ile yazıldı. Koyu tema, özel değişkenler ve tutarlı bir görsel dil oluşturdum. Web developer olmadığım için bu süreçte Claude Code'dan çok fazla yardım aldım ve onu etkin şekilde kullandım; hatta Claude Code'u nasıl daha iyi kullanacağım konusunda da oldukça bilgi sahibi oldum."
          },
          {
            title: "Blog Altyapısı",
            content:
              "Statik veri dosyası üzerinde çalışan özel bir blog motoru kurdum. Paragraf, başlık, liste, alıntı, kod bloğu, params, membar, flow, treemap gibi 15'ten fazla blok tipi destekleniyor. Her blog için otomatik okuma süresi hesaplanıyor. Burayı da kullanıcı çok daha net bir şekilde blogdakileri anlayabilsin diye yaptım."
          },
          {
            title: "Gemini AI Chatbot",
            content:
              "Google Gemini API entegrasyonuyla, benim hakkımda soru-cevap yapabilen kişisel bir chatbot ekledim. Bu mimaride RAG kullandım. Chatbot portföy verisiyle besleniyor sadece gerçek bilgilerle cevap veriyor."
          },
          {
            title: "Firebase & Ziyaretçi Sayacı",
            content:
              "Firebase Firestore ile iletişim kısmı oluşturdum."
          },
          {
            title: "Responsive & Deploy",
            content:
              "Tüm sayfalar masaüstü ve mobil için ayrıca tasarlandı. Netlify üzerinden yayına alındı, custom domain bağlandı."
          }
        ]
      }
    },
    {
      id: "dsiyasi",
      name: "DPolitic (Multi-Agent Political Simulation)",
      tech: ["Python", "FastAPI", "Llama", "Multi-Agent", "Local"],
      desc:
        "6 farklı siyasi profil ve 20 farklı halk tipini simüle eden, tamamen yerel Llama ile çalışan çok ajanlı siyasi simülasyon motoru. Otonom mod ve kullanıcı katılımlı mod olmak üzere iki farklı oyun modu sunuyor.",
      details: {
        story:
          "Stanford'un 'Generative Agents' makalesini okuduğumda aklıma şu soru takıldı: aynı yapıyı siyasi arena üzerine kursam ne olur? Ama sığ bir 'ajanlar tartışıyor' deneyi yapmak istemedim — gerçek bir dinamik istiyordum. Siyasetçiler konuşuyor, halk tepki veriyor, siyasetçiler tekrar hamle yapıyor, halk yeniden değerlendiriyor. Tıpkı gerçek siyasi kampanyalar gibi. 20 farklı insan profili, 6 farklı siyasi kimlik, 20 tur süren bir simülasyon ve her turda değişen sempati dengesi. Maliyet sorununu Llama ile yerel çalışarak çözdüm — ama bu kadar çok sorgu attığı için testi bile başlı başına bir meydan okumaya dönüştü.",
        technical: [
          {
            title: "İki Farklı Oyun Modu",
            content:
              "Otonom Mod: Sistemin tamamı kendi kendine işliyor. Bot rastgele gerçekçi bir siyasi olay üretiyor, 6 siyasetçi o olaya açıklama yapıyor, 20 farklı halk tipi bu açıklamalara tepki veriyor, ardından siyasetçiler tekrar hamle yapıyor. Bu döngü 20 tur boyunca devam ediyor. Kullanıcı Katılımlı Mod: Kullanıcı sisteme bir seçmen olarak dahil oluyor; oyunu izlemek yerine fiilen içinde yer alıyor."
          },
          {
            title: "20 Tur Simülasyon Döngüsü",
            content:
              "Her tur şu sırayla işliyor: (1) Bot bir olay üretiyor, (2) 6 siyasetçi açıklama yapıyor, (3) 20 halk tipi bu açıklamalara tepki veriyor, (4) Siyasetçiler halkın tepkisini okuyup yeni bir hamle yapıyor, (5) Halk tekrar değerlendiriyor. Her turda her siyasetçinin sempati ve katkı puanları yeniden hesaplanıyor. 20. turun sonunda en yüksek puana sahip siyasetçi kazanıyor."
          },
          {
            title: "Kişilik Ağırlıkları (Persona Sistemi)",
            content:
              "CogniPair makalesindeki yaklaşıma benzer şekilde, hem 6 siyasi profilin hem de 20 halk tipinin kendi kişilik ağırlıkları var. Milliyetçi seçmen farklı tepki veriyor, ekonomi öncelikli seçmen farklı. Siyasetçilerin de her biri farklı retorik tarzına, ideolojik tutarlılık eşiğine ve hedef kitlesine sahip. Hiçbir tur aynı sonuçla bitmiyor."
          },
          {
            title: "Yerel Llama ile Maliyet Sıfır",
            content:
              "Bir simülasyon turu 26 ajanın (6 siyasetçi + 20 halk tipi) aktif sorgu attığı anlamına geliyor. 20 turda bu rakam 520'nin üzerine çıkıyor. OpenAI ile çalışsaydım her test astronomik bir maliyete dönerdi. Llama'yı yerelde çalıştırarak sınırsız deneme yapabildim."
          },
          {
            title: "Test Zorluğu",
            content:
              "Her tam simülasyon onlarca LLM çağrısı gerektirdiğinden standart birim testleri yetersiz kalıyor. Ajanların birbirini tutarsız yönlere çektiği, simülasyonun beklenmedik senaryolara sürüklendiği durumlar ortaya çıkıyor — bu hem bir hata hem de projenin en ilginç yanı."
          }
        ]
      }
    },
    {
      id: "mangala-ai",
      name: "Mangala AI (AlphaZero & Transformer)",
      tech: ["PyTorch", "AlphaZero", "Transformer", "Self-Play", "RL"],
      desc:
        "AlphaZero ve Transformer yapılarını anlamak için Mangala oyunu üzerinde uygulanmış bir pekiştirmeli öğrenme (RL) denemesi. Modern algoritmaların oyun teorisindeki etkilerini gözlemlemek amacıyla geliştirilmiş deneysel bir çalışma.",
      details: {
        story:
          "Çoğu kişi yapay zekaya giriş yaparken Tic-Tac-Toe veya basit satranç botları yazar. Ben ise Türk strateji oyunu Mangala'yı (Mancala) seçtim çünkü oyunun doğası, basit kurallarına rağmen inanılmaz bir kombinasyonel derinliğe sahip. İlk başta standart bir PPO (Proximal Policy Optimization) ajanı eğittim. Fena değildi ama 'insan gibi' sezgileri yoktu, sadece ezberliyordu. Sonra çıtayı yükselttim: DeepMind'ın AlphaZero algoritmasını sıfırdan yazabilir miyim? Buradaki en büyük teknik kumarım, literatürde genelde kullanılan ResNet (görüntü işleme) mimarisi yerine Transformer kullanmak oldu. Çünkü Mangala tahtası bir 'resim'den ziyade, birbirini etkileyen kuyuların (pits) sıralı bir dizisiydi. Transformer'ın 'Attention' mekanizması, bir kuyudaki taşların diğer kuyuları nasıl etkileyeceğini anlamak için mükemmeldi.",
        technical: [
          {
            title: "Beyin (Neural Network)",
            content:
              "Tahtadaki 14 kuyuyu bir dizi (sequence) olarak alan ve Self-Attention katmanlarından geçiren bir Transformer Encoder tasarladım. Bu yapı, oyunun durumunu sayısal vektörlere dönüştürerek taşların dağılımını analiz ediyor."
          },
          {
            title: "Karar Mekanizması (MCTS)",
            content:
              "Ajan sadece anlık duruma bakmıyor; Monte Carlo Tree Search ile gelecekteki binlerce olası hamleyi simüle ediyor. 'Eğer ben bunu oynarsam, o bunu oynar' ağacını gezerek en yüksek kazanma ihtimali olan yolu seçiyor."
          },
          {
            title: "Eğitim (Self-Play)",
            content:
              "Modelin öğreneceği bir veri seti yoktu. Onu kendisine karşı binlerce kez oynattım. Kazanan hamleleri ödüllendirdim, kaybedenleri cezalandırdım. Milyonlarca oyun sonunda kendi stratejilerini geliştirdi."
          },
          {
            title: "Sonuç",
            content:
              "Sıfırdan eğittiğim AlphaZero modeli, milyonlarca adım eğitilmiş PPO ajanını 32-16 yendi. MCTS + Transformer kombinasyonunun bu oyun için doğru tercih olduğunu görmek güzeldi."
          }
        ]
      }
    },
    {
      id: "repo-chat",
      name: "Repo-Chat (Privacy-First Local RAG)",
      tech: ["LangChain", "Ollama", "ChromaDB", "Llama-3", "React"],
      desc:
        "İnternet bağlantısı olmadan, yerel makinedeki GitHub repolarıyla konuşmayı sağlayan RAG (Retrieval-Augmented Generation) tabanlı bir asistan. Kod okuma süreçlerini hızlandırmak ve gizliliği korumak için tasarlandı.",
      details: {
        story:
          "Başka birisinin büyük bir reposuna girip 'authentication nerede yapılmış?' diye aramak gerçekten zaman alıyor. Kodu ChatGPT'ye yapıştırmak da bir noktaya kadar işe yarıyor — hem token limiti var hem de şirket kodunu dışarı atmak doğru değil. Bunun üzerine tamamen yerelde çalışan, repo klonlayıp onunla sohbet etmeyi sağlayan bir sistem yazdım.",
        technical: [
          {
            title: "Ingestion Pipeline",
            content:
              "Repo klonlandıktan sonra tüm kodu direkt LLM'e vermek mümkün değil. RecursiveCharacterTextSplitter ile kodu fonksiyon ve sınıf sınırlarını bozmadan parçalara böldüm."
          },
          {
            title: "Vektör Uzayı",
            content:
              "Parçaları embedding'e çevirip ChromaDB'de sakladım. 'Login nerede?' diye sorduğunda sistem kelime eşleştirme değil anlamsal arama yapıyor, ilgili kodu bulup getiriyor."
          },
          {
            title: "Local LLM",
            content:
              "Model olarak Ollama üzerinden Llama-3 kullandım. Veritabanından gelen ilgili kod parçaları bağlam olarak modele veriliyor, model de buna göre cevap üretiyor."
          },
          {
            title: "Gizlilik",
            content:
              "Her şey localhost'ta dönüyor. Kodlar dışarı çıkmıyor, internet bağlantısı gerekmiyor."
          }
        ]
      }
    },
    {
      id: "guardian-flow",
      name: "Guardian-Flow (MLOps & Drift)",
      tech: ["MLOps", "Docker", "Evidently AI", "FastAPI", "Grafana"],
      desc:
        "Yapay zeka modellerinin üretim ortamındaki (production) performansını ve veri kaymasını (data drift) canlı olarak izleyen modüler bir MLOps aracı. Sürdürülebilir AI sistemleri için bir prototip.",
      details: {
        story:
          "Okulda modeli eğitip Jupyter'da %99 alınca iş bitiyor. Ama production'da veri değişiyor, dağılım kayıyor, model sessizce bozuluyor — kimse fark etmiyor. Guardian-Flow'u tam bu problemi takip etmek için yaptım: modelin anlık performansını ve veri dağılımını sürekli izleyen, bir şeyler kaymaya başlayınca alarm veren bir sistem.",
        technical: [
          {
            title: "Data Drift (Veri Kayması)",
            content:
              "Evidently AI ile eğitim verisi ve canlı veriyi istatistiksel olarak karşılaştırıyorum (KL divergence vb.). Dağılım bozulmaya başladığında sistem uyarı üretiyor."
          },
          {
            title: "Mimari",
            content:
              "Model servisi FastAPI ile dışarı açık, monitoring servisi arka planda analiz yapıp sonuçları Grafana dashboard'una gönderiyor. Her parça bağımsız çalışıyor."
          },
          {
            title: "Containerization",
            content:
              "Tüm yapı Docker ile paketlenmiş, herhangi bir sunucuda tek komutla ayağa kalkıyor."
          },
          {
            title: "Kazanım",
            content:
              "Model eğitmekle iş bitmiyor — asıl iş oradan sonra başlıyor. Bu projeyle o tarafı biraz daha somut anladım."
          }
        ]
      }
    },
    {
      id: "multilingual-ocr",
      name: "Multilingual OCR Engine",
      tech: ["YOLOv11", "OpenCV", "CNN", "NLP", "Python"],
      desc:
        "Klasik OCR yöntemlerinin yetersiz kaldığı durumlarda devreye giren; 65 dildeki karmaşık belgeleri analiz edebilen hibrit bir görüntü işleme ve dil tespit sistemi. Arvasis staj projesi.",
      details: {
        story:
          "Stajdaki ilk görevim kağıt üzerinde basitti: 'Resimlerdeki yazıları oku.' Ama veri seti 65 farklı dilde, buruşuk kağıtlardan, kötü çekilmiş faturalardan ve el yazısı notlardan oluşuyordu. Tesseract'ı çalıştırınca özellikle Arapça ve Kiril'de işe yaramadığını gördüm. Tek bir modelle olmaz, önce dili anla sonra dile özel oku mantığıyla ilerledim.",
        technical: [
          {
            title: "Pipeline Tasarımı",
            content:
              "İki aşamalı kurgu: önce dil tespiti, sonra o dile göre özelleşmiş OCR. Tek genel model yerine modüler yapı."
          },
          {
            title: "Dil Tespiti (Language ID)",
            content:
              "Görüntü tabanlı CNN ile NLP tekniklerini birleştirerek belgenin dilini tespit eden hibrit bir yapı kurdum."
          },
          {
            title: "Özelleştirilmiş OCR",
            content:
              "YOLOv11 ile metin bölgelerini nesne gibi tespit ettim, ardından o dil için fine-tune edilmiş OCR motorunu devreye soktum."
          },
          {
            title: "Görüntü İşleme",
            content:
              "OpenCV ile gürültü temizleme, binarization ve perspektif düzeltme ön işlemleri uyguladım."
          },
          {
            title: "Sonuç",
            content:
              "Karmaşık belgelerde %40 civarında olan doğruluk oranı bu pipeline ile %85'in üzerine çıktı."
          }
        ]
      }
    }
  ],

  competitions: [
    {
      name: "TEKNOFEST – Sağlıkta Yapay Zeka (Mutasyon Tahmini)",
      result: "Finalist",
      description:
        "TEKNOFEST Sağlıkta Yapay Zeka yarışmasının mutasyon tahmini kategorisinde finalist oldum. Dört farklı hastalık paneli için DNA'daki tek nokta mutasyonlarını sınıflandıran LightGBM, XGBoost ve CatBoost ensemble modelleri geliştirdik; 0.93–0.97 AUPRC skoruna ulaştık."
    },
    {
      name: "Üniversiteler Arası Data League",
      result: "Türkiye 2.",
      description:
        "5 milyondan fazla etiketlenmemiş sosyal medya postunda koordineli bot ve kampanya faaliyetini tespit eden denetimsiz bir sistem geliştirdik; Türkiye 2.'si olduk."
    },
    {
      name: "GFAST",
      result: "2.",
      description:
        "Üretim makinelerinin arızasını önceden tahmin eden kestirimci bakım sistemi ve iş modeliyle katıldık."
    },
    {
      name: "HSD Ideathon",
      result: "2.",
      description:
        "Doğal afet koordinasyonunu iyileştiren bir yazılım fikrini çalışan bir prototipe dönüştürerek 2. olduk."
    },
    {
      name: "TÜBİTAK 2209-A",
      result: "Proje sunumu",
      description:
        "Federe öğrenme (federated learning) ile veri gizliliği üzerine hazırladığımız projeyi TÜBİTAK 2209-A kapsamında sunduk. Veriyi merkezde toplamadan, modelin kullanıcı cihazlarında eğitilip yalnızca model güncellemelerinin paylaşıldığı bir yaklaşımı ele aldık."
    },
    {
      name: "BTK Akademi 2026 Hackathon",
      result: "Katılım",
      description:
        "AjanPazar × FitAI projesiyle katıldık: Gemini API ile ürün açıklamalarını ve kullanıcı yorumlarını analiz edip beden ve stil önerisi çıkaran bir web uygulaması geliştirdik."
    },
    {
      name: "Kaggle",
      result: "Aktif katılım",
      description:
        "Tıptan finansa, NLP'den görüntü işlemeye farklı alanlarda veri bilimi yarışmalarına katılıyorum."
    }
  ],

  links: {
    github: "https://github.com/talh4kaya",
    linkedin: "https://www.linkedin.com/in/talha-kaya-aa5255340",
    kaggle: "https://www.kaggle.com/talh4kaya",
    huggingface: "https://huggingface.co/talh4kaya",
    website: "https://talhakaya.net",
    email: "talh4kaya@gmail.com"
  }
};
