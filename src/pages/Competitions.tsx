import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/sections/SiteHeader';
import SiteFooter from '../components/sections/SiteFooter';

type Competition = {
    slug: string;
    title: string;
    sub: string;
    what: string;
    why: string;
    how: string;
    result: string;
};

const competitions: Competition[] = [
    {
        slug: 'teknofest',
        title: 'TEKNOFEST Finalisti',
        sub: 'Sağlıkta Yapay Zeka, Mutasyon Tahmini',
        what: 'Dört farklı hastalık paneli için DNA dizilerindeki tek nükleotid varyantlarını sınıflandıran makine öğrenmesi modelleri geliştirdik.',
        why: 'Genetik varyantların klinik yorumlanması uzmanlık ve zaman gerektiriyor, bu süreci otomatikleştiren açıklanabilir bir karar destek aracı oluşturmak istedik.',
        how: 'LightGBM, XGBoost ve CatBoost ile ensemble yaklaşım kurduk; Optuna ile hiperparametre optimizasyonu, SHAP ile model açıklanabilirliği ve iki aşamalı karar eşiği stratejisi uyguladık.',
        result: 'Dört panelde 0.93–0.97 AUPRC skoru elde ettik ve TEKNOFEST Sağlıkta Yapay Zeka finaline kalmayı başardık.',
    },
    {
        slug: 'dataleague',
        title: 'Data League',
        sub: 'Üniversiteler Arası Data Yarışması',
        what: '5 milyondan fazla sosyal medya postunda koordineli bot ağlarını ve yapay gündem oluşturma faaliyetlerini tespit eden denetimsiz bir sistem geliştirdik.',
        why: 'Sosyal medyadaki koordineli dezenformasyon kampanyaları kamuoyu algısını manipüle ettiğinden bu tür ağları etiketli veri gerektirmeden yakalamak istedik.',
        how: 'Isolation Forest algoritmasına TF-IDF tabanlı kampanya hafızası entegre ettik; 31 metin özelliği, çok dilli doğallık analizi ve AI içerik tespitiyle açıklanabilir bir mimari kurduk.',
        result: 'Türkiye genelinde üniversiteler arası yarışmada Türkiye 2. sırasını elde ettik.',
    },
    {
        slug: 'gfast',
        title: 'GFAST',
        sub: 'Girişimcilik Yarışması',
        what: 'Üretim makinelerinin arızasını önceden tahmin eden, sanayi odaklı bir kestirimci bakım sistemi tasarladık.',
        why: 'Reaktif bakım anlayışı yüksek maliyet ve üretim kaybına yol açıyor; makine öğrenmesiyle arızaları önceden tespit eden proaktif bir çözüm sunmak istedik.',
        how: 'Sensör akışlarından anomali tespiti yapan ML modelleri geliştirdik; iş modelini sanayi paydaşlarıyla doğrulayarak girişimcilik çerçevesinde sunduk.',
        result: 'Yarışmayı 2. sırada tamamladık ve projeyi gerçek sanayi ortaklarına sunma fırsatı bulduk.',
    },
    {
        slug: 'tubitak',
        title: 'TÜBİTAK 2209-A',
        sub: 'Federe Öğrenme ile Veri Gizliliği',
        what: 'Veriyi merkezde toplamadan model eğitmeyi mümkün kılan, federe öğrenme (federated learning) temelli bir veri gizliliği projesi hazırlayıp sunduk.',
        why: 'Sağlık ve finans gibi alanlarda veriler kurum dışına çıkamıyor; bu da ortak model eğitimini imkansız hale getiriyor. Veriyi yerinde bırakıp yalnızca öğrenmeyi paylaşan bir yaklaşımı denemek istedik.',
        how: 'Model kullanıcı cihazlarında/kurum içinde eğitilip yalnızca model güncellemeleri merkezde birleştiriliyor; ham veri hiçbir zaman paylaşılmıyor. Bu mimariyi kurgulayıp doğruluk ile gizlilik arasındaki dengeyi inceledik.',
        result: 'Projeyi TÜBİTAK 2209-A kapsamında sunduk.',
    },
    {
        slug: 'hsd',
        title: 'HSD Ideathon',
        sub: 'Fikir & Prototip Yarışması',
        what: 'Doğal afet koordinasyonunu iyileştirmeye yönelik bir yazılım fikri geliştirip çalışan bir prototipe dönüştürdük.',
        why: 'Afet anında kuruluşlar arası veri iletişim kopukluğu müdahale süresini uzatıyor, bu sorunu çözen akıllı bir koordinasyon katmanı tasarlamak istedik.',
        how: 'Kullanıcı araştırması, hızlı prototipleme ve ekip sunumu aşamalarını kısa sürede tamamlayarak fikri somut bir demo ürüne taşıdık.',
        result: "HSD Ideathon'da 2. sırayı elde ettik.",
    },
    {
        slug: 'kaggle',
        title: 'Kaggle',
        sub: 'Veri Bilimi Yarışmaları',
        what: "Farklı alanlarda gerçek dünya veri setleriyle çok sayıda yarışmaya katıldım ve aktif olarak katılmaya devam ediyorum.",
        why: 'Farklı problem türlerinde pratik deneyim kazanmak, yeni teknikleri hızla denemek ve küresel veri bilimcilerle rekabet ederek kendimi ölçmek istedim.',
        how: "EDA, feature engineering, model seçimi ve ensemble yöntemlerini sistematik biçimde uygulayarak çözümler geliştirdim; public kernel'larla topluluğa katkı sağladım.",
        result: 'Süregelen aktif katılım; her yarışmada portföye ve teknik birikime somut katkı sağlamaya çalışıyorum.',
    },
    {
        slug: 'btk',
        title: 'BTK Akademi 2026 Hackathon',
        sub: 'AjanPazar × FitAI',
        what: 'Kullanıcının seçtiği ürünü kişiliğiyle uyumlu mu diye analiz eden, stil ve beden tavsiyesi veren, Gemini API destekli bir dolap/stil danışmanı web uygulaması geliştirdik.',
        why: 'Online alışverişte doğru bedeni ve tarzı seçmek zor; ürün yorumlarından ve açıklamasından anlamlı öneri çıkaran akıllı bir asistan eksikliğini gidermek istedik.',
        how: 'Gemini API ile ürün açıklamalarını ve kullanıcı yorumlarını analiz ederek beden önerisi çıkaran, kullanıcının stil tercihiyle ürünü eşleştiren bir kullanıcı arayüzü tasarladık.',
        result: "BTK Akademi 2026 Hackathon'unda AjanPazar × FitAI projesiyle takım olarak yer aldık.",
    },
];

const Competitions = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <SiteHeader />

            <main>
                <section className="comp-hero">
                    <Link to="/" className="comp-hero-back">← Anasayfa</Link>
                    <h1>Yarışmalarım</h1>
                    <p className="comp-hero-sub">
                        Üniversite hayatım boyunca katıldığım yapay zeka, veri bilimi ve yazılım geliştirme yarışmaları.
                    </p>
                </section>

                <section className="comp-rows">
                    {competitions.map((c) => (
                        <div className={`testimonial comp-row-${c.slug}`} key={c.slug}>
                            <div className="exp-meta">
                                <h3>{c.title}</h3>
                                <p className="exp-sub">{c.sub}</p>
                            </div>
                            <div className="testimonial-body comp-detail">
                                <p><strong>Ne Yaptık:</strong> {c.what}</p>
                                <p><strong>Neden Yaptık:</strong> {c.why}</p>
                                <p><strong>Nasıl Yaptık:</strong> {c.how}</p>
                                <p><strong>Sonuçlar:</strong> {c.result}</p>
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            <SiteFooter />
        </>
    );
};

export default Competitions;
