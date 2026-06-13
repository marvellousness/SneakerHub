import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Calendar, Package, ShoppingBag, ChevronDown, ChevronUp, MapPin, 
  CreditCard, ExternalLink, ChevronRight, HelpCircle, Truck, ClipboardList,
  ArrowUpDown, Star, Smile
} from 'lucide-react';
import { Order } from '../types';

interface OrderHistoryViewProps {
  orders: Order[];
  onBack: () => void;
  onTrackOrder: (order: Order) => void;
  onNavigateToShop: () => void;
  onSelectOrder: (order: Order) => void;
}

export default function OrderHistoryView({
  orders,
  onBack,
  onTrackOrder,
  onNavigateToShop,
  onSelectOrder
}: OrderHistoryViewProps) {
  // Sorting options: 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc'
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'price-desc' | 'price-asc'>('date-desc');

  // Keep track of which order card is expanded
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(orders.length > 0 ? orders[0].id : null);

  // Ratings persistence
  const [ratings, setRatings] = useState<Record<string, { rating: number; feedback: string; submitted: boolean; date: string }>>(() => {
    try {
      const saved = localStorage.getItem('sneakerhub_order_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Draft ratings & feedback before submission
  const [draftRating, setDraftRating] = useState<Record<string, number>>({});
  const [draftFeedback, setDraftFeedback] = useState<Record<string, string>>({});
  // Hover effect over star index per order
  const [hoverRating, setHoverRating] = useState<Record<string, number>>({});

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  const handleSaveRating = (orderId: string) => {
    const rLabel = draftRating[orderId] || 0;
    if (rLabel === 0) return;

    const updated = {
      ...ratings,
      [orderId]: {
        rating: rLabel,
        feedback: draftFeedback[orderId] || '',
        submitted: true,
        date: new Date().toISOString()
      }
    };
    setRatings(updated);
    try {
      localStorage.setItem('sneakerhub_order_ratings', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage exception:", e);
    }
  };

  const handleResetRating = (orderId: string) => {
    const updated = { ...ratings };
    delete updated[orderId];
    setRatings(updated);
    try {
      localStorage.setItem('sneakerhub_order_ratings', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage exception:", e);
    }

    // Reset draft fields as well
    setDraftRating(prev => ({ ...prev, [orderId]: 0 }));
    setDraftFeedback(prev => ({ ...prev, [orderId]: '' }));
  };

  // Derived sorted orders array
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'date-asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'price-desc') {
      return b.priceBreakdown.total - a.priceBreakdown.total;
    }
    if (sortBy === 'price-asc') {
      return a.priceBreakdown.total - b.priceBreakdown.total;
    }
    return 0;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-50/80 text-amber-800 border-amber-250',
          dot: 'bg-amber-500'
        };
      case 'Confirmed':
        return {
          bg: 'bg-orange-50/80 text-orange-800 border-orange-250',
          dot: 'bg-orange-500'
        };
      case 'Shipped':
        return {
          bg: 'bg-blue-50/80 text-blue-800 border-blue-250',
          dot: 'bg-blue-500'
        };
      case 'Out for Delivery':
        return {
          bg: 'bg-indigo-50/80 text-indigo-800 border-indigo-250',
          dot: 'bg-indigo-500'
        };
      case 'Delivered':
      case 'Completed':
        return {
          bg: 'bg-emerald-50/80 text-emerald-800 border-emerald-250',
          dot: 'bg-emerald-500'
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-50/80 text-rose-800 border-rose-250',
          dot: 'bg-rose-500'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-800 border-slate-200',
          dot: 'bg-slate-500'
        };
    }
  };

  return (
    <div id="order-history-container" className="pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none text-left px-4 bg-white font-sans animate-none">
      
      {/* Header bar and navigation */}
      <div id="history-header-nav" className="flex items-center justify-between py-3 border-b border-slate-100 bg-white sticky top-0 z-20">
        <button
          id="history-back-btn"
          onClick={onBack}
          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-800 cursor-pointer hover:bg-slate-50 overflow-hidden"
        >
          <ArrowLeft size={14} />
        </button>
        <span className="text-xs font-black uppercase text-black tracking-widest italic">
          Order History
        </span>
        <span className="text-[10px] bg-slate-50 border border-slate-100 rounded px-2 py-0.5 font-bold font-mono uppercase tracking-tight">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      <div id="history-content-block" className="pt-3 space-y-4">
        {orders.length === 0 ? (
          /* Empty state for orders history */
          <div id="history-empty-state" className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
              <ClipboardList size={30} strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">No past purchases found</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                You haven't placed any sneaker orders yet. Shop our premium brand catalog to launch your first delivery.
              </p>
            </div>
            <button
              id="history-shop-first-btn"
              onClick={onNavigateToShop}
              className="px-5 py-3 bg-black hover:bg-slate-900 text-white text-[10px] uppercase font-black tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer leading-none font-mono"
            >
              Discover Releases
            </button>
          </div>
        ) : (
          /* Orders index list layout */
          <div className="space-y-3">
            {/* Sorting controls bar */}
            <div id="order-history-filter-bar" className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Sort Transactions
              </span>
              <div className="relative inline-flex items-center">
                <select
                  id="order-sort-selector"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-800 rounded-lg pl-3 pr-7 py-2 focus:outline-none focus:border-black appearance-none cursor-pointer font-sans leading-none hover:bg-slate-50 transition-all select-none"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-450">
                  <ArrowUpDown size={11} />
                </div>
              </div>
            </div>

            {sortedOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
              
              // Count quantities in this order
              const itemQtyCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div 
                  key={order.id} 
                  id={`order-block-${order.id}`}
                  className="bg-white border border-slate-150 rounded-xl overflow-hidden transition-all shadow-xs"
                >
                  
                  {/* Order Card Summary bar */}
                  <div 
                    onClick={() => toggleExpand(order.id)}
                    className="p-3.5 bg-slate-50 border-b border-slate-100/50 flex flex-col justify-between cursor-pointer hover:bg-slate-100/60"
                  >
                    <div className="flex justify-between items-start leading-none mb-2">
                      <div className="text-left space-y-0.5">
                        <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block leading-none">ORDER ID</span>
                        <h4 className="text-xs font-black text-slate-900 font-mono tracking-tight leading-none uppercase">{order.id}</h4>
                      </div>

                      <div className="flex gap-2 items-center">
                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono border rounded-full px-2 py-0.5 font-bold uppercase tracking-wide leading-none ${getStatusStyle(order.status).bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusStyle(order.status).dot} ${order.status !== 'Delivered' && order.status !== 'Cancelled' ? 'animate-pulse' : ''}`} />
                          {order.status}
                        </span>
                        {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                      </div>
                    </div>

                    <div className="flex justify-between items-end leading-none">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                        <Calendar size={11} className="text-slate-400 shrink-0" />
                        <span>{formattedDate}</span>
                        <span className="text-slate-300">•</span>
                        <span>{itemQtyCount} {itemQtyCount === 1 ? 'pair' : 'pairs'}</span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[10px] text-slate-450 block uppercase font-mono leading-none tracking-tight">Total Payment</span>
                        <span className="text-xs font-black text-slate-950 font-mono leading-none mt-1 inline-block">${order.priceBreakdown.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Order Details content area */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden bg-white"
                      >
                        <div className="p-3.5 space-y-4 border-t border-slate-100">
                          
                          {/* Items listed */}
                          <div className="space-y-3">
                            <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Purchased Pairs</span>
                            <div className="divide-y divide-slate-100">
                              {order.items.map((item) => {
                                const activePrice = item.product.discountPrice || item.product.price;
                                return (
                                  <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shrink-0">
                                        <img 
                                          src={item.product.images[0]} 
                                          alt={item.product.name} 
                                          className="w-full h-full object-cover" 
                                          referrerPolicy="no-referrer"
                                        />
                                      </div>
                                      <div className="text-left space-y-0.5 min-w-0">
                                        <span className="text-[8px] font-mono text-slate-400 font-bold uppercase tracking-tight block leading-none">{item.product.brand}</span>
                                        <h5 className="font-extrabold text-slate-800 leading-tight truncate uppercase max-w-[170px] m-0">{item.product.name}</h5>
                                        <div className="flex items-center gap-1.5 text-[9px] leading-none text-slate-500 font-mono">
                                          <span>Size US {item.size}</span>
                                          <span>•</span>
                                          <span>Col: {item.colorName}</span>
                                          <span>•</span>
                                          <span className="text-slate-800 font-bold">Qty {item.quantity}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="text-right leading-none select-none font-mono font-bold shrink-0">
                                      <span>${activePrice.toFixed(2)}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Address Book Destination */}
                          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4">
                            <div className="space-y-1 bg-slate-55 border border-slate-100/50 p-2 rounded-lg">
                              <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-slate-400 uppercase leading-none tracking-wider">
                                <MapPin size={10} className="text-slate-400" />
                                <span>Ship Address</span>
                              </div>
                              <div className="text-[10px] text-slate-600 leading-normal font-sans pt-0.5">
                                <h6 className="font-extrabold text-slate-800 leading-none mb-0.5">{order.shippingAddress.fullName}</h6>
                                <p className="truncate">{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                              </div>
                            </div>

                            <div className="space-y-1 bg-slate-55 border border-slate-100/50 p-2 rounded-lg">
                              <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-slate-400 uppercase leading-none tracking-wider">
                                <CreditCard size={10} className="text-slate-400" />
                                <span>Payment Form</span>
                              </div>
                              <div className="text-[10px] text-slate-600 leading-normal font-sans pt-0.5">
                                <h6 className="font-extrabold text-slate-850 leading-none mb-0.5 uppercase">{order.paymentMethod}</h6>
                                <p className="text-slate-450">Digital Gateway</p>
                                <p className="text-emerald-600 font-bold font-mono">Authorized ✓</p>
                              </div>
                            </div>
                          </div>

                          {/* Pricing Ledger breakdowns */}
                          <div className="pt-3.5 border-t border-dashed border-slate-200 space-y-1.5 text-[10px] font-medium leading-none text-slate-500 bg-slate-50/50 p-3 rounded-lg border border-slate-150">
                            <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-tight block text-slate-400 font-bold mb-1 border-b border-slate-150/40 pb-1">
                              <span>Pricing Calculations Ledger</span>
                              <span>USD</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Purchase Subtotal</span>
                              <span className="font-mono">${order.priceBreakdown.subtotal.toFixed(2)}</span>
                            </div>
                            {order.priceBreakdown.discount > 0 && (
                              <div className="flex justify-between text-orange-600 font-bold">
                                <span>Promo Coupon Voucher Deduction</span>
                                <span className="font-mono">-${order.priceBreakdown.discount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Estimated Sales Tax (8.0%)</span>
                              <span className="font-mono">${order.priceBreakdown.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Secured Delivery Shipping</span>
                              <span className="font-mono">{order.priceBreakdown.shipping === 0 ? 'FREE' : `$${order.priceBreakdown.shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-1.5 text-xs text-slate-900 font-black mt-1">
                              <span className="font-sans italic uppercase">Total Deductions Charge</span>
                              <span className="font-mono">${order.priceBreakdown.total.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Rate Your Delivery Experience Feature */}
                          {order.status === 'Delivered' && (
                            <div className="pt-3.5 border-t border-dashed border-slate-200 space-y-2.5 text-left">
                              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">
                                Courier & Delivery Audit
                              </span>

                              {ratings[order.id]?.submitted ? (
                                /* Submitted State */
                                <div className="bg-emerald-50/20 border border-emerald-100 p-3 rounded-lg flex flex-col gap-2 relative">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight italic flex items-center gap-1">
                                      <span className="text-emerald-500">✓</span> Feedback Logged
                                    </span>
                                    <span className="text-[8.5px] font-mono text-slate-400">
                                      {new Date(ratings[order.id].date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                    </span>
                                  </div>

                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((starVal) => (
                                      <Star 
                                        key={starVal} 
                                        size={12} 
                                        className={starVal <= ratings[order.id].rating ? 'fill-amber-400 text-amber-500' : 'text-slate-250'} 
                                      />
                                    ))}
                                  </div>

                                  {ratings[order.id].feedback ? (
                                    <p className="text-[10px] text-slate-600 bg-white/70 px-2.5 py-1.5 rounded-md border border-slate-100 italic leading-snug">
                                      "{ratings[order.id].feedback}"
                                    </p>
                                  ) : (
                                    <p className="text-[9.5px] text-slate-400 italic">No text comments provided.</p>
                                  )}

                                  <button
                                    onClick={() => handleResetRating(order.id)}
                                    className="absolute right-3 bottom-3 text-[9px] font-mono font-black text-amber-600 hover:text-amber-800 uppercase tracking-wider underline cursor-pointer bg-transparent border-none"
                                  >
                                    Reset Review
                                  </button>
                                </div>
                              ) : (
                                /* Rating Form State */
                                <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg space-y-2.5">
                                  <div className="leading-none space-y-1">
                                    <p className="text-[10.5px] font-bold text-slate-800">How was your delivery with courier Marcus?</p>
                                    <p className="text-[9.5px] text-slate-400 leading-snug">Rate the box preservation, item accuracy, and courier service.</p>
                                  </div>

                                  {/* Star Selector */}
                                  <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                      {[1, 2, 3, 4, 5].map((starVal) => {
                                        const activeValue = hoverRating[order.id] || draftRating[order.id] || 0;
                                        return (
                                          <button
                                            key={starVal}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(prev => ({ ...prev, [order.id]: starVal }))}
                                            onMouseLeave={() => setHoverRating(prev => ({ ...prev, [order.id]: 0 }))}
                                            onClick={() => setDraftRating(prev => ({ ...prev, [order.id]: starVal }))}
                                            className="cursor-pointer transition-transform hover:scale-115 focus:outline-none bg-transparent p-0 m-0 border-none"
                                          >
                                            <Star
                                              size={18}
                                              className={`transition-all duration-100 ${
                                                starVal <= activeValue 
                                                  ? 'fill-amber-400 text-amber-500 scale-105' 
                                                  : 'text-slate-300'
                                              }`}
                                            />
                                          </button>
                                        );
                                      })}
                                    </div>
                                    {draftRating[order.id] > 0 && (
                                      <span className="text-[9.5px] font-black font-mono uppercase bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded leading-none">
                                        {draftRating[order.id]}/5 Score
                                      </span>
                                    )}
                                  </div>

                                  {/* Quick suggestion tags */}
                                  <div className="space-y-1">
                                    <p className="text-[8.5px] font-mono font-bold text-slate-400 uppercase tracking-tight">Tap Quick Tags</p>
                                    <div className="flex flex-wrap gap-1">
                                      {["⚡ Fast Delivery", "📦 Pristine Box", "👟 Perfect Fit", "🗣️ Great Courier"].map((tag) => {
                                        const currentText = draftFeedback[order.id] || '';
                                        const hasTag = currentText.includes(tag);
                                        return (
                                          <button
                                            key={tag}
                                            type="button"
                                            onClick={() => {
                                              if (hasTag) {
                                                const cleaned = currentText.replace(tag, '').replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '').trim();
                                                setDraftFeedback(prev => ({ ...prev, [order.id]: cleaned }));
                                              } else {
                                                const separator = currentText ? ', ' : '';
                                                setDraftFeedback(prev => ({ ...prev, [order.id]: currentText + separator + tag }));
                                              }
                                            }}
                                            className={`text-[8.5px] px-2 py-1 rounded-md border transition-all text-xs cursor-pointer font-sans leading-none ${
                                              hasTag 
                                                ? 'bg-black border-black text-white font-semibold' 
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                          >
                                            {tag}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Custom comments box */}
                                  <div className="space-y-1">
                                    <textarea
                                      value={draftFeedback[order.id] || ''}
                                      onChange={(e) => setDraftFeedback(prev => ({ ...prev, [order.id]: e.target.value }))}
                                      placeholder="Leave a quick note about your unboxing (optional)..."
                                      className="text-[10.5px] p-2 bg-white border border-slate-150 rounded-lg w-full focus:outline-none focus:border-black font-sans leading-normal h-12 resize-none shadow-inner"
                                    />
                                  </div>

                                  {/* Submit button bar */}
                                  <div className="flex justify-end pt-1">
                                    <button
                                      type="button"
                                      disabled={!draftRating[order.id]}
                                      onClick={() => handleSaveRating(order.id)}
                                      className="bg-black text-white hover:bg-slate-900 text-[9px] font-mono tracking-widest font-black uppercase py-2 px-3 rounded-lg transition-all self-end cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed leading-none flex items-center gap-1 shadow-sm border-none"
                                    >
                                      <Smile size={11} />
                                      Submit Assessment
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Action deep linking buttons */}
                          <div className="flex gap-2">
                            <button
                              id={`history-[${order.id}]-details-btn`}
                              onClick={() => onSelectOrder(order)}
                              className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer font-sans leading-none"
                            >
                              <ClipboardList size={12} className="text-slate-500" />
                              View Invoice
                            </button>

                            <button
                              id={`history-track-btn-${order.id}`}
                              onClick={() => onTrackOrder(order)}
                              className="flex-1 py-3 bg-black hover:bg-slate-900 text-white rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer font-sans leading-none"
                            >
                              <Truck size={12} className="text-orange-400" />
                              Track Live
                            </button>
                            
                            <button
                              id={`history-help-btn-${order.id}`}
                              onClick={() => alert(`Verification Log: Initiating support request context order ${order.id}...`)}
                              className="px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                              title="Contact Support"
                            >
                              <HelpCircle size={14} />
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
