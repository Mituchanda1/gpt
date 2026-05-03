import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, BrainCircuit, Terminal, Cpu } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function SurveyGPT() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', text: 'Identity verified. GPT optimization module initialized. State the survey metadata or query you wish to analyze.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: (process.env as any).GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-latest",
        contents: [
            { role: "user", parts: [{ text: `You are an AI assistant for a Survey Offerwall platform called OfferGPT based on findejob.com. Your goal is to help users earn more points by giving them tips, explaining simple concepts, and acting as a technical co-pilot. User says: ${userMsg}` }] }
        ],
        config: {
          systemInstruction: "You are the OfferGPT System AI. Speak like a professional technical assistant. Use terms like 'node', 'logic', 'protocol', 'verification'. Be helpful and concise. Keep formatting clean with monospaced accents.",
          temperature: 0.7,
        }
      });

      const aiText = response.text || "Communication link failure. Please retry.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error) {
      console.error('AI Error', error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Error: AI engine timeout. Verify connection to findejob.com nodes." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col pt-4">
      <header className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
                <BrainCircuit size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">GPT <span className="text-emerald-500">Copilot</span></h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Node: Assistant-V4 // Status: Synced</p>
            </div>
        </div>
        <div className="hidden sm:flex items-center gap-6 glass px-6 py-2 rounded-full border border-white/5">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Core Online</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
                <Cpu size={14} className="text-slate-500" />
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Hostinger VPS Active</span>
            </div>
        </div>
      </header>

      <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col relative border border-white/10 shadow-2xl">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide" ref={scrollRef}>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-lg ${msg.role === 'assistant' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                  {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-white/[0.04] text-slate-200 border border-white/5' : 'bg-emerald-500/10 text-white border border-emerald-500/20'}`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500 text-white border border-white/10 shadow-lg">
                        <Bot size={20} />
                    </div>
                    <div className="flex gap-1.5 items-center p-5 bg-white/[0.04] rounded-2xl border border-white/5">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-[#0d0d0d]/80 backdrop-blur-md border-t border-white/5">
          <div className="max-w-3xl mx-auto flex gap-4">
             <div className="flex-1 relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Analyze survey node..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all text-sm"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 text-[10px] font-bold uppercase tracking-widest pointer-events-none hidden md:block">
                   Press Enter
                </div>
             </div>
             <button 
               onClick={handleSend}
               disabled={!input.trim() || isTyping}
               className="bg-emerald-500 text-white px-8 rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20 active:scale-95 group"
             >
               <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </button>
          </div>
        </div>
      </div>

      <footer className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass px-3 py-1 rounded-full border border-white/5">
                  <Terminal size={12} className="text-emerald-500" />
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">ID: 0x{Math.floor(Math.random()*1000000).toString(16).toUpperCase()}</span>
              </div>
              <div className="text-[10px] text-slate-600 italic">Connected to findejob.com Production API</div>
          </div>
          <p className="text-[10px] text-slate-700 uppercase font-bold tracking-tight">AI Confidence Rating: 99.4%</p>
      </footer>
    </div>
  );
}
