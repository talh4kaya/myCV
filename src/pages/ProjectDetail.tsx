import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { portfolioData } from '../data/portfolio';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectDetail = () => {
    const { id } = useParams<{ id: string }>();
    const project = portfolioData.projects.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!project) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
                <h1 className="text-4xl font-bold mb-4">Proje Bulunamadı</h1>
                <Link to="/" className="text-zinc-400 hover:text-white underline">Ana Sayfaya Dön</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-900 selection:text-white">

            {/* Arka Plan Dekorasyonları */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-900/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">

                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Geri Dön</span>
                </Link>

                {/* HERO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                        {project.name.split('(')[0].trim()}
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl">
                        {project.name.split('(')[1]?.replace(')', '') || project.desc}
                    </p>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-3 mt-8">
                        {project.tech.map(t => (
                            <span key={t} className="px-4 py-2 bg-zinc-900 rounded-lg text-zinc-300 text-sm font-mono border border-zinc-800">
                                {t}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* CONTENT GRID */}
                <div className="grid grid-cols-1 gap-16">

                    {/* STORY SECITON */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-zinc-900/20 p-8 rounded-3xl border border-white/5"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-white">
                            Hikayesi ve Motivasyonum
                        </h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-lg text-zinc-300 leading-relaxed whitespace-pre-line">
                                {project.details?.story}
                            </p>
                        </div>
                    </motion.section>

                    {/* TECHNICAL DEPTH SECTION */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold mb-8 text-white">
                            Teknik Derinlik
                        </h2>

                        <div className="space-y-6">
                            {project.details?.technical.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group pl-6 border-l-2 border-zinc-800 hover:border-green-500 transition-colors"
                                >
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed text-lg">
                                        {item.content}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                </div>

                {/* FOOTER NAV */}
                <div className="mt-20 pt-10 border-t border-zinc-900 flex justify-center items-center text-zinc-500 text-sm">
                    <p>© 2024 Talha Kaya</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
