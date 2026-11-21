import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SiteHeader from '../components/sections/SiteHeader';
import SiteFooter from '../components/sections/SiteFooter';
import ContactForm from '../components/sections/ContactForm';
import HeroCard from '../components/HeroCard';
import SocialDock from '../components/SocialDock';
import FileBoxIllustration from '../components/FileBoxIllustration';
import ProjectStory from '../components/ProjectStory';
import HandsIllustration from '../components/HandsIllustration';
import IdeaIllustration from '../components/IdeaIllustration';
import CursorTrail from '../components/CursorTrail';
import { useChatbot } from '../components/useChatbot';

// Projeler alanlarına göre kümelenmiş dört sütun (jaeyi'deki "Specialties" gibi).
// İsimler ve linkler GitHub'daki repolara göre; repo'su olan etikete tıklayınca
// GitHub'da açılır. Kurum içi projelerin (Lakehouse, Agent, OCR) repo'su yok.
const GH = 'https://github.com/talh4kaya/';
const SPECIALTIES: { name: string; desc: string; projects: { label: string; href?: string }[] }[] = [
    {
        name: 'Veri mühendisliği',
        desc: 'Dağınık veriyi toplayan, temizleyen ve herkese yalnızca yetkisi olanı gösteren veri platformları.',
        projects: [
            { label: 'Kurumsal Data Lakehouse' },
            { label: 'Uçtan Uca Big Data Pipeline', href: GH + 'big-data-pipeline' },
            { label: 'Guardian-Flow: Uçtan Uca MLOps', href: GH + 'Data-Sci-end-to-end-MLops' },
        ],
    },
    {
        name: 'Yapay zekâ ajanları ve LLM',
        desc: 'Veriyle çalışan, soru cevaplayan ve kullanıcının yetkisiyle iş yapan LLM tabanlı sistemler.',
        projects: [
            { label: 'Kurumsal AI Agent Platformu' },
            { label: 'Kalem: Raporcu Agent', href: GH + 'kalem' },
            { label: 'Repo-Chat: Lokal Kod Asistanı (RAG)', href: GH + 'repo-chat' },
            { label: 'DSiyasi: Çok Ajanlı Siyasi Simülasyon', href: GH + 'dsiyasi' },
            { label: 'AI Search: Prompta Göre Ürün Önerisi', href: GH + 'AI--Search' },
            { label: 'makapaka: Bu Sitenin Asistanı', href: GH + 'myCV' },
        ],
    },
    {
        name: 'Makine öğrenmesi',
        desc: 'Tablo verisinden tahmin üreten, deney yöneten ve kendi kendine oynayarak öğrenen modeller.',
        projects: [
            { label: 'Mangala AI: AlphaZero (tarayıcıda oyna)', href: '/mangala' },
            { label: 'Dönüşüm Optimizasyonu (Multi-Armed Bandit)', href: GH + 'conversion-optimizer' },
            { label: 'Promo-Pulse: Kampanya Uplift Analizi', href: GH + 'Promo-Pulse-Uplift' },
            { label: 'Home Credit Kredi Riski Analizi', href: GH + 'home-credit-analiz' },
            { label: 'ML Destekli Görsel Bileşen Editörü', href: GH + 'react-visual-editor-ml-project' },
            { label: 'TEKNOFEST Mutasyon Tahmini' },
            { label: 'Data League Dezenformasyon Tespiti' },
        ],
    },
    {
        name: 'Görüntü işleme',
        desc: 'Belgeleri ve görüntüleri okuyup dilini tespit eden, metne dönüştüren sistemler.',
        projects: [
            { label: 'Çok Dilli Belge OCR ve Dil Tespiti' },
            { label: 'Gazete Arşivi VLM OCR' },
        ],
    },
];

// Deneyimlerim yol haritası: soldan sağa, eskiden bugüne
const ROADMAP: { label: string; org: string; role: string; when: string; text: string; items: string[]; current?: boolean; next?: boolean }[] = [
    {
        label: 'Arvasis',
        org: 'Arvasis Yazılım Danışmanlık',
        role: 'Makine Öğrenmesi Stajyeri',
        when: '2025',
        text: "Görüntü işleme ve nesne tespiti alanlarında çalıştım. 65 farklı dil için kelime seviyesinde dil tespiti yapabilen bir model geliştirdim. Standart Tesseract'ın yetersiz kaldığı çok dilli belgelerde YOLOv11 ile metin tespiti uygulayarak doğruluk oranını %40'tan %85'in üzerine çıkardım; gürültü temizleme, perspektif düzeltme ve veri çoğaltma gibi ön işleme adımlarını uyguladım.",
        items: ['65 dilde kelime düzeyinde dil tespiti', 'YOLOv11 ile metin tespiti', 'OCR doğruluğu %40 → %85+'],
    },
    {
        label: 'Dijital Varlıklar',
        org: 'Dijital Varlıklar A.Ş.',
        role: 'Yazılım Mühendisi Stajyeri',
        when: '2026',
        text: "Türkiye Gazetesi'nin dijital arşivi için VLM tabanlı OCR modelleriyle çalıştım. Kurumsal bir yazılım için native RAG yapısı kurdum; PDF ve web verisini otomatik çıkarma, temizleme ve anlamlı parçalara bölme için bir veri işleme hattı geliştirdim. BGE-M3 ve Qdrant ile 400'den fazla doküman parçasını semantik aramaya hazır hale getirdim, iki katmanlı bir mükerrer tespit algoritmasıyla veri kalitesini artırdım.",
        items: ['Gazete arşivi için VLM tabanlı OCR', 'Native RAG ve veri işleme hattı', 'BGE-M3 + Qdrant ile semantik arama'],
    },
    {
        label: 'İhlas Holding',
        org: 'İhlas Holding A.Ş.',
        role: 'Yapay Zekâ ve Veri Mühendisliği',
        when: '2026, devam ediyor',
        text: "Holdingin uçtan uca veri, yetki ve yapay zekâ platformunu kuruyorum. İştiraklerin verisini katmanlı bir lakehouse'ta topladım; satır, kolon ve belge düzeyinde merkezî yetkilendirmeyi kurdum. Üstüne, kullanıcının kendi yetkisiyle çalışan; MCP araçları, RAG ve A2A agent'larından oluşan kurumsal yapay zekâ katmanını geliştirdim.",
        items: ['Katmanlı lakehouse ve merkezî yetkilendirme', "MCP, RAG ve A2A agent'larıyla yapay zekâ katmanı", 'Kullanıcının yetkisiyle çalışan asistanlar'],
        current: true,
    },
    {
        label: 'Sıradaki',
        org: 'Sıradaki durak',
        role: 'Yeni projeler',
        when: 'Yakında',
        text: 'Yeni projelere ve iş birliklerine açığım. Veriyle ilgili çözmek istediğin bir problem varsa birlikte bakalım.',
        items: ['Birlikte çalışmaya açığım'],
        next: true,
    },
];

// Ana başlık: iki satır
// Ana başlık (Notion'daki gibi kısa ve iki satır); tanıtım cümlesi altındaki açıklamada
const HEADLINE = [
    'I turn raw data into',
    'intelligent AI solutions.',
];

// Kartın altındaki logo duvarı: katıldığım yarışmalar (Notion'daki müşteri logoları gibi)
const COMPETITIONS = [
    { name: 'TEKNOFEST', rank: 'Finalist', medal: 'gold', logo: '/icons/comp/teknofest.png', desc: 'Sağlıkta Yapay Zeka kategorisinde DNA mutasyonlarını sınıflandıran modellerimizle 0.93 ile 0.97 arası AUPRC aldık ve finale kaldık.' },
    { name: 'Data League', rank: 'Türkiye 2.', medal: 'silver', logo: '/icons/comp/dataleague.png', desc: 'Sosyal medyadaki koordineli dezenformasyonu etiketsiz veriyle tespit eden sistemimizle 5 milyondan fazla postu analiz ettik.' },
    { name: 'GFAST', rank: 'İkincilik', medal: 'silver', logo: '/icons/comp/gfast.png', desc: 'Kestirimci bakım projemizle ikinci olduk ve projeyi gerçek sanayi ortaklarına sunduk.' },
    { name: 'HSD Ideathon', rank: 'İkincilik', medal: 'silver', logo: '/icons/comp/hsd.png', desc: 'Afet koordinasyonu üzerine geliştirdiğimiz fikirle ikinci olduk.' },
    { name: 'TÜBİTAK 2209-A', rank: 'Sunuldu', logo: '/icons/comp/tubitak-belge.svg', desc: 'Araştırma projemizi TÜBİTAK 2209-A kapsamında sunduk.' },
    { name: 'Kaggle', rank: 'Aktif', logo: '/icons/comp/kaggle.png', desc: 'Veri bilimi yarışmalarına düzenli olarak katılıp her yarışmada yeni bir şey öğreniyorum.' },
    { name: 'BTK Hackathon', rank: 'Katılım', logo: '/icons/comp/btk.svg', desc: "BTK Akademi 2026 Hackathon'unda AjanPazar ve FitAI projesiyle takım olarak yer aldık." },
];

const ROADMAP_STEP_MS = 5000;

const Home = () => {
    const location = useLocation();
    // Yol haritasında seçili durak; açılışta bugünkü iş
    const [stepIndex, setStepIndex] = useState(0);
    // Deneyimler kendi kendine sırayla ilerler (bölüm ekrandayken, 5 sn'de bir);
    // ziyaretçi bir durağa tıkladığı anda otomatik ilerleme tamamen durur.
    const [autoPlay, setAutoPlay] = useState(true);
    const [roadmapVisible, setRoadmapVisible] = useState(false);
    const roadmapRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = roadmapRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setRoadmapVisible(e.isIntersecting), { threshold: 0.35 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!autoPlay || !roadmapVisible) return;
        const id = window.setTimeout(() => setStepIndex((i) => (i + 1) % ROADMAP.length), ROADMAP_STEP_MS);
        return () => window.clearTimeout(id);
    }, [autoPlay, roadmapVisible, stepIndex]);
    const { openFullscreen, sendMessage } = useChatbot();
    const heroRef = useRef<HTMLElement>(null);


    // Bu projelerin herkese açık bir sayfası yok; "Daha fazla bilgi al"
    // Makapaka'yı açıp projeyi detaylı anlatmasını ister.
    const askAbout = (title: string) => {
        openFullscreen();
        sendMessage(`"${title}" projesini biraz daha detaylı anlatır mısın?`);
    };

    // Başka sayfadan /#section ile geldiyse ilgili bölüme kaydır
    useEffect(() => {
        if (!location.hash) return;
        const id = location.hash.replace('#', '');
        const tryScroll = () => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else setTimeout(tryScroll, 100);
        };
        setTimeout(tryScroll, 100);
    }, [location.hash]);

    return (
        <>
            <SiteHeader />

            {/* main'deki büyütmenin (zoom) dışında: imleç koordinatları birebir eşleşsin */}
            <CursorTrail targetRef={heroRef} />

            <main className="home-main">
                <section className="hero" ref={heroRef}>
                    <div className="hero-title-wrap">
                        {/* Notion'daki gibi: ortalı, büyük, iki satır; sayfa açılınca kelimeler
                            alttan sırayla belirir. */}
                        <h1 aria-label={HEADLINE.join(' ')}>
                            {HEADLINE.map((line, li) => (
                                <span key={li} aria-hidden="true">
                                    {li > 0 && <br />}
                                    {line.split(' ').map((word, wi, arr) => (
                                        <span key={wi}>
                                            <span className="h1-word" style={{ '--i': li * 8 + wi } as CSSProperties}>
                                                <span>{word}</span>
                                            </span>
                                            {(wi < arr.length - 1 || li < HEADLINE.length - 1) && ' '}
                                        </span>
                                    ))}
                                </span>
                            ))}
                        </h1>
                    </div>

                    <p className="hero-sub">
                        Hi, I'm Talha Kaya. Data Scientist &amp; Machine Learning Engineer.
                    </p>

                    {/* Notion'daki gibi: ortada yan yana iki yuvarlak buton, solda dolu ana buton */}
                    <div className="hero-buttons">
                        <a
                            href="#all-projects"
                            className="btn btn-primary"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('all-projects')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Projelerimi Keşfet
                        </a>
                        <a
                            href="#contact"
                            className="btn btn-soft"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            İletişime Geç
                        </a>
                    </div>

                    {/* Notion'daki ürün görselinin yerinde: Makapaka sohbet penceresi */}
                    <div className="hero-card">
                        <HeroCard />
                    </div>
                </section>



                {/* Katıldığım yarışmalar: ince çerçeveli kutucuklardan ızgara. Üzerine gelince
                    logo renklenir ve orada ne yaptığımız küçük bir kutuda yazar. */}
                <section className="comp-grid-wrap" id="competitions" aria-label="Katıldığım yarışmalar">
                    <p className="comp-grid-eyebrow">Katıldığım yarışmalar</p>
                    <ul className="comp-grid">
                        {COMPETITIONS.map((c) => (
                            <li key={c.name}>
                                <Link to="/yarismalarim" className="comp-tile" aria-describedby={`comp-tip-${c.name.replace(/\W+/g, '')}`}>
                                    <span className="comp-tile-plus" aria-hidden="true">+</span>
                                    <span className="comp-tile-icon" aria-hidden="true">
                                        <img src={c.logo} alt="" className="comp-tile-logo" />
                                    </span>
                                    <span className="comp-tile-text">
                                        <span className="comp-tile-name">{c.name}</span>
                                        <small className={`comp-tile-rank${c.medal ? ` tier tier-${c.medal}` : ''}`}>{c.rank}</small>
                                    </span>
                                    <span className="comp-tip" role="tooltip" id={`comp-tip-${c.name.replace(/\W+/g, '')}`}>
                                        <b className={c.medal ? `tier tier-${c.medal}` : undefined}>{c.rank}</b>
                                        {c.desc}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="work" id="all-projects">
                    <div className="work-head">
                        <div>
                            <h2 className="work-title">Aktif kullanılan projelerim.</h2>
                            <p className="work-sub">
                                Şirketlerin dijital dönüşüm sürecinde geliştirdiğim ve halen aktif kullanılan projeler.
                            </p>
                        </div>
                        <FileBoxIllustration className="work-illustration" />
                    </div>

                    <ProjectStory onAsk={askAbout} />
                </section>

                {/* Tüm projeler (jaeyi.studio'daki "Specialties" bölümü gibi): küçük üst başlık,
                    büyük cümle, alanlarına göre kümelenmiş dört sütun */}
                <section className="specialties" id="projects">
                    <div className="specialties-top">
                        <div>
                            <p className="specialties-eyebrow">Tüm projelerim</p>
                            <h2 className="specialties-statement">
                                Veriyle başlayan her problemi, şirketlerin her gün kullandığı yapay zekâ çözümlerine
                                dönüştürüyorum.
                            </h2>
                        </div>
                        <IdeaIllustration className="specialties-illustration" />
                    </div>
                    <ul className="specialties-grid">
                        {SPECIALTIES.map((sp) => (
                            <li className="specialty" key={sp.name}>
                                <h3 className="specialty-name">{sp.name}</h3>
                                <p className="specialty-desc">{sp.desc}</p>
                                <ul className="specialty-tags">
                                    {sp.projects.map((p) => (
                                        <li key={p.label}>
                                            {p.href?.startsWith('/') ? (
                                                <Link to={p.href}>{p.label}</Link>
                                            ) : p.href ? (
                                                <a href={p.href} target="_blank" rel="noopener noreferrer">{p.label}</a>
                                            ) : (
                                                p.label
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Deneyimlerim: yol haritası gibi. Üstte başlık ve altında kısa özet (aynı
                    hizada); altta soldan sağa tıklanabilir duraklar. */}
                <section className="roadmap" id="experience" ref={roadmapRef}>
                    <div className="roadmap-top">
                        <div className="roadmap-head">
                            <h2 className="roadmap-title">Deneyimlerim</h2>
                            <p className="roadmap-summary">
                                Görüntü işlemeyle başlayan yolum, belge işleme ve RAG üzerinden bugün bir holdingin uçtan uca
                                veri ve yapay zekâ platformuna uzandı. Her durakta bir öncekinin üstüne koyarak ilerliyorum.
                            </p>
                        </div>
                        <HandsIllustration className="roadmap-illustration" />
                    </div>

                    {/* duraklara tıklanır; seçilen durakta ne yaptığım altta anlatılır */}
                    <ol className="roadmap-line" role="tablist" aria-label="Deneyimler">
                        {ROADMAP.map((step, i) => (
                            <li
                                key={step.label}
                                className={`roadmap-step${i === stepIndex ? ' is-selected' : ''}${step.next ? ' is-next' : ''}${i === stepIndex && autoPlay && roadmapVisible ? ' is-auto' : ''}`}
                                style={{ '--step-ms': `${ROADMAP_STEP_MS}ms` } as CSSProperties}
                            >
                                <button
                                    type="button"
                                    role="tab"
                                    id={`roadmap-tab-${i}`}
                                    aria-selected={i === stepIndex}
                                    aria-controls="roadmap-detail"
                                    className="roadmap-hit"
                                    onClick={() => {
                                        setAutoPlay(false);
                                        setStepIndex(i);
                                    }}
                                >
                                    <span className="roadmap-pill">{step.label}</span>
                                    <span className="roadmap-dot" aria-hidden="true" />
                                    <span className="roadmap-role">{step.role}</span>
                                    <span className="roadmap-when">{step.when}</span>
                                </button>
                            </li>
                        ))}
                    </ol>

                    <div className="roadmap-detail" id="roadmap-detail" role="tabpanel" aria-labelledby={`roadmap-tab-${stepIndex}`} key={stepIndex}>
                        <div className="roadmap-detail-meta">
                            <p className="roadmap-detail-org">{ROADMAP[stepIndex].org}</p>
                            <p className="roadmap-detail-role">{ROADMAP[stepIndex].role} · {ROADMAP[stepIndex].when}</p>
                        </div>
                        <div>
                            <p className="roadmap-detail-text">{ROADMAP[stepIndex].text}</p>
                            {ROADMAP[stepIndex].next ? (
                                <a
                                    href="#contact"
                                    className="roadmap-detail-link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    İletişime geç →
                                </a>
                            ) : (
                                <ul className="roadmap-detail-items">
                                    {ROADMAP[stepIndex].items.map((it) => <li key={it}>{it}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                </section>

                <section className="about" id="contact">
                    <div className="about-text">
                        <p>
                            Merhaba, ben <strong>Talha Kaya</strong>. Sakarya Üniversitesi'nde Bilgisayar Mühendisliği
                            okuyorum ve <strong>Data Scientist &amp; Machine Learning Engineer</strong> olarak çalışıyorum. Ham
                            veriyi toplayıp düzenliyor; ondan içgörü, tahmin ve gerçekten kullanılan yapay zekâ çözümleri
                            üretiyorum. Veri hatlarından makine öğrenmesi modellerine, görüntü işlemeden LLM ve agent tabanlı
                            sistemlere kadar işin her aşamasında çalışıyorum. Odağım hep aynı: karmaşık problemleri anlaşılır,
                            güvenilir ve sürdürülebilir çözümlere dönüştürmek.
                        </p>

                        <SocialDock />
                    </div>

                    <ContactForm />
                </section>
            </main>

            <SiteFooter />
        </>
    );
};

export default Home;
