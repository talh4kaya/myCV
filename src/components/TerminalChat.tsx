import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal } from 'lucide-react';
import { getGeminiResponse } from '../services/gemini'; // Servisi çağırdık

export default function TerminalChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      content: 'Merhaba! Ben Talha Kaya\'nın kişisel yapay zeka asistanı Makapaka. Talha\'nın CV\'si, projeleri ve deneyimleri hakkında her şeyi bana sorabilirsin.' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    // Kullanıcı mesajını ekle
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput("");
    setIsTyping(true); // Düşünme efekti başlasın

    // GERÇEK GEMINI API ÇAĞRISI
    try {
      const aiResponse = await getGeminiResponse(userMessage);
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: aiResponse 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "Sistem Hatası: Bağlantı koptu." 
      }]);
    } finally {
      setIsTyping(false); // Düşünme bitti
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-16 lg:mt-0">
      
      {/* Scrollbar Gizleme */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* PROFİL FOTOĞRAFI */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
        <div className="relative group">
          <img 
            src="/vesikalık.jpg" 
            alt="Profile" 
            className="w-24 h-24 rounded-full border-[4px] border-zinc-800 object-cover shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-500 ease-out bg-black"
          />
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-black rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* SYSTEM READY YAZISI */}
      <div className="absolute -top-10 right-0 text-[10px] font-mono text-zinc-500 tracking-widest flex items-center gap-2 hidden sm:flex">
        <span className="animate-pulse text-green-500 text-lg">●</span> 
        <span className="text-zinc-500 font-bold">LIVE SYSTEM: READY</span>
      </div>

      {/* TERMINAL */}
      <div className="font-mono text-sm shadow-2xl shadow-black rounded-3xl overflow-hidden border border-zinc-800 bg-black relative z-10">
        
        {/* HEADER */}
        <div className="bg-black px-5 py-4 flex items-center justify-between border-b border-zinc-900"> 
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
            </div>
            <div className="text-zinc-500 text-xs flex items-center gap-2 font-semibold tracking-wide">
              <Terminal size={12} className="opacity-50" />
              <span>talhakaya@root</span>
            </div>
          </div>
          <div className="text-red-800 text-[11px] font-bold tracking-widest flex gap-3 shadow-red-900/20 drop-shadow-sm opacity-60">
            <span>111 163</span>
            <span>TDnm</span>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 h-[450px] flex flex-col relative bg-black">
          <div className="flex-1 overflow-y-auto space-y-6 mb-4 no-scrollbar pr-2 z-10">
            {messages.map((msg, idx) => (
              <div key={idx} className="leading-relaxed text-white">
                <div className="mb-1 text-[11px] opacity-80 uppercase tracking-widest font-bold">
                  {msg.role === 'bot' ? <span className="text-green-600">➜ Makapaka</span> : <span className="text-blue-500">➜ You</span>}
                </div>
                <div className="text-base font-normal text-zinc-300">
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Düşünme Efekti */}
            {isTyping && (
              <div className="text-green-500 text-xs animate-pulse font-mono tracking-widest">
                &gt; processing request...
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-3 items-center border-t border-zinc-900 pt-5 mt-1 z-10">
            <span className="text-green-600 text-lg animate-pulse font-bold">❯</span>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent text-white text-base outline-none placeholder-zinc-800 font-medium"
              placeholder="Talha'nın deneyimleri hakkında sor..."
              autoFocus
            />
            <button onClick={handleSend} className="text-zinc-600 hover:text-white transition-colors p-1">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}