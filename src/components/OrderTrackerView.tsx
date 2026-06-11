import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, MapPin, Truck, Phone, MessageSquare, 
  Map, ThumbsUp, Calendar, Navigation, Compass, ShieldCheck 
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerViewProps {
  order: Order | null;
  onBack: () => void;
}

export default function OrderTrackerView({
  order,
  onBack
}: OrderTrackerViewProps) {
  // Safe guarding empty states
  if (!order) {
    return (
      <div id="order-tracker-empty" className="py-20 text-center space-y-4 px-4 text-left">
        <MapPin size={48} className="text-zinc-300 mx-auto" />
        <div className="space-y-1">
          <h4 className="text-sm font-black text-zinc-800 text-center">No active package being tracked</h4>
          <p className="text-xs text-zinc-405 text-center max-w-xs mx-auto">Authorize an order in SneakerHub to access live courier delivery maps.</p>
        </div>
        <button onClick={onBack} className="px-4 py-2 bg-zinc-950 text-white text-xs font-bold rounded-lg mx-auto block cursor-pointer">
          Go Back
        </button>
      </div>
    );
  }

  // Active status triggers
  const completedCount = order.trackingHistory.filter(h => h.completed).length;
  // Progress tracker percentage calculation
  const progressPercent = Math.min(((completedCount - 1) / (order.trackingHistory.length - 1)) * 100, 100);

  // Map Animation simulation coords
  const [courierPosition, setCourierPosition] = useState({ x: 35, y: 55 });
  const [etaTime, setEtaTime] = useState(15); // minutes remaining

  // Live map dot motion simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCourierPosition((prev) => {
        // Move slowly towards destination (representingAlex address: x:80, y:25)
        const targetX = 75;
        const targetY = 25;
        
        const newX = prev.x < targetX ? prev.x + 1 : prev.x;
        const newY = prev.y > targetY ? prev.y - 0.6 : prev.y;
        
        // Lower ETA time
        setEtaTime((prevEta) => Math.max(prevEta > 2 ? prevEta - 1 : 2, 2));

        return { x: parseFloat(newX.toFixed(1)), y: parseFloat(newY.toFixed(1)) };
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="order-tracker-container" className="pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none text-left px-4 bg-white">
      
      {/* Tracker Header */}
      <div id="tracker-header-nav" className="flex items-center justify-between py-3 border-b border-slate-100 bg-white sticky top-0 z-20">
        <button
          id="tracker-back-btn"
          onClick={onBack}
          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-800 cursor-pointer hover:bg-slate-50 overflow-hidden"
        >
          <ArrowLeft size={14} />
        </button>
        <span className="text-xs font-black uppercase text-black tracking-widest font-sans italic">
          Live Tracking • {order.id}
        </span>
        <span className="text-[9px] bg-black text-white rounded px-2 py-0.5 font-bold font-mono uppercase tracking-wider border border-black">
          En Route
        </span>
      </div>

      <div id="tracker-dashboard" className="pt-3 space-y-5 bg-white">
        
        {/* 1. MOCK INTEGRATED VECTOR DELVERY MAP */}
        <div id="order-radar-map-block" className="relative h-44 w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
          {/* Simulated secondary vector graphic maps roads */}
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            {/* Grid lines representing roads */}
            <line x1="0" y1="50" x2="100%" y2="50" stroke="#b0b5c0" strokeWidth="2" />
            <line x1="0" y1="120" x2="100%" y2="120" stroke="#b0b5c0" strokeWidth="3" />
            <line x1="50" y1="0" x2="50" y2="100%" stroke="#b0b5c0" strokeWidth="2.5" />
            <line x1="150" y1="0" x2="150" y2="100%" stroke="#b0b5c0" strokeWidth="3" strokeDasharray="3" />
            <line x1="0" y1="20" x2="100%" y2="100" stroke="#b0b5c0" strokeWidth="1.5" />
          </svg>

          {/* Compass layout styling */}
          <div className="absolute top-2.5 left-2.5 bg-white p-1.5 rounded-full shadow-xs text-black border border-slate-250">
            <Compass size={14} className="animate-spin" style={{ animationDuration: '10s' }} />
          </div>

          <div className="absolute bottom-2 left-2 bg-black text-white rounded-lg px-2 py-1 flex items-center gap-1 text-[8px] font-bold font-mono uppercase tracking-wider">
            <Navigation size={9} className="text-orange-400" />
            <span>HQ WAREHOUSE SFO DIRECT</span>
          </div>

          {/* SFO Destination coordinate Pin */}
          <div className="absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2 text-center text-black z-10">
            <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center shadow-md animate-bounce border border-white">
              <MapPin size={10} className="fill-orange-400 text-orange-400" />
            </div>
            <span className="text-[8px] bg-white text-black px-1.5 py-0.5 rounded shadow-xs mt-1 block font-black border border-slate-200 uppercase tracking-wide">Your Porch</span>
          </div>

          {/* Dispatch warehouse start pin coordinates */}
          <div className="absolute top-[55%] left-[30%] -translate-x-1/2 -translate-y-1/2 text-center text-slate-500">
            <div className="w-3 h-3 bg-slate-400 rounded-full flex items-center justify-center border border-white" />
            <span className="text-[7px] bg-slate-50 text-slate-400 px-1 rounded block border border-slate-200">Warehouse</span>
          </div>

          {/* Active Courier Moving Dot */}
          <motion.div 
            animate={{ left: `${courierPosition.x}%`, top: `${courierPosition.y}%` }}
            transition={{ duration: 1 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 text-center"
          >
            <div className="w-6 h-6 bg-black border-2 border-white rounded-full flex items-center justify-center shadow-lg cursor-pointer">
              <Truck size={11} className="text-orange-400 animate-pulse" />
            </div>
            <span className="text-[7px] font-black bg-black text-orange-400 rounded px-1 tracking-tighter mt-0.5 block uppercase border border-slate-800">HubVan</span>
          </motion.div>
        </div>

        {/* 2. DRIVER CONTACT CARD INFORMATION */}
        <div id="driver-contact-card" className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-200 rounded-xl overflow-hidden shrink-0 relative flex items-center justify-center text-slate-800 border border-slate-200">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Courier Driver Marcus" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="text-left space-y-0.5">
              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase leading-none block tracking-wider">DELIVERY COURIER UNIT</span>
              <h4 className="text-xs font-black text-black leading-tight uppercase font-sans">Marcus</h4>
              <p className="text-[10px] text-slate-500 leading-none">Arriving in <strong className="text-black font-mono font-black">{etaTime} Min</strong> • Gold Rank unit</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              id="driver-call-btn"
              onClick={() => alert("Verification Log: Dialing delivery courier Marcus...")}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <Phone size={13} />
            </button>
            <button
              id="driver-chat-btn"
              onClick={() => alert("Verification Log: Opening live courier chat...")}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <MessageSquare size={13} />
            </button>
          </div>
        </div>

        {/* 3. COURIER MILESTONES CHECKLIST PROGRESS */}
        <div id="tracking-milestones-checklist" className="space-y-3.5 pt-1.5">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Courier Steps Progress</span>
          
          <div className="relative pl-7 space-y-5 text-xs text-left">
            {/* Visual connector line indicator */}
            <div className="absolute top-2 bottom-2 left-2.5 w-[2px] bg-slate-100 rounded">
              <div 
                style={{ height: `${progressPercent}%` }} 
                className="bg-black w-full transition-all duration-700"
              />
            </div>

            {order.trackingHistory.map((step, idx) => (
              <div key={idx} className="relative select-none">
                {/* Checkpoint circular nodes */}
                <div 
                  className={`absolute left-[-23px] -translate-x-1/2 top-0.5 w-3 h-3 rounded-full border-2 transition-colors ${
                    step.completed 
                      ? "bg-black border-black" 
                      : "bg-white border-slate-200"
                  }`}
                />
                
                {/* Details layout */}
                <div className="space-y-0.5 leading-none">
                  <div className="flex items-center justify-between leading-none">
                    <h5 className={`font-black uppercase tracking-wide leading-none font-sans text-[11px] ${
                      step.completed ? "text-slate-900 italic font-black" : "text-slate-350"
                    }`}>
                      {step.status}
                    </h5>
                    <span className="text-[9px] font-mono font-bold text-slate-400">{step.date}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans pt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. SECURITY VERIFIED FOOTER BAR */}
        <div id="tracker-secure-footer" className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex items-start gap-3">
          <ShieldCheck size={16} className="text-orange-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-left leading-none">
            <span className="text-[8px] font-mono font-bold text-slate-400 uppercase leading-none block tracking-wider font-bold">SECURE LOG DEPOSIT PLATFORM</span>
            <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
              Driver will perform a photolog validation on dispatching your package. Fully monitored by SneakerHub security protocols.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
