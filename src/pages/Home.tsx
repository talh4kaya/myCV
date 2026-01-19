import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import TerminalChat from '../components/TerminalChat';
import ProjectCarousel from '../components/ProjectCarousel';
import VisitorCounter from '../components/VisitorCounter';
import { Code2, Brain, GraduationCap, Globe, Github } from 'lucide-react';

function Home() {
    // Initial empty state for the text segments
    const [typedSegments, setTypedSegments] = useState([
        { text: "", className: "text-white" },
        { text: "", className: "text-white" },
        { text: "", className: "text-red-600" },
        { text: "", className: "text-white" },
        { text: "", className: "text-red-600" },
        { text: "", className: "text-white" },
        { text: "", className: "text-white" }
    ]);

    // Use refs for animation state to avoid closure staleness and re-render loops
    const stateRef = useRef({
        segmentIndex: 0,
        charIndex: 0,
        phase: 'typing', // 'typing' | 'pausing' | 'deleting'
    });

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const fullSegments = [
            { text: "Hi, my name is Talha,\n", className: "text-white" },
            { text: "I’m a ", className: "text-white" },
            { text: "Data Scientist", className: "text-red-600" },
            { text: ",\n", className: "text-white" },
            { text: "ML Engineer", className: "text-red-600" },
            { text: " and\n", className: "text-white" },
            { text: "analytical problem solver.", className: "text-white" }
        ];

        const animate = () => {
            const state = stateRef.current;

            if (state.phase === 'typing') {
                const targetText = fullSegments[state.segmentIndex]?.text || "";

                if (state.charIndex < targetText.length) {
                    // Type one character
                    state.charIndex++;
                    const currentText = targetText.slice(0, state.charIndex);

                    setTypedSegments(prev => {
                        const newSegments = [...prev];
                        newSegments[state.segmentIndex].text = currentText;
                        return newSegments;
                    });

                    timeoutRef.current = setTimeout(animate, 85); // Normal typing speed
                } else {
                    // Finished this segment, move to next
                    state.segmentIndex++;
                    state.charIndex = 0;

                    if (state.segmentIndex >= fullSegments.length) {
                        // All segments typed, switch to pausing
                        state.phase = 'pausing';
                        state.segmentIndex = fullSegments.length - 1; // Prepare for last segment index
                        timeoutRef.current = setTimeout(animate, 15000); // Wait 15s
                    } else {
                        // Next segment immediately
                        timeoutRef.current = setTimeout(animate, 85);
                    }
                }
            }
            else if (state.phase === 'pausing') {
                // Pause over, start deleting
                state.phase = 'deleting';
                state.charIndex = fullSegments[state.segmentIndex].text.length;
                timeoutRef.current = setTimeout(animate, 50);
            }
            else if (state.phase === 'deleting') {
                const currentSegmentText = fullSegments[state.segmentIndex].text;

                if (state.charIndex > 0) {
                    // Delete one character
                    state.charIndex--;
                    const currentText = currentSegmentText.slice(0, state.charIndex);

                    setTypedSegments(prev => {
                        const newSegments = [...prev];
                        newSegments[state.segmentIndex].text = currentText;
                        return newSegments;
                    });

                    timeoutRef.current = setTimeout(animate, 40); // Fast delete speed
                } else {
                    // Finished deleting this segment, move to previous
                    state.segmentIndex--;

                    if (state.segmentIndex < 0) {
                        // All deleted, restart typing loop
                        state.phase = 'typing';
                        state.segmentIndex = 0;
                        state.charIndex = 0;
                        timeoutRef.current = setTimeout(animate, 500); // Brief pause before restart
                    } else {
                        // Setup next segment to delete
                        state.charIndex = fullSegments[state.segmentIndex].text.length;
                        timeoutRef.current = setTimeout(animate, 40);
                    }
                }
            }
        };

        // Start the loop
        timeoutRef.current = setTimeout(animate, 500);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800 selection:text-white overflow-x-hidden">

            {/* 1. NAVBAR */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-0 left-0 w-full p-4 md:p-8 z-50 mix-blend-difference flex justify-between items-center"
            >
                <img
                    src="/me.png"
                    alt="TK Logo"
                    className="w-14 h-14 object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0"
                />
                <VisitorCounter />
            </motion.nav>

            {/* 2. HERO SECTION */}
            <section className="min-h-screen flex flex-col lg:flex-row items-center px-6 md:px-24 pt-24 lg:pt-0 relative">

                {/* SOL TARAFI: Yazılar ve LİNKLER */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="lg:w-1/2 w-full space-y-10 z-10 mb-16 lg:mb-0 pl-0 lg:pl-10"
                >

                    <div className="w-4 h-4 bg-white rotate-45 mb-8 hidden md:block opacity-60"></div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] min-h-[290px] whitespace-pre-wrap">
                        {typedSegments.map((segment, index) => (
                            <span key={index} className={segment.className}>{segment.text}</span>
                        ))}
                        <span className="animate-pulse">|</span>
                    </h1>

                    {/* LİNK LİSTESİ */}
                    <div className="flex flex-col gap-3 text-lg md:text-xl pl-1 font-medium text-zinc-600">

                        <a
                            href="mailto:talh4kaya@gmail.com"
                            className="hover:text-white transition-colors w-max text-zinc-400 underline decoration-zinc-800 underline-offset-4"
                        >
                            talh4kaya@gmail.com
                        </a>

                        <a
                            href="https://github.com/talh4kaya"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors w-max hover:translate-x-2 duration-200"
                        >
                            github
                        </a>

                        <a
                            href="https://www.linkedin.com/in/talha-kaya-aa5255340"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors w-max hover:translate-x-2 duration-200"
                        >
                            linkedin
                        </a>

                        <a
                            href="/Cv.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors w-max hover:translate-x-2 duration-200 opacity-60"
                            title="cv"
                        >
                            CV
                        </a>
                    </div>
                </motion.div>

                {/* SAĞ TARAFI: Terminal Chatbot */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="lg:w-1/2 w-full z-20 flex justify-center lg:justify-start lg:pl-16 pr-0"
                >
                    <TerminalChat />
                </motion.div>

                {/* HERO ARKA PLAN IŞIĞI */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-green-900/20 rounded-full blur-[180px] -z-10 pointer-events-none"
                ></motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] -z-10 pointer-events-none"
                ></motion.div>

            </section>

            {/* 3. ABOUT ME SECTION */}
            <section className="py-32 px-6 md:px-24 bg-black border-t border-zinc-900 relative">

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[45%_55%] gap-32 items-start">

                    {/* SOL: Biyografi Metni */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8 pb-12"
                    >
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            01. Hakkımda
                        </h2>

                        <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                            Veriyi anlama, işleme ve <span className="text-zinc-500">geleceği kodlama</span> tutkusu.
                        </h3>

                        <div className="space-y-6 text-zinc-400 leading-relaxed text-lg">
                            <p>
                                Merhaba, ben <strong className="text-white">Talha Kaya</strong>. Sakarya Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim.
                                Bilgisayarla uğraşmayı seviyorum ama beni asıl motive eden şey, <strong className="text-white">karşıma çıkan problemleri kurcalamak</strong>, parçalarına ayırmak ve gerçekten işe yarayan çözümler üretmek.
                            </p>
                            <p>
                                Yazılıma <strong className="text-white">Python ve C++</strong> ile başladım. Zaman içinde en çok ilgimi çeken alanın <strong className="text-white">makine öğrenmesi</strong> olduğunu fark ettim. Bir modelin sadece sonuç üretmesi değil, neden o sonucu verdiğini anlamak bana daha heyecan veriyor. Bu ilgimi <strong className="text-white">Arvasis Yazılım</strong>’da yaptığım stajda pratiğe dökme şansı buldum. Burada, 65 farklı dili destekleyen <strong className="text-white">OCR modelleri</strong> üzerinde çalışarak öğrendiklerimi gerçek projelerde kullandım.
                            </p>
                            <p>
                                Teknik konuların yanında iletişimin de işin önemli bir parçası olduğuna inanıyorum. <strong className="text-white">İngilizce (B2)</strong> seviyesinde teknik kaynakları takip edebiliyor, öğrendiklerimi başkalarına anlatmaktan çekinmiyorum. Meraklı yapım sayesinde <strong className="text-white">Reinforcement Learning’den Computer Vision’a</strong> kadar farklı alanları denemeyi ve kendimi sürekli geliştirmeyi seviyorum.
                            </p>
                        </div>
                    </motion.div>

                    {/* SAĞ: Unified Quad Card container */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="content-start w-full mt-40 lg:pl-12"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

                            {/* 1. Eğitim - Cream Card */}
                            <div className="group relative aspect-[1.6/1] p-6 flex flex-col justify-between bg-[#F2F0E9] text-black transition-transform duration-300 hover:-translate-y-1">
                                <div className="flex justify-between items-start z-10">
                                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-60">Eğitim</h4>
                                    <span className="text-[10px] font-mono opacity-40">01</span>
                                </div>
                                <div className="z-10">
                                    <p className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.9] mb-2">
                                        Sakarya<br />Uni.
                                    </p>
                                    <p className="text-xs font-bold opacity-60 uppercase tracking-wider">Bilgisayar Müh. 3. Sınıf</p>
                                </div>
                                <GraduationCap className="absolute bottom-4 right-4 text-black opacity-[1.0] group-hover:opacity-[0.07] transition-opacity scale-[2.5] origin-bottom-right" strokeWidth={1.5} />
                            </div>

                            {/* 2. Alanlar - Silver Card */}
                            <div className="group relative aspect-[1.6/1] p-6 flex flex-col justify-between bg-[#C4C4C4] text-black transition-transform duration-300 hover:-translate-y-1">
                                <div className="flex justify-between items-start z-10">
                                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-60">Alanlar</h4>
                                    <span className="text-[10px] font-mono opacity-40">02</span>
                                </div>
                                <div className="z-10">
                                    <p className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.9] mb-2">
                                        Machine<br />Learning
                                    </p>
                                    <p className="text-xs font-bold opacity-60 uppercase tracking-wider">Deep Learning • RL</p>
                                </div>
                                <Brain className="absolute bottom-4 right-4 text-black opacity-[1.0] group-hover:opacity-[0.07] transition-opacity scale-[2.5] origin-bottom-right" strokeWidth={1.5} />
                            </div>

                            {/* 3. Stack - Black Card */}
                            <div className="group relative aspect-[1.6/1] p-6 flex flex-col justify-between bg-[#0A0A0A] text-white transition-transform duration-300 hover:-translate-y-1">
                                <div className="flex justify-between items-start z-10">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Stack</h4>
                                    <span className="text-[10px] font-mono text-zinc-700">03</span>
                                </div>
                                <div className="z-10">
                                    <p className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.9] mb-3">
                                        Teknik<br />Stack
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 opacity-80">
                                        {['Python', 'C++', 'PyTorch', 'OpenCV', 'Numpy', 'Pandas', 'Scikit-learn'].map(t => (
                                            <span key={t} className="text-[10px] border border-zinc-800 bg-zinc-900/50 px-2 py-0.5 rounded-full text-zinc-400 font-medium">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <Code2 className="absolute bottom-4 right-4 text-white opacity-[1.0] group-hover:opacity-[0.07] transition-opacity scale-[2.5] origin-bottom-right" strokeWidth={1.5} />
                            </div>

                            {/* 4. Dil - Lime/Yellow Card */}
                            <div className="group relative aspect-[1.6/1] p-6 flex flex-col justify-between bg-[#689466] text-black transition-transform duration-300 hover:-translate-y-1">
                                <div className="flex justify-between items-start z-10">
                                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-60">Dil</h4>
                                    <span className="text-[10px] font-mono opacity-40">04</span>
                                </div>
                                <div className="z-10">
                                    <p className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.9] mb-2">
                                        İngilizce<br />(B2)
                                    </p>
                                    <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Hazırlık + Teknik</p>
                                </div>
                                <Globe className="absolute bottom-4 right-4 text-black opacity-[1.00] group-hover:opacity-[0.07] transition-opacity scale-[2.5] origin-bottom-right" strokeWidth={1.5} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 4. PROJECTS SECTION */}
            <section className="py-32 px-0 bg-black relative border-t border-zinc-900 overflow-hidden">

                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-900/10 blur-[120px] -z-10 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 md:px-24 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            02. Projelerim
                        </h2>

                        <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
                            Gerçek dünya problemleri için <span className="text-zinc-500">modern çözümler.</span>
                        </h3>
                    </motion.div>
                </div>

                {/* Carousel Container */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <ProjectCarousel />
                </motion.div>

            </section>

            {/* 5. SOCIAL MEDIA */}
            <div className="pt-0 pb-10 -mt-16 flex justify-center bg-black relative z-10">
                <div className="bg-[#0f0f11] border border-zinc-800 rounded-full px-6 py-3 flex items-center gap-6 hover:border-zinc-700 transition-colors shadow-2xl shadow-black">
                    <a href="https://github.com/talh4kaya" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-white transition-colors hover:scale-110 transform duration-200">
                        <Github size={20} />
                    </a>
                    <a href="https://www.linkedin.com/in/talha-kaya-aa5255340" target="_blank" rel="noopener noreferrer" className="text-[#0077b5] hover:text-white transition-colors hover:scale-110 transform duration-200">
                        {/* Solid/Filled LinkedIn Logo */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                    </a>
                    <a href="https://www.kaggle.com/talh4kaya" target="_blank" rel="noopener noreferrer" className="text-[#20BEFF] hover:text-white transition-colors hover:scale-110 transform duration-200">
                        {/* Simple Kaggle Icon SVG */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.825 23.9997H14.888L9.58 15.6597L9.57 15.6597L8.03 14.1697V23.9997H4V0H8.03V10.9697L13.9 4.90967H18.577L11.5 12.0697L18.825 23.9997Z" />
                        </svg>
                    </a>
                    <a href="mailto:talh4kaya@gmail.com" className="text-[#3dab1b] hover:text-white transition-colors hover:scale-110 transform duration-200">
                        {/* Gmail M Logo */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* 6. FOOTER (NAME) */}
            <footer className="py-6 flex justify-center bg-black text-white ">
                <span className="text-zinc-600 font-bold tracking-widest text-xs ">Developed by Talha Kaya © 2026</span>
            </footer>

        </div>
    );
}

export default Home;
