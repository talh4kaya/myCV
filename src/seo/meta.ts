import { readings } from '../data/readings';
import { portfolioData } from '../data/portfolio';

// Sitedeki her sayfanın başlık/açıklama/canonical bilgisi tek yerde.
// Hem build sırasında (build/sitePlugin.ts her rota için ayrı HTML üretir,
// sitemap.xml'i yazar) hem de tarayıcıda (RouteMeta, sayfa değişince <head>'i
// günceller) kullanılır. Yeni bir sayfa/rota eklersen buraya da ekle.

export const SITE_URL = 'https://talhakaya.net';
export const SITE_NAME = 'Talha Kaya';
export const DEFAULT_IMAGE = '/me.png';

export type PageMeta = {
    path: string;
    title: string;
    description: string;
    image?: string;
    imageAlt?: string;
    type: 'website' | 'article' | 'profile';
    noindex?: boolean;
    jsonLd?: Record<string, unknown>[];
};

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

// Arama sonuçlarında kesilmesin diye ~155 karakter, kelime ortasında bölmeden
export const truncate = (text: string, max = 155) => {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    const cut = clean.slice(0, max - 1);
    return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};

const PERSON_ID = `${SITE_URL}/#person`;

const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Talha Kaya',
    alternateName: 'talh4kaya',
    jobTitle: 'Data Scientist & Machine Learning Engineer',
    description:
        'Sakarya Üniversitesi Bilgisayar Mühendisliği öğrencisi, TEKNOFEST finalisti, Data League Türkiye 2.si. Computer Vision, LLM, RAG ve tabular data alanlarında çalışıyor.',
    url: SITE_URL,
    image: absoluteUrl(DEFAULT_IMAGE),
    sameAs: [
        'https://www.linkedin.com/in/talha-kaya-aa5255340',
        'https://github.com/talh4kaya',
        'https://www.kaggle.com/talh4kaya',
    ],
    email: 'mailto:talh4kaya@gmail.com',
    knowsAbout: ['Machine Learning', 'Data Science', 'Computer Vision', 'Large Language Models', 'RAG', 'Python', 'PyTorch'],
    alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Sakarya Üniversitesi',
    },
};

const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Talha Kaya',
    url: SITE_URL,
    inLanguage: 'tr-TR',
    author: { '@id': PERSON_ID },
};

const breadcrumb = (items: { name: string; path: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: absoluteUrl(item.path),
    })),
});

const HOME: PageMeta = {
    path: '/',
    title: 'Talha Kaya | Data Scientist & Machine Learning Engineer',
    description:
        'Talha Kaya — Sakarya Üniversitesi Bilgisayar Mühendisliği öğrencisi, Data Scientist ve ML Engineer. TEKNOFEST finalisti; Computer Vision, LLM ve RAG projeleri.',
    type: 'profile',
    imageAlt: 'Talha Kaya',
    jsonLd: [personJsonLd, websiteJsonLd],
};

const COMPETITIONS: PageMeta = {
    path: '/yarismalarim',
    title: 'Yarışmalarım: TEKNOFEST, Data League, GFAST | Talha Kaya',
    description:
        'TEKNOFEST Sağlıkta Yapay Zeka finalisti, Data League Türkiye 2.si, GFAST ve HSD Ideathon 2.si. Talha Kaya’nın katıldığı yapay zeka ve veri bilimi yarışmaları.',
    type: 'website',
    jsonLd: [breadcrumb([{ name: 'Ana Sayfa', path: '/' }, { name: 'Yarışmalarım', path: '/yarismalarim' }])],
};

const BLOG: PageMeta = {
    path: '/blog',
    title: 'Blog: Yapay Zeka Makale İncelemeleri | Talha Kaya',
    description:
        'LLM ajanları, multi-agent simülasyon, uzun bağlamlı transformer ve knowledge distillation üzerine okuduğum makalelerin Türkçe incelemeleri ve notlarım.',
    type: 'website',
    jsonLd: [
        {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Talha Kaya Blog',
            url: absoluteUrl('/blog'),
            inLanguage: 'tr-TR',
            author: { '@id': PERSON_ID },
            blogPost: readings.map((r) => ({
                '@type': 'BlogPosting',
                headline: r.title,
                url: absoluteUrl(`/blog/${r.id}`),
            })),
        },
        breadcrumb([{ name: 'Ana Sayfa', path: '/' }, { name: 'Blog', path: '/blog' }]),
    ],
};

const blogPostMeta = (r: (typeof readings)[number]): PageMeta => {
    const path = `/blog/${r.id}`;
    const description = truncate(r.excerpt);
    return {
        path,
        title: `${r.title} | Talha Kaya Blog`,
        description,
        image: r.image,
        imageAlt: r.title,
        type: 'article',
        jsonLd: [
            {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: r.title.slice(0, 110),
                description,
                url: absoluteUrl(path),
                mainEntityOfPage: absoluteUrl(path),
                inLanguage: 'tr-TR',
                image: r.image ? absoluteUrl(r.image) : absoluteUrl(DEFAULT_IMAGE),
                keywords: r.tags.join(', '),
                author: { '@type': 'Person', '@id': PERSON_ID, name: 'Talha Kaya', url: SITE_URL },
                publisher: { '@type': 'Person', '@id': PERSON_ID, name: 'Talha Kaya' },
                citation: r.url,
            },
            breadcrumb([
                { name: 'Ana Sayfa', path: '/' },
                { name: 'Blog', path: '/blog' },
                { name: r.title, path },
            ]),
        ],
    };
};

const projectMeta = (p: (typeof portfolioData.projects)[number]): PageMeta => {
    const path = `/project/${p.id}`;
    const name = p.name.split('(')[0].trim();
    return {
        path,
        title: `${name} | Talha Kaya Projeler`,
        description: truncate(p.desc),
        type: 'article',
        jsonLd: [
            {
                '@context': 'https://schema.org',
                '@type': 'CreativeWork',
                name,
                description: truncate(p.desc),
                url: absoluteUrl(path),
                keywords: p.tech.join(', '),
                author: { '@id': PERSON_ID },
            },
        ],
    };
};

export const NOT_FOUND: PageMeta = {
    path: '/404',
    title: 'Sayfa bulunamadı | Talha Kaya',
    description: 'Aradığın sayfa bulunamadı.',
    type: 'website',
    noindex: true,
};

export const getAllPages = (): PageMeta[] => [
    HOME,
    COMPETITIONS,
    BLOG,
    ...readings.map(blogPostMeta),
    ...portfolioData.projects.map(projectMeta),
];

export const getPageMeta = (pathname: string): PageMeta => {
    const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    return getAllPages().find((p) => p.path === normalized) ?? NOT_FOUND;
};
