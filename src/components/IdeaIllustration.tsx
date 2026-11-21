// "Tüm projelerim" başlığının sağında: gövdesi mavi bir dikdörtgen olan,
// el sallayarak yürüyen küçük karakter. Elle çizilmiş gibi serbest çizgiler;
// çizgiler sayfanın yazı rengini alır, gövde yumuşak mavi.
const IdeaIllustration = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 680 470" fill="none" aria-hidden="true">
        {/* mavi gövde */}
        <path d="M206 98 C300 94 450 92 550 96 L548 266 C450 270 300 270 208 266 Z" fill="#8fb0ec" opacity="0.9" />

        <g stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
            {/* saç */}
            <path d="M305 80 C330 62 358 62 375 72 C380 52 398 40 410 48 C420 56 425 70 422 82" />
            {/* yüz: gözler, burun, gülüş */}
            <path d="M335 142 L336 143" strokeWidth="14" />
            <path d="M440 140 L441 141" strokeWidth="14" />
            <path d="M392 120 C396 140 401 158 396 165 C391 171 384 171 380 168" />
            <path d="M330 180 C325 202 342 222 366 226" />

            {/* sol el: el sallıyor */}
            <path d="M200 232 C160 245 120 240 100 220 C75 190 58 150 52 116 C50 106 54 100 60 104 C68 110 76 126 80 140 C85 115 84 95 82 78 C80 66 88 64 92 70 C100 82 108 110 112 130 C115 110 112 80 115 65 C118 55 125 55 130 65 C140 85 148 118 150 135 C152 128 150 112 152 100 C152 90 158 88 162 95 C170 110 176 132 180 150 C182 160 190 166 200 166" />

            {/* sağ el */}
            <path d="M552 145 C590 150 625 175 638 215 C648 250 640 285 625 290 C615 290 612 280 610 266 C608 285 598 292 590 288 C580 282 582 266 585 255 C578 280 570 290 560 285 C548 278 548 266 553 260" />

            {/* bacaklar: yürüyor */}
            <path d="M295 272 L212 362 L248 440 L352 440 C350 426 340 418 324 414 L300 396 L360 298" />
            <path d="M364 300 L480 440 L575 352 C562 346 548 343 540 342 L470 270" />
        </g>
    </svg>
);

export default IdeaIllustration;
