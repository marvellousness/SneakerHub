import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, Truck, Receipt, CheckCircle2, ShieldAlert, 
  ArrowLeft, ArrowRight, Lock, MapPin 
} from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutViewProps {
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  onBackToCart: () => void;
  onSubmitOrder: (shippingAddress: any, paymentMethod: string) => void;
  defaultAddresses: any[];
}

export default function CheckoutView({
  cartItems,
  subtotal,
  discount,
  tax,
  shipping,
  total,
  onBackToCart,
  onSubmitOrder,
  defaultAddresses
}: CheckoutViewProps) {
  // Wizard Step: 1 = Shipping, 2 = Payment, 3 = Confirmation Review
  const [step, setStep] = useState(1);
  
  // Shipping Form State
  const [fullName, setFullName] = useState(defaultAddresses[0]?.fullName || "Alex Devmaster");
  const [street, setStreet] = useState(defaultAddresses[0]?.street || "128 Innovation Way, Suite B");
  const [city, setCity] = useState(defaultAddresses[0]?.city || "San Francisco");
  const [stateName, setStateName] = useState(defaultAddresses[0]?.state || "CA");
  const [zipCode, setZipCode] = useState(defaultAddresses[0]?.zipCode || "94107");
  const [phone, setPhone] = useState(defaultAddresses[0]?.phone || "+1 (555) 902-1234");
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCVC, setCardCVC] = useState("456");
  const [cardName, setCardName] = useState("Alex Devmaster");

  const [shippingError, setShippingError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Advance to payment step validation
  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !street || !city || !stateName || !zipCode || !phone) {
      setShippingError("Please fill in all shipping fields correctly.");
      return;
    }
    setShippingError("");
    setStep(2);
  };

  // Advance to review step validation
  const handleNextToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCVC || !cardName) {
      setPaymentError("Please provide secure payment details.");
      return;
    }
    // Simple format checks
    if (cardNumber.replace(/\s/g, '').length < 13) {
      setPaymentError("Card number looks invalid.");
      return;
    }
    setPaymentError("");
    setStep(3);
  };

  // Submit complete order
  const handleFinalSubmit = () => {
    setIsProcessing(true);
    
    // Simulate processing duration
    setTimeout(() => {
      setIsProcessing(false);
      onSubmitOrder({
        fullName,
        street,
        city,
        state: stateName,
        zipCode,
        phone
      }, `Credit Card (Ending in ${cardNumber.slice(-4)})`);
    }, 2000);
  };

  return (
    <div id="checkout-view-container" className="pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none text-left px-4 bg-white">
      
      {/* 1. SECURE CHECKOUT HEADER */}
      <div id="checkout-secure-header" className="flex items-center justify-between py-3 border-b border-slate-100 bg-white">
        <button
          id="checkout-back-nav"
          onClick={() => {
            if (step === 3) setStep(2);
            else if (step === 2) setStep(1);
            else onBackToCart();
          }}
          className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer text-xs"
        >
          <ArrowLeft size={14} />
        </button>
        
        <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1 font-sans italic leading-none">
          <Lock size={12} className="text-black" />
          SECURE ENCRYPTED CHECKOUT
        </span>

        {/* Current wizard state breadcrumb */}
        <span className="text-[10px] font-mono bg-slate-50 border border-slate-150 px-2 py-0.5 rounded text-slate-600 font-bold">
          STEP {step}/3
        </span>
      </div>

      {isProcessing ? (
        /* Processing Payment Screen overlay mock */
        <div id="payment-processing-stage" className="py-20 text-center space-y-4">
          <div className="w-14 h-14 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Processing Footwear Order</h4>
            <p className="text-xs text-slate-400 font-medium">Verifying security pins & securing sneaker inventory...</p>
          </div>
        </div>
      ) : (
        /* Render normal wizard forms */
        <div id="checkout-forms" className="pt-3 space-y-5">
          
          {/* STEP 1: SHIPPING DELIVERY ADDRESS DETAILS */}
          {step === 1 && (
            <motion.form 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleNextToPayment} 
              className="space-y-4"
            >
              <div className="flex items-center gap-1.5 text-slate-900">
                <MapPin size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest font-sans">1. Delivery Destination</h3>
              </div>

              {shippingError && <div className="text-[11px] text-red-650 bg-red-50 p-2.5 rounded border border-red-100">{shippingError}</div>}

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Recipient Full Name</label>
                  <input
                    id="shipping-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Street Delivery Address</label>
                  <input
                    id="shipping-street"
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">City</label>
                    <input
                      id="shipping-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">State (e.g. CA)</label>
                    <input
                      id="shipping-state"
                      type="text"
                      required
                      maxLength={2}
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Zip / Postal Code</label>
                    <input
                      id="shipping-zip"
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Mobile Phone Contact</label>
                    <input
                      id="shipping-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Action Proceed to payment */}
              <button
                id="checkout-advance-payment"
                type="submit"
                className="w-full py-4 bg-black text-white rounded-xl text-xs font-black tracking-widest uppercase transition-colors shadow flex items-center justify-center gap-1.5 cursor-pointer mt-4 hover:bg-slate-900 active:scale-98"
              >
                Continue to Payment
                <ArrowRight size={12} />
              </button>
            </motion.form>
          )}

          {/* STEP 2: SECURE CREDIT CARD PAYMENT */}
          {step === 2 && (
            <motion.form 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleNextToReview} 
              className="space-y-4"
            >
              <div className="flex items-center gap-1.5 text-slate-900">
                <CreditCard size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest font-sans">2. Secure Card Payment</h3>
              </div>

              {paymentError && <div className="text-[11px] text-red-650 bg-red-50 p-2.5 rounded border border-red-100">{paymentError}</div>}

              {/* Simulated interactive Card preview visual container */}
              <div className="bg-black text-white p-4 rounded-xl shadow-md space-y-4 relative overflow-hidden h-36 border border-slate-800">
                <div className="absolute right-[-10px] bottom-[-10px] text-slate-800/40 text-8xl font-black font-sans leading-none pointer-events-none uppercase">HUB</div>
                <div className="flex justify-between items-start leading-none">
                  <span className="text-[9px] font-black tracking-widest text-orange-400 font-sans uppercase">SNEAKERHUB GOLD ELITE</span>
                  <span className="text-xs font-black tracking-widest font-mono italic">VISA</span>
                </div>
                
                <h4 className="text-sm font-mono tracking-widest pt-2 text-white">
                  {cardNumber || "•••• •••• •••• ••••"}
                </h4>

                <div className="flex justify-between items-baseline text-slate-400">
                  <div className="flex flex-col text-left">
                    <span className="text-[7px] uppercase font-mono">Cardholder</span>
                    <span className="text-xs font-bold truncate max-w-[150px] text-white uppercase">{cardName || "Alex Devmaster"}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[7px] uppercase font-mono">Expires</span>
                    <span className="text-xs font-bold font-mono text-white">{cardExpiry || "MM/YY"}</span>
                  </div>
                </div>
              </div>

              {/* Form card details inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Name printed on card</label>
                  <input
                    id="payment-card-name"
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-205 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white uppercase font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Card Number (16 Digits)</label>
                  <input
                    id="payment-card-number"
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-205 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Expiry Date</label>
                    <input
                      id="payment-card-expiry"
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-slate-55 border border-slate-205 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Security Code (CVC)</label>
                    <input
                      id="payment-card-cvc"
                      type="password"
                      required
                      maxLength={3}
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value)}
                      className="w-full bg-slate-55 border border-slate-205 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Action Proceed to review */}
              <button
                id="checkout-advance-review"
                type="submit"
                className="w-full py-4 bg-black text-white rounded-xl text-xs font-black tracking-widest uppercase transition-colors shadow flex items-center justify-center gap-1.5 cursor-pointer mt-4 hover:bg-slate-900"
              >
                Review Purchase Details
                <ArrowRight size={12} />
              </button>
            </motion.form>
          )}

          {/* STEP 3: ORDER REVIEW & PLACE PURCHASE ORDER */}
          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 text-left"
            >
              <div className="flex items-center gap-1.5 text-slate-900">
                <Receipt size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest font-sans">3. Final Verification Review</h3>
              </div>

              {/* Review summary cards */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-700 space-y-2.5 shadow-xs">
                <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                  <div className="space-y-0.5 animate-none">
                    <span className="text-[9px] font-mono uppercase font-black text-slate-400 leading-none">SHIPPING TARGET</span>
                    <p className="font-extrabold text-black leading-tight mt-0.5">{fullName}</p>
                    <p className="text-[11px] leading-relaxed text-slate-500">{street}</p>
                    <p className="text-[11px] leading-relaxed text-slate-500">{city}, {stateName} {zipCode}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-black hover:underline cursor-pointer">Change</button>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] font-mono uppercase font-black text-slate-400 leading-none">PAYMENT METHOD</span>
                    <p className="font-bold text-slate-800 mt-0.5 font-mono">Visa Card ending in •••• {cardNumber?.slice(-4)}</p>
                  </div>
                  <button onClick={() => setStep(2)} className="text-[10px] font-black uppercase text-black hover:underline cursor-pointer">Change</button>
                </div>
              </div>

              {/* List of checkout items */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase font-black text-slate-400 block tracking-wider leading-none">Purchase Items ({cartItems.length})</span>
                <div className="max-h-24 overflow-y-auto space-y-1 scrollbar-none pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 font-bold text-slate-605">
                      <span className="truncate max-w-[180px] font-sans text-slate-850 font-extrabold uppercase">{item.product.name} (x{item.quantity})</span>
                      <span className="font-mono text-slate-900">${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Pricing breakdown */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-1.5 font-bold text-slate-500 shadow-xs">
                <div className="flex justify-between leading-none text-slate-500">
                  <span>Basket Subtotal</span>
                  <span className="text-slate-800 font-mono font-bold">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between leading-none text-orange-650 bg-orange-50 px-1 py-0.5 rounded border border-orange-100/55">
                    <span className="text-[11px] font-black uppercase">Coupon Discount</span>
                    <span className="font-mono font-black">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between leading-none text-slate-500">
                  <span>Sales Courier Tax (8%)</span>
                  <span className="text-slate-800 font-mono font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between leading-none text-slate-500">
                  <span>Shipping & Handling</span>
                  {shipping === 0 ? (
                    <span className="text-orange-500 text-[10px] uppercase font-black tracking-wide">Free Premium</span>
                  ) : (
                    <span className="text-slate-805 font-mono font-bold">${shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between pt-2.5 border-t border-slate-200 text-xs font-black text-black uppercase tracking-widest leading-none">
                  <span>Final Authorization Total</span>
                  <span className="font-mono text-black text-sm font-black">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Absolute Action purchase place */}
              <button
                id="checkout-action-submit-order"
                onClick={handleFinalSubmit}
                className="w-full py-4 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={14} className="text-lime-300" />
                Authorize Purchase Order
              </button>
            </motion.div>
          )}

        </div>
      )}

    </div>
  );
}
