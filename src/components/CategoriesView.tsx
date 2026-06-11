import React from 'react';
import { motion } from 'motion/react';
import { 
  Footprints, Trophy, Shuffle, Dumbbell, Compass, 
  ChevronRight, ArrowRight, ShieldAlert, Award
} from 'lucide-react';

interface CategoriesViewProps {
  onCategorySelect: (category: string) => void;
}

export default function CategoriesView({ onCategorySelect }: CategoriesViewProps) {
  // Brand list and Category items
  const brandLogos = [
    { name: "Nike", slogan: "Just Do It", count: "3 Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80" },
    { name: "Adidas", slogan: "Impossible is Nothing", count: "1 Shoe", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=150&auto=format&fit=crop&q=80" },
    { name: "New Balance", slogan: "We Stand for Something Bigger", count: "1 Shoe", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=150&auto=format&fit=crop&q=80" },
    { name: "Asics", slogan: "Sound Mind, Sound Body", count: "1 Shoe", image: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=150&auto=format&fit=crop&q=80" },
    { name: "Puma", slogan: "Forever Faster", count: "1 Shoe", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=150&auto=format&fit=crop&q=80" },
    { name: "Reebok", slogan: "Life is Not a Spectator Sport", count: "1 Shoe", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=150&auto=format&fit=crop&q=80" }
  ];

  const sportsCategories = [
    { name: "Running", icon: Footprints, desc: "Marathon racing & recovery trainers", color: "bg-slate-50 text-black hover:bg-slate-100 border-slate-150" },
    { name: "Basketball", icon: Trophy, desc: "High-top court stability & rebound", color: "bg-slate-50 text-black hover:bg-slate-100 border-slate-150" },
    { name: "Lifestyle", icon: Compass, desc: "Street fashion classics & everyday wear", color: "bg-slate-50 text-black hover:bg-slate-100 border-slate-150" },
    { name: "Tennis", icon: Award, desc: "Low-profile retro court favorites", color: "bg-slate-50 text-black hover:bg-slate-100 border-slate-150" }
  ];

  return (
    <div id="categories-view-container" className="space-y-6 pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none px-4 bg-white">
      
      {/* 1. SPORTS CATEGORIES GRID */}
      <div id="sports-categories-section" className="space-y-3 text-left">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Sports Categories</h3>
        <p className="text-[11px] text-slate-400 mt-[-5px]">Engineered support for specific movements</p>
        
        <div className="grid grid-cols-1 gap-2.5">
          {sportsCategories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={cat.name}
                whileTap={{ scale: 0.99 }}
                onClick={() => onCategorySelect(cat.name)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${cat.color} group`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-black text-white rounded-lg shadow-sm block shrink-0">
                    <IconComponent size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-tight group-hover:text-black uppercase tracking-tight">{cat.name}</h4>
                    <p className="text-[10px] text-slate-400 leading-none mt-1 font-medium">{cat.desc}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. BRANDS SNEAKER INDEX */}
      <div id="brand-directories-section" className="space-y-3 text-left">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Brand Directories</h3>
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded uppercase">6 Managed</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {brandLogos.map((brand) => (
            <div
              key={brand.name}
              onClick={() => onCategorySelect(brand.name)}
              className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shrink-0 hover:border-slate-300 cursor-pointer shadow-xs group h-36"
            >
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block leading-none">{brand.count}</span>
                <h4 className="text-xs font-black text-slate-800 leading-tight group-hover:text-black uppercase tracking-tight mt-1">{brand.name}</h4>
                <p className="text-[9px] text-slate-400 leading-none truncate mt-0.5">{brand.slogan}</p>
              </div>

              <div className="h-16 w-full rounded-lg overflow-hidden relative mt-2 bg-slate-50 border border-slate-100/50">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. VERIFIED PRO SHOP POLICY BANNER */}
      <div id="certified-guarantee-banner" className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-left space-y-2">
        <div className="flex items-center gap-1.5 text-slate-900">
          <Footprints size={14} className="text-orange-500" />
          <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-slate-700">Certified SneakerHub Auths</h4>
        </div>
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
          Every pair on SneakerHub is backed by a dual physical inspect guarantee by professional footwear specialists. Complete retail box with tags included as standard.
        </p>
      </div>

    </div>
  );
}
