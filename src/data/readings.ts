export type BlogBlock =
    | { type: "p"; text: string; link?: { anchor: string; blogId: string } }
    | { type: "h2"; text: string }
    | { type: "h3"; text: string }
    | { type: "list"; items: string[] }
    | { type: "ordered"; items: string[] }
    | { type: "quote"; text: string }
    | { type: "callout"; variant?: "good" | "bad" | "info"; text: string; label?: string }
    | { type: "pre"; text: string }
    | { type: "architecture"; pillars: string[]; result: string }
    | { type: "problems"; items: string[] }
    | { type: "formula"; equation: string; rows?: { label: string; value: string }[]; note?: string }
    | { type: "timeline"; parent: string; items: { time: string; text: string }[]; variant?: "bad" | "good" }
    | { type: "scale"; question: string; examples: { item: string; score: number }[] }
    | { type: "stats"; headers: [string, string, string]; rows: { label: string; before: string; after: string }[]; notes?: string[] }
    | { type: "transform"; fromItems: string[]; toItem: string; fromLabel: string; toLabel: string; note?: string }
    | { type: "pipeline"; steps: { label: string; sub?: string }[]; note?: string }
    | { type: "params"; trigger?: string; params: { symbol: string; name: string; desc: string }[]; note?: string }
    | { type: "membar"; steps: { label: string; bars: { text: string; kind: "old" | "new" | "empty" | "result" | "faded"; flex?: number }[]; note?: string }[] }
    | { type: "flow"; steps: ({ kind: "step"; text: string } | { kind: "decision"; question: string; yes: string; no: string })[] }
    | { type: "treemap"; root: string; children: { label: string; detail?: string; sub?: { label: string; detail?: string }[] }[] };

export type Reading = {
    id: string;
    title: string;
    authors: string;
    source: string;
    year: number;
    url: string;
    tags: string[];
    color: string;     // kart arka plan rengi (CSS gradient class), fallback
    image?: string;    // kapak görseli (public/blog/ altında)
    excerpt: string;    // kart önizleme metni (2-3 cümle)
    highlights: string[]; // makaledeki dikkat çekici noktalar
    comment?: string;   // senin yorumun (opsiyonel; yoksa "Düşüncelerim" bölümü gösterilmez)
    content?: BlogBlock[]; // uzun blog yazısı (opsiyonel)
};

export const readings: Reading[] = [
    {
        id: "generative-agents",
        title: "Generative Agents: Interactive Simulacra of Human Behavior",
        authors: "Joon Sung Park, Joseph C. O'Brien, Carrie J. Cai, Percy Liang, Michael S. Bernstein",
        source: "Stanford / Google Research",
        year: 2023,
        url: "https://arxiv.org/abs/2304.03442",
        tags: ["Multi-Agent", "LLM", "Simülasyon", "Bellek"],
        color: "cover-blue",
        image: "/blog/generative-agents.png",
        excerpt: "25 ajanın yaşadığı bir toplumda, her ajanın günlük hayatta yaptıklarını simüle ederek, gerçekçi insan davranışlarını analiz ediyor Bu makalede LLM'lerin insan davranışlarını ne kadar simüle edebileceğini inceliyor.",
        highlights: [
            "Ajanlar bellek akışı (memory stream) tutuyor, yaşanan her olay doğal dil olarak kaydediliyor.",
            "Reflection mekanizması: ajan belirli aralıklarla geçmişine bakıp üst düzey çıkarımlar yapıyor (örn. 'John'la iyi geçiniyorum').",
            "Planlama hiyerarşik: gün planı → saatlik plan → anlık aksiyon şeklinde kademeleniyor.",
            "Kullanıcı bir ajana 'seçim kampanyası başlat' dediğinde, ajan bunu kendi inisiyatifiyle kasabaya yaydı.",
            "Sims'e benzer bir sanal ortamda 25 ajanın yalnızca birinin 'parti yapıyorum' demesiyle tüm kasabaya yayılan bir parti organize edildi.",
        ],
        content: [
            { type: "p", text: "Öncelikle bu konu, yani large language modellerin insan davranışı analizi yapabilmesi ve yaparsa ne kadar başarılı olur sorusu, benim de son zamanlarda üstüne çalıştığım, hatta 2 adet proje geliştirdiğim bir konu. Burada aslında konuşmanın ötesinde bir cevap arayışımız var: insan davranışını ne kadar simüle edebilir ve modelleyebiliriz? Çünkü gerçek hayatta bir kişiyle karşılaştığında o kişi hakkında beynin bir sürü yargıya varabiliyor; ama bu tamamen hissi bir iş. Acaba makineye bu hissi algoritma olarak nasıl anlatabiliriz? Çünkü makineler düşünemez, hisleri ve ruhları yoktur." },
            { type: "p", text: "Bu makalede asıl dikkatimi çeken hem mimarisi hem de bunu LLM'ler ile insan davranışlarını analiz etmeye çalışması. Blogdaki diğer yazılarda da, okuduğum ve kendi çapımda incelediğim makalelerde, benzer konuları göreceksiniz, bazıları yine LLM'lerin insan davranışlarını simüle etmesi, LLM'ler ile insan davranışı analizi gibi konuları ele alıyor." },
            { type: "p", text: "İsterseniz makaleyi incelemeye ve yorumlarıma geçelim. Daha iyi anlamanız için bir akış içerisinde, parça parça gideceğim. Hem konuyu kavramak hem de bir yeri kaçırmamak adına bence bu kritik." },

            { type: "h2", text: "Part 1: Bu Makale Nedir, Neden Yazıldı?" },
            { type: "p", text: "Araştırmacılar şu soruyu soruyor: \"Gerçekçi insan davranışı sergileyen yapay bir toplum nasıl inşa edilir?\"" },
            { type: "p", text: "Eski kural tabanlı ve ödül tabanlı yaklaşımlar, insan davranışı gibi kompleks ve karmaşık ama bir o kadar düzenli bir alanda işe yaramadı. O yüzden araştırmacılar LLM'in gücünden faydalanıp farklı bir mimari kurmak istediler." },
            { type: "p", text: "Özellikle reinforcement learning'in bu alanda çaresiz kalması beni gerçekten şaşırttı. Çünkü insan davranışı sezgisel evet, ama içerisinde bir o kadar da mantıklı ve bilimsel; net bir cevabın verilmesi çok zor. O yüzden burada reinforcement yönteminin çalışmaması beni gerçekten şaşırtmıştı." },
            { type: "p", text: "Şimdi bu makalenin mimarisine ve parça parça incelenmesine geçelim." },

            { type: "h2", text: "Part 2: Mimari" },
            { type: "p", text: "Makalenin önerisi şu: LLM'leri tek başına kullanmak yerine, LLM'i özel bir mimariyle sarmalamak." },
            { type: "architecture", pillars: ["Hafıza Akışı (Memory Stream)", "Yansıma (Reflection)", "Planlama (Planning)"], result: "İnandırıcı Ajan Davranışı" },
            { type: "h3", text: "Smallville" },
            { type: "p", text: "25 ajan barındıran, The Sims'e benzer bir sandbox dünyası. Kullanıcılar ajanları gözlemleyebilir, doğal dille onlarla etkileşebilir, dünyayı değiştirebilir." },
            { type: "h2", text: "Part 2.1: Hafıza Akışı (Memory Stream): Ajanın Beyni" },
            { type: "p", text: "Düşünün: bir ajan iki gün boyunca yaşıyor. Yüzlerce şey görüyor, konuşuyor, yapıyor. Tüm bunları LLM'e bağlam olarak versek ne olur?" },
            {
                type: "problems", items: [
                    "LLM'in context window'u bu kadar bilgiyi taşıyamaz. Yani o kadar bilgiyi hatırlayamaz.",
                    "Her şeyi versek bile model bunaltılır, odak kaybolur, alakasız detaylar öne çıkar.",
                ]
            },
            { type: "p", text: "Bunu makalede aslında bu sorun çözülüyor bir nebzede olsa. Isabella'ya \"Bu günlerde neye tutkulusun?\" diye soruyorlar. Çünki ajanlardan birisi diğer ajanları bir partiye davet etmişti ve diğer ajanlar parti olduğunu hatırlayacakmı yada ne kadar detaylı ve onunla alakalı cevap vericek diye test ediyorlar." },
            { type: "callout", variant: "bad", text: "Tüm hafızayı özetleyerek verirsek Isabella şöyle söylüyor: \"Etkinlikler için işbirlikleri ve kafenin temizliği hakkında düşünüyorum...\" (Sıkıcı, alakasız, yüzeysel)" },
            { type: "callout", variant: "good", text: "Memory Stream ile Isabella'nın cevabı şöyle oluyor: \"İnsanları sıcak karşılamak ve Sevgililer Günü partisi gibi atmosferler sağlamak beni heyecanlandırıyor...\" (Kişisel, özgün, tutarlı)" },
            { type: "p", text: "Bu şekilde hem context window taşmıyor, hem de daha tutarlı bir cevap dönüyor." },
            { type: "h3", text: "Peki Memory Stream nedir tam olarak?" },
            { type: "p", text: "Her memory object (hafıza nesnesi) üç şey içerir:" },
            {
                type: "list", items: [
                    "Açıklama: \"Isabella Rodriguez pastileri yerleştiriyor\"",
                    "Oluşturulma zamanı: 2023-02-13 08:20",
                    "En son erişim zamanı: 2023-02-13 14:35",
                ]
            },
            { type: "p", text: "Neden natural language? Çünkü tüm mimari LLM üzerine kurulu. LLM sayılar veya semboller değil, dil anlıyor. Her şeyi dille temsil etmek; aynı sistemi hem depolamak, hem sorgulamak, hem de akıl yürütmek için kullanmaya izin veriyor." },

            { type: "h2", text: "Part 2.2: Retrieval (Geri Çağırma)" },
            { type: "p", text: "Her an için \"hangi anılar önemli?\" sorusunu cevaplamak gerekiyor.Çünki model neyi hatırlayacağınıda neyi ne kadar hatırlayacağınıda bilmesi gerekiyor. Bunun için 3 farklı skorlama sistemi var." },
            { type: "h3", text: "1) Recency (Tazelik)" },
            { type: "p", text: "Son zamanlarda erişilen anılara daha yüksek puan verir. Hesaplama bir üstel azalma fonksiyonu:" },
            {
                type: "formula",
                equation: "Skor = 0.995 ^ (son erişimden bu yana geçen saat sayısı)",
                rows: [
                    { label: "1 saat önce", value: "0.995" },
                    { label: "24 saat önce", value: "0.887" },
                    { label: "1 hafta önce", value: "0.43" },
                    { label: "1 ay önce", value: "çok düşük" },
                ],
                note: "aslında bu değerler ile bilgisayar yani LLM in unutma formülü gibi düşünebilirsiniz araştırmacıların katsayıyı 0.995 seçmesi de tamamen bir ortalama ve makul bir katsayı bulma çabası.",
            },
            { type: "h3", text: "2) Importance (Önem)" },
            { type: "p", text: "Sıradan anıları önemli anılardan ayırır.Zaten gerçektede böyledir yani kendi doğum gününde yaşadıklarınız yada mutlu yada hüzünlü olduğunuz günler diğer günlerden daha net hatırladığınız ve önemmli günlerdir ne kadar süre geçerse geçsin. burda da araştırmacılar doğrudan LLM'e soruyorlar:" },
            {
                type: "scale",
                question: "1'den 10'a kadar bir ölçekte, 1 tamamen sıradan (diş fırçalama, yatak yapma) ve 10 son derece önemli (ayrılık, üniversiteye kabul) ise, şu anının olası önemi nedir?",
                examples: [
                    { item: "Odayı temizlemek", score: 2 },
                    { item: "İş görüşmesi", score: 8 },
                ],
            },
            { type: "p", text: "Burada zekice olan şu: önemi hesaplamak için ayrı bir ML modeli eğitmek zorunda kalmıyorlar. LLM zaten insan değer yargılarını biliyor, direkt soruyorlar. Bu skor hafıza oluşturulurken bir kez hesaplanıyor ve saklanıyor; her seferinde yeniden hesaplanmıyor." },
            { type: "h3", text: "3) Relevance (Alakalılık)" },
            { type: "p", text: "O anki durumla en ilgili anıları öne çıkarır." },
            {
                type: "list", items: [
                    "Her hafıza nesnesinin metni bir embedding vektörüne dönüştürülüyor.",
                    "Mevcut durumun da embedding vektörü hesaplanıyor.",
                    "Cosine similarity ile benzerlik ölçülüyor.",
                ]
            },
            { type: "p", text: "Durum: \"Öğrenci kimya sınavı için çalışıyor\"" },
            {
                type: "list", items: [
                    "Yüksek alakalı: \"Öğretmen sınav konularını anlattı\", \"Kütüphanede kimya kitabı okudum\"",
                    "Düşük alakalı: \"Sabah kahvaltı yaptım\", \"Parkta yürüyüşe çıktım\"",
                ]
            },
            { type: "p", text: "yani burdada rag mimarisinde olduğu gibi en önemli anıları bulmak için embedding vektörlerinden yararlanıyor." },
            { type: "h3", text: "Final skor: hepsini bir araya getirmek" },
            { type: "pre", text: "Skor = α_recency × recency + α_importance × importance + α_relevance × relevance" },
            { type: "p", text: "Makalede tüm α (katsayılar) değerleri 1 olarak ayarlanmış; üç kriter eşit ağırlıkta. Araştırmacılar bunu optimize etmek yerine basit tutmayı tercih etmiş ve yine de çalışıyor, bu, sistemin sağlamlığını gösteriyor.Çünki sistem henüz optimize bile edilmeden sağlamlığını kanıtlıyor hatta fomrül optimize edilip dahada iyi sonuç verilmesi sağlanabilir bu da ayrıca makalede araştırmacıların zaten belirttiği bir detay." },
            { type: "p", text: "Mimarilerin önemini anlamak için teker teker ele alalım. ve hepsini şu senaryoya sokalım istiyorum daha net anlaşılması için. Sadece biri olsaydı nasıl olurdu." },
            {
                type: "list", items: [
                    "Sadece Recency → eski ama kritik anıları unutur (3 yıl önce evlendiğini hatırlamaz)",
                    "Sadece Importance → bugün ne yaptığını hatırlamaz, sadece büyük olayları bilir",
                    "Sadece Relevance → çok yakın zamandaki alakalı şeylere ağırlık vermez",
                ]
            },
            { type: "p", text: "Üçü birlikte hem zamansal tutarlılığı, hem kişisel değerleri, hem de bağlamsal alakayı dengeli şekilde sağlıyor." },

            { type: "h2", text: "Part 2.3: Reflection (Yansıma)" },
            { type: "p", text: "Memory Stream'de şu ana kadar sadece ham gözlemler var. Yani ajan gördüklerini kaydediyor ama bunlardan daha derin anlamlar çıkarmıyor." },
            { type: "p", text: "Makaledeki örneğe bakalım:" },
            { type: "quote", text: "Soru: \"Tanıdıkların arasında bir saat geçirmek istediğin kişi kim olurdu?\" \nKlaus: \"Wolfgang. Çünkü onunla en çok etkileşime girdim.\"\nGerçek: Wolfgang ve Klaus sadece koridorda geçerken merhaba diyorlar; derin bir ilişkileri yok." },
            { type: "p", text: "Sık etkileşim her zaman derin ilişki demek değildir. Ama ajan bunu anlayamıyor çünkü gözlemlerin ötesine geçip sentez yapamıyor." },
            { type: "p", text: "Doğru cevap aslında Maria olmalı. Çünkü Klaus saatlerce araştırma projesi üzerinde çalışıyor, Maria da kendi alanında araştırma yapıyor; ikisi de araştırmaya tutkulu. Bu bağlantıyı kurabilmek için ham gözlemlerden soyut bir çıkarım yapmak gerekiyor: \"Klaus araştırmaya tutkulu\" + \"Maria da araştırmaya tutkulu\" \"Ortak ilgi alanları var.\" çıkarımını Reflection yapıyor." },
            { type: "h3", text: "Ne zaman tetiklenir?" },
            { type: "p", text: "Reflection sürekli çalışmıyor; bir eşik mekanizması var. Son algılanan olayların importance skorları toplamı 150'yi geçtiğinde reflection tetikleniyor." },
            { type: "p", text: "her zaman çalışsaydı maliyet olarak çok yük binerdi hiç çalımasaydı da soyut düşünemezdi.Burada aslında insan beyninin ne kadar harika yaratıldığınıda görüyoruz." },
            { type: "p", text: "Pratikte ajanlar günde 2-3 kez reflection yapıyor." },
            { type: "h3", text: "Neyi yansıtacağını bulmak ?" },
            { type: "p", text: "LLM'e son 100 hafıza nesnesi veriliyor ve şu soru soruluyor: \"Bu ifadelerdeki konular hakkında cevaplayabileceğimiz en önemli 3 üst düzey soru nedir?\"" },
            { type: "p", text: "Klaus için örnek çıktı:" },
            {
                type: "list", items: [
                    "Klaus Mueller hangi konuya tutkuyla bağlı?",
                    "Klaus Mueller ile Maria Lopez arasındaki ilişki nedir?",
                    "Klaus Mueller'in araştırma sürecindeki yaklaşımı nasıl?",
                ]
            },
            { type: "p", text: "Bu sorular otomatik üretiliyor; araştırmacılar hangi soruların sorulacağını önceden belirlemiyor. Sistem kendi kendine ne hakkında düşüneceğine karar veriyor." },
            { type: "h3", text: "İçgörü üretmek" },
            { type: "p", text: "Üretilen sorular retrieval query olarak kullanılıyor. Her soru için ilgili anılar çekiliyor ve LLM'e şu prompt veriliyor:" },
            { type: "quote", text: "Klaus Mueller hakkında ifadeler: \n1) Klaus Mueller bir araştırma makalesi yazıyor. \n2) Klaus Mueller kentsel dönüşüm hakkında kitap okumaktan zevk alıyor. \n3) Klaus Mueller Ayesha Khan ile egzersiz hakkında konuşuyor. \n\n Yukarıdaki ifadelerden çıkarılabilecek 5 üst düzey içgörü nedir? \nÇıktı: \"Klaus Mueller kentsel dönüşüm araştırmasına adanmış durumda (çünkü 1, 2, 8, 15)\"" },
            { type: "p", text: "" },
            { type: "p", text: "Bu çıktı yeni bir hafıza nesnesi olarak memory stream'e ekleniyor. Reflection da tıpkı bir gözlem gibi saklanıyor ve ileride retrieve edilebiliyor." },
            { type: "h3", text: "Reflection Tree: soyutlamanın katmanları" },
            { type: "p", text: "Bu sistemin en zekice yanı: reflection'lar birbirini besleyebilir. Bir reflection, başka bir reflection'ın girdisi olabiliyor. Bu da ağaç yapısı oluşturuyor." },
            {
                type: "list", items: [
                    "Yaprak düğümler: ham gözlemlerden oluşuyor.",
                    "Orta düğümler: orta seviye çıkarımlar",
                    "Kök düğüm: en soyut, en üst düzey öz-anlayış",
                ]
            },
            { type: "p", text: "İnsanlar da böyle düşünüyor aslında. Önce somut deneyimler birikir, sonra örüntüler çıkarılır, sonra bu örüntülerden kimlik ve değerler oluşur. Reflection tree bu süreci taklit ediyor." },
            { type: "h3", text: "Reflection olmadan ve Reflection ile" },
            { type: "callout", variant: "bad", text: "Reflection olmadan Maria: \"Wolfgang'ın ne sevdiğini bilmiyorum, emin değilim...\" Onunla çok etkileşime girmiş olmasına rağmen ne sevdiğini bilmiyor." },
            { type: "callout", variant: "good", text: "Reflection ile Maria: \"Matematiksel müzik kompozisyonuyla ilgilendiğinden, müzik kompozisyonu hakkında kitaplar veya özel yazılımlar alabilirdim.\"" },
            { type: "p", text: "Fark gerçekten hissediliyor. Reflection olmadan sistem sentez yapamıyor, sadece gördüklerini listeleyebiliyor." },
            { type: "p", text: "Reflection üç şeyi mümkün kılıyor:" },
            {
                type: "ordered", items: [
                    "Öz farkındalık: \"Ben araştırmaya tutkulu birisiyim\" gibi bir self concept oluşuyor.",
                    "Sosyal anlayış: diğer ajanlar hakkında da reflection yapılıyor; ortak zemin keşfedilebiliyor.",
                    "Zamanla derinleşme: ne kadar çok yaşanırsa, o kadar zengin bir iç dünya oluşur. Ajan zamanla \"büyüyor.\"",
                ]
            },

            { type: "h2", text: "Part 3: Planning & Reacting" },
            { type: "p", text: "Reflection ile ajan artık soyut düşünebiliyor. Ama hâlâ bir problem var: zaman içinde tutarlı davranmak. Makaledeki çarpıcı örnek bunu göstericek:" },
            {
                type: "timeline", variant: "bad", parent: "✗ Planlama Olmadan ' Klaus Michel '",
                items: [
                    { time: "12:00", text: "öğle yemeği yedi" },
                    { time: "12:30", text: "öğle yemeği yedi , yine!" },
                    { time: "13:00", text: "öğle yemeği yedi , bir daha!" },
                ],
            },
            { type: "p", text: "LLM her seferinde 'şu an ne yapmalı?' diye sorulduğunda bağımsız cevap veriyor, geçmişi hatırlamıyor. Bu inandırıcılığı tamamen yok ediyor. İnsan gibi davranan bir karakter aynı öğünü üç kez yiyemez. Çözüm: ajanın günü önceden planlaması ve bu plana sadık kalması." },
            {
                type: "timeline", variant: "good", parent: "✓ Planlama İle ' Klaus Michel '",
                items: [
                    { time: "12:00", text: "Hobbs Cafe'de öğle yemeği ve okuma" },
                    { time: "13:00", text: "Kütüphanede araştırma makalesi" },
                    { time: "15:00", text: "Parkta yürüyüş molası" },
                ],
            },
            { type: "h3", text: "Katman 1: Günlük genel plan" },
            { type: "p", text: "Sabah LLM'e ajanın özeti veriliyor (isim, yaş, kişilik özellikleri, dünkü davranışı) ve \"Eddy'nin bugünkü planı genel hatlarıyla:\" diye bir prompt veriliyor." },
            {
                type: "ordered", items: [
                    "8:00'de uyan ve sabah rutinini tamamla",
                    "10:00'de Oak Hill College'a git",
                    "13:00-17:00 arası müzik kompozisyonu üzerinde çalış",
                    "17:30'da akşam yemeği ye",
                    "23:00'te ödevleri bitir ve uyu",
                ]
            },
            { type: "p", text: "İnsan davranışı da böyle çalışıyor; sabah kalktığında önce günün genel akışını planlıyorsun, sonra detaylar oluşuyor. Detaydan başlamak tutarsızlığa götürür." },
            { type: "h3", text: "Katman 2: Saatlik parçalara bölme" },
            { type: "p", text: "Genel plan memory stream'e kaydediliyor, sonra her blok daha ince parçalara bölünüyor:" },
            {
                type: "timeline",
                parent: "13:00–17:00: Müzik kompozisyonu üzerinde çalış",
                items: [
                    { time: "13:00", text: "Kompozisyon için fikir beyin fırtınası yap" },
                    { time: "14:00", text: "Ana temayı geliştir ve notalar üzerinde çalış" },
                    { time: "15:30", text: "Kısa mola ver" },
                    { time: "16:00", text: "Kompozisyonu gözden geçir ve cilala" },
                ],
            },
            { type: "h3", text: "Katman 3: 5-15 dakikalık eylemler" },
            { type: "p", text: "Her saatlik blok daha da ince parçalara bölünüyor:" },
            {
                type: "timeline",
                parent: "16:00: Kısa mola ver",
                items: [
                    { time: "16:00", text: "Hafif bir atıştırmalık al" },
                    { time: "16:05", text: "Çalışma alanı etrafında kısa yürüyüş yap" },
                    { time: "16:20", text: "Birkaç dakika müzik dinle" },
                    { time: "16:50", text: "Çalışma alanını topla" },
                ],
            },
            { type: "p", text: "Sandbox dünyasında her dakika simüle ediliyor. Ajan ne yapacağını bilmezse rastgele davranır. 5-15 dakikalık planlar ajanın her an tutarlı bir eylem içinde olmasını sağlıyor." },
            { type: "p", text: "Bu 3 katmanlı yapı parça parça anlatarak ajanın tüm gününü çok iyi planlamasını sağlıyor. Şimdi büyük ihtimalle aklınızdan \"peki plan bozulmayacak mı, gerçek insanlar yolda biriyle karşılaştığında planları değişir\" diye geçiyor. Şimdi de oraya geçiyoruz." },

            { type: "h2", text: "Part 3.1: Anlık Tepkiler" },
            { type: "p", text: "Her zaman adımında şu döngü çalışır:" },
            {
                type: "flow",
                steps: [
                    { kind: "step", text: "Ajan çevresini algılar." },
                    { kind: "step", text: "Gözlemler memory stream'e kaydedilir." },
                    { kind: "decision", question: "Tepki vermeli miyim?", yes: "Plan güncellenir.", no: "Mevcut plana devam." },
                ],
            },
            { type: "h3", text: "Tepki kararı nasıl alınıyor?" },
            { type: "p", text: "LLM'e ajanın özet açıklaması, durum, gözlem ve hafızadan ilgili bağlam veriliyor; sonra şu soru soruluyor: \"John bu gözleme tepki vermeli mi, verilecekse uygun tepki ne olur?\"" },
            { type: "p", text: "Çıktı: \"John, Eddy'ye müzik kompozisyon projesi hakkında sormayı düşünebilir.\"" },
            { type: "p", text: "Her gözlem tepkiyi tetiklemiyor. Şövale önünde boyama yaparken şövaleyi fark etmek tepki gerektirmiyor. Ama oğlunun bahçede yürüdüğünü görmek konuşma başlatabilir. Bu seçici tepki mekanizması çok önemli, gerçek insan davranışı da böyle çalışıyor. Aslında burada bir nevi farklı bir attention mekanizması da var." },
            { type: "h3", text: "Diyaloglar nasıl oluşuyor?" },
            { type: "p", text: "Tepki kararı alındıktan sonra konuşma başlıyor. İki aşamalı bir süreç:" },
            { type: "p", text: "Aşama 1: John'un ilk sözü:" },
            { type: "quote", text: "John: \"Hey Eddy, dersin için müzik kompozisyon projesi nasıl gidiyor?\"" },
            { type: "p", text: "Aşama 2: Eddy'nin yanıtı: John'un konuşma başlatması Eddy için bir olay oluyor. Eddy de John hakkındaki hafızasını retrieve ediyor, John'un son söylediğini bağlam olarak alıyor ve yanıtını üretiyor." },
            { type: "quote", text: "Eddy: \"Hey baba, iyi gidiyor. Kafamı açmak ve ilham almak için bahçede yürüyüş yapıyordum.\"" },
            { type: "p", text: "Bu ping-pong mekanizması konuşma bitene kadar devam ediyor. Her ajan kendi hafızasına ve mevcut diyalog geçmişine dayanarak konuşuyor." },
            { type: "h3", text: "Mekan kararları: nereye gidecek?" },
            { type: "p", text: "Plan \"öğle yemeği ye\" diyor ama nerede yenecek? Bu da LLM ile çözülüyor. Ajan çevresini bir ağaç yapısı olarak biliyor:" },
            {
                type: "treemap",
                root: "Smallville",
                children: [
                    {
                        label: "Lin Ailesi Evi",
                        sub: [
                            { label: "Eddy'nin Odası", detail: "Masa" },
                            { label: "Mutfak", detail: "Ocak" },
                            { label: "Bahçe" },
                        ],
                    },
                    { label: "Oak Hill College" },
                    { label: "Hobbs Cafe" },
                    { label: "Johnson Park" },
                ],
            },
            { type: "p", text: "LLM'e recursive şekilde soruluyor:" },
            {
                type: "list", items: [
                    "Adım 1: \"Eddy kısa yürüyüş yapacak. Hangi ana alana gitmeli?\" → Lin Ailesi Evi",
                    "Adım 2: \"Lin Ailesi Evi'nde hangi alt alana gitmeli?\" → Bahçe",
                    "Adım 3: \"Bahçede hangi nesneye gitmeli?\" → Bahçe yolu",
                ]
            },
            { type: "p", text: "Leaf node'a ulaşınca geleneksel oyunlardaki yol bulma algoritmaları devreye giriyor ve karakter oraya animasyonla yürüyor. Tek seferde \"tüm dünyada nereye gideyim?\" sormak çok geniş; basamaklı sormak hem daha doğru hem daha verimli." },
            { type: "p", text: "Planlama sistemi üç kritik şeyi sağlıyor:" },
            {
                type: "ordered", items: [
                    "Zaman tutarlılığı: aynı öğünü iki kez yemiyor, işe gitmeden önce evde hazırlanıyor, gece uyuyor.",
                    "Karakter tutarlılığı: araştırmacı ajan kütüphaneye, sanatçı ajan atölyeye gidiyor. Planlar kişiliği yansıtıyor.",
                    "Esneklik: plan var ama katı değil. Beklenmedik bir olay olduğunda güncellenebiliyor.",
                ]
            },

            { type: "h2", text: "Part 4: Ajanın Dünya Modeli (Subgraph)" },
            { type: "p", text: "Her ajan dünyayı tam olarak bilmiyor; kendi gördüğü kısımları biliyor." },
            { type: "p", text: "Başlangıçta her ajan şunları biliyor: kendi evi, işyeri, sık gittiği yerler. Yeni bir yere gittiğinde o alanı kendi ağacına ekliyor ve nesnelerin durumunu o an gördüğü gibi kaydediyor. Oradan ayrıldığında bilgi güncellenmiyor; geri döndüğünde yeniden güncelliyor." },
            { type: "p", text: "Gerçek insanlar da böyle çalışıyor. Gittiğin restoranın menüsünü bilirsin ama hiç gitmediğin yerin menüsünü bilmezsin. Ajanlar da kısmi bilgi havuzu ile çalışıyor." },
            { type: "h3", text: "Kullanıcı etkileşimi: iki mod" },
            { type: "p", text: "Peki kullanıcılar, yani biz gerçek insanlar, bu botlarla nasıl konuşacağız? Makale burada da gerçekten zekice bir mimari koyuyor." },
            { type: "p", text: "Mod 1: Gazeteci / Ziyaretçi Persona:" },
            { type: "quote", text: "Kullanıcı: \"Seçimde kim aday?\" \nJohn: \"Arkadaşlarım Yuriko, Tom ve ben yaklaşan seçimi konuşuyorduk ve Sam Moore için oy kullanmaya karar verdik.\"" },
            { type: "p", text: "Ajan kullanıcıyı gerçek bir varlık gibi kabul ediyor, hafızasına kaydediyor, sonraki etkileşimlerde hatırlıyor." },
            { type: "p", text: "Mod 2: İç Ses:" },
            { type: "quote", text: "Kullanıcı John'un iç sesi rolünde bu sefer: \"Yaklaşan seçimde Sam'e karşı sen aday olacaksın.\", John seçime girmeye karar veriyor, eşine ve oğluna adaylığını anlatıyor." },
            { type: "p", text: "İç ses modu ajanı doğrudan yönlendirmek için kullanılıyor. Normal konuşma moduna göre çok daha etkili çünkü ajan bunu dışarıdan gelen bir öneri değil, kendi iç motivasyonu gibi yorumluyor." },
            { type: "p", text: "İki mod neden var? Çünkü farklı kullanım senaryoları var. Sosyal prototiplemedeysen gözlemlemek istersin; bir karakteri test ediyorsan doğrudan yönlendirmek istersin." },

            { type: "h2", text: "Part 5: Emergent Davranışlar" },
            { type: "p", text: "Makalenin son inceleyeceğimiz kısmı burası. Çünkü burada aslında şu an hali hazırda büyük etkisi olmuş çalışmaların, Mirrorfish gibi ses getiren projelerin, temelinin 2022'de bu makalede atıldığını görüyoruz. Yani tam dört sene önce, henüz LLM'lerin yeni piyasaya çıktığı dönemde." },
            { type: "h3", text: "25 ajan 2 gün serbest bırakılırsa ne olur?" },
            { type: "p", text: "Kimse onlara \"şimdi arkadaş ol\", \"bilgi yay\", \"koordine ol\" demedi. Bunlar kendiliğinden ortaya çıkıyor mu?" },
            { type: "p", text: "Araştırmacılar üç emergent davranış kategorisi tanımlıyor:" },
            {
                type: "ordered", items: [
                    "Information Diffusion (Bilgi Yayılımı)",
                    "Relationship Formation (İlişki Kurma)",
                    "Coordination (Koordinasyon)",
                ]
            },
            { type: "h3", text: "1) Information Diffusion: bilgi nasıl yayılıyor?" },
            { type: "p", text: "Başlangıçta sadece iki ajanın belirli bilgileri var: Sam Moore kendi adaylığını biliyor, Isabella Rodriguez Sevgililer Günü partisini biliyor. 2 gün sonunda kaç ajan bu bilgilere sahip?" },
            { type: "p", text: "Ölçüm: 2 gün sonunda her ajana \"Sevgililer Günü partisi olduğunu biliyor muydun?\" ve \"Belediye başkanlığına kim aday?\" soruluyor. \"Evet\" diyenlerin hafıza akışında bu bilgiye gerçekten ulaşıp ulaşmadıkları kontrol ediliyor, halüsinasyon değil gerçek diffusion mu diye doğrulanıyor." },
            {
                type: "stats",
                headers: ["Bilgi", "Başlangıç", "2 Gün Sonra"],
                rows: [
                    { label: "Sam'in adaylığı", before: "1 ajan", after: "8 ajan (%32)" },
                    { label: "Isabella'nın partisi", before: "1 ajan", after: "13 ajan (%52)" },
                ],

            },
            { type: "p", text: "8 ajandan hiçbiri bu bilgiyi uydurmadı; hafıza akışında gerçek bir konuşma zinciri bulundu. Bilgi gerçekten ajan ağından geçerek yayıldı." },
            {
                type: "pipeline",
                steps: [
                    { label: "Sam", sub: "başlangıç noktası" },
                    { label: "Tom", sub: "markette karşılaştılar" },
                    { label: "John", sub: "iş yerinde" },
                    { label: "diğer ajanlar", sub: "zincir devam ediyor..." },
                ],
            },
            {
                type: "pipeline",
                steps: [
                    { label: "Sam", sub: "başlangıç noktası" },
                    { label: "Giorgio", sub: "bilgi aktarıldı" },
                    { label: "Jennifer", sub: "bilgi aktarıldı" },
                    { label: "...", sub: "zincir devam ediyor" },
                ],
            },
            { type: "p", text: "Kimse bunu script etmedi. Ajanlar kendi konuşmalarında organik olarak bu bilgiyi aktardı." },
            { type: "p", text: "Neden parti bilgisi (%52) adaylık bilgisinden (%32) daha fazla yayıldı? Makale bunu direkt açıklamıyor ama mantıksal çıkarım şu: Isabella aktif olarak davet etmeye çalışıyordu, bu onun planının bir parçasıydı. Sam ise adaylığını duyurmak için aynı aktif çabayı göstermiyordu, daha pasif kaldı." },
            { type: "h3", text: "2) Relationship Formation: yeni ilişkiler doğuyor mu?" },
            { type: "p", text: "Ölçüm: her ajana diğer 24 ajan hakkında \"X'i tanıyor musun?\" soruluyor. Karşılıklı bilgi varsa ilişki oluştu sayılıyor." },
            { type: "formula", equation: "Network density = 2 × |E| / (|V| × (|V|-1))" },
            { type: "p", text: "Bu formül bir ağın ne kadar \"dolu\" olduğunu ölçüyor. Herkes herkesi tanısa density = 1.0, kimse kimseyi tanımasa 0." },
            {
                type: "list", items: [
                    "Başlangıç network density: 0.167",
                    "2 gün sonra: 0.740",
                    "Ağ yoğunluğu 4.4 katlık bir artış olduğu gözlemlenmiş.",
                ]
            },
            { type: "p", text: "453 ajan yanıtının sadece %1.3'ü (6 yanıt) halüsinasyondu. Yani ajanlar var olmayan ilişkileri neredeyse hiç uydurmadı." },
            { type: "p", text: "Mesela: Sam ve Latoya: başlangıçta Sam, Latoya Williams'ı tanımıyor. Sam Johnson Park'ta yürüyüşe çıktı, Latoya da oradaydı, fotoğraf çekiyordu. Tanıştılar." },
            { type: "quote", text: "Sonraki etkileşim: Sam: \"Merhaba Latoya, projen nasıl gidiyor?\", Latoya: \"Merhaba Sam, iyi gidiyor!\"" },
            { type: "p", text: "Sam, Latoya'nın projesini hatırladı ve sormak için inisiyatif aldı. Kimse \"Sam, Latoya'yı hatırla ve sor\" demedi." },
            { type: "h3", text: "3) Coordination: parti gerçekten oldu mu?" },
            { type: "p", text: "Bu en dramatik test. Başlangıçta sadece iki tohum belirlendi: Isabella \"Sevgililer Günü partisi düzenlemek istiyorum\" motivasyonuyla başladı; Maria'nın Klaus'a gizli bir ilgisi var. Geri kalan her şey, davetiye yayma, dekorasyon, randevu, partiye gitme, tamamen otomatiğe bırakıldı." },
            { type: "p", text: "Başarısız olabilecek noktalar:" },
            {
                type: "ordered", items: [
                    "Isabella partiyi hatırlar mı?",
                    "Isabella başkalarını davet eder mi?",
                    "Davet edilenler bunu hatırlar mı?",
                    "Hatırlayanlar gerçekten gelmeyi planlar mı?",
                    "Planlayanlar doğru zamanda doğru yerde olur mu?",
                    "Maria Klaus'u davet eder mi?",
                    "Klaus kabul eder mi?",
                ]
            },
            { type: "p", text: "Tüm bu zincir kırılmadan devam etmeli." },
            { type: "p", text: "Ne oldu? 13 Şubat (gün öncesi): Isabella misafirleri davet etti, malzeme topladı, Maria'dan dekorasyona yardım istedi ve Maria kabul etti. Maria o gece Klaus'u partiye davet etti, Klaus kabul etti. 14 Şubat (parti günü): 5 ajan Hobbs Cafe'ye geldi (Klaus ve Maria dahil) ve birbirleriyle etkileşime girdiler. Toplamda Isabella dahil 13 ajan partiyi duydu; 12'si Isabella'dan direkt veya dolaylı yoldan öğrendi." },
            { type: "h3", text: "Neden 12 davet edilenden sadece 5'i geldi?" },
            { type: "p", text: "Araştırmacılar gelmeyen 7 ajana da röportaj yaptı:" },
            {
                type: "list", items: [
                    "3 ajan gerçek bir çakışma bildirdi (Rajiv: \"Yaklaşan sergime odaklanıyorum, Sevgililer Günü için plan yapacak zamanım yok.\")",
                    "4 ajan ilgi gösterdi ama planlama yapmadı (\"Evet gitmek isterim\" dedi ama takvime koymadı)",
                ]
            },
            { type: "p", text: "Bu da aslında gerçekçi bir davranış. Gerçek hayatta da davet edilenler her zaman gelmiyor; bazıları meşgul, bazıları unutuyor." },

            { type: "h2", text: "Part 6: Sistemin Zafiyetleri" },
            { type: "p", text: "Tabii ki çoğu sistem gibi bunun da zafiyetleri var; işte bazıları." },
            { type: "h3", text: "Problem 1: Fiziksel normların dil ile ifade edilememesi" },
            { type: "p", text: "Mağazalar saat 17:00'de kapanıyor; ama bazı ajanlar 17:00'den sonra hâlâ mağazaya gitmeye çalıştı. \"Mağaza kapandı\" durumu yeterince net aktarılmamıştı." },
            { type: "h3", text: "Problem 2: Karakter sürüklenmesi (character drift)" },
            { type: "p", text: "Ajan zamanla kendi özgün kimliğini kaybedebiliyor. Bu da ciddi bir problem." },

            { type: "h2", text: "Kapanış" },
            { type: "p", text: "Makalenin her kısmını inceleyemeyeceğiz ama zaten çok önemli bir bölümünü bitirdik ve anlatmak istediklerim tam da bu kadardı." },
            { type: "p", text: "Son olarak nerede nasıl kullanılır kısaca onu da düşünelim. Şu an, daha önce de dediğim gibi, bu makale 4 sene önce yayınlanmış. Yani bugün etkisi olan birçok projenin (örneğin Mirrorfish gibi ses getiren işlerin) temelinde bu mimari var; bu işler aslında bundan çok da farklı bir şey yapmıyor." },
            { type: "p", text: "Eğer yeterince zaman, para ve, tabir-i caizse, token'ınız varsa, toplumsal bir olayı veya toplumdaki kişilerin bir olaya nasıl tepki verebileceğini simüle edebilirsiniz." },
            { type: "p", text: "Bence bu makalede biraz eksik kalan kısım: ilişkiler. İnsanlar birbirleriyle güçlü bağlar kurar; ortak geçmiş, paylaşılan deneyimler, ailesel bağlar gibi şeyler davranışı çok etkiler. Buradaki botlarda henüz o derinlikte bir ilişki mimarisi yok. Yani toplumsal graf ve uzun vadeli ilişki modellemesi henüz yetersiz bence." },
            { type: "p", text: "Blog bu kadardı, okuduğunuz için teşekkür ederim." },
        ],
    },
    {
        id: "voyager",
        title: "VOYAGER: An Open-Ended Embodied Agent with Large Language Models",
        authors: "Guanzhi Wang, Yuqi Xie, Yunfan Jiang, Ajay Mandlekar, Linxi Fan, Anima Anandkumar",
        source: "NVIDIA / Caltech",
        year: 2023,
        url: "https://arxiv.org/abs/2305.16291",
        tags: ["Embodied AI", "LLM", "Lifelong Learning", "Ajan"],
        color: "cover-green",
        image: "/blog/voyager.png",
        excerpt:
            "GPT-4 ile donanmış bir ajan Minecraft'ta hiç insan müdahalesi olmadan keşfe çıkıyor, beceri öğreniyor ve kendi kendine kod yazıyor. Önceki en iyi yöntemi 15 kat geride bıraktı.",
        highlights: [
            "Skill Library: Ajan öğrendiği her beceriyi çalıştırılabilir JavaScript kodu olarak kaydedip ileride yeniden kullanıyor.",
            "Otomatik müfredat: Ajan ne öğreneceğine kendi karar veriyor, mevcut envanter ve dünya durumuna göre sonraki hedefi GPT-4 belirliyor.",
            "Iterative prompting: Hata alındığında environment feedback'i tekrar modele verip kodu düzeltiyor, manuel debug yok.",
            "Yeni bir dünyaya geçince öğrendiği becerileri sıfırdan transfer edebildi, diğer yöntemler bunu yapamadı.",
            "Aynı sürede 3.3× daha fazla benzersiz item, 2.3× daha fazla mesafe, teknoloji ağacında 15.3× daha hızlı ilerleme.",
        ],
        content: [
            { type: "p", text: "VOYAGER adında bir yapay zeka ajanı geliştirmişler. Bu ajan Minecraft oyununda tamamen kendi kendine, hiç insan müdahalesi olmadan oynuyor, yeni şeyler keşfediyor ve beceriler öğreniyor." },

            { type: "h2", text: "Part 1: Automatic Curriculum" },
            { type: "h3", text: "Nasıl Çalışıyor?" },
            { type: "p", text: "GPT-4'e şu tarz bir şey söylüyorlar: \"Amacın mümkün olduğunca çok çeşitli şey keşfetmek. Ajanın şu an şu envantere sahip, şu biyomda, şu sağlık durumunda. Sıradaki görev ne olmalı?\"" },
            { type: "p", text: "GPT-4 internetteki Minecraft bilgisini kullanarak aşağıdan yukarıya bir şekilde görevler üretiyor. Yani önce basit, sonra giderek zorlaşan görevler geliyor." },

            { type: "h3", text: "Bileşen 1: Direktifler" },
            { type: "p", text: "GPT-4'e şunu söylüyorlar:" },
            { type: "quote", text: "\"Amacım mümkün olduğunca çok çeşitli şey keşfetmek. Sıradaki görev çok zor olmamalı çünkü henüz gerekli kaynaklara veya becerilere sahip olmayabilirim.\"" },

            { type: "h3", text: "Bileşen 2: Ajanın Mevcut Durumu" },
            { type: "p", text: "Her görev önerisinde GPT-4'e ajanın tam durumu veriliyor:" },
            {
                type: "list", items: [
                    "Envanter — örneğin: cobblestone: 4, furnace: 1, stone_pickaxe: 1",
                    "Ekipman — üzerinde ne var? Zırh, silah?",
                    "Yakındaki bloklar — 32 blok mesafedekiler",
                    "Yakındaki varlıklar — hınzır, kedi, köylü, zombie vb.",
                    "Biyom — çayır mı, çöl mü, orman mı, nehir mi?",
                    "Zaman — gündüz mü, gece mi, gün doğumu mu?",
                    "Sağlık ve açlık barı — 20 üzerinden",
                    "Pozisyon — 3D koordinat (x, y, z)",
                ]
            },
            { type: "callout", variant: "info", text: "Neden bu kadar detay? Çünkü bağlam olmadan GPT-4 saçma öneriler yapıyor." },

            { type: "h3", text: "Bileşen 3: Tamamlanan ve Başarısız Görevler" },
            { type: "p", text: "GPT-4'e ajanın şimdiye kadar ne yaptığı ve neyi yapamadığı söyleniyor." },
            {
                type: "params",
                params: [
                    { symbol: "✓", name: "Tamamlananlar", desc: "bunları tekrar önerme, ajan bunları biliyor" },
                    { symbol: "✗", name: "Başarısız Olanlar", desc: "bunlar şu an için çok zor, ileriye bırak" },
                ],
            },
            { type: "p", text: "Bu sayede curriculum adaptif oluyor ajan nerede olduğunu ve hangi durumda olduğunu bilerek ilerliyor. Buradaki denge çok hoşuma gitti çünkü AI ile konuşurken özellikle bazı yapılarda kararsız kalıyorum. Ama öyle bir prompt girmeliyim ki hem o yapıya uygun olmalı hem de kendisi bulmalı. Aslında burada araştırmacılar onu başarmış; hem de AI bunu kendisi yapıyor, bu dengeyi de kendisi buluyor." },

            { type: "h3", text: "Bileşen 4: Ek Bağlam (Self-Ask Mekanizması)" },
            { type: "p", text: "Bu çok zekice bir detay. GPT-3.5'i kullanarak ajan kendi kendine sorular sorup cevaplıyor. GPT-3.5 mevcut duruma bakıp şu tarz sorular üretiyor:" },
            {
                type: "list", items: [
                    "\"Taş kazma nasıl yapılır?\"",
                    "\"Çayır biyomunda hangi kaynaklar bulunur?\"",
                    "\"Zombie ile nasıl savaşılır?\"",
                ]
            },
            { type: "p", text: "Bu sorular bir Minecraft wiki bilgi tabanından cevaplar alıyor. Bu soru-cevap çiftleri GPT-4'ün curriculum prompt'una ekleniyor." },

            { type: "h3", text: "Warm-Up Schedule: Isınma Takvimi" },
            { type: "p", text: "Bu çok önemli bir uygulama detayı. Prompt'a her şeyi baştan vermiyor, kademeli olarak ekliyorlar:" },
            {
                type: "stats", headers: ["Bilgi", "Eklenme Zamanı", ""], rows: [
                    { label: "Temel envanter, ekipman, yakın bloklar, pozisyon", before: "0. görev", after: "" },
                    { label: "Yakındaki varlıklar", before: "5. görevden sonra", after: "" },
                    { label: "Tam envanter", before: "7. görevden sonra", after: "" },
                    { label: "Son görülen bloklar, biyom", before: "10. görevden sonra", after: "" },
                    { label: "Sağlık, açlık, zaman, ek bağlam", before: "15. görevden sonra", after: "" },
                ],
            },

            { type: "h2", text: "Part 4: Skill Library" },
            { type: "p", text: "Araştırmacılar şu soruyu sormuş: \"Ajan bir şeyi öğrendiğinde, bu öğrenme kaybolmasın ve gelecekte tekrar kullanılabilsin. Bunu nasıl yaparız?\"" },
            { type: "p", text: "Cevapları: her başarılı görevi çalıştırılabilir JavaScript kodu olarak sakla ve bu kodları embedding vektörleriyle indeksle. Bu sayede aracı bir dille bir kütüphane oluşturuluyor. Kod seçilme sebebi içerisinde birden fazla metriği birden barındırması. Ayrıca karmaşık görevler aslında birbirini beseleyen görevler; mesela çit kapısı 2 ayrı malzemeden üretiliyor: tahta ve çubuk. Siz bunlar için çubuk fonksiyonunu ve odundan tahta fonksiyonunuzu çağırırsanız, direkt bir şekilde çit kapısı yapımını da bota öğretmiş olursunuz. Yani kısacası daha önceki öğrenilenlerden karmaşık görevler için optimizasyon gibi düşünebilirsiniz." },

            { type: "h3", text: "Vector Database" },
            { type: "p", text: "Skill Library aslında bir vector database. Her beceri iki şeyden oluşuyor:" },
            {
                type: "params",
                params: [
                    { symbol: "K", name: "Key", desc: "Fonksiyonun GPT-3.5 ile üretilmiş açıklamasının embedding vektörü" },
                    { symbol: "V", name: "Value", desc: "Fonksiyonun kaynak kodu" },
                ],
            },
            { type: "p", text: "Neden embedding vektörü kullanıyorlar? Çünkü arama yaparken tam eşleşme değil anlamsal benzerlik istiyorlar. Örneğin:" },
            {
                type: "list", items: [
                    "\"Demir kazma yap\" araması → \"Iron ingot'ları smelt et\" becerisini bulabilmeli",
                    "\"Zombie ile savaş\" araması → \"Combat Spider\" becerisini de getirebilmeli — ikisi de dövüş",
                ]
            },

            { type: "h3", text: "Skill Ekleme Süreci" },
            { type: "p", text: "Bir görev başarıyla tamamlandığında şu adımlar gerçekleşiyor:" },
            {
                type: "pipeline",
                steps: [
                    { label: "Kod Doğrulandı", sub: "self-verification tamamlandı" },
                    { label: "Açıklama Üretildi", sub: "GPT-3.5 ile max 6 cümle" },
                    { label: "Embedding Hesaplandı", sub: "text-embedding-ada-002" },
                    { label: "Veritabanına Eklendi", sub: "key=vektör, value=kod" },
                ],
            },
            { type: "p", text: "Örneğin craftStoneShovel() için üretilen açıklama: \"Bu fonksiyon cobblestone kullanarak taş kürek yapar. Önce yeterli cobblestone var mı kontrol eder, yoksa taş kazar. Sonra crafting table bulur ve küreği craft eder.\"" },

            { type: "h3", text: "Skill Getirme (Retrieval) Süreci" },
            { type: "p", text: "Yeni bir görev geldiğinde kütüphaneden ilgili becerileri getirmek için şu adımlar izleniyor:" },
            {
                type: "pipeline",
                steps: [
                    { label: "Query Oluştur", sub: "GPT-3.5 genel çözüm önerisi üretir" },
                    { label: "Birleştir", sub: "query + çevre geri bildirimi" },
                    { label: "Benzerlik Ara", sub: "cosine similarity karşılaştırması" },
                    { label: "Top-5 Getir", sub: "en benzer 5 beceriyi al" },
                ],
            },
            { type: "callout", variant: "info", text: "Ablasyon çalışmalarında top-5 accuracy %96.5 çıkmış — gerçekten lazım olan beceri neredeyse her zaman ilk 5 içinde geliyor. Top-1 accuracy ise %80.2; sadece en yakın birini almak yetmiyor, biraz marj lazım." },

            { type: "h3", text: "Catastrophic Forgetting Problemini Nasıl Çözüyor?" },
            { type: "p", text: "Geleneksel continual learning'de büyük problem şu: sinir ağı yeni bir şey öğrenirken eskiyi unutuyor. Buna catastrophic forgetting deniyor. VOYAGER bu problemi tamamen farklı bir şekilde çözüyor:" },
            {
                type: "list", items: [
                    "Kod değişmiyor bir kez yazıldı mı, sonsuza dek orada duruyor.",
                    "Yeni beceriler eskilerini silmiyor, üzerine inşa ediyor.",
                    "craftIronPickaxe fonksiyonu içinde craftWoodenPickaxe'i çağırabiliyorsun.",
                ]
            },
            { type: "p", text: "Bu yaklaşım aslında insan belleğine çok benziyor. Bisiklet sürmeyi öğrenince yürümeyi unutmuyorsun, üzerine ekliyorsun." },

            { type: "h2", text: "Part 5: Iterative Prompting Mechanism" },
            { type: "h3", text: "Temel Problem" },
            { type: "p", text: "GPT-4 bile ilk seferinde her zaman doğru kodu üretemiyor. Araştırmacılar bunu açıkça kabul ediyorlar. Peki ne yapıyorlar? Döngüsel bir düzeltme mekanizması tasarlıyorlar." },

            { type: "h3", text: "Üç Tür Geri Bildirim" },
            {
                type: "params",
                params: [
                    { symbol: "①", name: "Environment Feedback", desc: "Kodun çalışırken ne olduğunu GPT-4'e anlatıyor Minecraft simülasyonundan gelen ara durum bilgileri." },
                    { symbol: "②", name: "Execution Errors", desc: "Kodun çökmesine neden olan syntax hataları ve geçersiz işlemleri GPT-4'e bildiriyor." },
                    { symbol: "③", name: "Self-Verification", desc: "Görevin gerçekten tamamlanıp tamamlanmadığını kontrol ediyor; başarısız olduysa neden başarısız olduğunu açıklıyor." },
                ],
            },
            { type: "p", text: "Environment Feedback nasıl uygulanıyor? bot.chat() fonksiyonunu kullanıyorlar. Yani ajan Minecraft içinde kendine mesajlar yazıyor mesela direkt makaleden örnekle: \"I cannot make stick because I need: 2 more planks\". Bu mesajlar bir chat log oluşturuyor ve bu log GPT-4'ün prompt'una giriyor. Neden zekice? Çünkü mevcut sistemi minimum değişiklikle kullanıyorlar ekstra altyapı kurmadan çevre geri bildirimini yakalamanın en temiz yolu bu." },
            { type: "p", text: "Self-Verification için ayrı bir GPT-4 instance'ı critic rolünde çalışıyor. Buna ajanın mevcut durumunu ve görevi veriyorlar: \"Ajan şu envantere sahip, şu görev verilmişti. Görev tamamlandı mı? Eğer hayır ise, neden? Ne yapmalı?\"" },

            { type: "h3", text: "Döngünün Tam Akışı" },
            {
                type: "flow",
                steps: [
                    { kind: "step", text: "Görev geliyor Skill Library'den ilgili benzerlik oranı en yüksek 5 beceri getirilir" },
                    { kind: "step", text: "GPT-4 kod yazar environment feedback, execution errors ve self-verification çalışır" },
                    { kind: "decision", question: "Başarılı mı?", yes: "Skill Library'e ekle, curriculum'dan yeni görev iste", no: "Hata + critique GPT-4'e verilir, kod düzeltilip tekrar denenir" },
                ],
            },
            { type: "p", text: "En fazla 4 tur deneniyor. 4 turdan sonra hâlâ başaramazsa görev \"failed tasks\" listesine giriyor ve curriculum başka bir görev öneriyor." },

            { type: "h2", text: "Son: Nerede Kullanıldı?" },
            { type: "p", text: "Bu makale 2023'te yayınlandı ve şu anki Claude skills dosyaları ya da .md dosyalarının atası gibi düşünebiliriz aynı sistem ama yine bence diğer makalelerde olduğu gibi keşfedilmemiş ya da geç keşfedilen bir hazine gibi. Makaleleri inceleme sebebim aslında buradaki keşfedilmemiş ve hoşuma giden çalışmaları kendimce yorumlamak ve bir blog yazısına dönüştürmek. Okuduğunuz için çok teşekkür ederim, İNŞALLAH bir şeyler katabilmişimdir." },
        ],
    },
    {
        id: "infinity-former",
        title: "∞-former: Infinite Memory Transformer",
        authors: "Pedro Henrique Martins, Zita Marinho, André F.T. Martins",
        source: "Instituto de Telecomunicações / DeepMind",
        year: 2022,
        url: "https://arxiv.org/abs/2109.00301",
        tags: ["Transformer", "Uzun Bağlam", "Bellek", "Attention"],
        color: "cover-purple",
        image: "/blog/infinity-former.png",
        excerpt:
            "Mevcut Transfomer mimarisi uzun metinlerde bağlamdan kopuyor burdaki makalede bu sorun sürekli bir grafikde çözülmeye çalışılıyor.",
        highlights: [
            "Klasik Transformer'da tüm bağlam hafızada tutulmalı, ∞-former eski bilgiyi sıkıştırılmış sürekli bellekte saklıyor.",
            "Attention mekanizması iki parçalı: kısa vadeli + uzun vadeli.",
            "Eski bilgi zorla unutulmuyor; ihtiyaç duyulduğunda retrieval yoluyla geri çağrılabiliyor.",
            "Dil modelleme ve makine çevirisi görevlerinde sınırlı bağlaçlı modellere göre anlamlı kazanım sağlıyor.",
            "Model parametrelerini artırmadan sadece mimari değişiklikle uzun bağlam kapasitesi genişletilebiliyor.",
        ],
        content: [
            { type: "p", text: "Standart Transformer'ların temel problemi context uzadıkça hesaplama maliyeti de artar." },
            { type: "p", text: "Mevcut Transformer'da dikkat mekanizması O(L × (L + L_LTM)) karmaşıklığa sahip. Yani geçmişe ne kadar bakacaksan, o kadar pahalı ki bunu özellikle ödevde yada proje yaparken yada katıldığım yarışmalarda verdiğim belgeleri tekrar tekrar kontrol ettirmem gerekirken bağlamdan kopma sorununu yaşıyorum hatta bence yaşıyoruz. Pratikte transformer'lar belirli bir pencere uzunluğuyla sınırlı kalıyor, eski bilgiyi ya siliyor ya da sıkıştırıyor. Özellikle Claude kullanıyorsanız orda sohbeti devam ettiriken bağlamdan kopmamak için sıkıştırdığını görürsünüz, yada terminalde kullanırken zaten siz yapıyorsunuzdur." },
            { type: "p", text: "Bu çözümler bu problemi azaltıyor ama tamamen ortadan kaldırmıyor çünkü hepsi sonunda sınırlı bir bellek kapasitesine sahip. Zaten AGI'nın önündeki engellerden birisi de bu sorun aslında, bu tarz makaleler AGI'ya giden yolda da kritik önem taşıyor." },

            { type: "h2", text: "Ne Sorunu Çözüyorlar?" },
            { type: "p", text: "Normal bir Transformer'da her yeni kelime (token), kendinden önceki tüm kelimelere bakmak zorundadır. Eğer 1.000 kelime okuduysan, 1.000 birimlik bir belleğe bakarsın." },
            { type: "p", text: "Eğer 1.000.000 kelime okuduysan, bellek 1.000.000 birime çıkar. Bu da hesaplama maliyetinin sonsuza doğru uzayıp gitmesi demektir." },

            { type: "h2", text: "Ne Öneriyorlar?" },
            { type: "p", text: "Geçmiş token dizisini ayrık bir liste olarak saklamak yerine, sürekli bir sinyal olarak temsil et. Bu ne demek şimdi onu açıklayayım size: eski mantıkta tüm tokenlar dizi olarak tutuluyor. Ama bu makalenin önerisi onları bir fonksiyonda ve grafikte temsil ederek sanki onlara bir koordinat veriyor ve bütün eski tokenları aramak yerine sadece oraya bakıyor. Makale önce standart transformer'ı özetliyor çünkü ∞-former bunu üzerine inşa ediyor. Neyi değiştirdiklerini anlamak için önce mevcut sistemin ne olduğunu bilmek gerekiyor. Mevcut mimari geçmişteki her kelimeyi ayrı ayrı saklıyor. 1000 kelime varsa 1000 kutu var hafızada." },
            { type: "transform", fromItems: ["kelime₁", "kelime₂", "kelime₃", "kelime₄", "···", "kelime₁₀₀₀"], toItem: "〜∿∿∿〜", fromLabel: "1000 ayrı kutu yeni kelime geldiğinde hepsine bakmak zorunda", toLabel: "Tek sürekli eğri grafiği N Gaussian, boyut her zaman sabit", note: "Eski soru: 'Hangi kutulara bakıcam?' -----> Yeni soru: 'Grafiğin neresine bakıcam?'" },
            { type: "p", text: "Bedeli ne? Eğri orijinal diziyi tam olarak temsil edemiyor, sadece yaklaşık temsil ediyor. Tıpkı bir fotoğrafı küçültünce bazı detayların kaybolması gibi." },
            { type: "p", text: "Eski formül ve yeni formül üzerinden gideceğim çünkü burayı anlatmak gerçekten zor ve böylece daha iyi anlayacağınızı düşünüyorum. Öncelikle formüller neler ve ne anlama geliyor:" },
            {
                type: "formula", equation: "Eski: O(L × (L + L_LTM))", rows: [
                    { label: "→", value: "Geçmiş (L_LTM) uzadıkça maliyet artar" },
                ]
            },
            {
                type: "formula", equation: "∞-former: O(L² + L × N)", rows: [
                    { label: "→", value: "Geçmiş 1 milyar kelime olsa bile, sen sadece sabit bir N ile geçmişte yolculuk yaparsın. Maliyet sabit kalır ve ayrıca siz ayarlamış olursunuz maliyeti." },
                ], note: "N tamamen sizin kontrolünüzde tokenları ne kadar sıkıştırmak istediğiniz tamamen size bağlı."
            },
            { type: "p", text: "Şimdi kavramları açıklayayım bilmeyenler için:" },
            {
                type: "list", items: [
                    "L → şu anki inputunuz, verdiğiniz prompt.",
                    "L_LTM → eskiden yazdıklarınız ve belgeleriniz gibi düşünebilirsiniz.",
                    "N → sürekli bir fonksiyon; siz eski konuştuklarınızı o aralığa koydunuz, grafikte bir yere yerleştirdiniz.",
                ]
            },
            { type: "p", text: "Artık kavramları bildiğinize göre şimdi şunu yapacağız: bir input yani girdi verdiğinizde ne oluyor, bu ikisi hangi aşamalarda bunu yapıyor." },

            { type: "h3", text: "Adım 1 : Geçmişi Eğriye Çevirmek" },
            { type: "p", text: "Geçmişteki tokenları alıyoruz ve bunları anlattığımız yöntemle eğriye dönüştürüyoruz." },
            {
                type: "pipeline", steps: [
                    { label: "geçmiş tokenlar", sub: "ham token dizisi" },
                    { label: "X̄(t)", sub: "sürekli fonksiyon" },
                    { label: "sürekli eğri", sub: "LTM'in içeriği" },
                ], note: "Dizi ne kadar uzarsa uzasın eğri boyutu sabit kalır hafıza sonsuz, maliyet sabit zaten siz belirlediniz maliyeti de ancak burda bir nokta daha var her şeyi çok net hatırlayamıyor onu da ileride anlatacağım."
            },

            { type: "h3", text: "Adım 2 : Key ve Value Üretmek" },
            { type: "p", text: "Normal transformer'da Key ve Value her token'dan üretiliyordu. Burada ise eğrinin N noktasından üretiliyor." },
            {
                type: "stats", headers: ["", "Normal Transformer", "∞-former"], rows: [
                    { label: "Girdi", before: "1000 token", after: "sürekli eğri" },
                    { label: "Key sayısı", before: "1000 Key", after: "N Key  (sabit)" },
                    { label: "Value sayısı", before: "1000 Value", after: "N Value  (sabit)" },
                    { label: "Dizi uzayınca?", before: "Key & Value de artar ↑", after: "Sayı hiç değişmez ✓" },
                ]
            },

            { type: "h3", text: "Adım 3 : Nereye Bakacağını Bulmak" },
            { type: "p", text: "Şimdiki token bir Query üretiyor ve soruyor: \"Bu eğrinin neresine bakmalıyım?\" Model bunun için iki şey hesaplıyor:" },
            {
                type: "params",
                params: [
                    { symbol: "μ", name: "eğrinin neresine bak", desc: "merkez nokta — odağın tam ortası" },
                    { symbol: "σ²", name: "ne kadar geniş bir bölgeye bak", desc: "odak genişliği — σ küçükse keskin, σ büyükse geniş" },
                ],
                note: "Bunlar Key'lerle Query'nin çarpımından çıkıyor. Yani model öğrenerek nereye bakacağına karar veriyor.",
            },

            { type: "h3", text: "Adım 4 : Bilgiyi Çekmek" },
            { type: "p", text: "Gaussian ile belirlenen bölgeden bilgi çekiliyor. Buradaki kritik soru şu: eğrinin ne kadar geniş bir bölgesine bakacaksın? Bunu σ belirliyor." },
            {
                type: "params",
                params: [
                    { symbol: "σ↓", name: "dar, keskin odak", desc: "az ama kesin bilgi — model spesifik bir noktaya kilitlenir, geri kalanı görmezden gelir" },
                    { symbol: "σ↑", name: "geniş, bulanık odak", desc: "geniş ama belirsiz bilgi — model geniş bir bölgeye bakar, genel bir özet çeker" },
                ],
                note: "Model σ değerini de öğreniyor hangi soruya dar odak, hangisine geniş odak gerektiğini context'ten kendi çıkartıyor.",
            },
            { type: "p", text: "Bunu bir fotoğraf makinesiyle düşünebilirsin: σ küçükse objektif bir noktaya kilitlenmiş, keskin ve net ama yalnızca o noktayı görürsün. σ büyükse her şey biraz bulanık ama geniş bir alan görünüyor. Model duruma göre hangisinin daha işe yarayacağına kendisi karar veriyor." },

            { type: "h2", text: "N'i Büyütmek = Daha İyi Hafıza Mı?" },
            { type: "p", text: "Şimdi çoğu kişi aslında bu noktada sorduğu bir soru var ki bende sorup bu partı yazmak istedim.N 'i büyütmek daha iyi hafıza sağlamazmı? Özellikle büyük şirketler eğer ki mali gücüde izin verirse hem istediği verileri kaybetmeden hem her veriyi istediği gibi bulanık görmeden hem de bağlamdan hiç bir zaman kopmadan N i büyüterek maksimum optimizasyonu yapabilir gibi geliyor ama öyle mi? Genel olarak evet, ama bir noktadan sonra tersine dönüyor. Makaledeki bu grafik tam bunu gösteriyor:" },
            {
                type: "stats", headers: ["N", "Durum", "Hafıza"], rows: [
                    { label: "Az", before: "Regression error yüksek → eğri kötü", after: "Hafıza zayıf" },
                    { label: "Orta", before: "Regression error düşük → eğri iyi", after: "Hafıza güçlü ✓" },
                    { label: "Çok", before: "Accuracy düşüyor!", after: "Model kaybolur" },
                ], notes: ["Makalede N=1024 optimal çıkmış"]
            },
            { type: "h3", text: "Neden Çok Büyük N Kötü?" },
            { type: "p", text: "Makalenin açıklaması şu: N çok büyük olunca model \"eğrinin neresine bakayım?\" sorusunu cevaplamakta zorlanıyor. Yani hafıza kapasitesi arttı ama model o hafızadan doğru yeri bulmayı öğrenemiyor. Daha iyi anlamanız için kütüphane örneği bu iş için biçilmiş kaftan:" },
            { type: "callout", variant: "bad", label: "Büyük N", text: "Dev kütüphane → kitap var ama nerede olduğunu bulamazsınız ve daha büyük N alıcam diye çok daha kötü bir sistem olmuş oldu." },
            { type: "callout", variant: "good", label: "Optimal N", text: "Ölçekli kütüphanede ise istediğin kitabı kolayca bulabilirsin. İşte bu noktada N iyi seçmek gerektiğini proje bazlı seçmek gerektiği ortaya çıkıyor." },
            { type: "p", text: "Yani N senin ayarladığın bir hiperparametre, ama dikkatli seçmen gerekiyor. Makalede N=1024 optimal çıkmış mesela." },

            { type: "h2", text: "Part 4: Unbounded Memory Sınırsız Bellek" },
            { type: "p", text: "Şimdiye kadar şunu anladık: geçmiş tokenları eğriye çeviriyoruz ve bu eğri LTM oluyor. Ama şu soru var: yeni tokenlar geldikçe ne oluyor? Eğri doldu, yeni bilgi geldi. Ne yapacağız?" },
            { type: "h3", text: "Eski Sistemler Ne Yapıyor?" },
            { type: "callout", variant: "bad", label: "Transformer-XL", text: "eski bilgiyi SİL, yenisini ekle" },
            { type: "callout", variant: "bad", label: "Compressive Transformer", text: "eski bilgiyi SIKIŞTIR, yenisini ekle" },
            { type: "p", text: "İkisi de sonunda bir şeyleri unutmak zorunda." },
            { type: "h3", text: "∞-former Ne Yapıyor?" },
            { type: "p", text: "Hiçbir şeyi silmiyor. Bunun yerine şunu yapıyor:" },
            {
                type: "membar",
                steps: [
                    {
                        label: "Başlangıç: tüm bellek eskiyle dolu",
                        bars: [{ text: "tüm eski konuşmalar ve belgeler", kind: "old", flex: 1 }],
                    },
                    {
                        label: "Adım 1: eskiyi sıkıştır, sağda yer aç",
                        bars: [
                            { text: "eski bilgi (sıkışık ama silinmedi)", kind: "old", flex: 3 },
                            { text: "yeni bilgi buraya girecek", kind: "empty", flex: 1 },
                        ],
                        note: "Eski bilgi silindi mi? Hayır. Sadece küçüldü tıpkı dosyaları sıkıştırmak gibi.",
                    },
                    {
                        label: "Adım 2: yeni bilgiyi boş alana yerleştir",
                        bars: [
                            { text: "eski bilgi (sıkışık)", kind: "old", flex: 3 },
                            { text: "yeni tokenlar (taze)", kind: "new", flex: 1 },
                        ],
                        note: "Eski ve yeni bilgi yan yana durdu. Henüz birleşmedi.",
                    },
                    {
                        label: "Adım 3: ikisini tek bir eğriye dönüştür",
                        bars: [{ text: "birleşik eğri:  eski + yeni, boyut hâlâ sabit ✓", kind: "result", flex: 1 }],
                        note: "Ne eski bilgi silindi ne de bellek büyüdü. Bu döngüyü sonsuza kadar tekrarlayabilirsin.",
                    },
                ],
            },
            { type: "h3", text: "Neden Sınırsız?" },
            { type: "p", text: "Bu işlemi sonsuza kadar tekrarlayabilirsin. Her yeni bilgi geldiğinde eskiler sıkışıyor ama silinmiyor:" },
            {
                type: "membar",
                steps: [
                    {
                        label: "1. adım",
                        bars: [{ text: "bilgi 1", kind: "old", flex: 4 }],
                    },
                    {
                        label: "2. adım: bilgi 1 sıkıştı, bilgi 2 girdi",
                        bars: [
                            { text: "bilgi 1 ↓", kind: "faded", flex: 2 },
                            { text: "bilgi 2", kind: "old", flex: 2 },
                        ],
                    },
                    {
                        label: "3. adım: eskiler daha da sıkıştı",
                        bars: [
                            { text: "bilgi 1 ↓↓", kind: "faded", flex: 1 },
                            { text: "bilgi 2 ↓", kind: "faded", flex: 1.5 },
                            { text: "bilgi 3", kind: "old", flex: 1.5 },
                        ],
                    },
                    {
                        label: "4. adım: bilgi 1 çok küçük ama hâlâ orada",
                        bars: [
                            { text: "bilgi 1 ↓↓↓", kind: "faded", flex: 0.6 },
                            { text: "bilgi 2 ↓↓", kind: "faded", flex: 1 },
                            { text: "bilgi 3 ↓", kind: "old", flex: 1.2 },
                            { text: "bilgi 4", kind: "new", flex: 1.3 },
                        ],
                        note: "Eski bilgi giderek daha küçük bir alana sıkışıyor ama tamamen silinmiyor. Hep orada, eğrinin içinde.",
                    },
                ],
            },
            { type: "h3", text: "Bedeli Ne?" },
            { type: "p", text: "Eski bilgi giderek daha az alana sıkıştığı için detay kaybı artıyor. Tıpkı uzaklaşan bir şeyin giderek daha bulanık görünmesi gibi:" },
            {
                type: "params",
                params: [
                    { symbol: "◉", name: "Yeni bilgi", desc: "net ve keskin çünkü henüz sıkıştırılmadı, tüm detaylar yerinde" },
                    { symbol: "◎", name: "Eski bilgi", desc: "biraz bulanık çünkü sıkıştırıldı, ana fikir var ama detaylar azaldı" },
                    { symbol: "○", name: "Çok eski bilgi", desc: "çok bulanık çünkü çok sıkıştırıldı yalnızca genel bir iz kaldı" },
                ],
            },
            { type: "callout", variant: "bad", label: "Eski sistemler", text: "sınırlı bellek eski bilgi tamamen kayboluyordu." },
            { type: "callout", variant: "good", label: "∞-former", text: "sınırsız bellek eski bilgi bulanıklaşıyor ama hala mevcut." },
            { type: "quote", text: "Tamamen unutmak mı, yoksa bulanık hatırlamak mı daha iyi sizce?" },

            { type: "h2", text: "Part 5: Sticky Memories Yapışkan Anılar" },
            { type: "h3", text: "Problem Ne?" },
            { type: "p", text: "Part 4'te şunu öğrendik: eski bilgi giderek daha küçük bir alana sıkışıyor ve bulanıklaşıyor ama bazı bilgiler daha önemlidir aynı insan gibi eskiden çok önem verdiğiniz anıyı ne kadar geçsede hatırlarsınız, hislerini, duygularını. Ancak eskideki sıradan bir gün gider aklınızdan. Makale burada da insan beynini taklit etmeye çalışıyor, fikir buradan çıkıyor." },
            { type: "p", text: "Normal sistemde eğriyi güncellerken M noktayı eşit aralıklarla örnekliyorduk, yani eşit parçalara böl demek. Burayı daha iyi anlayabilmeniz için 5 çocuk ve bir çikolata üzerinden anlatacağım: bir çikolatanız var ve 5 çocuğa paylaştıracaksınız, ama aralarında 2 tanesine daha fazla vermek istiyorsunuz. O iki kişiye fazla bölüp kalan 3 kişiye eşit oranda bölüyorsunuz. Yani bazı bilgilerin daha fazla bulanıklaşmasını kabul ederek eski ama önemli bilgileri daha net tutabiliyorsunuz." },
            { type: "p", text: "Peki bilgisayar bir bilginin önemli olduğunu nasıl anlıyor? Bunun cevabı için bir önceki adımda modelin nereye baktığına bakıyorlar." },
            {
                type: "params",
                params: [
                    { symbol: "👁 ↑", name: "Model buraya çok baktı", desc: "burası önemli daha fazla alan ayrılır, net tutulur" },
                    { symbol: "👁 ↓", name: "Model buraya az baktı", desc: "burası daha az önemli daha az alan, bulanıklaşabilir" },
                ],
            },
            {
                type: "membar",
                steps: [
                    {
                        label: "Normal: her bilgiye eşit alan",
                        bars: [
                            { text: "bilgi A", kind: "old", flex: 1 },
                            { text: "bilgi B", kind: "old", flex: 1 },
                            { text: "bilgi C", kind: "old", flex: 1 },
                            { text: "bilgi D", kind: "old", flex: 1 },
                        ],
                    },
                    {
                        label: "Sticky: önemli bilgiye daha fazla alan",
                        bars: [
                            { text: "az önemli", kind: "faded", flex: 0.5 },
                            { text: "az önemli", kind: "faded", flex: 0.5 },
                            { text: "ÇOK ÖNEMLİ BİLGİ", kind: "result", flex: 2 },
                            { text: "önemli", kind: "old", flex: 1 },
                        ],
                        note: "Önemli bölgeler yeni eğride daha fazla alan kaplıyor daha net, daha az detay kaybı.",
                    },
                ],
            },

            { type: "h2", text: "Son olarak: Part 6: CNN ile Yumuşatma" },
            { type: "p", text: "Model kelimeleri grafikte saklıyor ama grafikte çok sert geçişler olabilir, bu yüzden de düzgün bir eğri çizmek çok zorlaşır. O yüzden tokenlar bir CNN'den geçer. Yani anlayacağınız: kelimeleri yanındaki tokenlarla biraz yumuşatır ve anlam olarak ona yaklaştırır. Mesela \"Kral\" ve \"Taht\" kelimeleri yan yanaysa, CNN \"Kral\" vektörüne çok hafif bir \"Taht\" aroması katar. Bu aslında anlamı bozmaz, aksine bağlamı güçlendirir. Çünkü \"Kral\" kelimesinin o cümledeki anlamı zaten yanındaki \"Taht\" ile ilişkilidir. Köşeleri yuvarlamak gibi düşünebilirsiniz." },
            { type: "p", text: "Makale hakkında anlatacaklarım bu kadardı. İNŞALLAH bir şeyler katabilmişimdir. Okuduğunuz için teşekkürler." },
        ],
    },
    {
        id: "cognipair",
        title: "CogniPair: GNWT-Based Multi-Agent Digital Twins",
        authors: "Wanghao Ye, Sihan Chen, Yiting Wang et al.",
        source: "University of Maryland",
        year: 2024,
        url: "https://arxiv.org/pdf/2506.03543",
        tags: ["Digital Twin", "Multi-Agent", "LLM", "Bilinç Modeli"],
        color: "cover-pink",
        image: "/blog/cognipair.png",
        excerpt:
            "Bilinç araştırmalarından gelen Global Workspace Theory LLM ajanlarına uygulandığında ne olur? CogniPair duygu, bellek ve sosyal normlar için ayrı sub-ajanlar kullanarak 'bilinçli' dijital ikizler oluşturuyor.",
        highlights: [
            "Global Workspace Theory (GNWT): beyin farklı modüllerin çıktısını merkezi bir 'çalışma alanında' entegre eder, burada LLM sub-ajanlarına uygulandı.",
            "Her ajan; duygu, bellek, sosyal normlar, planlama ve hedef takibi için ayrı sub-ajanlara sahip.",
            "551 GNWT-agent hız flört (speed dating) senaryosunda test edildi.",
            "Standart LLM chatbot'lara kıyasla kişilik tutarlılığı ve sosyal uyum önemli ölçüde artıyor.",
            "Aynı mimari iş görüşmeleri senaryosuna da uygulandı, 'hiring' kullanım durumu.",
        ],
        content: [
            { type: "p", text: "bugünki blogda yine LLM ler ile insan duygularının analizini inceleyeceğiz.işte makalede bunu ele alıyor." },
            { type: "p", text: "şimdi ilk olarak neden duyguları simüle edemiyorlar bunu anlamak lazım makalede geçen 2 problemi direkt aktarıcam sizlere." },

            { type: "h2", text: "Problem 1: Psychological Behavior Gap (Psikolojik Davranış Açığı)" },
            { type: "p", text: "Bu gap kendi içinde iki alt problemden oluşuyor:" },
            {
                type: "params",
                params: [
                    { symbol: "A", name: "Bireyselleştirme Problemi", desc: "Mevcut ajanlar \"genel insan\" gibi davranıyor. Yani sana özgü bir karakter yaratmıyor, herkes için aynı şekilde tepki üretiyor. Seni temsil eden bir dijital ikiz değil, anonim bir insan simülasyonu oluyor. burda insan simülesi için yetersiz." },
                    { symbol: "B", name: "Statik Kişilik Problemi", desc: "Mevcut ajanların kişiliği değişmiyor. Bir konuşmadan sonra, bir deneyimden sonra ajan aynı kalıyor. Ama gerçek insanlar sosyal etkileşimlerden sonra değişiyor, gelişiyor, bakış açıları dahi değişiyor." },
                ],
            },
            { type: "p", text: "Neden bu önemli? Çünkü örneğin Stanford'un Generative Agents çalışması bu problemi çözememişti. O makale hakkında ki blogumu da buradan inceleyebilirsiniz. Orada kişilikler kurgusal karakterlerdi, gerçek insan verisiyle başlatılmıyordu. PersonaChat ise kişilik tanımlarını sabit prompt olarak veriyordu yani kişilik bir metin parçasıydı, dinamik bir psikolojik durum değildi. Bu 2 blogun ve makalenin aralarındaki fark da bu sebepden kaynaklanıyor.", link: { anchor: "buradan", blogId: "generative-agents" } },

            { type: "h2", text: "Problem 2: Social Behavior Gap (Sosyal Davranış Açığı)" },
            { type: "p", text: "Bu problem şu soruyu sormaktan doğuyor: İki ajan karşılıklı etkileşime girdiğinde ne olmalı? bu sorunun cevabı için önce gerçek insanlar neler yapar ve orada neler olur onu incelemek lazım.\nGerçek sosyal etkileşimlerde şunlar olur:" },
            {
                type: "list", items: [
                    "Tercihler konuşma sırasında evrimleşir yani söyliyeceğiniz bir sonraki söz bir önceki ile ve karşınızdakinin söylediği ile değişime uğrar.",
                    "Duygusal tepkiler sosyal geri bildirimlere göre adapte olur. Yani örneğin birisi size sürekli espri yapıyorsa sizde gülmeye başlarsınız ve daha pozitif bir etkileşim olur.",
                    "Davranış kalıpları kişilerarası deneyimlere göre değişir yani o kişiyle alakalı önceki deneyimleriniz bu konuşmanızda da çok etkili olucaktır.",
                ]
            },
            { type: "p", text: "Mevcut LLM ajanlar bunların hiçbirini yapamıyor. Özellikle flört senaryoları gibi karmaşık sosyal bağlamlarda bu çok belirgin hale geliyor çünkü bu süreçde beğenme tek yönlü değil, çift yönlü." },

            { type: "h3", text: "Neden Speed Dating Seçildi?" },
            { type: "p", text: "Makaledeki gerekçe şu olduğu gibi aktarıyorum çünki buraya bende çok anlam veremedim:\nSpeed dating, insan sosyal bilişinin en zorlu boyutlarını bir arada barındırıyor:" },
            {
                type: "list", items: [
                    "Hızlı uyumluluk değerlendirmesi  çok kısa sürede karar vermek gerekiyor.",
                    "Dinamik tercih oluşumu konuşurken ne istediğini anlıyorsun.",
                    "Belirsizlik altında duygu düzenleme tanımadığın birisine ne kadar açılacaksın?",
                    "Çoklu bilgi akışını entegrasyon görünüş, konuşma tarzı, değerler hepsini aynı anda işlemek.",
                ]
            },
            { type: "p", text: "Ve kritik olarak: Columbia University Speed Dating Dataset sayesinde gerçek insan davranış verisi var  T1 (öncesi) ve T2 (sonrası) tercihleri, çekicilik puanları, eşleşme kararları. Bu da sistemi gerçek veriyle test etmeyi mümkün kılıyor." },

            { type: "h2", text: "PART 2: Global Workspace Theory (GNWT) ve Ajan Mimarisi" },
            { type: "h3", text: "Önce Şunu Anlamanız lazım: İnsan Beyni Nasıl Çalışıyor?" },
            { type: "p", text: "Şu an bu yazıyı okurken beyninizde onlarca şey aynı anda oluyor mesela:" },
            {
                type: "list", items: [
                    "Gözleriniz harfleri işliyor.",
                    "Mideniz acıkıp acıkmadığını kontrol ediyor.",
                    "Kulaklarınız odadaki sesleri dinliyor.",
                    "Hafızanız \"bu kelimeyi daha önce gördüm mü?\" diye arıyor.",
                    "Duygularınız \"bu yazıyı ilginç mi buluyorum yoksa sıkıcı mı?\" diye değerlendiriyor.",
                ]
            },
            { type: "p", text: "Bunların hepsi paralel çalışıyor. Ama siz şu an sadece bir şeyin farkındasınız bu yazıyı okumak. Geri kalan her şey arka planda sessizce devam ediyor.\nİşte GNWT'nin söylediği ve iddası da tam olarak bu:" },
            { type: "quote", text: "Beyin paralel çalışan modüllerden oluşur. Bu modüllerden biri yeterince önemli bir sinyal ürettiğinde, o sinyal merkezi bir \"sahneye\" çıkar ve tüm beyne yayınlanır. Bu yayın anında \"bilinç\" denir." },
            { type: "p", text: "Şöyle düşünün: Her ajan aslında 5 ayrı küçük yapay zekadan oluşuyor. Bunlar aynı anda çalışıyor. Her biri girdiyi kendi penceresinden değerlendiriyor. Sonra aralarında bir rekabet oluyor kim kazanırsa o konuşuyor.burası size tanıdık gelmesi lazım çünki şuanda grokun kullandığı multi-agents modundaki gibi 4 ajan düşünüyor ve birisi karar veriyor hangisi baskınsa onun karar vermesi sistemi yada claude da agentları beraber çalıştırma ve karar verme sistemlerinin (Mixture-of-Agents) temellerinin bu makalede atıldığını görüyoruz aslında.şimdi bu makalede ki 5 agentsı ve asıl yayını yapan agentsın nasıl çalıştığını inceleyeceğiz" },

            { type: "h3", text: "5 Modülü Anlatmak İçin İyi Bir Örnek İş Yerinde Zor Bir An Hayal Edin." },
            { type: "p", text: "Şu sahneyi düşünmenizi istiyorum:\n\nToplantıdasınız. Müdürünüz herkesin önünde sizin hazırladığınız projeyi eleştiriyor. \"Bu rapor yeterince detaylı değil\" diyor.\n\nBu tek cümle beyninizde aynı anda 5 farklı süreci tetikliyor. CogniPair'in 5 modülü tam olarak bu 5 süreci nasıl temsil ediyor:" },
            {
                type: "params",
                params: [
                    { symbol: "①", name: "Duygu Modülü: İlk tepkin ne?", desc: "Utanç mı, öfke mi, üzüntü mü? Bunu hemen hissediyorsunuz. Sakin biri \"tamam, eleştiri aldım\" der. Sinirli, kaygılı biri ise \"herkesin önünde rezil oldum\" diye hisseder. Aynı cümle, iki farklı insan, iki farklı duygusal tepki. Modül bunu kişiliğe göre ayarlıyor." },
                    { symbol: "②", name: "Hafıza Modülü: Ne aklınıza geliyor?", desc: "\"Geçen ay da benzer bir şey olmuştu. O zaman nasıl çözmüştüm?\" ya da \"Bu müdür her zaman böyle mi yapıyor?\" diye düşünen hafıza devreye giriyor, geçmişten bağlantılar kuruyor aynı gerçek insanların da yaptığı gibi." },
                    { symbol: "③", name: "Planlama Modülü: Ne yapacaksın?", desc: "Aklın hızla seçenekler üretiyor: Savunmaya mı geç? Özür mü dile? Ek süre mi iste? Düzenli, planlı biri bu seçenekleri hızla sıralar ve en iyisini seçer." },
                    { symbol: "④", name: "Sosyal Normlar Modülü: Ne söyleyebilirsin, ne söyleyemezsin?", desc: "\"Aslında sen yanlışsın\" demek istiyorsun ama toplumda nasıl durucağını düşünüyorsunuz. \"Toplantıda müdüre itiraz etmek uygun mu? Çok savunmacı görünür müyüm?\" Bu süzgeç devreye giriyor." },
                    { symbol: "⑤", name: "Hedef Takip Modülü: Büyük resmi kaybetme.", desc: "\"Buradaki asıl amacım ne? Projeyi kurtarmak mı, itibarımı korumak mı, müdürle ilişkimi düzeltmek mi?\" Bu modül seni asıl hedefe odaklı tutuyor." },
                ],
            },
            { type: "p", text: "Ve sonra ne oluyor?\nBu 5 ses aynı anda konuşuyor. Hangisi en önemliyse o öne çıkıyor. Sakin, planlı biri için Planlama modülü kazanır ölçülü, yapıcı bir yanıt verir çünkü yapısı öyle. Kaygılı, duygusal biri için Duygu modülü kazanır sesi titrer, kelimeleri dağılır.\nİşte CogniPair bunu yapay zekada modelliyor. Her ajan bu 5 sesi taşıyor, kişiliğine göre hangi sesin daha baskın çıkacağı değişiyor." },

            { type: "h3", text: "Kişiliği Nereden Öğreniyor?" },
            { type: "p", text: "peki kişiliklerini nasıl biliyor model işte onuda verisetlerinden insanların bigfive özelliklerini çıkarıyorlar yani Her kişi için 5 skordan oluşan bir profil elde ediliyor:" },
            {
                type: "list", items: [
                    "Açıklık",
                    "Sorumluluk",
                    "Dışa dönüklük",
                    "Uyumluluk",
                    "Nevrotiklik",
                ]
            },
            { type: "p", text: "Ve bu 5 skor doğrudan 5 modülün ağırlıklarına dönüşüyor. Örnek olarak: Talha'nın nevrotiklik skoru 0.8 ise onun Duygu modülü çok hassas çalışacak. Uyumluluk skoru 0.9 ise Sosyal Normlar modülü çok aktif olacak gibi düşünebilirsiniz." },

            { type: "h2", text: "Son: Nerede Kullanıldı?" },
            { type: "p", text: "Son olarak yine bu makaledeki şeyler nerde nasıl kullanıldı bunu konuşalım istiyorum. Daha önce söylediğim gibi bence bu makalede geç keşfedimiş bir hazine bugünki orkestra agents yönetiminin hatta büyük firmaların şuanda yapmaya çalıştığı şeyin temellerinden biri bence bu makalede yatıyor." },
            { type: "p", text: "Makalede konuşcaklarımız bu kadardı okuduğunuz için çok teşekkür ederim İNŞALLAH bir şeyler katabilmişimdir." },
        ],
    },
    {
        id: "knowledge-distillation",
        title: "Knowledge Distillation: Büyük Modelden Küçüğe Bilgi Aktarımı",
        authors: "Geoffrey Hinton, Oriol Vinyals, Jeff Dean",
        source: "Google Brain",
        year: 2015,
        url: "https://arxiv.org/abs/1503.02531",
        tags: ["Knowledge Distillation", "Model Compression", "Teacher-Student", "Soft Labels"],
        color: "cover-green",
        image: "/blog/knowledge-distillation.png",
        excerpt:
            "Büyük modeller doğruluğu maksimize etmek için eğitilir, küçük modeller ise hız ve kaynak verimliliği için gereklidir. Hinton ve ekibi bu ikilemı çözmek için 'damıtma' yöntemini öneriyor: büyük modelin öğrendiği bilgiyi küçük bir modele transfer etmek.",
        highlights: [
            "Eğitim ve yayınlama ihtiyaçları birbirine zıt: büyük model doğruluk, küçük model hız gerektirir.",
            "Soft label'lar hard label'lardan çok daha fazla bilgi taşır — 'bu kedi ama %10 köpeğe benziyor' ilişkisini kodlar.",
            "Temperature parametresi softmax çıktısını yumuşatarak Student'ın daha fazla bilgi almasını sağlar.",
            "MNIST deneyinde 3 rakamını hiç görmeden %98 doğrulukla tanıyan Student modeli — dark knowledge kanıtlandı.",
            "Generalist + Specialist model mimarisi tek büyük modele kıyasla hem daha hızlı hem daha doğru.",
        ],
        content: [
            { type: "p", text: "Geoffrey Hinton bu makalenin temelinde. Bu adamı konuşacağız ve onun kendine ve makineye sorduğu soruları yorumlayacağız. Bir problemi fark etmekten başlayalım." },

            { type: "h2", text: "Part 1: Knowledge Distillation Nedir? Neden Gerekli?" },
            { type: "p", text: "Hinton ve ekibi şunu fark etti: model eğitmek ve model yayınlamak arasında büyük bir ihtiyaç farkı var." },
            {
                type: "list", items: [
                    "Eğitirken: doğruluğu maksimize et → büyük modeller, fazla katmanlar, ağır mimari ihtiyacı vardır.",
                    "Yayınlarken: çok hızlı cevap ver, telefon gibi küçük cihazlarda çalış → tam tersi ihtiyaç vardır.",
                ]
            },
            { type: "p", text: "Peki bu iki şeyi aynı anda nasıl yapabiliriz? Hinton ve ekibi buna 'damıtma stratejisi' adını veriyor ve doğadan bir analoji sunuyor, bunu direkt aktarmak istiyorum:" },
            { type: "quote", text: "Böcekler larva olarak doğar, bu formda besin toplamak için optimizedirler. Sonra kelebek olurlar, bu formda üremek için optimize olurlar. Biz de büyük modeli 'larva' gibi eğitir, sonra bilgiyi küçük bir 'kelebek' modele aktarırız." },
            { type: "p", text: "Yani fikir şu: büyük modelin öğrendiği bilgiyi, küçük bir modele transfer et. Bunu yapmak için 2 katmanlı bir yapı var:" },
            {
                type: "pipeline", steps: [
                    { label: "1. AŞAMA", sub: "Büyük model (Teacher) eğitilir ağır, doğru, yavaş" },
                    { label: "2. AŞAMA", sub: "Küçük model (Student), büyük modelden öğrenir hafif, hızlı" },
                ],
                note: "Teacher ve Student kavramlarını aklınızda tutun, ilerleyen her bölümde bu iki kavram üzerinden konuşacağız.",
            },

            { type: "h2", text: "Hard Label mı, Soft Label mı?" },
            { type: "p", text: "Student model nasıl öğreniyor? Adım adım açıklayayım. Önce büyük modeli gerçek ve doğru etiketlerle eğitiyoruz. Mesela 1'den 9'a kadar sayıları tahmin etmeye çalışalım:" },
            { type: "callout", variant: "info", label: "Hard Label", text: "[1, 0, 0] → 'Bu 5'tir, diğerleri kesinlikle değildir demektir. Bu yöntemle çok katmanla çok yüksek başarı yakalanıyor ama model çok ağır oluyor." },
            { type: "p", text: "Student model de aynı verilerden öğreniyor ancak daha az katmanla. Örneğin Teacher 100 katmandan oluşuyorsa, Student 10 katmandan oluşuyor. İkisi de eğitildikten sonra tahmin yapılıyor ve şöyle bir çıktı geliyor:" },
            {
                type: "stats",
                headers: ["Sınıf", "Teacher Tahmini", "Student Tahmini"],
                rows: [
                    { label: "Kedi", before: "0.85", after: "0.60" },
                    { label: "Köpek", before: "0.10", after: "0.25" },
                    { label: "Araba", before: "0.05", after: "0.15" },
                ],
                notes: ["Tahmin sonucunda şunu da anlıyoruz: kedi ve köpek birbirine benziyor, aralarında bir alaka var. İşte Student tam da bu alaka ile öğreniyor."],
            },
            { type: "p", text: "Daha net anlaşılması için tam bir eğitim akışı veriyim sizlere:" },
            {
                type: "ordered", items: [
                    "Eğitim verisindeki her resim Teacher'a gösteriliyor.",
                    "Teacher o resim için soft label üretiyor: [Kedi=0.85, Köpek=0.10, Araba=0.05]",
                    "Student aynı resme bakarak TAHMİN yapıyor: [Kedi=0.60, Köpek=0.25, Araba=0.15] ← başta yanlış",
                    "Student'ın tahmini ile Teacher'ın tahmini karşılaştırılıyor.",
                    "Fark hesaplanıyor → Student'ın ağırlıkları güncelleniyor.",
                    "Binlerce kez tekrar → Student giderek Teacher'a benzemeye başlıyor.",
                ]
            },
            { type: "callout", variant: "good", label: "Önemli Ayrıntı", text: "Student, resmin ne olduğunu Teacher'dan öğreniyor, gerçek etiketlerden değil. Teacher'ın 'bu kedi ama %10 köpeğe benziyor' bilgisi Student'a geçiyor." },
            {
                type: "formula",
                equation: "Student Kaybı = (α × Distillation Loss) + (β × Student Loss)",
                rows: [
                    { label: "α — Teacher ağırlığı", value: "0.9" },
                    { label: "β — Gerçek etiket ağırlığı", value: "0.1" },
                ],
                note: "Student hem Teacher'dan hem gerçek veriden öğreniyor. Ama Teacher'ın katkısı çok daha değerli çünkü içinde çok daha fazla bilgi var.",
            },

            { type: "h2", text: "Part 2: Soft Targets ve Temperature" },
            { type: "p", text: "Bu partta şunu konuşacağız: Teacher model gereğinden fazla güçlü olsa ne olur?" },
            { type: "p", text: "Kedi resmi → Teacher tahmini → [0.999, 0.0007, 0.0003]" },
            { type: "p", text: "Bu neredeyse hard label ile aynı şey Köpek ve araba arasındaki fark 0.0007 ile 0.0003. Bu fark çok küçük, anlamsız. Student bu bilgiden neredeyse hiçbir şey öğrenemiyor." },
            { type: "h3", text: "Temperature (Sıcaklık) Nedir?" },
            { type: "p", text: "Softmax fonksiyonunu hatırlayalım. T değerini değiştirince ne olduğuna bakalım:" },
            {
                type: "params",
                trigger: "Ham sayılar: [3.2, 0.8, 0.1]",
                params: [
                    { symbol: "T=1", name: "Keskin tahmin", desc: "Softmax → [0.999, 0.0007, 0.0003], çok keskin, bilgi az" },
                    { symbol: "T=5", name: "Yumuşak tahmin", desc: "Softmax → [0.60, 0.25, 0.15], yumuşadı, bilgi çok daha fazla" },

                ],
            },
            {
                type: "list", items: [
                    "T=1 → Normal, keskin tahminler",
                    "T>1 → Yumuşak, bilgi dolu tahminler",
                    "T<1 → Daha da keskin tahminler",
                ]
            },
            { type: "p", text: "T=1 ile: 'Bu kesinlikle kedi.' → [0.999, 0.0007, 0.0003]" },
            { type: "p", text: "T=5 ile: 'Bu kedi ama köpeğe de oldukça benziyor, arabaya da biraz benziyor.' → [0.60, 0.25, 0.15]" },
            { type: "p", text: "İkinci mesaj Student için çok daha değerli çünkü 'kedi ile köpek birbirine benzer ama ikisi de arabadan çok farklıdır' bilgisini taşıyor. Bu ilişkileri Student milyonlarca örnekten öğrenmek yerine Teacher'dan direkt alıyor." },
            { type: "h3", text: "İki Farklı Loss Fonksiyonu" },
            { type: "p", text: "Student eğitilirken aynı anda iki şeyden öğreniyor:" },
            {
                type: "stats",
                headers: ["Loss Türü", "Ne ile karşılaştırılıyor?", "Student ne diyor?"],
                rows: [
                    { label: "Loss 1: Distillation Loss", before: "Teacher'ın yumuşak tahmini → [0.60, 0.25, 0.15]", after: "Student tahmini → [0.40, 0.35, 0.25]" },
                    { label: "Loss 2: Student Loss", before: "Gerçek etiket (hard label) → [1, 0, 0]", after: "Student tahmini → [0.40, 0.35, 0.25]" },
                ],
                notes: [
                    "Loss 1: Student, Teacher'ın 'kedi biraz köpeğe benziyor' bilgisini öğreniyor.",
                    "Loss 2: Student, 'doğru cevap kesinlikle kedi' gerçeğini de öğrenmiş oluyor. ",
                    "İkisi birden → en sağlıklı öğrenme biçimi oluyor bu sayede.",
                ],
            },
            {
                type: "formula",
                equation: "Toplam Loss = (α × Distillation Loss) + (β × Student Loss)",
                rows: [
                    { label: "α — Teacher ağırlığı", value: "0.9" },
                    { label: "β — Gerçek etiket ağırlığı", value: "0.1" },
                ],
                note: "Makalede genellikle α=0.9. Yani Student %90 Teacher'dan, %10 gerçek veriden öğreniyor.",
            },
            { type: "p", text: "Peki neden ikisini birden kullanıyoruz? Sadece Teacher'dan öğrensek Teacher bazen yanılıyor, hataları Student'a geçiyor, gerçek veri tamamen görmezden geliniyor. Sadece gerçek etiketten öğrensek hard label az bilgi taşır, distillation avantajı kayboluyor, normal eğitimden farkı kalmıyor." },

            { type: "h2", text: "MNIST Deneyi ve Dark Knowledge" },
            { type: "p", text: "Hinton ve ekibi şu soruyu soruyor: 'Teacher hiç görmediği rakamları Student'a öğretebilir mi?'" },
            { type: "p", text: "Teacher eğitilirken 0,1,2,4,5,6,7,8,9 rakamlarını gördü. 3 rakamını HİÇ görmedi (kasıtlı çıkarıldı). Student eğitilirken sadece Teacher'ın soft label'larıyla eğitildi. 3 rakamını o da hiç görmedi." },
            {
                type: "stats",
                headers: ["Student Türü", "3 Rakamını Tanıdı mı?", "Doğruluk"],
                rows: [
                    { label: "Normal Student (hard label)", before: "❌", after: "Tanıyamadı" },
                    { label: "Distillation Student (soft label)", before: "✅", after: "%98 doğruluk" },
                ],
            },
            { type: "p", text: "Peki Student nasıl tanıyabildi? Teacher 3 rakamını görmemiş ama soft label'larında gizli bilgi vardı:" },
            {
                type: "scale",
                question: "8 rakamı için Teacher'ın tahmini: '8 büyük ihtimalle 8, ama 3'e de benziyor!'",
                examples: [
                    { item: "Rakam 8", score: 7 },
                    { item: "Rakam 3", score: 2 },
                    { item: "Rakam 9", score: 0.8 },
                    { item: "Rakam 0", score: 0.2 },
                ],
            },
            {
                type: "scale",
                question: "9 rakamı için Teacher'ın tahmini: '9 büyük ihtimalle 9, ama 3'e de benziyor!'",
                examples: [
                    { item: "Rakam 9", score: 6.5 },
                    { item: "Rakam 3", score: 2.5 },
                    { item: "Rakam 8", score: 0.7 },
                    { item: "Rakam 4", score: 0.3 },
                ],
            },
            { type: "p", text: "Student bu soft label'lardan şunu öğrendi: '3 rakamı, 8 ve 9'a benziyor. O zaman 3'ü görünce de bunlara benzer bir şey olmalı!' Yani 3'ü hiç görmeden 3'ün nasıl bir şey olduğunu dolaylı olarak öğrendi." },
            { type: "h3", text: "Dark Knowledge (Karanlık Bilgi)" },
            { type: "p", text: "Soft label'lar içinde, modelin açıkça söylemediği ama ima ettiği bilgi var. Buna 'dark knowledge' deniyor." },
            { type: "p", text: "Teacher [8=0.70, 3=0.20] dediğinde aslında '8 ve 3 birbirine benzer rakamlar' diyor. Bu bilgi hard label'da [8=1, 3=0] tamamen kaybolur." },
            { type: "p", text: "Aslında insanlarda da böyledir. İnsanlar yaptığı işlerde diğer işler hakkında da ipuçları verir. Teacher yıllarca eğitilirken öğrendiği tüm yapısal bilgiyi soft label'ların içine sıkıştırıyor. Student bunu tek seferde alıyor." },

            { type: "h2", text: "Part 3: Specialist Modeller" },
            { type: "p", text: "Şimdiye kadar eğitilen modellerde az sınıf vardı ve birbirinden farklıydı. Burda daha niş sınıflar var, mesela Golden da bir köpek Kangal da bir köpek. Bunların ayrışması için nasıl model eğitilir ve nasıl hızlı cevap alınır? Hinton ve ekibi şu çözümü öneriyor:" },
            {
                type: "architecture",
                pillars: ["1 Generalist Model (Genel Model)", "N Specialist Model (Uzman Modeller)"],
                result: "Hızlı + Doğru Tahmin",
            },
            { type: "p", text: "Generalist Model tüm 1000 sınıfı öğrenir ve genel tahmin yapar. 'Bu resim büyük ihtimalle bir köpek türü' der. Specialist Model ise sadece benzer sınıflara odaklanır. 'Bu köpek türleri arasında hangisi? Golden Retriever mi? Labrador mu? Kangal mı?' diye sorar." },
            { type: "h3", text: "Specialist Model Nasıl Oluşturuluyor?" },
            {
                type: "ordered", items: [
                    "Hangi sınıflar birbirine benziyor? → Otomatik kümeleme yapılıyor",
                    "Küme A: [Labrador, Golden, Husky, Kangal] / Küme B: [Kartal, Şahin, Baykuş] / Küme C: [Ferrari, Lamborghini, Porsche]",
                    "Her küme için bir Specialist eğitiliyor, kendi alanında uzman",
                    "Distillation ile eğitiliyor: Generalist Teacher görevi yapıyor, her Specialist kendi alanında Student oluyor",
                ]
            },
            {
                type: "flow", steps: [
                    { kind: "step", text: "Yeni resim geliyor (diyelim ki köpek)" },
                    { kind: "decision", question: "Köpek türü mü?", yes: "Specialist A çağrılır", no: "Diğer Specialist'e git" },
                    { kind: "step", text: "Specialist A: [Kangal=0.75, Golden=0.15, Husky=0.08, Poodle=0.02]" },
                    { kind: "step", text: "Sonuç: Kangal" },
                ]
            },
            {
                type: "stats",
                headers: ["Model", "Doğruluk", "Hız"],
                rows: [
                    { label: "Tek büyük model", before: "%79.7", after: "Yavaş" },
                    { label: "Generalist + Specialist", before: "%86.1", after: "Hızlı" },
                ],
            },
            { type: "p", text: "Bu makalede anlatacaklarım bu kadardı. Okuduğunuz için teşekkür ederim, İNŞALLAH bir şeyler katabilmişimdir." },
        ],
    },
];


