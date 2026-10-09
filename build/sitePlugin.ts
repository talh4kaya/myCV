import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import {
    absoluteUrl,
    DEFAULT_IMAGE,
    getAllPages,
    NOT_FOUND,
    SITE_NAME,
    SITE_URL,
    type PageMeta,
} from '../src/seo/meta';
import { securityHeaders } from './securityHeaders';

// Build bittikten sonra çalışır ve SPA'yı arama motorları / sosyal medya
// önizlemeleri için hazırlar:
//  - Her rota için kendi <title>, description, canonical, Open Graph ve
//    JSON-LD'si olan ayrı bir HTML dosyası (dist/blog/<id>.html gibi).
//    Klasör/index.html değil düz .html: Netlify klasörleri sonuna "/" eklenmiş
//    adrese 301 ile yönlendiriyor, bu da canonical adresle çelişiyordu.
//  - 404.html (gerçek 404 durum kodu + noindex; "soft 404" olmasın)
//  - sitemap.xml, robots.txt
//  - _redirects ve _headers (Netlify)

const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

// JSON-LD içinde "</script>" gibi bir dizi script'i erken kapatmasın
const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

export const renderHead = (meta: PageMeta) => {
    const url = absoluteUrl(meta.path);
    const image = absoluteUrl(meta.image ?? DEFAULT_IMAGE);
    const lines = [
        `<title>${escapeHtml(meta.title)}</title>`,
        `<meta name="description" content="${escapeHtml(meta.description)}" />`,
        `<meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
        meta.noindex ? '' : `<link rel="canonical" href="${url}" />`,
        `<meta property="og:type" content="${meta.type}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
        `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
        `<meta property="og:image" content="${image}" />`,
        `<meta property="og:image:alt" content="${escapeHtml(meta.imageAlt ?? SITE_NAME)}" />`,
        `<meta property="og:locale" content="tr_TR" />`,
        `<meta property="og:site_name" content="${SITE_NAME}" />`,
        `<meta name="twitter:card" content="summary" />`,
        `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
        `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
        `<meta name="twitter:image" content="${image}" />`,
        ...(meta.jsonLd ?? []).map((data) => `<script type="application/ld+json">${safeJson(data)}</script>`),
    ];
    return `<!-- seo:start -->\n  ${lines.filter(Boolean).join('\n  ')}\n  <!-- seo:end -->`;
};

const writeFile = (outDir: string, relPath: string, content: string) => {
    const file = path.join(outDir, relPath);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
};

const buildSitemap = (pages: PageMeta[]) => {
    const urls = pages
        .filter((p) => !p.noindex)
        .map((p) => {
            const priority = p.path === '/' ? '1.0' : p.path.split('/').length > 2 ? '0.7' : '0.8';
            return `  <url>\n    <loc>${absoluteUrl(p.path)}</loc>\n    <priority>${priority}</priority>\n  </url>`;
        })
        .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

const buildRobots = () =>
    ['User-agent: *', 'Allow: /', 'Disallow: /.netlify/', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n');

const buildRedirects = (pages: PageMeta[]) => {
    const rewrites = pages
        .filter((p) => p.path !== '/')
        .map((p) => `${p.path}  ${p.path}.html  200`);
    return [
        '# Bu dosya build/sitePlugin.ts tarafından üretilir — elle düzenleme.',
        ...rewrites,
        '',
        '# Bilinmeyen adresler gerçek 404 döner (SPA yine yüklenir, noindex ile).',
        '/*  /404.html  404',
        '',
    ].join('\n');
};

const buildHeaders = () => {
    const global = Object.entries(securityHeaders)
        .map(([key, value]) => `  ${key}: ${value}`)
        .join('\n');
    return [
        '# Bu dosya build/sitePlugin.ts tarafından üretilir — elle düzenleme.',
        '/*',
        global,
        '',
        '# Vite dosya adlarına hash eklediği için uzun süre cache güvenli',
        '/assets/*',
        '  Cache-Control: public, max-age=31536000, immutable',
        '',
    ].join('\n');
};

export const sitePlugin = (): Plugin => {
    let outDir = 'dist';

    return {
        name: 'site-seo-prerender',
        apply: 'build',
        configResolved(config) {
            outDir = path.resolve(config.root, config.build.outDir);
        },
        closeBundle() {
            const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf-8');
            if (!SEO_BLOCK.test(template)) {
                throw new Error('index.html içinde <!-- seo:start --> ... <!-- seo:end --> bloğu bulunamadı');
            }

            const pages = getAllPages();
            for (const page of pages) {
                const html = template.replace(SEO_BLOCK, renderHead(page));
                const file = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`;
                writeFile(outDir, file, html);
            }

            writeFile(outDir, '404.html', template.replace(SEO_BLOCK, renderHead(NOT_FOUND)));
            writeFile(outDir, 'sitemap.xml', buildSitemap(pages));
            writeFile(outDir, 'robots.txt', buildRobots());
            writeFile(outDir, '_redirects', buildRedirects(pages));
            writeFile(outDir, '_headers', buildHeaders());
        },
    };
};
