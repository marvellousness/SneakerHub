import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Award, ArrowRight, Sparkles, Clock, Percent, 
  ShoppingBag, Star, ShieldCheck, Heart, Search, ChevronRight 
} from 'lucide-react';
import { SneakerProduct } from '../types';

interface HomeViewProps {
  products: SneakerProduct[];
  onSelectProduct: (id: string) => void;
  onBrandSelect: (brand: string) => void;
  onNavigateToOffers: () => void;
  onNavigateToAssistant: () => void;
  onToggleWishlist: (product: SneakerProduct) => void;
  wishlistIds: string[];
  onAddToCart: (product: SneakerProduct, size: number, color: any) => void;
}

export default function HomeView({
  products,
  onSelectProduct,
  onBrandSelect,
  onNavigateToOffers,
  onNavigateToAssistant,
  onToggleWishlist,
  wishlistIds,
  onAddToCart
}: HomeViewProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 12 });

  // Banner Slides
  const slides = [
    {
      title: "RUN ON CLOUDS",
      subtitle: "NIKE ZOOMX RACING SERIES",
      description: "Experience absolute kinetic propulsion with the brand-new Nike Alphafly Next% V3. Engineered for champions.",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1000&auto=format&fit=crop&q=80",
      accent: "text-lime-500",
      productId: "prod-zoom-alpha",
      cta: "Shop Speed Range"
    },
    {
      title: "VINTAGE COMFORT",
      subtitle: "REEBOK CLUB C CLASSIC",
      description: "Originally crafted in 1985 for the tennis courts. Reimagined today in buttery garment leather for daily lifestyle comfort.",
      image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1000&auto=format&fit=crop&q=80",
      accent: "text-amber-600",
      productId: "prod-reebok-club",
      cta: "Explore Vintage"
    },
    {
      title: "PREMIUM ELEGANCE",
      subtitle: "NEW BALANCE 990V6",
      description: "Made in the USA from premium pigskin overlays and next-gen FuelCell foam cushioning templates.",
      image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1000&auto=format&fit=crop&q=80",
      accent: "text-orange-500",
      productId: "prod-nb990",
      cta: "Grab Craft Series"
    }
  ];

  // Auto scroll slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Flash sales Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 34, seconds: 12 }; // Loop
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get hot products
  const hotProducts = products.filter(p => p.isHot || p.rating >= 4.8);
  const collections = [
    { name: "Running Era", tag: "Running", bg: "bg-emerald-50 text-emerald-700", desc: "Energy & speed", img: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=300&auto=format&fit=crop&q=80" },
    { name: "Retro Street", tag: "Lifestyle", bg: "bg-blue-50 text-blue-700", desc: "Timeless fashion", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&auto=format&fit=crop&q=80" },
    { name: "Court Legends", tag: "Basketball", bg: "bg-indigo-50 text-indigo-700", desc: "High top stability", img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300&auto=format&fit=crop&q=80" }
  ];

  return (
    <div id="home-view-container" className="space-y-6 pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none px-4 bg-white">
      
      {/* 1. HERO SLIDESHOW */}
      <div id="hero-slideshow" className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden bg-black shadow-md border border-slate-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background image & gradient overlay */}
            <img 
              src={slides[activeSlide].image} 
              alt={slides[activeSlide].title} 
              className="absolute inset-0 w-full h-full object-cover opacity-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black via-black/60 to-transparent" />
            
            {/* Slide Content */}
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <span className={`text-[10px] tracking-widest font-black font-mono uppercase ${slides[activeSlide].accent}`}>
                {slides[activeSlide].subtitle}
              </span>
              <h2 className="text-xl md:text-2xl font-black italic tracking-tighter leading-none text-white uppercase font-sans">
                {slides[activeSlide].title}
              </h2>
              <p className="text-xs text-slate-300 line-clamp-2 max-w-sm font-medium">
                {slides[activeSlide].description}
              </p>
              
              <div className="flex items-center justify-between pt-2">
                <button
                  id={`hero-cta-btn-${activeSlide}`}
                  onClick={() => onSelectProduct(slides[activeSlide].productId)}
                  className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold leading-none hover:bg-slate-100 flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  {slides[activeSlide].cta}
                  <ArrowRight size={12} />
                </button>
                
                {/* Dots indicator */}
                <div className="flex gap-1">
                  {slides.map((_, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeSlide === idx ? "w-4 bg-white" : "w-1.5 bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. DYNAMC AI ASSISTANT PROMPT CHASSIS */}
      <div 
        id="home-ai-consulting-bar" 
        onClick={onNavigateToAssistant}
        className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between shadow-xs cursor-pointer hover:bg-white hover:border-slate-300 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center relative shadow-sm">
            <Sparkles size={18} className="text-orange-400 animate-pulse" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1 uppercase tracking-tight">
              Ask AI Sneaker Expert
              <span className="text-[9px] bg-orange-500 text-white font-bold rounded px-1.5 py-0.5 tracking-tight leading-none">Active</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">"Find best training runners under $180..."</p>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* 3. POPULAR BRANDS SEGMENT */}
      <div id="popular-brands-segment" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Select Brand</h3>
          <span className="text-[10px] font-mono text-slate-300 font-bold uppercase">Premium Auths</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
          {["Nike", "Adidas", "New Balance", "Puma", "Asics", "Reebok"].map((brand) => (
            <button
              id={`brand-btn-${brand.toLowerCase().replace(' ', '-')}`}
              key={brand}
              onClick={() => onBrandSelect(brand)}
              className="px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold uppercase text-slate-600 hover:bg-black hover:text-white hover:border-black transition-all shrink-0 snap-start cursor-pointer shadow-xs active:scale-95"
            >
              <span>{brand}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. FLASH SALE & DISCOUNTS BAR */}
      <div id="flash-sale-bar" className="bg-orange-50/70 border border-orange-100 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Clock size={16} className="text-orange-600 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="text-left">
            <span className="text-[10px] font-bold text-orange-700 tracking-widest font-mono uppercase">FLASH OFFERS ACTIVE</span>
            <div className="text-xs font-black text-slate-950 leading-none">Limited Sizes Dropping Fast</div>
          </div>
        </div>
        
        {/* Countdown display */}
        <div className="flex items-center gap-1 font-mono text-xs font-black text-orange-950">
          <span className="bg-orange-950 text-white rounded px-1.5 py-0.5">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span>:</span>
          <span className="bg-orange-950 text-white rounded px-1.5 py-0.5">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span>:</span>
          <span className="bg-orange-950 text-white rounded px-1.5 py-0.5">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>

      {/* 5. HOT LAUNCHES / TRENDING SNEAKERS */}
      <div id="hot-launches-segment" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame size={16} className="text-orange-500 fill-orange-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Hot Restocks</h3>
          </div>
          <button id="view-all-launches" onClick={() => onBrandSelect("All")} className="text-xs font-bold text-slate-500 hover:text-black flex items-center gap-0.5">
            View All <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {hotProducts.slice(0, 4).map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -3 }}
                className="bg-white border border-slate-100 rounded-xl p-2.5 flex flex-col relative group shadow-sm"
              >
                {/* Hot Tag or Discount Tag */}
                {product.discountPrice ? (
                  <span className="absolute top-2 left-2 z-10 bg-orange-500 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 z-10 bg-black text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Hot
                  </span>
                )}

                {/* Wishlist Button */}
                <button
                  id={`wishlist-toggle-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  className="absolute top-2 right-2 z-10 w-7 h-7 bg-white shadow rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 active:scale-90 transition-all cursor-pointer"
                >
                  <Heart size={14} className={isWishlisted ? "fill-rose-500 text-rose-500" : ""} />
                </button>

                {/* Sneaker Thumbnail */}
                <div 
                  onClick={() => onSelectProduct(product.id)}
                  className="w-full h-28 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center relative cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {product.stock <= 5 && (
                    <div className="absolute bottom-1 right-1 bg-red-50 text-red-700 font-mono text-[8px] font-bold px-1 rounded">
                      Only {product.stock} left
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="text-left pt-2 space-y-0.5 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 block uppercase leading-none font-mono tracking-wider">
                      {product.brand}
                    </span>
                    <h4 
                      onClick={() => onSelectProduct(product.id)}
                      className="text-xs font-bold text-slate-800 group-hover:text-black transition-colors line-clamp-1 py-0.5 cursor-pointer font-sans"
                    >
                      {product.name}
                    </h4>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-black text-slate-650 leading-none">{product.rating}</span>
                      <span className="text-[9px] text-slate-400">({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Pricing footer */}
                  <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-slate-100">
                    <div className="flex flex-col">
                      {product.discountPrice ? (
                        <>
                          <span className="text-xs font-black text-slate-900 leading-none">${product.discountPrice.toFixed(2)}</span>
                          <span className="text-[9px] text-slate-400 line-through leading-none">${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-xs font-black text-slate-900 leading-none">${product.price.toFixed(2)}</span>
                      )}
                    </div>

                    <button
                      id={`home-add-cart-${product.id}`}
                      onClick={() => onAddToCart(product, product.sizes[0], product.colors[0])}
                      className="bg-black text-white rounded-lg p-1.5 hover:bg-slate-900 transition-colors cursor-pointer shadow-xs active:scale-95"
                    >
                      <ShoppingBag size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 6. STYLE SEGMENTS BENTO COLLECTIONS */}
      <div id="lifestyle-bento-collections" className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Shop By Scene</h3>
          <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-50 border border-slate-150 rounded px-1.5 py-0.5 uppercase">Custom Fits</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {collections.map((col) => (
            <div 
              key={col.name}
              onClick={() => onBrandSelect(col.tag)}
              className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden text-center cursor-pointer hover:border-slate-300 hover:shadow-xs transition-all group flex flex-col h-32 justify-between"
            >
              <div className="p-2 text-left">
                <span className={`text-[8px] font-black uppercase px-1 py-0.5 rounded leading-none ${col.bg}`}>
                  {col.tag}
                </span>
                <div className="text-[11px] font-black text-slate-800 mt-1.5 truncate group-hover:text-black">{col.name}</div>
                <div className="text-[9px] text-slate-400 leading-none truncate mt-0.5 font-medium">{col.desc}</div>
              </div>
              <div className="h-16 w-full overflow-hidden relative mt-1">
                <img 
                  src={col.img} 
                  alt={col.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. DAILY SCRATCH SCRAPE COUPON VIBE */}
      <div 
        id="scratch-card-teaser"
        onClick={onNavigateToOffers}
        className="relative bg-black rounded-xl p-4 text-white text-left overflow-hidden shadow-md cursor-pointer group border border-slate-100"
      >
        {/* Decorative circle */}
        <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
            <Percent size={18} />
          </div>
          <div>
            <div className="text-xs font-black tracking-normal text-white flex items-center gap-1.5">
              Interactive Offers Active!
              <span className="text-[8px] tracking-wide font-black bg-orange-500 text-white px-1 py-0.5 rounded uppercase leading-none">NEW</span>
            </div>
            <p className="text-[11px] text-slate-300 max-w-xs mt-1.5 font-medium">
              Scratch & Win daily shopping vouchers on our virtual ticket. Claim up to 25% off.
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-extrabold text-slate-400">
          <span>Claimable items refreshed daily</span>
          <span className="text-white group-hover:translate-x-0.5 transition-all flex items-center gap-0.5 leading-none">
            Scratch Ticket <ArrowRight size={10} />
          </span>
        </div>
      </div>

      {/* 8. SNEAKERHUB LOYALTY CARD */}
      <div id="loyalty-card-teaser" className="bg-black text-white rounded-xl p-4 text-left shadow relative overflow-hidden border border-slate-900">
        <div className="absolute bottom-[-15px] right-[-15px] text-slate-800 text-6xl font-black font-sans opacity-25 pointer-events-none italic uppercase">Hub</div>
        <div className="flex items-center gap-1">
          <Award size={14} className="text-amber-300" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 leading-none">VIP Platinum Tier</span>
        </div>
        <h4 className="text-sm font-black mt-1.5 leading-none text-white font-sans uppercase tracking-tight">Alex Devmaster</h4>
        <p className="text-[10px] text-slate-400 mt-1">Account ID: SH-VIP-2026Master</p>
        
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-900">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-mono font-bold uppercase">AVAILABLE POINTS</span>
            <span className="text-sm font-mono font-bold text-amber-300 leading-none mt-0.5">1,250 PTS</span>
          </div>
          <div className="bg-slate-900 hover:bg-slate-800 border border-slate-850 px-3 py-1.5 rounded-lg text-[9px] font-bold text-slate-300 cursor-pointer shadow-sm transition-all active:scale-95 select-none uppercase">
            Claim Rewards
          </div>
        </div>
      </div>

    </div>
  );
}
