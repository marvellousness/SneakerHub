import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, 
  Sparkles, Ticket, Percent, ChevronRight 
} from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, amount: number) => void;
  onRemoveItem: (id: string) => void;
  onNavigateToProducts: () => void;
  onStartCheckout: () => void;
  onApplyPromoCode: (percentage: number, code: string) => void;
  appliedDiscountPercentage: number;
  appliedDiscountCode: string;
}

export default function CartView({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onNavigateToProducts,
  onStartCheckout,
  onApplyPromoCode,
  appliedDiscountPercentage,
  appliedDiscountCode
}: CartViewProps) {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const activePrice = item.product.discountPrice || item.product.price;
      return sum + (activePrice * item.quantity);
    }, 0);
  }, [cartItems]);

  // SLES FREE EXPRESS DYNAMIC METRIC
  const FREE_SHIPPING_LIMIT = 200;
  const isFreeShipping = subtotal >= FREE_SHIPPING_LIMIT;
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_LIMIT) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_LIMIT - subtotal;

  // Calculatables
  const dPrice = subtotal * (appliedDiscountPercentage / 100);
  const tax = (subtotal - dPrice) * 0.08; // 8% tax
  const shipping = subtotal > 0 ? (isFreeShipping ? 0 : 15.00) : 0;
  const total = subtotal > 0 ? (subtotal - dPrice + tax + shipping) : 0;

  // Manual code voucher submission
  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    
    const formatted = promoInput.trim().toUpperCase();
    if (formatted === "SNEAKERHUB15") {
      onApplyPromoCode(15, "SNEAKERHUB15");
      setPromoSuccess("Woot! 15% VIP Shopping coupon code loaded.");
      setPromoError("");
    } else if (formatted === "KICKS20" || formatted === "SCRATCH20") {
      onApplyPromoCode(20, formatted);
      setPromoSuccess(`Epic! 20% Off coupon code applied!`);
      setPromoError("");
    } else if (formatted === "RUNNER25") {
      onApplyPromoCode(25, "RUNNER25");
      setPromoSuccess("Master! 25% Specialist coupon code loaded.");
      setPromoError("");
    } else {
      setPromoError("Voucher expired or invalid coupon model.");
      setPromoSuccess("");
    }
  };

  return (
    <div id="cart-view-container" className="pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none text-left px-4 bg-white">
      
      {cartItems.length === 0 ? (
        /* Empty Cart elements */
        <div id="cart-empty-state" className="py-16 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 border border-slate-150 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Your Shopping Cart is Empty</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto font-medium">Discover the latest limited releases from Nike, Adidas, and Jordan.</p>
          </div>
          <button
            id="cart-shop-now-btn"
            onClick={onNavigateToProducts}
            className="px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold shadow-sm hover:bg-slate-900 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
          >
            Explore Hot Releases
          </button>
        </div>
      ) : (
        /* Filled Cart structure */
        <div id="cart-shopping-panel" className="space-y-5 pt-3">
          
          {/* FREE EXPRESS SHIPPING MILESTONE PROGRESS METRIC */}
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-left space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-[11px] leading-tight">
              {isFreeShipping ? (
                <span className="font-extrabold text-orange-600 flex items-center gap-1 uppercase tracking-tight">
                  🎉 Free Express Delivery unlocked!
                </span>
              ) : (
                <span className="font-medium text-slate-500">
                  Add <strong className="text-slate-900 font-mono">${remainingForFreeShipping.toFixed(2)}</strong> more for <strong className="text-slate-900">Free Delivery</strong>
                </span>
              )}
              <span className="text-[10px] font-mono text-slate-400 font-bold max-w-[200px] truncate leading-none uppercase">Limit: $200.00</span>
            </div>
            
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                style={{ width: `${progressToFreeShipping}%` }} 
                className={`h-full rounded-full transition-all duration-500 ${
                  isFreeShipping ? "bg-orange-500" : "bg-black"
                }`}
              />
            </div>
          </div>

          {/* SNEAKER BAG ITEMS */}
          <div className="space-y-2.5">
            <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Your Sneaker Selection</span>
            
            <div className="space-y-2">
              {cartItems.map((item) => {
                const activePrice = item.product.discountPrice || item.product.price;
                return (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    className="bg-white border border-slate-100 p-2.5 rounded-xl flex items-center gap-3 relative shadow-xs"
                  >
                    {/* Image thumb */}
                    <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    {/* Details and controls */}
                    <div className="flex-1 text-left leading-none space-y-1.5 min-w-0 pr-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 truncate leading-none uppercase tracking-tight">{item.product.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase font-mono mt-1">
                          Size US {item.size} • Color: {item.colorName}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 font-mono">
                          ${(activePrice * item.quantity).toFixed(2)}
                        </span>

                        {/* Adjust qty buttons */}
                        <div className="flex items-center border border-slate-150 rounded-lg bg-slate-50 leading-none overflow-hidden">
                          <button
                            id={`qty-minus-${item.id}`}
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 px-1.5 text-slate-500 hover:text-black hover:bg-slate-100 transition-all cursor-pointer"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="px-1.5 text-[11px] font-black text-slate-900 font-mono select-none">{item.quantity}</span>
                          <button
                            id={`qty-plus-${item.id}`}
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 px-1.5 text-slate-500 hover:text-black hover:bg-slate-100 transition-all cursor-pointer"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete action button */}
                    <button
                      id={`delete-cart-item-${item.id}`}
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute top-2.5 right-2.5 text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* VOUCHER APPLICATION CARD */}
          <div id="promo-voucher-apply-block" className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left space-y-2">
            <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block tracking-wider">Store Promo Code</span>
            
            <form onSubmit={handlePromoSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Ticket className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                <input
                  id="promo-code-input"
                  type="text"
                  placeholder="e.g. SNEAKERHUB15"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full bg-white border border-slate-150 rounded-lg pl-7.5 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-black uppercase font-mono"
                />
              </div>
              <button
                id="apply-promo-btn"
                type="submit"
                className="bg-black text-white text-[11px] font-bold px-3.5 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer select-none uppercase tracking-wide"
              >
                Apply
              </button>
            </form>

            {promoError && <p className="text-[10px] text-red-600 leading-none mt-1 font-medium">{promoError}</p>}
            {promoSuccess && <p className="text-[10px] text-orange-600 leading-none font-bold mt-1">{promoSuccess}</p>}
            
            {appliedDiscountCode && (
              <div className="flex items-center justify-between text-[11px] bg-orange-50 text-orange-850 p-1.5 rounded border border-orange-100">
                <span className="flex items-center gap-1 font-bold uppercase text-[9px] tracking-wide">
                  <Percent size={10} /> {appliedDiscountCode} Applied
                </span>
                <span className="font-mono font-bold">-{appliedDiscountPercentage}% OFF</span>
              </div>
            )}
          </div>

          {/* ORDER PRICING SUMMARY BILL */}
          <div id="cart-order-summary-card" className="bg-white border border-slate-100 rounded-xl p-4 text-left space-y-2.5 shadow-xs">
            <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none font-medium">Checkout Breakdown</span>
            
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50 font-medium text-slate-500 leading-none">
                <span>Subtotal ({cartItems.length} sneaker pair)</span>
                <span className="text-slate-800 font-bold font-mono">${subtotal.toFixed(2)}</span>
              </div>
              
              {appliedDiscountPercentage > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-50 font-bold text-orange-600 bg-orange-50/40 px-1 rounded border border-orange-100/50 leading-none">
                  <span className="text-[11px]">Discount Coupon ({appliedDiscountCode})</span>
                  <span className="font-mono">-${dPrice.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-50 font-medium text-slate-500 leading-none">
                <span>Estimated Sales Tax (8%)</span>
                <span className="text-slate-800 font-bold font-mono">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50 font-medium text-slate-500 leading-none">
                <span>Express Courier Shipping</span>
                {shipping === 0 ? (
                  <span className="text-orange-500 uppercase font-black text-[9px] tracking-wide">Free Express Premium</span>
                ) : (
                  <span className="text-slate-800 font-bold font-mono">${shipping.toFixed(2)}</span>
                )}
              </div>

              <div className="flex justify-between pt-2 text-xs font-black text-slate-900 uppercase tracking-widest leading-none font-sans">
                <span>Total Amount Due</span>
                <span className="font-mono text-black text-sm">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Secure Shield tag */}
            <div className="flex items-center justify-center gap-1 bg-slate-50 py-1.5 mt-2 rounded border border-slate-100 text-[9px] text-slate-400 font-semibold">
              <ShieldCheck size={12} className="text-orange-500" />
              <span>SSL Secure 256-Bit Financial Encryption</span>
            </div>
          </div>

          {/* MAIN PROCEED CHECKOUT CTA */}
          <button
            id="cart-action-proceed-checkout"
            onClick={onStartCheckout}
            className="w-full py-4 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            Proceed to Secure Checkout
            <ArrowRight size={14} />
          </button>

        </div>
      )}

    </div>
  );
}
