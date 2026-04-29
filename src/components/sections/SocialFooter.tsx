import { Github } from 'lucide-react';

const SocialFooter = () => {
    return (
        <>
            <div className="pt-0 pb-10 -mt-16 flex justify-center bg-black relative z-10">
                <div className="bg-[#0f0f11] border border-zinc-800 rounded-full px-6 py-3 flex items-center gap-6 hover:border-zinc-700 transition-colors shadow-2xl shadow-black">
                    <a href="https://github.com/talh4kaya" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-white transition-colors hover:scale-110 transform duration-200">
                        <Github size={20} />
                    </a>
                    <a href="https://www.linkedin.com/in/talha-kaya-aa5255340" target="_blank" rel="noopener noreferrer" className="text-[#0077b5] hover:text-white transition-colors hover:scale-110 transform duration-200">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                    </a>
                    <a href="https://www.kaggle.com/talh4kaya" target="_blank" rel="noopener noreferrer" className="text-[#20BEFF] hover:text-white transition-colors hover:scale-110 transform duration-200">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.825 23.9997H14.888L9.58 15.6597L9.57 15.6597L8.03 14.1697V23.9997H4V0H8.03V10.9697L13.9 4.90967H18.577L11.5 12.0697L18.825 23.9997Z" />
                        </svg>
                    </a>
                    <a href="mailto:talh4kaya@gmail.com" className="text-[#3dab1b] hover:text-white transition-colors hover:scale-110 transform duration-200">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                        </svg>
                    </a>
                </div>
            </div>

            <footer className="py-6 flex justify-center bg-black text-white ">
                <span className="text-zinc-600 font-bold tracking-widest text-xs ">Developed by Talha Kaya © 2026</span>
            </footer>
        </>
    );
};

export default SocialFooter;
