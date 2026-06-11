import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, Star, TrendingUp, X, Heart } from 'lucide-react';
import { SneakerProduct } from '../types';

interface SearchViewProps {
  products: SneakerProduct[];
  onSelectProduct: (id: string) => void;
  onNavigateToAssistant: () => void;
}

export default function SearchView({
  products,
  onSelectProduct,
  onNavigateToAssistant
}: SearchViewProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Alphafly Next", "Jordan retro", "Reebok club classics"
  ]);

  const trendingProducts = useMemo(() => {
    return products.slice(0, 3);
  }, [products]);

  // Clear query
  const handleClear = () => {
    setQuery("");
  };

  // Perform filtering
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [products, query]);

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  const handleRecentDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div id="search-view-container" className="space-y-4 pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none text-left px-4 bg-white">
      
      {/* Search Input Bar */}
      <div id="search-bar-input-box" className="relative mt-2">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          id="live-search-input"
          type="text"
          placeholder="SEARCH BRANDS, SPORTS, DESIGN CODES..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-slate-55 border border-slate-200 rounded-xl pl-10 pr-9 py-3 text-xs focus:outline-none focus:border-black focus:bg-white transition-all shadow-xs font-semibold uppercase tracking-wider text-black placeholder:text-slate-400"
        />
        {query && (
          <button
            id="clear-search-query-btn"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* RENDER DYNAMIC LIVE RESULTS */}
      {query.trim() ? (
        <div id="search-results-list" className="space-y-3">
          <div className="flex justify-between items-center bg-white">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block leading-none">
              MATCHES FOUND ({searchResults.length})
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div id="search-empty-state" className="py-8 text-center space-y-2 pb-12">
              <p className="text-xs text-slate-450 font-medium font-sans">We couldn't find matches for "{query}".</p>
              <div 
                onClick={onNavigateToAssistant}
                className="inline-flex items-center gap-1.5 text-[10px] text-white font-black bg-black border border-black px-4 py-2.5 rounded-xl cursor-pointer hover:bg-slate-900 uppercase tracking-widest font-sans shadow active:scale-95 transition-all text-xs"
              >
                <Sparkles size={11} className="text-orange-400" />
                Consult Shoe Concierge
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {searchResults.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p.id)}
                  className="bg-white border border-slate-150 rounded-xl p-2 flex items-center justify-between hover:border-black cursor-pointer transition-all shadow-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shrink-0">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-left space-y-0.5">
                      <span className="text-[8px] font-mono font-bold uppercase text-slate-400 leading-none">{p.brand}</span>
                      <h4 className="text-xs font-black text-slate-800 leading-tight group-hover:text-black truncate max-w-[170px] uppercase font-sans">{p.name}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] leading-none">
                        <span className="text-black font-mono font-black">${(p.discountPrice || p.price).toFixed(2)}</span>
                        <div className="flex items-center text-orange-500">
                          <Star size={10} className="fill-orange-400 text-orange-400" />
                          <span className="text-[9px] font-bold text-slate-600 ml-0.5">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <X size={12} className="rotate-45 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* TRENDS AND RECENT VISUAL PANEL */
        <div id="search-dashboard-panel" className="space-y-5 pt-1">
          
          {/* AI EXPERT HELP CHIPS */}
          <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-start gap-4">
            <div className="p-2.5 bg-black text-white rounded-lg shadow shrink-0">
              <Sparkles size={14} className="text-orange-400 animate-pulse" />
            </div>
            <div className="space-y-1.5 text-left leading-none">
              <h5 className="text-[11px] font-black text-black leading-tight uppercase tracking-wider font-sans italic">Consult our virtual concierge</h5>
              <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                Tell our Shopping Assistant about your race calendar targets, sizing preferences, or budget brackets to lock in exact recommendations.
              </p>
              <button
                id="search-chat-assistant-shortcut"
                onClick={onNavigateToAssistant}
                className="text-[9px] font-mono font-black uppercase tracking-widest text-white bg-black hover:bg-slate-900 border border-black py-2 px-3 rounded-xl active:scale-95 shadow inline-flex items-center gap-1 cursor-pointer transition-all mt-1"
              >
                Launch Assistant
              </button>
            </div>
          </div>

          {/* RECENT SEARCHES */}
          {recentSearches.length > 0 && (
            <div id="recent-search-logs" className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Recent Searches</span>
              <div className="flex flex-col gap-1.5">
                {recentSearches.map((term, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleRecentClick(term)}
                    className="flex items-center justify-between py-2 border-b border-slate-100 text-xs font-bold text-slate-700 hover:text-black cursor-pointer leading-none"
                  >
                    <span className="uppercase text-[10px] tracking-tight">{term}</span>
                    <button
                      id={`delete-recent-${idx}`}
                      onClick={(e) => handleRecentDelete(e, idx)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRENDING SNEAKERS */}
          <div id="trending-products-section" className="space-y-2 pb-6">
            <div className="flex items-center gap-1 leading-none">
              <TrendingUp size={12} className="text-black" />
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider">Trending Right Now</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {trendingProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p.id)}
                  className="bg-white border border-slate-150 rounded-xl p-2 flex items-center justify-between cursor-pointer hover:border-black shadow-xs group h-14"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shrink-0">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-left leading-none space-y-1">
                      <h4 className="text-xs font-black text-slate-800 group-hover:text-black leading-none truncate max-w-[190px] uppercase font-sans italic">{p.name}</h4>
                      <p className="text-[9px] text-slate-450 uppercase leading-none font-mono font-bold tracking-tight">{p.brand} • {p.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-black leading-none font-mono mr-1">${(p.discountPrice || p.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
