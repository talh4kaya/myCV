// "Deneyimlerim" başlığının sağında birbirine uzanan iki el (elle çizilmiş
// gibi serbest çizgiler). Çizgiler sayfanın yazı rengini alır; böylece hem
// açık hem koyu temada temiz görünür.
const HandsIllustration = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 950 530" fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
            {/* sol el: dış hat (bilekten başparmağa, işaret parmağına) */}
            <path
                d="M88 228 C105 160 125 90 148 32 C152 18 165 14 180 18 C190 22 200 24 210 22 C260 16 320 10 360 6 C385 4 404 10 405 24 C406 40 388 46 372 46 C345 50 318 60 302 70 C300 76 304 80 310 82 C360 102 420 126 460 150 C488 166 492 192 474 198"
            />
            {/* sol elin parmakları */}
            <path d="M346 158 C390 172 440 188 474 198" />
            <path d="M340 208 C390 222 450 236 480 238 C496 240 494 262 470 266 C440 268 410 266 380 268" />
            <path d="M300 246 C330 252 360 262 372 270 C384 280 380 300 362 306 C350 310 340 308 330 304" />
            {/* sol elin alt hattı ve manşet */}
            <path d="M330 304 C260 280 180 250 112 226 C100 222 92 224 88 228" />
            <path d="M12 214 C40 226 66 236 94 240" />

            {/* sağ el: başparmak */}
            <path d="M940 282 C880 288 840 285 800 274 C760 260 700 236 650 232 C635 240 638 262 655 268 C690 290 740 320 780 335 C795 342 805 346 815 348" />
            {/* sağ elin bileği */}
            <path d="M882 290 C892 350 900 420 904 500" />
            {/* sağ elin parmakları */}
            <path d="M688 362 C640 372 560 385 510 395 C500 400 502 410 515 412 C560 412 610 410 645 410" />
            <path d="M540 422 C528 432 526 458 545 465 C590 462 640 458 682 456" />
            <path d="M598 470 C578 478 580 500 602 500 C700 495 800 488 904 482" />
        </g>
    </svg>
);

export default HandsIllustration;
