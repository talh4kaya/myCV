import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const VisitorCounter = () => {
    const [count, setCount] = useState<number>(0);
    const spring = useSpring(0, { bounce: 0, duration: 2000 });
    const displayValue = useTransform(spring, (current) => Math.round(current));

    useEffect(() => {
        // Namespace ve Key'i sitenize özel belirleyin.
        // Eğer bu key daha önce oluşturulmadıysa otomatik oluşturulur ve 1'den başlar.
        const NAMESPACE = "talh4kaya.com";
        const KEY = "visits";

        fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
            .then(res => res.json())
            .then(data => {
                setCount(data.value);
                spring.set(data.value);
            })
            .catch(err => {
                console.warn("Counter API error:", err);
                // Fallback demo for localhost if API fails
                const fakeCount = 359;
                setCount(fakeCount);
                spring.set(fakeCount);
            });
    }, [spring]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-mono text-zinc-500 font-bold text-sm tracking-widest flex items-center gap-2"
        >
            <motion.span className="text-white">
                {displayValue}
            </motion.span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </motion.div>
    );
};

export default VisitorCounter;
