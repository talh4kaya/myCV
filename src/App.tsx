import React from 'react';
import TerminalChat from './components/TerminalChat';
import { Code2, Brain, Database, GraduationCap, Globe, Cpu } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800 selection:text-white overflow-x-hidden">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 left-0 w-full p-8 z-50 mix-blend-difference">
        <img 
          src="/tk-logo.png" 
          alt="TK Logo" 
          className="w-14 h-14 object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0" 
        />
      </nav>

      {/* 2. HERO SECTION */}
      <section className="min-h-screen flex flex-col lg:flex-row items-center px-6 md:px-24 pt-24 lg:pt-0 relative">
        
        {/* SOL TARAFI: Yazılar ve LİNKLER */}
        <div className="lg:w-1/2 w-full space-y-10 z-10 mb-16 lg:mb-0 pl-0 lg:pl-10">
          
          <div className="w-4 h-4 bg-white rotate-45 mb-8 hidden md:block opacity-60"></div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
            Hi, my name is Talha,<br />
            I’m a <span className="text-zinc-500">Data Scientist</span>,<br />
            <span className="text-zinc-500">ML Engineer</span> and<br />
            analytical problem solver.
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
              className="hover:text-white transition-colors w-max hover:translate-x-2 duration-200 opacity-60 cursor-help"
              title="Yakında eklenecek"
            >
              cv (yakında)
            </a>
          </div>
        </div>

        {/* SAĞ TARAFI: Terminal Chatbot */}
        <div className="lg:w-1/2 w-full z-20 flex justify-center lg:justify-start lg:pl-16 pr-0">
          <TerminalChat />
        </div>

        {/* HERO ARKA PLAN IŞIĞI */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-green-900/20 rounded-full blur-[180px] -z-10 pointer-events-none opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] -z-10 pointer-events-none opacity-30"></div>

      </section>

      {/* 3. ABOUT ME SECTION */}
      <section className="py-32 px-6 md:px-24 bg-black border-t border-zinc-900 relative">
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* SOL: Biyografi Metni */}
          <div className="space-y-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              01. Hakkımda
            </h2>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Veriyi anlama, işleme ve <span className="text-zinc-500">geleceği kodlama</span> tutkusu.
            </h3>

            <div className="space-y-6 text-zinc-400 leading-relaxed text-lg">
              <p>
                Merhaba, ben <strong className="text-white">Talha Kaya</strong>. Sakarya Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. 
                Teknoloji dünyasında sadece kod yazan biri değil, karmaşık problemleri analitik zekasıyla çözen bir mühendis adayıyım.
              </p>
              <p>
                Yazılım serüvenim <strong className="text-white">Python ve C++</strong> ile başladı, ancak asıl tutkum verilerin arkasındaki hikayeyi keşfetmek oldu. 
                <strong className="text-white"> Arvasis Yazılım</strong>'da Makine Öğrenmesi stajyeri olarak 65 farklı dilde OCR (Optik Karakter Tanıma) modelleri geliştirerek teorik bilgimi gerçek dünya projelerine dönüştürdüm.
              </p>
              <p>
                İyi bir iletişimin teknik bilgi kadar önemli olduğuna inanırım. İngilizce (B2) bilgim ve meraklı yapımla, Reinforcement Learning'den Computer Vision'a kadar yapay zekanın sınırlarını zorlamayı seviyorum.
              </p>
            </div>
          </div>

          {/* SAĞ: Teknik Kartlar (Grid Yapısı) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 lg:mt-0">
            
            {/* Kart 1: Eğitim (Sarı -> Beyaz) */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 transition-colors group">
              <GraduationCap className="text-yellow-500 group-hover:text-white mb-4 transition-colors duration-300" size={32} />
              <h4 className="text-xl font-bold text-white mb-2">Eğitim</h4>
              <p className="text-zinc-400 text-sm">Sakarya Üniversitesi</p>
              <p className="text-zinc-500 text-sm">Bilgisayar Müh. (3. Sınıf)</p>
            </div>

            {/* Kart 2: Alanlar (Yeşil -> Beyaz) */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 transition-colors group">
              <Brain className="text-green-500 group-hover:text-white mb-4 transition-colors duration-300" size={32} />
              <h4 className="text-xl font-bold text-white mb-2">Odak Alanları</h4>
              <p className="text-zinc-400 text-sm">Machine Learning</p>
              <p className="text-zinc-500 text-sm">Deep Learning, RL, NLP</p>
            </div>

            {/* Kart 3: Diller & Araçlar (Mavi -> Beyaz) */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 transition-colors group">
              <Code2 className="text-blue-500 group-hover:text-white mb-4 transition-colors duration-300" size={32} />
              <h4 className="text-xl font-bold text-white mb-2">Stack</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Python', 'C++', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'OpenCV'].map((tech) => (
                  <span key={tech} className="text-xs bg-black border border-zinc-800 px-2 py-1 rounded text-zinc-400">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Kart 4: Yabancı Dil (Mor -> Beyaz) */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 transition-colors group">
              <Globe className="text-purple-500 group-hover:text-white mb-4 transition-colors duration-300" size={32} />
              <h4 className="text-xl font-bold text-white mb-2">Dil Yetkinliği</h4>
              <p className="text-zinc-400 text-sm">İngilizce (B2)</p>
              <p className="text-zinc-500 text-sm">Hazırlık Eğitimi + Teknik Literatür</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default App;