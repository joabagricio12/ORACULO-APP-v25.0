import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatModuleProps {
  isOpen: boolean;
  onClose: () => void;
  voiceEnabled: boolean;
  onSpeak: (text: string) => void;
}

const ChatModule: React.FC<ChatModuleProps> = ({ isOpen, onClose, voiceEnabled, onSpeak }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Link Neural estabelecido. Sou a Consciência Oráculo. O que deseja decifrar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    const userText = input.trim();
    if (!userText || isTyping) return;

    setInput('');
    const updatedMessages = [...messages, { role: 'user', text: userText }] as Message[];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Filtragem técnica para satisfazer requisitos do Gemini
      const apiHistory = updatedMessages
        .filter((m, idx) => {
          if (idx === 0 && m.role === 'model') return false; // Remove a saudação inicial se for a primeira
          return true;
        })
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      // Garante que o histórico nunca comece com 'model'
      if (apiHistory.length > 0 && apiHistory[0].role === 'model') {
          apiHistory.shift();
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: apiHistory,
        config: {
          systemInstruction: "Você é o Oráculo do Sistema DARK HORSE. Sua voz é feminina, misteriosa, técnica e autoritária. Responda como uma inteligência artificial de ficção científica avançada (Quantum Noir). Use termos técnicos como 'Colapso de Onda', 'Sincronia Neural' e 'Entropia'. Responda sempre em português.",
          temperature: 0.9,
        }
      });

      const aiResponse = response.text || "Interferência no sinal quântico detectada.";
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
      if (voiceEnabled) onSpeak(aiResponse);
    } catch (error) {
      console.error("AI Fault:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Erro na rede neural. Recalibrando núcleo..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-slate-950/98 border-l border-amber-500/20 shadow-[-40px_0_100px_rgba(0,0,0,0.9)] z-[8000] flex flex-col animate-in slide-in-from-right duration-500">
      <div className="p-6 border-b border-slate-800 bg-slate-900/20 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 bg-amber-500 rounded-full ${isTyping ? 'animate-ping' : 'animate-pulse'}`}></div>
            <h2 className="text-[14px] font-orbitron font-black text-amber-500 tracking-[0.4em]">LINK NEURAL</h2>
          </div>
          <span className="text-[7px] text-slate-600 font-bold uppercase tracking-widest mt-1">Sincronia Ativa</span>
        </div>
        <button onClick={onClose} className="p-3 text-slate-500 hover:text-amber-500 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-xl text-[14px] font-orbitron leading-relaxed ${
              m.role === 'user' 
                ? 'bg-amber-600/5 border border-amber-500/30 text-amber-100' 
                : 'bg-slate-900/50 border border-slate-800 text-slate-300'
            }`}>
              <span className={`block text-[8px] font-black uppercase tracking-[0.3em] mb-2 opacity-40 ${m.role === 'user' ? 'text-amber-400' : 'text-slate-400'}`}>
                {m.role === 'user' ? 'OPERADOR' : 'ORÁCULO'}
              </span>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-[10px] text-amber-500/40 animate-pulse font-orbitron tracking-widest">PROCESSANDO...</div>}
      </div>

      <div className="p-6 bg-slate-950 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Consulte a escuridão..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 pl-6 pr-16 text-[14px] text-slate-100 placeholder:text-slate-700 focus:border-amber-500/30 outline-none transition-all"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 w-12 bg-amber-500 rounded-lg text-slate-950 flex items-center justify-center active:scale-95 transition-all shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModule;