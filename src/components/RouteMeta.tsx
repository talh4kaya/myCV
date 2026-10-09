import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { absoluteUrl, DEFAULT_IMAGE, getPageMeta } from '../seo/meta';

// Build sırasında her sayfa doğru <head> ile üretiliyor; bu bileşen sadece
// site içinde (sayfa yenilenmeden) gezinirken başlık/açıklama/canonical'ı
// güncel tutuyor — sekme başlığı ve JS çalıştıran tarayıcı botları için.

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
};

const setCanonical = (href: string | null) => {
    let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!href) {
        el?.remove();
        return;
    }
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
};

const RouteMeta = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const meta = getPageMeta(pathname);
        const url = absoluteUrl(meta.path);
        const image = absoluteUrl(meta.image ?? DEFAULT_IMAGE);

        document.title = meta.title;
        setMeta('name', 'description', meta.description);
        setMeta('name', 'robots', meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
        setCanonical(meta.noindex ? null : url);
        setMeta('property', 'og:type', meta.type);
        setMeta('property', 'og:url', url);
        setMeta('property', 'og:title', meta.title);
        setMeta('property', 'og:description', meta.description);
        setMeta('property', 'og:image', image);
        setMeta('name', 'twitter:title', meta.title);
        setMeta('name', 'twitter:description', meta.description);
        setMeta('name', 'twitter:image', image);
    }, [pathname]);

    return null;
};

export default RouteMeta;
