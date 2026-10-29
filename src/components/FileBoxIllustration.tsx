// Başlığın sağındaki dosya kutusu illüstrasyonu. Tek renkli: yüzeyler
// currentColor tonlarında (koyu temada beyaz), ana hatlar sayfa zemini renginde
// koyu çizgi; yan yüz ve arka klasörde nokta tram. Geometri eğik izdüşümle
// hesaplandı: ön yüz ekseni (112, 26), derinlik ekseni (74, -26).
const FileBoxIllustration = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 250 230" fill="none" aria-hidden="true">
        <defs>
            <pattern id="filebox-dots" width="4.5" height="4.5" patternUnits="userSpaceOnUse">
                <circle cx="1.4" cy="1.4" r="1" fill="var(--bg)" />
            </pattern>
        </defs>
        <path d="M140.0 206.0 L214.0 180.0 L236.0 186.0 L172.0 214.0 Z" fill="currentColor" fillOpacity="0.18" />
        <g stroke="var(--bg)" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
            <path d="M28.0 112.0 L102.0 86.0 L214.0 112.0 L140.0 138.0 Z" fill="currentColor" fillOpacity="0.28" />
            <path d="M92.5 125.9 L92.5 9.9 L121.6 16.6 L129.4 30.5 L185.4 43.5 L185.4 147.5 Z" fill="currentColor" />
            <path d="M92.5 125.9 L92.5 9.9 L121.6 16.6 L129.4 30.5 L185.4 43.5 L185.4 147.5 Z" fill="url(#filebox-dots)" fillOpacity="0.55" stroke="none" />
            <path d="M63.2 132.9 L63.2 41.9 L90.1 48.1 L97.9 61.0 L147.2 72.4 L147.2 152.4 Z" fill="var(--bg)" />
            <path d="M63.2 132.9 L63.2 41.9 L90.1 48.1 L97.9 61.0 L147.2 72.4 L147.2 152.4 Z" fill="currentColor" fillOpacity="0.62" />
            <path d="M46.2 137.6 L46.2 55.6 L70.8 61.3 L78.6 73.1 L125.7 84.0 L125.7 156.0 Z" fill="var(--bg)" />
            <path d="M46.2 137.6 L46.2 55.6 L70.8 61.3 L78.6 73.1 L125.7 84.0 L125.7 156.0 Z" fill="currentColor" fillOpacity="0.85" />
            <path d="M140.0 138.0 L214.0 112.0 L214.0 180.0 L140.0 206.0 Z" fill="currentColor" />
            <path d="M140.0 138.0 L214.0 112.0 L214.0 180.0 L140.0 206.0 Z" fill="url(#filebox-dots)" stroke="none" />
            <path d="M28.0 112.0 L140.0 138.0 L140.0 206.0 L28.0 180.0 Z" fill="currentColor" />
            <path d="M41.4 141.1 L66.1 146.8 L66.1 160.8 L41.4 155.1 Z" strokeWidth="2.2" />
        </g>
    </svg>
);

export default FileBoxIllustration;
