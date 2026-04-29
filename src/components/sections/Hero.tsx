import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import TerminalChat from '../TerminalChat';

const Hero = () => {
    const [typedSegments, setTypedSegments] = useState([
        { text: "", className: "text-white" },
        { text: "", className: "text-white" },
        { text: "", className: "text-red-600" },
        { text: "", className: "text-white" },
        { text: "", className: "text-red-600" },
        { text: "", className: "text-white" },
        { text: "", className: "text-white" }
    ]);

    const stateRef = useRef({
        segmentIndex: 0,
        charIndex: 0,
        phase: 'typing',
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
                    state.charIndex++;
                    const currentText = targetText.slice(0, state.charIndex);

                    setTypedSegments(prev => {
                        const newSegments = [...prev];
                        newSegments[state.segmentIndex].text = currentText;
                        return newSegments;
                    });

                    timeoutRef.current = setTimeout(animate, 85);
                } else {
                    state.segmentIndex++;
                    state.charIndex = 0;

                    if (state.segmentIndex >= fullSegments.length) {
                        state.phase = 'pausing';
                        state.segmentIndex = fullSegments.length - 1;
                        timeoutRef.current = setTimeout(animate, 15000);
                    } else {
                        timeoutRef.current = setTimeout(animate, 85);
                    }
                }
            }
            else if (state.phase === 'pausing') {
                state.phase = 'deleting';
                state.charIndex = fullSegments[state.segmentIndex].text.length;
                timeoutRef.current = setTimeout(animate, 50);
            }
            else if (state.phase === 'deleting') {
                const currentSegmentText = fullSegments[state.segmentIndex].text;

                if (state.charIndex > 0) {
                    state.charIndex--;
                    const currentText = currentSegmentText.slice(0, state.charIndex);

                    setTypedSegments(prev => {
                        const newSegments = [...prev];
                        newSegments[state.segmentIndex].text = currentText;
                        return newSegments;
                    });

                    timeoutRef.current = setTimeout(animate, 40);
                } else {
                    state.segmentIndex--;

                    if (state.segmentIndex < 0) {
                        state.phase = 'typing';
                        state.segmentIndex = 0;
                        state.charIndex = 0;
                        timeoutRef.current = setTimeout(animate, 500);
                    } else {
                        state.charIndex = fullSegments[state.segmentIndex].text.length;
                        timeoutRef.current = setTimeout(animate, 40);
                    }
                }
            }
        };

        timeoutRef.current = setTimeout(animate, 500);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <section className="min-h-screen flex flex-col lg:flex-row items-center px-6 md:px-24 pt-24 lg:pt-0 relative">

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

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="lg:w-1/2 w-full z-20 flex justify-center lg:justify-start lg:pl-16 pr-0"
            >
                <TerminalChat />
            </motion.div>

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
    );
};

export default Hero;
