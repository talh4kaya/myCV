import { Link } from 'react-router-dom';
import { portfolioData } from '../data/portfolio';
import { ArrowUpRight, Code2, Brain, Terminal, Layout } from 'lucide-react';

const projects = portfolioData.projects;

// Helper to get an icon based on project type/name
const getProjectIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('ai') || n.includes('vis') || n.includes('gpt')) return <Brain size={20} className="text-white" />;
    if (n.includes('terminal') || n.includes('cli')) return <Terminal size={20} className="text-white" />;
    if (n.includes('portfolio') || n.includes('web')) return <Layout size={20} className="text-white" />;
    return <Code2 size={20} className="text-white" />;
};

const ProjectCarousel = () => {
    // Duplicate projects to create seamless loop
    const allProjects = [...projects, ...projects];

    return (
        <div className="w-full py-16 overflow-hidden relative">

            {/* Gradient Fade Edges for smooth entry/exit */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

            {/* Marquee Track */}
            <div className="flex w-max animate-scroll gap-6 hover:pause">
                {allProjects.map((project, idx) => {
                    const uniqueKey = `${project.id}-${idx}`;
                    return (
                        <div
                            key={uniqueKey}
                            className="w-[600px] h-[350px] shrink-0 bg-[#0f0f11] border border-[#1f1f23] rounded-2xl p-6 flex flex-col justify-between group hover:border-zinc-700 transition-colors"
                        >
                            {/* Header: Avatar + User Info */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 relative overflow-hidden">
                                        {getProjectIcon(project.name)}
                                        {/* Status Dot */}
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f0f11]"></div>
                                    </div>
                                    <div className="flex flex-col leading-tight">
                                        <h4 className="font-bold text-white text-2xl">{project.name}</h4>
                                        <span className="text-xs text-zinc-500 font-mono">@talh4kaya</span>
                                    </div>
                                </div>

                                <Link
                                    to={`/project/${project.id}`}
                                    className="text-zinc-600 hover:text-white transition-colors"
                                >
                                    <ArrowUpRight size={18} />
                                </Link>
                            </div>

                            {/* Content */}
                            <div className="mb-6">
                                <p className="text-zinc-300 text-xl leading-relaxed line-clamp-5">
                                    {project.desc}
                                </p>
                            </div>

                            {/* Footer: Badge */}
                            <div className="flex items-center gap-2 mt-auto">
                                <div className="bg-[#1a0b0b] border border-red-900/30 rounded px-2 py-1 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded bg-red-600 flex items-center justify-center text-[9px] font-bold text-black">DT</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-red-500/80">Talha Kaya Project</span>
                                </div>
                                <div className="text-sm text-zinc-400 font-bold font-mono ml-auto">
                                    {project.tech[0]} app
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Hover to pause styling */}
            <style>{`
                .hover\\:pause:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default ProjectCarousel;
