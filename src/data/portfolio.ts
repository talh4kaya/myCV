export const portfolioData = {
  personal: {
    name: "Talha Kaya",
    title: "Data Scientist & Machine Learning Engineer",
    university: "Sakarya Üniversitesi – Bilgisayar Mühendisliği (3. Sınıf)",
    languages: [
      "Türkçe (Ana Dil)",
      "İngilizce (B2 – Hazırlık Eğitimi)"
    ],
    summary:
      "Problem çözme yeteneği yüksek, tasarım bakış açısına sahip ve iletişimi güçlü bir mühendis adayıyım. Özellikle Python ve C++ ile çalışmayı seviyorum. Teorik bilgiyi gerçek dünya problemlerine (OCR, Nesne Tespiti, Reinforcement Learning) uyarlamaya odaklanıyorum."
  },

  skills: {
    languages: ["Python", "C++", "SQL", "TypeScript", "React", "Tailwind CSS"],
    libraries: [
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "OpenCV",
      "TensorFlow",
      "PyTorch"
    ],
    areas: [
      "Makine Öğrenmesi",
      "Görüntü İşleme (Computer Vision)",
      "Reinforcement Learning",
      "Nesne Tespiti",
      "Veri Analizi"
    ]
  },

  experience: [
    {
      company: "Arvasis Yazılım Danışmanlık",
      role: "Makine Öğrenmesi Stajyeri",
      description:
        "Görüntü işleme ve nesne tespiti alanlarında çalıştım. 65 farklı dil için kelime seviyesinde dil tespiti yapabilen gelişmiş bir OCR modeli geliştirdim."
    }
  ],

  projects: [
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
              "Sıfırdan eğittiğim AlphaZero modelim, milyonlarca adım eğitilmiş klasik PPO ajanını 32'ye 16'lık bir skorla ezici şekilde yendi. Bu, 'Düşünen' yapay zekanın, 'Sezgisel' yapay zekaya üstünlüğünün kanıtıydı."
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
          "Yazılımcı olarak her gün GitHub'da başkalarının kodlarını okuyorum. Bazen devasa bir repoyu açıp 'Burada authentication nerede yapılmış?' diye aramak saatlerimi alıyordu. Kodu kopyalayıp ChatGPT'ye yapıştırmak ise hem güvenlik açısından riskliydi hem de token limitlerine takılıyordu. 'Kendi bilgisayarımda, internete ihtiyaç duymadan kodlarla konuşabileceğim bir sistem yapmalıyım' dedim ve Repo-Chat doğdu. Amacım, GitHub linkini verdiğim anda o repoyu bir uzmana dönüştürmekti.",
        technical: [
          {
            title: "Ingestion Pipeline",
            content:
              "Sistem önce repoyu klonluyor. Ancak tüm kodu tek seferde LLM'e veremeyiz. Bu yüzden kodu, fonksiyon ve sınıf mantığını bozmadan küçük parçalara (chunks) bölen akıllı bir RecursiveCharacterTextSplitter kullandım."
          },
          {
            title: "Vektör Uzayı",
            content:
              "Bu parçaları sayısal vektörlere (embeddings) dönüştürüp ChromaDB içinde sakladım. Bu sayede 'Login işlemi nasıl çalışıyor?' diye sorduğunuzda, sistem kelime eşleşmesi değil, anlamsal arama yaparak ilgili kod bloğunu buluyor."
          },
          {
            title: "Local LLM",
            content:
              "Beyin olarak Meta'nın Llama-3 modelini (Ollama üzerinden) kullandım. Vektör veritabanından gelen ilgili kod parçalarını alıp modele 'Bağlam (Context)' olarak veriyorum ve cevabı ürettiriyorum."
          },
          {
            title: "Gizlilik",
            content:
              "Her şey yerelde (Localhost) dönüyor. Kodlarınız asla buluta gitmiyor. Bu proje bana GenAI ve RAG (Retrieval-Augmented Generation) mimarilerini derinlemesine öğretti."
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
          "Okulda ve yarışmalarda modelleri eğitip bırakıyoruz. Jupyter Notebook'ta %99 başarı alıyoruz ve iş bitiyor. Ama gerçek dünyada işler böyle yürümüyor. Veri değişiyor, dünya değişiyor. Bugün çalışan model, yarın çöp olabiliyor. Bu projeyi, 'Sadece model geliştiren değil, modelin yaşam döngüsünü yöneten bir mühendis olmak istiyorum' diyerek başlattım. Guardian-Flow, modellerin sağlığını 7/24 izleyen bir yoğun bakım ünitesi gibi çalışıyor.",
        technical: [
          {
            title: "Data Drift (Veri Kayması)",
            content:
              "Sistemin kalbinde Evidently AI kütüphanesi var. Eğitim verisi ile canlı veriyi istatistiksel olarak (Kullback-Leibler divergence vb. testlerle) karşılaştırıyor. Eğer veri dağılımı bozulmaya başlarsa sistem alarm veriyor."
          },
          {
            title: "Mimari",
            content:
              "Sistemi modüler mikroservisler olarak tasarladım. Model servisi FastAPI ile dışarı açılıyor, monitoring servisi arka planda sürekli analiz yapıyor ve sonuçları dashboard'a iletiyor."
          },
          {
            title: "Containerization",
            content:
              "Tüm yapıyı Docker ile paketledim. Bu sayede sistem, 'benim bilgisayarımda çalışıyordu' sorunundan kurtulup herhangi bir bulut sunucusunda tek komutla ayağa kaldırılabiliyor."
          },
          {
            title: "Kazanım",
            content:
              "Bu proje bana MLOps dünyasının kapılarını açtı ve yapay zekanın sadece modellemeden ibaret olmadığını, asıl zorluğun sürdürülebilirlik olduğunu gösterdi."
          }
        ]
      }
    },
    {
      id: "multilingual-ocr",
      name: "Multilingual OCR Engine",
      tech: ["YOLOv8", "OpenCV", "CNN", "NLP", "Python"],
      desc:
        "Klasik OCR yöntemlerinin yetersiz kaldığı durumlarda devreye giren; 65 dildeki karmaşık belgeleri analiz edebilen hibrit bir görüntü işleme ve dil tespit sistemi. Arvasis staj projesi.",
      details: {
        story:
          "Arvasis'teki stajım, benim için teoriden pratiğe geçişin en sert ve öğretici dönemiydi. Bana verilen görev kağıt üzerinde basitti: 'Resimlerdeki yazıları oku.' Ama gerçek dünyada karşıma çıkan veri seti, 65 farklı dilde, buruşuk kağıtlar, kötü ışıklandırılmış faturalar ve el yazısı notlardan oluşuyordu. Standart Tesseract OCR motorunu çalıştırdığımda, özellikle Latin alfabesi dışındaki dillerde (Arapça, Kiril vb.) çuvalladığını gördüm. Bir çözüm mimarı gibi düşünmem gerekiyordu.",
        technical: [
          {
            title: "Pipeline Tasarımı",
            content:
              "Tek bir model her şeyi yapamazdı. Sistemi iki aşamaya böldüm: Önce dil tespiti, sonra özelleşmiş okuma."
          },
          {
            title: "Dil Tespiti (Language ID)",
            content:
              "Belgenin hangi dilde olduğunu anlamak için görüntü tabanlı bir sınıflandırma modeli (CNN) ve NLP tekniklerini birleştiren hibrit bir yapı kurdum."
          },
          {
            title: "Özelleştirilmiş OCR",
            content:
              "YOLOv8 kullanarak metin bölgelerini 'nesne' gibi tespit ettim. Ardından, tespit edilen dil için fine-tune edilmiş özel OCR motorlarını dinamik olarak tetikledim."
          },
          {
            title: "Görüntü İşleme",
            content:
              "Yazıların okunabilirliğini artırmak için OpenCV ile gürültü temizleme (denoising), binarization ve perspektif düzeltme (deskewing) ön işlemleri uyguladım."
          },
          {
            title: "Sonuç",
            content:
              "Başlangıçta karmaşık belgelerde %40'larda olan doğruluk oranını, kurduğum bu hibrit pipeline sayesinde %85'lerin üzerine çıkardık. Bu proje bana, gerçek mühendisliğin algoritma seçmek değil, veriyi ve süreci yönetmek olduğunu öğretti."
          }
        ]
      }
    }
  ],

  links: {
    github: "https://github.com/talh4kaya",
    email: "talhakaya@gmail.com"
  }
};
