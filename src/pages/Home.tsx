import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SiteHeader from '../components/sections/SiteHeader';
import SiteFooter from '../components/sections/SiteFooter';
import MakapakaCard from '../components/MakapakaCard';
import ContactForm from '../components/sections/ContactForm';

const Home = () => {
    const location = useLocation();

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

            <main>
                <section className="hero">
                    <div className="hero-title-wrap">
                        {/* {' '} — mobilde <br> gizlendiğinde kelimeler birleşmesin */}
                        <h1>
                            I'm Talha Kaya, Data Scientist and{' '}<br />
                            Machine Learning Engineer. I work{' '}<br />
                            across tabular data, computer vision,{' '}<br />
                            LLMs, and RAG, and automate all of it.
                        </h1>
                    </div>

                    <p className="slots">Yeni<strong> projeler</strong> için müsaitim.</p>

                    <div className="hero-buttons">
                        <a
                            href="#contact"
                            className="btn btn-primary"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            İletişime Geç <span className="arrow">↗</span>
                        </a>
                        <a
                            href="#projects"
                            className="btn btn-secondary"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Örnek Projelerim
                        </a>
                    </div>
                </section>

                <section className="project-grid" id="projects">
                    <article className="project-card">
                        <Link to="/yarismalarim" className="project-thumb project-thumb-comp">
                            <img src="/cartoon-podium.svg" alt="" className="card-corner-icon" />
                            <div className="comp-preview-list">
                                <div className="comp-preview-row">
                                    <img src="/icons/teknofest-logo.png" alt="" className="comp-preview-logo" />
                                    <div className="comp-preview-text">
                                        <span className="comp-preview-name">TEKNOFEST</span>
                                        <span className="comp-preview-desc">Sağlıkta Yapay Zeka</span>
                                    </div>
                                    <span className="comp-preview-result">Finalist</span>
                                </div>
                                <div className="comp-preview-row">
                                    <img src="/icons/dataleague-logo.png" alt="" className="comp-preview-logo" />
                                    <div className="comp-preview-text">
                                        <span className="comp-preview-name">Data League</span>
                                        <span className="comp-preview-desc">Bot Ağı Tespiti</span>
                                    </div>
                                    <span className="comp-preview-result">Türkiye 2.</span>
                                </div>
                                <div className="comp-preview-row">
                                    <img src="/icons/gfast-logo.png" alt="" className="comp-preview-logo" />
                                    <div className="comp-preview-text">
                                        <span className="comp-preview-name">GFAST</span>
                                        <span className="comp-preview-desc">Kestirimci Bakım</span>
                                    </div>
                                    <span className="comp-preview-result">2.</span>
                                </div>
                                <div className="comp-preview-row">
                                    <img src="/icons/hsd-ideathon-logo.png" alt="" className="comp-preview-logo" />
                                    <div className="comp-preview-text">
                                        <span className="comp-preview-name">HSD Ideathon</span>
                                        <span className="comp-preview-desc">Afet Koordinasyonu</span>
                                    </div>
                                    <span className="comp-preview-result">2.</span>
                                </div>
                                <div className="comp-preview-row">
                                    <img src="/icons/kaggle-logo.png" alt="" className="comp-preview-logo" />
                                    <div className="comp-preview-text">
                                        <span className="comp-preview-name">Kaggle</span>
                                        <span className="comp-preview-desc">Veri Bilimi Yarışmaları</span>
                                    </div>
                                    <span className="comp-preview-result"></span>
                                </div>
                            </div>
                            <div className="comp-card-footer">
                                <span className="project-caption">Katıldığım Yarışmalar</span>
                                <span className="comp-card-arrow">→</span>
                            </div>
                        </Link>
                    </article>

                    <article className="project-card">
                        <MakapakaCard />
                    </article>

                    <article className="project-card">
                        <div className="project-thumb thumb-3 project-thumb-split">
                            <img src="/abacus-toy.svg" alt="" className="card-corner-icon" />
                            <div className="split-block">
                                <div className="split-head">
                                    <h4>Mangala AI</h4>
                                    <p className="split-sub">Reinforcement Learning · AlphaZero &amp; Transformer</p>
                                </div>
                                <p className="split-desc">
                                    ResNet yerine Transformer Encoder mimarisi ve Monte Carlo Tree Search (MCTS) kullanarak Mangala oyunu için sıfırdan bir AlphaZero ajanı geliştirdim; self-play yöntemiyle kendi kendine öğrenen model, geleneksel PPO ajanını 32-16 mağlup ederek dizilim bazlı strateji oyunlarında Attention mekanizmasının üstünlüğünü kanıtladı.
                                </p>
                                <div className="split-tags">
                                    <span>PyTorch</span><span>AlphaZero</span><span>Transformer</span><span>Self Play</span>
                                </div>
                            </div>
                            <div className="split-divider"></div>
                            <div className="split-block">
                                <div className="split-head">
                                    <h4>TEKNOFEST</h4>
                                    <p className="split-sub">Sağlıkta Yapay Zeka · Mutasyon Tahmini</p>
                                </div>
                                <p className="split-desc">
                                    Genetik varyantların klinik yorumlanmasını otomatikleştiren bir karar destek aracı geliştirmek amacıyla; LightGBM, XGBoost ve CatBoost algoritmalarını Optuna optimizasyonu, SHAP açıklanabilirliği ve iki aşamalı karar eşiğiyle birleştiren bir ensemble modeli kurguladık. Dört farklı hastalık panelinde 0.93–0.97 AUPRC skoru elde eden proje, TEKNOFEST Sağlıkta Yapay Zeka yarışmasında finale kalmaya hak kazandı.
                                </p>
                                <div className="split-tags">
                                    <span>LightGBM</span><span>XGBoost</span><span>SHAP</span><span>Optuna</span>
                                </div>
                            </div>
                            <p className="split-title">Data Science Projelerim</p>
                        </div>
                    </article>

                    <article className="project-card">
                        <div className="project-thumb thumb-2 project-thumb-split">
                            <img src="/cartoon-notebook-cluttered.svg" alt="" className="card-corner-icon" />
                            <div className="split-block">
                                <div className="split-head">
                                    <h4>DPolitic</h4>
                                    <p className="split-sub">LLM Tabanlı Çok Ajanlı Siyasi Simülasyon</p>
                                </div>
                                <p className="split-desc">
                                    6 farklı siyasi profil ve 20 halk tipini simüle eden, tamamen yerel Llama ile çalışan çok ajanlı
                                    siyasi simülasyon motoru. Tamamen otonom çalışan ve isteğe bağlı kullanıcı müdahalesi modu sunan bu yapıyla modellerin gerçek dünyayı ne kadar iyi simüle edebildiğini inceledim.
                                </p>
                                <div className="split-tags">
                                    <span>Python</span><span>FastAPI</span><span>Llama</span><span>Multi Agent</span>
                                </div>
                            </div>
                            <div className="split-divider"></div>
                            <div className="split-block">
                                <div className="split-head">
                                    <h4>Multilingual OCR</h4>
                                    <p className="split-sub">Görüntü İşleme &amp; Dil Tespiti</p>
                                </div>
                                <p className="split-desc">
                                    65 dildeki karmaşık belgelerde mevcut OCR yöntemlerinin yetersiz kaldığını tespit ederek, dil tespiti ve YOLOv11 tabanlı hibrit bir OCR pipeline’ı geliştirdim. Bu yaklaşım ile OCR doğruluğunu %40’tan %85’in üzerine çıkardım.
                                </p>
                                <div className="split-tags">
                                    <span>YOLOv11</span><span>OpenCV</span><span>CNN</span><span>NLP</span>
                                </div>
                            </div>
                            <p className="split-title">LLM · VLM · RAG · OCR</p>
                        </div>
                    </article>
                </section>

                <section className="clients" id="competitions">
                    <p className="section-label">Katıldığım Yarışmalar</p>

                    <div className="testimonial">
                        <div className="exp-meta">
                            <h3>TEKNOFEST Finalisti</h3>
                            <p className="exp-sub">Yapay Zeka &amp; Makine Öğrenmesi</p>
                        </div>
                        <div className="testimonial-body">
                            <p className="quote">
                                "Türkiye'nin en büyük teknoloji festivali TEKNOFEST bünyesinde yapay zeka ve makine öğrenmesi
                                alanında özgün modeller geliştirerek finalistlik derecesi elde ettim."
                            </p>
                        </div>
                    </div>

                    <div className="testimonial">
                        <div className="exp-meta">
                            <h3>Data League</h3>
                            <p className="exp-sub">Veri Bilimi Yarışması</p>
                        </div>
                        <div className="testimonial-body">
                            <p className="quote">
                                "Sosyal medyadaki koordineli dezenformasyon kampanyalarını etiketli veri gereksinimi olmadan tespit etmek amacıyla; Isolation Forest algoritmasını TF-IDF tabanlı kampanya hafızası, 31 metin özelliği, çok dilli doğallık analizi ve AI içerik tespitiyle güçlendiren denetimsiz bir sistem geliştirdik. 5 milyondan fazla postu başarıyla analiz eden bu açıklanabilir mimari ile Üniversiteler Arası Data Yarışması'nda Türkiye 2.liği elde ettik."
                            </p>
                        </div>
                    </div>
                </section>

                <section className="clients" id="experience">
                    <p className="section-label">Deneyimlerim</p>

                    <div className="testimonial">
                        <div className="exp-meta">
                            <h3>Yazılım Mühendisi Stajyeri</h3>
                            <p className="exp-sub">Dijital Varlıklar A.Ş. (2026)</p>
                        </div>
                        <div className="testimonial-body">
                            <p className="quote">
                                "Türkiye Gazetesi'nin dijital arşivi için VLM tabanlı OCR modelleriyle çalıştım. Kurumsal bir
                                yazılım için native RAG yapısı kurdum; PDF ve web verisini otomatik çıkarma, temizleme ve anlamlı
                                parçalara bölme için bir veri işleme pipeline'ı geliştirdim. BGE-M3 ve Qdrant kullanarak 400'den
                                fazla doküman parçasını semantik aramaya hazır hale getirdim; iki katmanlı bir mükerrer tespit
                                algoritmasıyla veri kalitesini artırdım."
                            </p>
                        </div>
                    </div>

                    <div className="testimonial">
                        <div className="exp-meta">
                            <h3>Makine Öğrenmesi Stajyeri</h3>
                            <p className="exp-sub">Arvasis Yazılım Danışmanlık (2025)</p>
                        </div>
                        <div className="testimonial-body">
                            <p className="quote">
                                "Görüntü işleme ve nesne tespiti alanlarında çalıştım. 65 farklı dil için kelime seviyesinde dil
                                tespiti yapabilen bir model geliştirdim. Standart Tesseract'ın yetersiz kaldığı çok dilli belgelerde
                                YOLOv11 ile metin tespiti uygulayarak doğruluk oranını %40'tan %85'in üzerine çıkardım. Gürültü
                                temizleme, perspektif düzeltme ve data augmentation gibi görüntü ön işleme adımlarını uyguladım."
                            </p>
                        </div>
                    </div>
                </section>

                <section className="about" id="contact">
                    <div className="about-text">
                        <p>
                            Merhaba, ben <strong>Talha Kaya</strong>, Sakarya Üniversitesi Bilgisayar Mühendisliği öğrencisi ve
                            veriden değer üreten bir <strong>Data Scientist &amp; Machine Learning Engineer</strong>'ım. Computer
                            vision, RAG mimarileri ve LLM tabanlı sistemler kuruyorum. Arvasis, Dijital Varlıklar, Data League ve{' '}
                            <strong>TEKNOFEST</strong> finalisti olarak yürüttüğüm çalışmalarımda karmaşık problemlere açıklanabilir
                            ve sürdürülebilir çözümler üretmeye odaklanıyorum.
                        </p>

                        <div className="about-social-row">
                            <a
                                href="https://www.linkedin.com/in/talha-kaya-aa5255340"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="LinkedIn"
                                className="about-social-item"
                            >
                                <img src="/icons/linkedin.png" alt="LinkedIn" />
                            </a>
                            <a href="mailto:talh4kaya@gmail.com" title="E-posta" className="about-social-item">
                                <img src="/icons/communication.png" alt="E-posta" />
                            </a>
                            <a
                                href="https://github.com/talh4kaya"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="GitHub"
                                className="about-social-item"
                            >
                                <img src="/icons/github-sign.png" alt="GitHub" />
                            </a>
                            <a
                                href="https://huggingface.co/talh4kaya"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Hugging Face"
                                className="about-social-item"
                            >
                                <img src="/icons/huggingface-icon.png" alt="Hugging Face" />
                            </a>
                            <a
                                href="https://www.kaggle.com/talh4kaya"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Kaggle"
                                className="about-social-item"
                            >
                                <img src="/icons/kaggle-logo.png" alt="Kaggle" />
                            </a>
                        </div>
                    </div>

                    <ContactForm />
                </section>
            </main>

            <SiteFooter />
        </>
    );
};

export default Home;
