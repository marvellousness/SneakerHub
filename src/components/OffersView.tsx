import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Percent, Sparkles, Gift, Copy, Check, Ticket, 
  RefreshCw, Award, Info, Gamepad2 
} from 'lucide-react';
import { Offer } from '../types';

interface OffersViewProps {
  offers: Offer[];
  onClaimCode: (code: string, percentage: number) => void;
  claimedCodes: string[];
}

export default function OffersView({
  offers,
  onClaimCode,
  claimedCodes
}: OffersViewProps) {
  // Scratch Card local interactive states
  const [isScratched, setIsScratched] = useState(false);
  const [scratchResult, setScratchResult] = useState({ code: "SCRATCH20", percent: 20 });
  const [scratchProgress, setScratchProgress] = useState(0); // 0 to 100
  const [activeTab, setActiveTab] = useState<'coupons'|'scratch'>('coupons');
  const [copiedCode, setCopiedCode] = useState("");

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const simulateScratch = () => {
    // Reveal coupon
    setIsScratched(true);
    onClaimCode(scratchResult.code, scratchResult.percent);
  };

  const resetScratchCard = () => {
    setIsScratched(false);
    // Custom randomizer for scratch prizes
    const prizes = [
      { code: "KICKS20", percent: 20 },
      { code: "SNEAKERHUB15", percent: 15 },
      { code: "RUNNER25", percent: 25 }
    ];
    const picked = prizes[Math.floor(Math.random() * prizes.length)];
    setScratchResult(picked);
  };

  return (
    <div id="offers-view-container" className="pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none text-left px-4 bg-white">
      
      {/* 1. SECTOR TABS HEADERS */}
      <div id="offers-tabs-headers" className="flex bg-slate-50 border border-slate-150 p-1 rounded-xl mt-2 leading-none">
        <button
          id="offers-tab-coupons"
          onClick={() => setActiveTab('coupons')}
          className={`flex-1 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans ${
            activeTab === 'coupons' ? "bg-black text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Ticket size={12} />
          Vouchers
        </button>

        <button
          id="offers-tab-scratch"
          onClick={() => setActiveTab('scratch')}
          className={`flex-1 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans ${
            activeTab === 'scratch' ? "bg-black text-white shadow-sm" : "text-slate-500 hover:text-slate-805"
          }`}
        >
          <Gamepad2 size={12} />
          Scratch Card
        </button>
      </div>

      {activeTab === 'coupons' ? (
        /* 2. DISPLACED COUPONS LIST */
        <div id="coupons-directory-list" className="space-y-4 pt-3.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Hub Active Promos</span>
            <span className="text-[10px] text-slate-450 font-bold bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md uppercase font-mono tracking-tight">Apply on check-out</span>
          </div>

          <div className="space-y-3">
            {offers.map((offer) => {
              const isClaimed = claimedCodes.includes(offer.code);
              return (
                <div
                  key={offer.code}
                  className="bg-white border border-slate-150 rounded-xl p-4 relative flex flex-col justify-between overflow-hidden shadow-xs"
                >
                  {/* Visual perforation circles like actual voucher */}
                  <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-4.5 h-4.5 bg-white border-r border-slate-150 rounded-full" />
                  <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-4.5 h-4.5 bg-white border-l border-slate-150 rounded-full" />
                  
                  {/* Details */}
                  <div className="text-left space-y-1 p-1">
                    <div className="flex justify-between items-start leading-none">
                      <span className="text-[9px] font-mono text-white bg-black rounded px-2 py-0.5 font-bold uppercase tracking-wide">
                        {offer.discountText}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono tracking-tight uppercase">Expires: {offer.expires}</span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 leading-tight uppercase font-sans pt-1.5 italic">
                      {offer.description}
                    </h4>
                    <p className="text-[10px] text-slate-455 leading-relaxed font-sans">
                      Enter at review phase to apply real-time deduction discounts on your final sneakers total.
                    </p>
                  </div>

                  {/* Copy or Apply bottom trigger */}
                  <div className="pt-3 border-t border-dashed border-slate-200 mt-2 flex items-center justify-between">
                    {/* Copy button */}
                    <div className="flex items-center gap-1">
                      <code className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono font-bold text-slate-900 select-all">
                        {offer.code}
                      </code>
                      <button
                        id={`copy-code-${offer.code}`}
                        onClick={() => handleCopyCode(offer.code)}
                        className="p-1.5 hover:bg-slate-50 rounded text-slate-450 hover:text-black transition-colors cursor-pointer"
                        title="Copy coupon code"
                      >
                        {copiedCode === offer.code ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      </button>
                    </div>

                    {/* Apply instantly CTA */}
                    <button
                      id={`apply-code-${offer.code}`}
                      onClick={() => onClaimCode(offer.code, offer.percentage)}
                      disabled={isClaimed}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all cursor-pointer font-sans leading-none ${
                        isClaimed 
                          ? "bg-slate-50 border border-slate-100 text-slate-400 cursor-not-allowed" 
                          : "bg-black text-white hover:bg-slate-900 shadow"
                      }`}
                    >
                      {isClaimed ? "Active" : "Apply"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 3. INTERACTIVE SCRATCH DAILY GAME CONTAINER */
        <div id="scratch-ticket-container" className="space-y-4 pt-3.5">
          <div className="text-left space-y-0.5 animate-none">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Interactive Playground</span>
            <h3 className="text-sm font-black text-slate-950 uppercase font-sans tracking-wide italic">Daily Scratch Ticket</h3>
            <p className="text-[10px] text-slate-450 leading-relaxed font-sans">Swipe your cursor or press the card cover to reveal special daily mystery multipliers.</p>
          </div>

          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center relative overflow-hidden shadow-xs max-w-sm mx-auto">
            
            <AnimatePresence mode="wait">
              {!isScratched ? (
                /* Unscratched overlay mockup */
                <motion.div
                  key="unscratched"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={simulateScratch}
                  className="bg-slate-900 border border-slate-800 p-8 rounded-xl min-h-40 flex flex-col items-center justify-center cursor-pointer shadow-md select-none group text-white"
                >
                  <div className="w-11 h-11 rounded-lg bg-slate-850 flex items-center justify-center text-white group-hover:scale-105 transition-transform border border-slate-750">
                    <Gift size={20} className="text-orange-400 animate-bounce" />
                  </div>
                  <h4 className="text-[11px] font-black tracking-widest uppercase text-white mt-3 font-mono">PRESS TO SCRATCH REVEAL</h4>
                  <p className="text-[9px] text-slate-400 mt-1 uppercase font-mono tracking-wider">Guaranteed multipliers inside</p>
                </motion.div>
              ) : (
                /* Prize revealed container */
                <motion.div
                  key="revealed"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-orange-50/20 border border-orange-200 p-6 rounded-xl min-h-40 flex flex-col items-center justify-center text-slate-900 space-y-3"
                >
                  <div className="flex items-center gap-1 text-orange-550 leading-none">
                    <Sparkles size={14} className="text-orange-500 animate-spin" style={{ animationDuration: '6s' }} />
                    <span className="text-[9px] tracking-widest font-black uppercase font-mono text-orange-650">REVEAL COMPLETED</span>
                  </div>

                  <div className="text-center font-sans">
                    <h4 className="text-2xl font-black text-black tracking-tight italic uppercase">WON {scratchResult.percent}% OFF!</h4>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">System loaded the claimed promotion automatically to active coupons.</p>
                  </div>

                  <div className="flex gap-1 items-stretch justify-center pt-2 leading-none">
                    <code className="bg-white border border-orange-200 rounded px-3 py-1.5 font-mono font-black text-sm text-black flex items-center shadow-xs select-all">
                      {scratchResult.code}
                    </code>
                    <button
                      id="scratch-copy-code-btn"
                      onClick={() => handleCopyCode(scratchResult.code)}
                      className="bg-black hover:bg-slate-900 text-white px-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                    >
                      {copiedCode === scratchResult.code ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  </div>

                  <button
                    id="scratch-play-again-btn"
                    onClick={resetScratchCard}
                    className="text-[10px] font-black text-slate-400 hover:text-black flex items-center gap-1 justify-center pt-2 cursor-pointer leading-none uppercase tracking-wide"
                  >
                    <RefreshCw size={10} /> Scratch New Card
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* SNEAKER PRIZES LEGEND */}
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-left space-y-2.5 shadow-xs">
            <div className="flex items-center gap-1 text-black">
              <Award size={13} className="text-orange-400" />
              <h4 className="text-[10px] font-black uppercase font-mono tracking-wider leading-none">Voucher Pool Breakdown</h4>
            </div>
            
            <div className="space-y-1.5 text-[10px] leading-tight text-slate-500">
              <div className="flex justify-between border-b border-slate-200/50 pb-1.5 font-bold">
                <span className="text-slate-700">🥈 Silver Voucher Drop</span>
                <span className="font-mono text-black">SNEAKERHUB15 (15% Off)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-1.5 font-bold">
                <span className="text-slate-700">🥇 Gold Exclusive Elite</span>
                <span className="font-mono text-black">KICKS20 (20% Off)</span>
              </div>
              <div className="flex justify-between pb-0.5 font-bold">
                <span className="text-slate-700">💎 Platinum Specialist VIP</span>
                <span className="font-mono text-black">RUNNER25 (25% Off)</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
