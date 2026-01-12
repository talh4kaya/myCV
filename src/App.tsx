import React from 'react';
import { Github, Linkedin, Mail, ArrowUpRight, ChevronDown } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      
      {/* 1. NAVBAR (Logo & Contact) */}
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50 mix-blend-difference">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tighter border-2 border-white p-1 leading-none">
          TK
        </div>
        
        {/* Sağ Üst Link */}
        <a href="mailto:talhakaya@gmail.com" className="text-sm font-medium hover:underline decoration-white underline-offset-4">
          contact
        </a>
      </nav>

      {/* 2. HERO SECTION (Referans Görseldeki Gibi) */}
      <section className="h-screen flex flex-col justify-center px-6 md:px-24 relative">
        <div className="max-w-4xl space-y-8">
          
          {/* Elmas İkonu (Görseldeki detay) */}
          <div className="mb-12">
            <div className="w-8 h-8 bg-white rotate-45"></div>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
            Hi, my name is Talha,<br />
            I’m a <span className="text-gray-400">Data Scientist</span>,<br />
            <span className="text-gray-400">ML Engineer</span> and<br />
            tech enthusiast.
          </h1>

          {/* Link Listesi */}
          <div className="flex flex-col gap-2 text-lg md:text-xl mt-12 pl-1">
            <a href="mailto:talhakaya@gmail.com" className="hover:text-gray-400 transition-colors w-max underline decoration-zinc-700 underline-offset-4">
              talhakaya@gmail.com
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors w-max">github</a>
            <a href="#" className="hover:text-gray-400 transition-colors w-max">linkedin</a>
            <a href="#" className="hover:text-gray-400 transition-colors w-max">cv (download)</a>
          </div>
        </div>

        {/* Scroll İkonu */}
        <div className="absolute bottom-10 right-10 md:right-24 animate-bounce">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section className="py-32 px-6 md:px-24 bg-black border-t border-zinc-900">
        <div className="max-w-3xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-8">01 — Hakkımda</h2>
          <p className="text-2xl md:text-4xl leading-relaxed font-light text-zinc-300">
            Veri ve yapay zeka arasındaki karmaşık problemleri çözmeye odaklanmış bir mühendisim. 
            Klasik yazılım geliştirmeyi, modern Makine Öğrenmesi teknikleriyle birleştirerek 
            <span className="text-white font-medium"> gerçek dünyada çalışan</span> akıllı sistemler inşa ediyorum.
          </p>
        </div>
      </section>

      {/* 4. PROJECTS SECTION */}
      <section className="py-32 px-6 md:px-24 bg-zinc-950">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-16">02 — Seçili Projeler</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* PROJE 1 */}
          <div className="group cursor-pointer">
            <div className="h-[400px] bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between hover:border-zinc-600 transition-all duration-300">
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 text-sm">001</span>
                <ArrowUpRight className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">RL Game Agent</h3>
                <p className="text-zinc-400 text-sm">Reinforcement Learning ile eğitilmiş, kendi kendine öğrenen otonom oyun ajanı.</p>
                <div className="flex gap-2 mt-4">
                  <span className="text-xs border border-zinc-700 px-2 py-1 rounded text-zinc-400">Python</span>
                  <span className="text-xs border border-zinc-700 px-2 py-1 rounded text-zinc-400">PyTorch</span>
                </div>
              </div>
            </div>
          </div>

          {/* PROJE 2 */}
          <div className="group cursor-pointer">
            <div className="h-[400px] bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between hover:border-zinc-600 transition-all duration-300">
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 text-sm">002</span>
                <ArrowUpRight className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Vision AI</h3>
                <p className="text-zinc-400 text-sm">Görüntü işleme ve nesne tanıma üzerine kurulu, gerçek zamanlı analiz sistemi.</p>
                <div className="flex gap-2 mt-4">
                  <span className="text-xs border border-zinc-700 px-2 py-1 rounded text-zinc-400">OpenCV</span>
                  <span className="text-xs border border-zinc-700 px-2 py-1 rounded text-zinc-400">YOLOv8</span>
                </div>
              </div>
            </div>
          </div>

          {/* PROJE 3 */}
          <div className="group cursor-pointer">
            <div className="h-[400px] bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between hover:border-zinc-600 transition-all duration-300">
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 text-sm">003</span>
                <ArrowUpRight className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Smart Portfolio</h3>
                <p className="text-zinc-400 text-sm">React ve Gemini AI kullanılarak geliştirilmiş, yaşayan kişisel web sitesi.</p>
                <div className="flex gap-2 mt-4">
                  <span className="text-xs border border-zinc-700 px-2 py-1 rounded text-zinc-400">React</span>
                  <span className="text-xs border border-zinc-700 px-2 py-1 rounded text-zinc-400">Tailwind</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 md:px-24 border-t border-zinc-900 flex justify-between items-center text-zinc-500 text-sm">
        <p>© 2024 Talha Kaya</p>
        <p>Designed with Code</p>
      </footer>

    </div>
  );
}

export default App;