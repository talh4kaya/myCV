import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import TerminalChat from '../components/TerminalChat';
import ProjectCarousel from '../components/ProjectCarousel';
import VisitorCounter from '../components/VisitorCounter';
import { Code2, Brain, GraduationCap, Globe } from 'lucide-react';

function Home() {
    // Initial empty state for the text segments
    const [typedSegments, setTypedSegments] = useState([
        { text: "", className: "text-white" },
        { text: "", className: "text-white" },
        { text: "", className: "text-zinc-500" },
        { text: "", className: "text-white" },
        { text: "", className: "text-zinc-500" },
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
            { text: "Data Scientist", className: "text-zinc-500" },
            { text: ",\n", className: "text-white" },
            { text: "ML Engineer", className: "text-zinc-500" },
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
                    src="/tk-logo.png"
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
                            href="#"
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
                        <div className="w-full rounded-[40px] overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/10 grid grid-cols-1 md:grid-cols-2">

                            {/* 1. Eğitim - Midnight Blue (#2C3E50) */}
                            <div className="min-h-[220px] h-full p-6 md:p-8 bg-[#2C3E50] flex flex-col justify-between group hover:bg-[#2C3E50]/90 transition-colors">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-3xl font-bold text-white tracking-tight leading-none">Eğitim</h4>
                                    <GraduationCap className="text-white/80 drop-shadow-md" size={40} />
                                </div>
                                <div>
                                    <p className="text-white text-lg font-bold leading-tight">Sakarya Üniversitesi</p>
                                    <p className="text-white/70 text-sm mt-1 font-medium">Bilgisayar Müh. (3. Sınıf)</p>
                                </div>
                            </div>

                            {/* 2. Alanlar - Nephritis Green (#27AE60) */}
                            <div className="min-h-[220px] h-full p-6 md:p-8 bg-[#27AE60] flex flex-col justify-between group hover:bg-[#27AE60]/90 transition-colors">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-3xl font-bold text-white tracking-tight leading-none">Odak<br />Alanları</h4>
                                    <Brain className="text-white/80 drop-shadow-sm" size={40} />
                                </div>
                                <div>
                                    <p className="text-white text-lg font-bold leading-tight">Machine Learning</p>
                                    <p className="text-white/80 text-sm mt-1 font-medium">Deep Learning, RL</p>
                                </div>
                            </div>

                            {/* 3. Stack - Light Cream (#FDFFE6) */}
                            <div className="min-h-[220px] h-full p-6 md:p-8 bg-[#FDFFE6] flex flex-col justify-between group hover:brightness-95 transition-all">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-3xl font-bold text-[#2C3E50] tracking-tight leading-none">Teknik<br />Stack</h4>
                                    <Code2 className="text-[#2C3E50]/70 drop-shadow-sm" size={40} />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Python', 'C++', 'SQL', 'FastAPI', 'PyTorch', 'OpenCV'].map((tech) => (
                                        <span key={tech} className="text-[11px] bg-[#2C3E50]/10 border border-[#2C3E50]/10 px-2 py-1 rounded-md text-[#2C3E50] font-bold">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Dil - Pumpkin Orange (#D35400) */}
                            <div className="min-h-[220px] h-full p-6 md:p-8 bg-[#D35400] flex flex-col justify-between group hover:bg-[#D35400]/90 transition-colors">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-3xl font-bold text-white tracking-tight leading-none">Dil<br />Yetkinliği</h4>
                                    <Globe className="text-white/80 drop-shadow-md" size={40} />
                                </div>
                                <div>
                                    <p className="text-white text-lg font-bold leading-tight">İngilizce (B2)</p>
                                    <p className="text-white/80 text-sm mt-1 font-medium">Hazırlık + Teknik Literatür</p>
                                </div>
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

        </div>
    );
}

export default Home;
