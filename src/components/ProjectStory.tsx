import type { CSSProperties } from 'react';
import { TECH_COLORS, TECH_ICONS } from './techIcons';

/* "Aktif kullanılan projelerim": her proje bir satır. Bir yanda yazı, öbür
   yanda projenin mimari şeması; şemadaki kutularda kullanılan teknolojilerin
   logoları var. Satırlar sırayla yazı solda, sağda, solda olacak şekilde
   dizilir; şemanın köşesinde proje numarası durur. */

// logosu olmayan teknolojiler için sade çizgi ikonlar
const G = {
    db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
    sheet: 'M4 4h16v16H4zM4 10h16M4 15h16M10 4v16',
    doc: 'M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 16.5h4',
    flow: 'M4 7h10M10 3l4 4-4 4M20 17H10M14 13l-4 4 4 4',
    box: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9',
    table: 'M4 5h16v14H4zM4 10h16M10 10v9',
    book: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11',
    shield: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z',
    key: 'M15 3a6 6 0 1 1-5.6 8.2L3 17.5V21h3.5v-2h2v-2h2l1.3-1.3A6 6 0 0 1 15 3zM16.5 7.5h.01',
    chat: 'M4 5h16v11H9l-4 3.5V16H4z',
    hub: 'M12 4v4M12 16v4M4 12h4M16 12h4M9 9h6v6H9z',
    plug: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4',
    link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
    cube: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
    eye: 'M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
    scan: 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M7 12h10',
    text: 'M5 6h14M5 10h14M5 14h10M5 18h7',
    globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z',
    brain: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4z',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    tag: 'M3.5 12.5v-8h8l9 9-8 8zM8 8h.01',
};

// logosu olmayan ikonların renkleri
const G_COLORS: Record<keyof typeof G, string> = {
    db: '#3b82f6', sheet: '#21a366', doc: '#e5484d', flow: '#1a8cff', box: '#12a594',
    table: '#4b9fd5', book: '#7c5cff', shield: '#e5734a', key: '#f5b100', chat: '#10a37f',
    hub: '#8b5cf6', plug: '#f59e0b', link: '#06b6d4', cube: '#6366f1', search: '#ec4899',
    eye: '#f97316', scan: '#e5734a', text: '#94a3b8', globe: '#14b8a6', brain: '#a855f7', check: '#22c55e', tag: '#f472b6',
};

// logo: simple-icons çizimi; img: projenin kendi GitHub'ından alınan logo (public/icons/tech)
// repo: teknolojinin GitHub deposu (sahip/ad); varsa kutucuk oraya bağlanır
type Node = { name: string; repo?: string; logo?: keyof typeof TECH_ICONS; img?: string; emoji?: string; icon?: keyof typeof G };
type Stage = { label: string; nodes: Node[]; layers?: boolean };
type Project = {
    org: string;
    title: string;
    text: string;
    ask: string;
    stages: Stage[];
    band: { label: string; nodes: Node[] };
};

const PROJECTS: Project[] = [
    {
        org: 'İhlas Holding, 2026',
        title: 'Kurumsal Data Lakehouse',
        text: 'İştiraklerin veritabanı, Excel ve PDF belgeleri SeaTunnel ile otomatik çekiliyor, Airflow ile düzenli olarak işleniyor. Veri SeaweedFS üzerindeki Iceberg tablolarında Bronze, Silver ve Gold katmanlarından geçerek temizleniyor ve dbt ile modelleniyor. Trino ile tek yerden sorgulanıyor, OpenMetadata ile hangi verinin nerede olduğu kataloglanıyor; Keycloak ve Ranger sayesinde herkes yalnızca rolünün izin verdiği veriyi görüyor.',
        ask: 'Kurumsal Data Lakehouse',
        stages: [
            { label: 'Kaynaklar', nodes: [{ name: 'Veritabanları', icon: 'db' }, { name: 'Excel', img: 'excel.svg' }, { name: 'PDF belgeler', img: 'pdf.svg' }] },
            { label: 'Veri alımı', nodes: [{ name: 'SeaTunnel CDC', repo: 'apache/seatunnel', img: 'seatunnel' }, { name: 'Airflow', repo: 'apache/airflow', logo: 'apacheairflow' }] },
            { label: 'Depolama', nodes: [{ name: 'SeaweedFS', repo: 'seaweedfs/seaweedfs', img: 'seaweedfs' }, { name: 'Iceberg', repo: 'apache/iceberg', img: 'iceberg' }, { name: 'dbt', repo: 'dbt-labs/dbt', logo: 'dbt' }], layers: true },
            { label: 'Sorgu', nodes: [{ name: 'Trino', repo: 'trinodb/trino', logo: 'trino' }, { name: 'Polaris katalog', repo: 'apache/polaris', img: 'polaris' }] },
        ],
        band: { label: 'Yönetişim ve güvenlik', nodes: [{ name: 'OpenMetadata', repo: 'open-metadata/OpenMetadata', img: 'openmetadata' }, { name: 'Keycloak', repo: 'keycloak/keycloak', logo: 'keycloak' }, { name: 'Ranger', repo: 'apache/ranger', img: 'ranger' }] },
    },
    {
        org: 'İhlas Holding, 2026',
        title: 'Kurumsal AI Agent Platformu',
        text: "Lakehouse'taki veri buradaki agent'lara akıyor. Şirketteki herkes takip ettiği KPI'lara göre kendi agent'ını kurup kişiselleştirebiliyor. Agent'lar LangGraph ile çalışıyor, MCP üzerinden Trino, Cube ve belge arama araçlarına bağlanıyor; veriyi analiz edip grafiği sohbette çiziyor ve Superset panolarına kaydediyor. Her işlemi kullanıcının kendi yetkisiyle yapıyor, Langfuse ile her adım izleniyor.",
        ask: 'Kurumsal AI Agent Platformu',
        stages: [
            { label: 'Sohbet', nodes: [{ name: 'LibreChat', repo: 'LibreChat-AI/LibreChat', img: 'librechat' }] },
            { label: 'Model geçidi', nodes: [{ name: 'LiteLLM', repo: 'BerriAI/litellm', emoji: '🚅' }] },
            { label: 'Agent', nodes: [{ name: 'LangGraph', repo: 'langchain-ai/langgraph', logo: 'langgraph' }, { name: 'A2A', repo: 'a2aproject/A2A', icon: 'link' }] },
            { label: 'Araçlar (MCP)', nodes: [{ name: 'ContextForge', repo: 'IBM/mcp-context-forge', img: 'contextforge' }, { name: 'Trino', repo: 'trinodb/trino', logo: 'trino' }, { name: 'Cube', repo: 'cube-js/cube', img: 'cube' }, { name: 'WeKnora RAG', repo: 'Tencent/WeKnora', icon: 'search' }] },
            { label: 'Sonuç', nodes: [{ name: 'Superset', repo: 'apache/superset', logo: 'apachesuperset' }] },
        ],
        band: { label: 'İzleme', nodes: [{ name: 'Langfuse', repo: 'langfuse/langfuse', img: 'langfuse' }] },
    },
    {
        org: 'Arvasis, 2025',
        title: 'Çok Dilli Belge OCR',
        text: "Reçetelerin hangi dilde yazıldığını kelime düzeyinde bulan bir sistem. 65 dilin her birinden 500'e yakın kelimeyle sentetik veri ürettim ve YOLOv11m nesne tespiti modelini bu veriyle eğittim; model kelimeleri birer nesne gibi bulup dillerini tespit ediyor. Tüm sayfayı OCR ile okumak çok uzun süreceği için dil tespitini nesne tespitiyle yaptım, böylece çok daha hızlı. 65 dilde %85 üzeri doğrulukla çalışıyor ve bir ilaç fabrikası hâlâ aktif olarak kullanıyor.",
        ask: 'Çok Dilli Belge OCR ve Dil Tespiti',
        stages: [
            { label: 'Girdi', nodes: [{ name: 'Reçete görseli', icon: 'doc' }] },
            { label: 'Ön işleme', nodes: [{ name: 'OpenCV', repo: 'opencv/opencv', logo: 'opencv' }] },
            { label: 'Dil tespiti', nodes: [{ name: 'YOLOv11m nesne tespiti', repo: 'ultralytics/ultralytics', logo: 'yolo' }] },
            { label: 'Çıktı', nodes: [{ name: 'Kelimeler ve dilleri', icon: 'globe' }] },
        ],
        band: { label: 'Eğitim', nodes: [{ name: 'Sentetik veri: 65 dil, dil başına yaklaşık 500 kelime', icon: 'text' }, { name: 'Python', repo: 'python/cpython', logo: 'python' }] },
    },
];

const NodeIcon = ({ n }: { n: Node }) =>
    n.img ? (
        <img src={`/icons/tech/${n.img.includes('.') ? n.img : `${n.img}.png`}`} alt="" className="ps-node-img" loading="lazy" />
    ) : n.emoji ? (
        <span className="ps-node-emoji" aria-hidden="true">{n.emoji}</span>
    ) : n.logo ? (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={TECH_ICONS[n.logo]} /></svg>
    ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={G[n.icon ?? 'box']} />
        </svg>
    );

const nodeColor = (n: Node): CSSProperties => {
    if (n.logo) {
        const c = TECH_COLORS[n.logo];
        return { '--c': c.c, '--cd': c.d ?? c.c } as CSSProperties;
    }
    const c = G_COLORS[n.icon ?? 'box'];
    return { '--c': c, '--cd': c } as CSSProperties;
};

const Chip = ({ n }: { n: Node }) =>
    n.repo ? (
        <a
            className="ps-node is-link"
            style={nodeColor(n)}
            href={`https://github.com/${n.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`${n.name} GitHub deposu`}
        >
            <NodeIcon n={n} />
            {n.name}
        </a>
    ) : (
        <span className="ps-node" style={nodeColor(n)}>
            <NodeIcon n={n} />
            {n.name}
        </span>
    );

// yol çizgisindeki noktaların sırayla yandığı renkler
const DOT_COLORS = ['#7c5cff', '#1f63f0', '#12a594', '#f5b100', '#e5734a', '#ec4899'];

const Diagram = ({ p }: { p: Project }) => (
    <figure className="ps-diagram" aria-label={`${p.title} mimari şeması`}>
        <div className="ps-flow" style={{ '--n': p.stages.length } as CSSProperties}>
            {/* çizgi boyunca sırayla akan renkli ışık */}
            <span className="ps-pulse" aria-hidden="true" />
            {p.stages.map((st, i) => (
                <div className="ps-col-wrap" key={st.label} style={{ '--i': i, '--dc': DOT_COLORS[i % DOT_COLORS.length] } as CSSProperties}>
                    <div className="ps-col">
                        <p className="ps-col-label">{st.label}</p>
                        <div className="ps-col-nodes">
                            {st.nodes.map((n) => <Chip n={n} key={n.name} />)}
                        </div>
                        {st.layers && (
                            <p className="ps-layers">
                                <span className="ps-l-bronze">Bronze</span>
                                <span className="ps-l-silver">Silver</span>
                                <span className="ps-l-gold">Gold</span>
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
        <div className="ps-band">
            <p className="ps-col-label">{p.band.label}</p>
            {p.band.nodes.map((n) => <Chip n={n} key={n.name} />)}
        </div>
    </figure>
);

// Projeler alt alta; her proje bir satır, yazı sırayla solda, sağda, solda.
// Yazının arkasında büyük numara, öbür yanda yukarıdan aşağı akan şema.
const ProjectStory = ({ onAsk }: { onAsk: (title: string) => void }) => (
    <div className="ps-rows">
        {PROJECTS.map((p, i) => (
            <article className={`ps-row${i % 2 === 1 ? ' is-flip' : ''}`} key={p.title}>
                <div className="ps-copy">
                    {/* büyük, aşağı doğru saydamlaşan proje numarası */}
                    <span className="ps-bignum" aria-hidden="true">{i + 1}</span>
                    <p className="ps-step">{p.org}</p>
                    <h3 className="ps-title">{p.title}</h3>
                    <p className="ps-text">{p.text}</p>
                    <button type="button" className="ps-ask" onClick={() => onAsk(p.ask)}>
                        <span className="ps-ask-text">makapakaya sor</span>
                        <span className="btn-icon" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8.75 6.75h8.5v8.5M17.25 6.75 7 17" />
                            </svg>
                        </span>
                    </button>
                </div>
                <Diagram p={p} />
            </article>
        ))}
    </div>
);

export default ProjectStory;
