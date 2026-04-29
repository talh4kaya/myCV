import { motion } from 'framer-motion';
import ProjectCarousel from '../ProjectCarousel';

const Projects = () => {
    return (
        <section className="py-32 px-0 bg-black relative border-t border-zinc-900 overflow-hidden">

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

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                <ProjectCarousel />
            </motion.div>
        </section>
    );
};

export default Projects;
