import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Calendar, MapPin, CreditCard, ExternalLink, 
  HelpCircle, Truck, ClipboardList, ShoppingBag, ShieldCheck, 
  ChevronRight, ArrowUpRight, CheckCircle2, Clock
} from 'lucide-react';
import { Order } from '../types';

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onTrackOrder: () => void;
  onViewProduct: (productId: string) => void;
}

export default function OrderDetailView({
  order,
  onBack,
  onTrackOrder,
  onViewProduct
}: OrderDetailViewProps) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getStatusBannerColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Out for Delivery':
        return 'bg-orange-50 text-orange-850 border-orange-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-850 border-rose-250';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  // Sneaker status flow tracking sequence
  const milestoneSteps = [
    { label: 'Order Placed', desc: 'Sneaker selection logged & queued', icon: <ClipboardList size={12} /> },
    { label: 'Payment Confirmed', desc: 'Secure digital payment authorized', icon: <CreditCard size={12} /> },
    { label: 'Parcel Shipped', desc: 'Sneaker dispatched from SFO warehouse', icon: <Truck size={12} /> },
    { label: 'Out for Delivery', desc: 'Assigned to courier Marcus en route', icon: <Clock size={12} /> },
    { label: 'Delivered', desc: 'Secure doorstep dropping completed', icon: <CheckCircle2 size={12} /> }
  ];

  // Helper to check which milestones are active based on status index
  const statusHierarchy = ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = statusHierarchy.indexOf(order.status);

  return (
    <div id="order-detail-container" className="pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none text-left px-4 bg-white font-sans animate-none">
      
      {/* Header bar and navigation */}
      <div id="detail-header-nav" className="flex items-center justify-between py-3 border-b border-slate-100 bg-white sticky top-0 z-20">
        <button
          id="detail-back-btn"
          onClick={onBack}
          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-800 cursor-pointer hover:bg-slate-50 overflow-hidden"
        >
          <ArrowLeft size={14} />
        </button>
        <span className="text-xs font-black uppercase text-black tracking-widest italic">
          Order Specifics
        </span>
        <button
          id="detail-track-top-btn"
          onClick={onTrackOrder}
          className="text-[9px] font-mono font-black text-white bg-black rounded px-2.5 py-1.5 uppercase tracking-wide cursor-pointer hover:bg-slate-900 leading-none transition-colors"
        >
          Track Live
        </button>
      </div>

      <div id="detail-content-block" className="pt-3 space-y-5">
        
        {/* Status Highlight Banner */}
        <div id="detail-status-banner" className={`border rounded-xl p-3.5 flex items-center justify-between ${getStatusBannerColor(order.status)}`}>
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono tracking-wider font-bold uppercase opacity-80 block leading-none">CURRENT DISPATCH STATE</span>
            <h3 className="text-sm font-black font-sans uppercase tracking-tight italic">{order.status}</h3>
          </div>
          <div className="text-right leading-none">
            <span className="text-[9.5px] font-mono tracking-tight text-slate-500 font-bold block">DATE COMPLETED</span>
            <span className="text-[10px] font-mono font-bold mt-1 inline-block">{new Date(order.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
          </div>
        </div>

        {/* 1. SNEAKER ITEMS LIST */}
        <div id="detail-items-block" className="space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Items in Shipment</span>
          <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden shadow-xs bg-white">
            {order.items.map((item) => {
              const activePrice = item.product.discountPrice || item.product.price;
              return (
                <div 
                  key={item.id} 
                  id={`detail-item-row-${item.id}`}
                  onClick={() => onViewProduct(item.product.id)}
                  className="p-3 flex items-center justify-between hover:bg-slate-50/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-slate-55 border border-slate-100 rounded-lg overflow-hidden shrink-0">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-left space-y-0.5 min-w-0">
                      <span className="text-[8px] font-mono text-slate-400 font-bold uppercase tracking-tight block leading-none">{item.product.brand}</span>
                      <h5 className="text-xs font-black text-slate-900 leading-tight truncate uppercase max-w-[160px] group-hover:text-amber-600 transition-colors m-0">
                        {item.product.name}
                      </h5>
                      <div className="flex items-center gap-1.5 text-[9px] leading-none text-slate-500 font-mono">
                        <span>Size US {item.size}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-200 block" style={{ backgroundColor: item.colorHex }} />
                          {item.colorName}
                        </span>
                        <span>•</span>
                        <span className="text-slate-800 font-bold">Qty {item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right leading-none flex items-center gap-1 ml-2 font-mono font-bold shrink-0">
                    <span className="text-xs text-slate-900">${activePrice.toFixed(2)}</span>
                    <ArrowUpRight size={10} className="text-slate-400 group-hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. ORDER PROGRESS TIMELINE */}
        <div id="detail-timeline-block" className="space-y-3.5">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Milestones Status Tracker</span>
          
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl shadow-xs space-y-4">
            <div className="relative pl-6 space-y-4.5 text-xs text-left">
              {/* Timeline vector line */}
              <div className="absolute top-1.5 bottom-1.5 left-2 w-[2px] bg-slate-200 rounded">
                <div 
                  className="bg-black w-full rounded transition-all duration-500" 
                  style={{ 
                    height: `${
                      currentStatusIndex === -1 ? 0 : 
                      currentStatusIndex === 0 ? '10%' :
                      currentStatusIndex === 1 ? '35%' :
                      currentStatusIndex === 2 ? '60%' :
                      currentStatusIndex === 3 ? '85%' : '100%'
                    }` 
                  }} 
                />
              </div>

              {milestoneSteps.map((step, idx) => {
                const isStepCompleted = currentStatusIndex >= idx;
                const isStepActive = currentStatusIndex === idx;

                return (
                  <div key={idx} className="relative flex items-start gap-3">
                    {/* Timeline bullet dot */}
                    <div 
                      className={`absolute left-[-22px] top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 transition-all ${
                        isStepActive 
                          ? 'bg-black border-black text-orange-400 scale-110 shadow' 
                          : isStepCompleted 
                            ? 'bg-black border-black text-white' 
                            : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="scale-75 shrink-0 select-none pointer-events-none">
                        {step.icon}
                      </div>
                    </div>

                    <div className="text-left space-y-0.5 leading-none">
                      <h5 className={`text-[10.5px] font-black uppercase tracking-wide leading-none font-sans ${
                        isStepActive 
                          ? "text-black italic font-black" 
                          : isStepCompleted ? "text-slate-800" : "text-slate-350"
                      }`}>
                        {step.label}
                      </h5>
                      <span className={`text-[9.5px] block font-sans leading-relaxed ${isStepActive ? 'text-slate-600 font-medium' : 'text-slate-400 font-normal'}`}>
                        {step.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. SHIPPED ADDRESS AND BILLING DATA */}
        <div id="detail-address-and-card" className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1 bg-slate-55 border border-slate-100/50 p-3 rounded-xl shadow-xs">
            <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-slate-400 uppercase leading-none tracking-wider">
              <MapPin size={10} className="text-slate-400" />
              <span>Recipient Address</span>
            </div>
            <div className="text-[10px] text-slate-600 leading-relaxed font-sans pt-1">
              <h6 className="font-extrabold text-slate-850 leading-none mb-1 uppercase tracking-tight">{order.shippingAddress.fullName}</h6>
              <p className="truncate font-medium">{order.shippingAddress.street}</p>
              <p className="font-medium">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p className="text-[9px] font-mono font-bold text-slate-450 mt-1">{order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="space-y-1 bg-slate-55 border border-slate-100/50 p-3 rounded-xl shadow-xs">
            <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-slate-400 uppercase leading-none tracking-wider">
              <CreditCard size={10} className="text-slate-400" />
              <span>Gateway Paid Form</span>
            </div>
            <div className="text-[10px] text-slate-600 leading-relaxed font-sans pt-1">
              <h6 className="font-extrabold text-slate-850 leading-none mb-1 uppercase tracking-tight">{order.paymentMethod}</h6>
              <p className="text-slate-450 font-medium">Verified Auth: YES</p>
              <p className="text-emerald-600 font-bold font-mono text-[9px] uppercase tracking-wider block bg-emerald-50 border border-emerald-100 rounded-md py-0.5 px-1 w-max mt-1 leading-none">
                AUTHORIZATION ✓
              </p>
            </div>
          </div>
        </div>

        {/* 4. BILLING CALCULATION LEDGER RECORD */}
        <div id="detail-breakdown-ledger" className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Invoice Accounting Statements</span>
          
          <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl space-y-1.5 text-[10px] font-medium leading-none text-slate-500">
            <div className="flex justify-between items-center text-[8.5px] font-mono uppercase tracking-tight block text-slate-400 font-black mb-1 border-b border-slate-150/50 pb-1.5">
              <span>LEDGER DEBITS IDENTIFICATION</span>
              <span>CURRENCY: USD</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Catalog Basket Subtotal</span>
              <span className="font-mono text-slate-800 font-bold">${order.priceBreakdown.subtotal.toFixed(2)}</span>
            </div>
            {order.priceBreakdown.discount > 0 && (
              <div className="flex justify-between py-0.5 text-orange-655 font-bold">
                <span>Voucher Promos Deduction Applied</span>
                <span className="font-mono">-${order.priceBreakdown.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-0.5">
              <span>Sales Surcharges (Local Tax 8.0%)</span>
              <span className="font-mono text-slate-800">${order.priceBreakdown.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Standard Logistics Dispatch Courier</span>
              <span className="font-mono text-slate-800">
                {order.priceBreakdown.shipping === 0 ? 'FREE DELIVERY ($0.00)' : `$${order.priceBreakdown.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-xs text-slate-900 font-black mt-1.5">
              <span className="font-sans italic uppercase tracking-tight">Accounts Ledger Charged Total</span>
              <span className="font-mono text-black">${order.priceBreakdown.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 5. PROTOCOLS FOOTER DETAILS */}
        <div id="detail-secure-verified" className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-start gap-2.5 shadow-xs">
          <ShieldCheck size={16} className="text-orange-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-left leading-none">
            <span className="text-[8px] font-mono font-bold text-slate-400 uppercase leading-none block tracking-wider font-bold">ANTI-COUNTERFEIT CHIP ID SECURED</span>
            <p className="text-[10px] text-slate-500 leading-relaxed font-sans pt-0.5">
              Your sneaker box features a tamper-proof RFID sensor tag. Direct NFC taps from your cellular device authenticate production limits instantly.
            </p>
          </div>
        </div>

        {/* Support context links dialer */}
        <div className="flex gap-2 pb-6">
          <button
            id="detail-contact-expert-btn"
            onClick={() => alert(`Verification Log: Routing to SneakerHub Concierge for assistance with order ${order.id}...`)}
            className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer font-sans leading-none"
          >
            <HelpCircle size={12} className="text-slate-500" />
            Concierge Help Desk
          </button>
        </div>

      </div>

    </div>
  );
}
