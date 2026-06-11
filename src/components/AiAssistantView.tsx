import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Send, Bot, User, Trash2, ArrowRight, 
  HelpCircle, ChevronRight, CornerDownRight, RefreshCw, Volume2 
} from 'lucide-react';
import { ChatMessage, SneakerProduct } from '../types';

interface AiAssistantViewProps {
  products: SneakerProduct[];
  onSelectProduct: (id: string) => void;
  chatHistory: ChatMessage[];
  onUpdateHistory: (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
}

export default function AiAssistantView({
  products,
  onSelectProduct,
  chatHistory,
  onUpdateHistory
}: AiAssistantViewProps) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Suggested prompt pills
  const promptPills = [
    { text: "Best marathon performance runners?", desc: "Race options & speed specs" },
    { text: "Urban street sneakers under $150?", desc: "Budget fashion styling" },
    { text: "Air Jordan 4 specs & ratings?", desc: "Vintage court details" },
    { text: "Help me choose a running shoe style!", desc: "Pronation & fit advisor" }
  ];

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Appended user input details
    const userMsg: ChatMessage = {
      role: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onUpdateHistory(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chatHistory, userMsg] })
      });
      const data = await response.json();

      const botMsg: ChatMessage = {
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: data.suggestedAction
      };

      onUpdateHistory(prev => [...prev, botMsg]);

    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        role: 'model',
        text: "I apologies, I am having trouble contacting my sneaker database right now. However, I can confidently tell you that our elite **Nike Air Zoom Alphafly V3** ($259.99) is our premium professional racer, while the classic retro leather **Reebok Club C Vintage** ($90.00) is our most popular casual wear silhouette! Can I help you with any sizing questions?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onUpdateHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handleClearHistory = () => {
    onUpdateHistory([
      {
        role: 'model',
        text: "Hello! I am your **SneakerHub AI Concierge**. I possess extensive expert knowledge on sneaker history, running dynamics (neutral/overpronation support), sizing recommendations, and casual streetwear trends.\n\nAsk me anything! For example: *'What are some durable running sneakers under $180?'* or *'Tell me details about the Jordan IV'*.",
        timestamp: "Now"
      }
    ]);
  };

  // Helper parser for embedding product link action widgets below message bubbles
  const renderProductLinks = (text: string) => {
    const textLower = text.toLowerCase();
    const matches: SneakerProduct[] = [];

    // Search matches from the actual catalog
    products.forEach(p => {
      if (textLower.includes(p.name.toLowerCase()) || textLower.includes(p.id.toLowerCase())) {
        if (!matches.some(m => m.id === p.id)) {
          matches.push(p);
        }
      }
    });

    if (matches.length === 0) return null;

    return (
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1 text-xs">
        <span className="text-[9px] font-mono font-bold text-slate-400 block tracking-tight leading-none uppercase">AI Recommended Footwear:</span>
        {matches.map(p => (
          <button
            id={`ai-suggest-nav-${p.id}`}
            key={p.id}
            onClick={() => onSelectProduct(p.id)}
            className="flex items-center justify-between text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-black text-slate-900 cursor-pointer active:scale-95 transition-all w-full mt-1"
          >
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[9px] bg-black text-lime-300 rounded px-1.5 py-0.5 font-bold font-mono tracking-tight">{p.brand}</span>
              <span className="font-sans text-xs text-slate-800 font-extrabold">{p.name}</span>
            </div>
            <span className="text-xs font-mono font-black text-slate-900">${(p.discountPrice || p.price).toFixed(2)}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div id="ai-assistant-container" className="flex flex-col h-full max-h-[calc(100vh-140px)] text-left pb-2 bg-white">
      
      {/* 1. CHAT HEADER CONTROLS */}
      <div id="assistant-header-bar" className="flex items-center justify-between py-2 border-b border-slate-100 px-4 leading-none bg-white">
        <div id="bot-avatar-block" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center relative shadow">
            <Sparkles size={14} className="text-orange-400 animate-pulse" />
          </div>
          <div>
            <h4 id="bot-name" className="text-xs font-black text-slate-900 flex items-center gap-1 font-sans uppercase italic">
              AI Shoe Concierge
              <span className="text-[8px] bg-orange-50 border border-orange-200 text-orange-600 px-1 rounded-sm tracking-wide font-mono font-bold leading-none">Gemini 3.5</span>
            </h4>
            <span className="text-[9px] text-slate-450 font-medium">Virtual shopping assistant online</span>
          </div>
        </div>

        {chatHistory.length > 1 && (
          <button
            id="clear-chat-history"
            onClick={handleClearHistory}
            className="text-[10px] text-slate-400 hover:text-rose-600 flex items-center gap-0.5 cursor-pointer font-bold uppercase tracking-wider"
            title="Reset Chat logs"
          >
            <Trash2 size={11} /> Clear Thread
          </button>
        )}
      </div>

      {/* 2. MESSAGES STREAM SCROLLER */}
      <div id="chat-messages-stream" className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 scrollbar-none bg-white">
        
        {chatHistory.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar block */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border shadow-xs ${
              msg.role === 'user' 
                ? "bg-slate-50 text-slate-700 border-slate-205" 
                : "bg-black text-white border-black"
            }`}>
              {msg.role === 'user' ? <User size={12} /> : <Bot size={12} className="text-orange-400" />}
            </div>

            {/* Bubble details */}
            <div className={`p-3 rounded-xl max-w-[80%] text-xs shadow-xs relative text-left leading-normal ${
              msg.role === 'user' 
                ? "bg-black text-white rounded-tr-none text-right font-medium" 
                : "bg-slate-50 border border-slate-100 rounded-tl-none text-left text-slate-800"
            }`}>
              {/* Formatted body paragraph blocks */}
              <div className="space-y-1.5 whitespace-pre-wrap font-medium">
                {msg.text.split('\n\n').map((para, pIdx) => {
                  // Basic format processing of bold parameters `**bold text**`
                  let formattedText = para;
                  const boldRegex = /\*\*(.*?)\*\*/g;
                  
                  const elements: React.ReactNode[] = [];
                  let lastIdx = 0;
                  let match;
                  
                  while ((match = boldRegex.exec(para)) !== null) {
                    const before = para.substring(lastIdx, match.index);
                    const boldWord = match[1];
                    elements.push(before);
                    elements.push(<strong key={match.index} className="font-extrabold text-black dark:text-orange-500 font-sans">{boldWord}</strong>);
                    lastIdx = boldRegex.lastIndex;
                  }
                  
                  elements.push(para.substring(lastIdx));
                  
                  return (
                    <p key={pIdx}>
                      {elements.length > 0 ? elements : para}
                    </p>
                  );
                })}
              </div>

              {/* Timestamp tags */}
              <span className={`text-[8px] font-mono block mt-1 uppercase text-slate-400 ${msg.role === 'user' ? "text-right" : "text-left"}`}>
                {msg.timestamp}
              </span>

              {/* Renders parsed sneaker link callbacks underneath AI messages */}
              {msg.role === 'model' && renderProductLinks(msg.text)}
            </div>
          </div>
        ))}

        {isTyping && (
          <div id="ai-typing-skeleton" className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0 border border-black">
              <Bot size={12} className="text-orange-400 transform scale-x-[-1]" />
            </div>
            
            {/* Animated Typing Skeleton bubbles */}
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl rounded-tl-none max-w-[120px] flex gap-1 justify-center items-center shadow-xs">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 3. PROMPT SUGGESTION PILLS LIST CARD */}
      {chatHistory.length === 1 && (
        <div id="suggested-assistant-prompts" className="px-4 pb-2 space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Suggested Prompts</span>
          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto scrollbar-none text-left">
            {promptPills.map((pill, idx) => (
              <button
                id={`pref-pill-${idx}`}
                key={idx}
                onClick={() => sendMessage(pill.text)}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl text-left cursor-pointer transition-colors active:scale-99 flex justify-between items-center group shadow-xs leading-none"
              >
                <div>
                  <div className="text-[11px] font-black text-slate-800 group-hover:text-black uppercase tracking-tight">{pill.text}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 leading-none font-medium">{pill.desc}</div>
                </div>
                <CornerDownRight size={10} className="text-slate-400 group-hover:text-black transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. CHAT FORM INPUT SHEETS */}
      <form onSubmit={handleSubmit} className="border-t border-slate-100 p-3 bg-white flex gap-2 items-center">
        <input
          id="assistant-text-field"
          type="text"
          placeholder="Ask sizing fits, marathon pronations..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isTyping}
          className="flex-1 bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:bg-white disabled:opacity-50"
        />
        <button
          id="assistant-send-btn"
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="w-10 h-10 rounded-xl bg-black hover:bg-slate-900 disabled:bg-slate-50 text-white disabled:text-slate-350 flex items-center justify-center transition-all cursor-pointer shadow active:scale-95 shrink-0"
        >
          <Send size={13} className="mr-0.5" />
        </button>
      </form>

    </div>
  );
}
