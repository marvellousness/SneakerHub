import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Star, Heart, ArrowLeft, ShieldCheck, ChevronDown, 
  ChevronUp, Truck, RotateCcw, Send, CheckCircle2, ShoppingCart, MessageSquarePlus 
} from 'lucide-react';
import { SneakerProduct } from '../types';

interface ProductDetailViewProps {
  product: SneakerProduct;
  onBack: () => void;
  onToggleWishlist: (product: SneakerProduct) => void;
  wishlistIds: string[];
  onAddToCart: (product: SneakerProduct, size: number, color: any) => void;
  onAddReview: (productId: string, review: { username: string; rating: number; title: string; comment: string }) => void;
}

export default function ProductDetailView({
  product,
  onBack,
  onToggleWishlist,
  wishlistIds,
  onAddToCart,
  onAddReview
}: ProductDetailViewProps) {
  const isWishlisted = wishlistIds.includes(product.id);
  
  // Detail States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(product.sizes[0]);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [showSpecs, setShowSpecs] = useState(false);
  
  // Review Form States
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [errorText, setErrorText] = useState("");

  // Swap color handler
  const handleColorSelect = (index: number, imageIndex: number) => {
    setSelectedColorIndex(index);
    setActiveImageIndex(imageIndex); // Swaps main gallery asset to match selected color!
  };

  // Submit Review form handler
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewTitle.trim() || !reviewComment.trim()) {
      setErrorText("Kindly fill in all review fields.");
      return;
    }
    
    onAddReview(product.id, {
      username: reviewName,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment
    });

    setReviewSuccess(true);
    setErrorText("");
    
    // Clear form
    setReviewName("");
    setReviewTitle("");
    setReviewComment("");
    
    // Timed reset of banner
    setTimeout(() => {
      setReviewSuccess(false);
    }, 4000);
  };

  // Compute review statistics bars
  const starDistributions = React.useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    product.reviews.forEach(rec => {
      const r = Math.round(rec.rating) as 5|4|3|2|1;
      if (counts[r] !== undefined) counts[r]++;
    });
    const total = product.reviews.length || 1;
    return {
      5: Math.round((counts[5] / total) * 100),
      4: Math.round((counts[4] / total) * 100),
      3: Math.round((counts[3] / total) * 100),
      2: Math.round((counts[2] / total) * 100),
      1: Math.round((counts[1] / total) * 100)
    };
  }, [product.reviews]);

  return (
    <div id="product-detail-container" className="pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none text-left px-4 bg-white">
      
      {/* 1. TOP ACCESS NAVIGATION BAR */}
      <div id="detail-nav-bar" className="flex items-center justify-between py-3 bg-white sticky top-0 z-20 border-b border-slate-100">
        <button
          id="detail-back-btn"
          onClick={onBack}
          className="w-9 h-9 border border-slate-200 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-800 cursor-pointer transition-all active:scale-95"
        >
          <ArrowLeft size={16} />
        </button>

        <span className="text-xs font-bold font-sans uppercase tracking-widest text-black leading-none italic">
          {product.brand}
        </span>

        <button
          id="detail-wishlist-toggle"
          onClick={() => onToggleWishlist(product)}
          className="w-9 h-9 border border-slate-200 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all cursor-pointer active:scale-95"
        >
          <Heart size={16} className={isWishlisted ? "fill-rose-500 text-rose-500 text-rose-500" : ""} />
        </button>
      </div>

      {/* 2. DYNAMIC IMAGES GALLERY STAGE */}
      <div id="product-images-gallery" className="space-y-3 pt-3">
        <div className="w-full h-64 bg-slate-50 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-100">
          <img
            src={product.images[activeImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-300"
            referrerPolicy="no-referrer"
          />
          {product.discountPrice && (
            <span className="absolute top-3 left-3 bg-orange-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase">
              Sale Range
            </span>
          )}
        </div>

        {/* Carousel indicators list */}
        <div className="flex gap-2 justify-center">
          {product.images.map((img, idx) => (
            <button
              id={`gallery-indicator-${idx}`}
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`w-14 h-14 rounded-xl border-2 overflow-hidden bg-slate-50 transition-all cursor-pointer ${
                activeImageIndex === idx ? "border-black scale-102" : "border-slate-205 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      </div>

      {/* 3. CORE SNEAKER TITLE & PRICING ELEMENT */}
      <div id="product-title-pricing" className="pt-4 space-y-1.5">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-750 rounded uppercase border border-slate-200/50">
            {product.category}
          </span>
          {product.isHot && (
            <span className="text-[9px] font-black px-2 py-0.5 bg-black text-white rounded font-sans uppercase tracking-wider">
              Limited Drop
            </span>
          )}
        </div>

        <h1 className="text-xl font-black text-slate-900 leading-tight uppercase font-sans tracking-tight">
          {product.name}
        </h1>

        {/* Star highlights & stock alert counts */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-500">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-black text-slate-800 ml-0.5 leading-none">{product.rating}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">({product.reviewsCount} verified reviews)</span>
          </div>

          <div className="text-right">
            {product.stock <= 5 ? (
              <span className="text-[9px] text-rose-600 bg-rose-50 font-bold px-2 py-0.5 rounded border border-rose-100 uppercase animate-pulse">
                Only {product.stock} units!
              </span>
            ) : (
              <span className="text-[9px] text-slate-650 bg-slate-50 font-bold px-2 py-0.5 rounded border border-slate-200 uppercase">
                Fully Stocked
              </span>
            )}
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 mt-2.5 flex items-baseline gap-2.5">
          {product.discountPrice ? (
            <>
              <span className="text-2xl font-black text-slate-900">${product.discountPrice.toFixed(2)}</span>
              <span className="text-sm text-slate-400 line-through">${product.price.toFixed(2)}</span>
              <span className="text-xs bg-orange-50 text-orange-600 font-extrabold px-1.5 py-0.5 rounded border border-orange-100">
                Save ${(product.price - product.discountPrice).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-black text-slate-905">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* 4. SELECT COLOR RADIAL BUTTONS */}
      <div id="product-color-selector" className="pt-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block font-sans">
            SELECT COLOR:
          </span>
          <span className="text-[10px] font-bold text-slate-700 uppercase font-mono bg-slate-50 border border-slate-150 rounded px-2 py-0.5">
            {product.colors[selectedColorIndex].name}
          </span>
        </div>

        <div className="flex gap-2.5">
          {product.colors.map((color, idx) => (
            <button
              id={`color-circle-${color.name.toLowerCase().replace(' ', '-')}`}
              key={idx}
              onClick={() => handleColorSelect(idx, color.imageIndex)}
              style={{ backgroundColor: color.hex }}
              className={`w-9 h-9 rounded-full border-3 cursor-pointer shadow-xs relative transition-all ${
                selectedColorIndex === idx ? "border-black scale-105 shadow-sm" : "border-white hover:border-slate-300"
              }`}
              title={color.name}
            >
              {selectedColorIndex === idx && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mix-blend-difference" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 5. SELECT US SHOE SIZES GRID */}
      <div id="product-size-selector" className="pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block font-sans">
            SELECT US SIZE:
          </span>
          <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-150 rounded px-1.5 py-0.5 font-mono uppercase">Standard Fit</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {product.sizes.map((sz) => (
            <button
              id={`size-box-${String(sz).replace('.', '-')}`}
              key={sz}
              onClick={() => setSelectedSize(sz)}
              className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer font-mono ${
                selectedSize === sz 
                  ? "bg-black border-black text-white shadow font-black" 
                  : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>

        {/* Size Advisor block */}
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-start gap-2 text-[10px] leading-relaxed text-slate-400 mt-2">
          <span className="font-extrabold text-slate-700 uppercase shrink-0 font-mono">Fit Advisor:</span>
          <span>{product.designerNote || "True to size. Standard athletic fitting. We advise selecting your standard size."}</span>
        </div>
      </div>

      {/* 6. PRIMARY MAIN BUY CTA WORKFLOWS */}
      <div id="product-action-buy-ctas" className="pt-5 border-t border-slate-100 mt-5 space-y-3">
        <button
          id="detail-action-add-to-cart"
          onClick={() => {
            const activeColor = product.colors[selectedColorIndex];
            onAddToCart(product, selectedSize || product.sizes[0], activeColor);
          }}
          className="w-full py-4 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <ShoppingCart size={14} />
          Add to Cart • ${(product.discountPrice || product.price).toFixed(2)}
        </button>

        {/* Policy badges */}
        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 justify-center border-r border-slate-200">
            <Truck size={14} className="text-slate-600" />
            <span>Fast Hub Dispatch</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center font-bold">
            <RotateCcw size={14} className="text-slate-600" />
            <span>30-Day Easy Returns</span>
          </div>
        </div>
      </div>

      {/* 7. SHOE SPECS ACCORDION DETAILS TABLE */}
      <div id="product-specs-accordion" className="pt-4 border-t border-slate-100 mt-4">
        <button
          id="specs-accordion-toggler"
          onClick={() => setShowSpecs(!showSpecs)}
          className="w-full flex items-center justify-between text-slate-950 font-black text-xs uppercase cursor-pointer tracking-wider"
        >
          <span>Footwear Technical Spec Details</span>
          {showSpecs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showSpecs && (
          <div id="specs-accordion-content" className="pt-3 space-y-2 text-xs">
            <p className="text-slate-400 leading-relaxed text-[11px] pb-1 border-b border-slate-100">
              {product.description}
            </p>
            {product.specs.map((spec, i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-slate-50 leading-none">
                <span className="text-slate-400 font-bold uppercase text-[9px] font-mono">{spec.label}</span>
                <span className="text-slate-800 font-black text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. HIGH-END CUSTOMER REVIEWS BOARD */}
      <div id="product-reviews-board" className="pt-6 border-t border-slate-100 mt-6 space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
          User Verified Reviews
        </h3>

        {/* Aggregate distribution block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 border border-slate-100 rounded-xl items-center">
          <div className="text-center md:border-r border-slate-200 space-y-0.5">
            <h4 className="text-3xl font-black text-slate-950 leading-none font-mono">{product.rating}</h4>
            <div className="flex items-center justify-center text-amber-500 mt-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <Star size={14} className={product.rating >= 4.7 ? "fill-amber-400 text-amber-400" : ""} />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Hub Verified Aggregate</p>
          </div>

          <div className="md:col-span-2 space-y-1 text-xs">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="w-3 text-right font-bold text-slate-550 font-mono">{stars}</span>
                <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${(starDistributions as any)[stars] || 0}%` }} 
                    className="bg-slate-800 h-full rounded-full"
                  />
                </div>
                <span className="w-7 text-right text-slate-400 font-mono text-[10px]">{(starDistributions as any)[stars] || 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div id="reviews-items-list" className="space-y-3 pt-2">
          {product.reviews.map((rev) => (
            <div key={rev.id} className="p-3 bg-white border border-slate-100 rounded-xl space-y-1.5 shadow-xs text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 font-sans">{rev.username}</span>
                <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
              </div>
              
              <div className="flex items-center gap-1.5 leading-none">
                <div className="flex text-amber-550 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={10} className={`fill-amber-400 text-amber-500 ${i < rev.rating ? "" : "opacity-20"}`} />
                  ))}
                </div>
                <span className="font-extrabold text-slate-900 leading-none truncate">{rev.title}</span>
              </div>

              <p className="text-slate-500 leading-relaxed text-[11px] font-medium">
                {rev.comment}
              </p>

              {rev.verified && (
                <div className="flex items-center gap-1 text-[9px] text-orange-500 font-bold uppercase tracking-wider font-mono pt-1 leading-none">
                  <ShieldCheck size={10} />
                  <span>Verified Purchase</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 9. WRITE REVIEW FORM TRIGGER SHEET */}
        <div id="submit-review-form-block" className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-slate-900">
            <MessageSquarePlus size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 font-sans">Write customer review</span>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-3">
            {reviewSuccess && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 flex items-center gap-1.5 text-orange-800 text-xs">
                <CheckCircle2 size={14} className="text-orange-500" />
                <span>Your customer evaluation has been published successfully!</span>
              </div>
            )}
            
            {errorText && (
              <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded">
                {errorText}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Your Username</label>
                <input
                  id="review-name-input"
                  type="text"
                  placeholder="e.g. SneakerQueen"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full bg-white border border-slate-150 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Review stars rating</label>
                <select
                  id="review-rating-select"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full bg-white border border-slate-150 rounded-lg px-2.5 py-2 text-xs focus:outline-none font-mono"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                  <option value={2}>⭐⭐ (2/5)</option>
                  <option value={1}>⭐ (1/5)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Review Title</label>
              <input
                id="review-title-input"
                type="text"
                placeholder="e.g. Incredibly robust rebound"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full bg-white border border-slate-150 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Detailed Comment</label>
              <textarea
                id="review-comment-textarea"
                rows={3}
                placeholder="Explain cushioning, width fit, and upper mesh quality details."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-white border border-slate-150 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-black resize-none"
              />
            </div>

            <button
              id="submit-review-btn"
              type="submit"
              className="py-2.5 bg-black text-white rounded-lg text-xs font-bold px-4 hover:bg-slate-900 transition-colors cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 w-full shadow-sm"
            >
              <Send size={12} /> Publish Verified Evaluation
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
