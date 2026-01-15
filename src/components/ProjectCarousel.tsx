import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolio';
import { ArrowRight } from 'lucide-react';

const projects = portfolioData.projects;

const ProjectCarousel = () => {
    return (
        <div className="w-full py-10 flex justify-center">
            {/* Grid Container */}
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
                {projects.map((project, index) => {
                    return (
                        <motion.div
                            key={project.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-black border border-zinc-800 rounded-[32px] p-8 min-h-[380px] h-full flex flex-col justify-between hover:border-zinc-600 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                        >
                            {/* Main Content: Title & Description */}
                            <div className="flex flex-col">
                                <h3 className="text-3xl font-bold text-white mb-4 leading-tight tracking-tight">
                                    {project.name.split('(')[0].trim()}
                                </h3>

                                <div className="relative overflow-hidden">
                                    <p className="text-zinc-400 text-base leading-relaxed line-clamp-4">
                                        {project.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Footer: Tech Stack (Left) & Link (Right) */}
                            <div className="flex justify-between items-end mt-8">
                                {/* Tech Stack - Bottom Left */}
                                <div className="flex flex-wrap gap-2 max-w-[60%]">
                                    {project.tech.map((t) => (
                                        <span
                                            key={t}
                                            className="px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-default"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* Link - Bottom Right */}
                                <Link to={`/project/${project.id}`} className="flex items-center gap-2 text-[#007acc] font-semibold text-base group/btn shrink-0">
                                    Daha fazla bilgi al
                                    <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProjectCarousel;
