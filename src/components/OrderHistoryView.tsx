import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Calendar, Package, ShoppingBag, ChevronDown, ChevronUp, MapPin, 
  CreditCard, ExternalLink, ChevronRight, HelpCircle, Truck, ClipboardList
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
  // Keep track of which order card is expanded
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(orders.length > 0 ? orders[0].id : null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Out for Delivery':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Delivered':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
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
            {orders.map((order) => {
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
                        <span className={`text-[9px] font-mono border rounded px-1.5 py-0.5 font-bold uppercase tracking-wide leading-none ${getStatusStyle(order.status)}`}>
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
