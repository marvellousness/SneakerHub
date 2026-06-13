import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, ShoppingBag, Search as SearchIcon, Bot, User, Heart, 
  Bell, ChevronRight, X, Trash2, Sliders, Database, ClipboardList,
  Layers, Settings, Layout, Plus, RefreshCw, Star, ShoppingCart 
} from 'lucide-react';

// Data modules imports
import { INITIAL_PRODUCTS } from './data/products';
import { 
  SneakerProduct, CartItem, Order, UserProfile, Notification, ChatMessage 
} from './types';

// Visual panel imports
import HomeView from './components/HomeView';
import CategoriesView from './components/CategoriesView';
import ProductListingView from './components/ProductListingView';
import ProductDetailView from './components/ProductDetailView';
import SearchView from './components/SearchView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import OrderTrackerView from './components/OrderTrackerView';
import OffersView from './components/OffersView';
import UserProfileView from './components/UserProfileView';
import NotificationsView from './components/NotificationsView';
import AiAssistantView from './components/AiAssistantView';
import OrderHistoryView from './components/OrderHistoryView';
import OrderDetailView from './components/OrderDetailView';

export default function App() {
  // App States
  const [products, setProducts] = useState<SneakerProduct[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);
  const [selectedBrandCategory, setSelectedBrandCategory] = useState({ brand: "All", category: "All" });
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Devmaster",
    email: "novadevmaster@gmail.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    membershipLevel: "PLATINUM",
    points: 1250,
    addresses: [
      {
        fullName: "Alex Devmaster",
        street: "128 Innovation Way, Suite B",
        city: "San Francisco",
        state: "CA",
        zipCode: "94107",
        phone: "+1 (555) 902-1234"
      }
    ]
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "nt-1",
      title: "Limited Drop: Jordan IV Restock!",
      description: "Extremely rare restock of Jordan IV Retro Military Blue sizes US 8-12. Unlock with Gold Membership coupon.",
      timestamp: "10 mins ago",
      type: "drop",
      read: false
    },
    {
      id: "nt-2",
      title: "Vip Voucher Code Claimed",
      description: "Claim 15% discount code SNEAKERHUB15 during your secure checkout process.",
      timestamp: "1 hr ago",
      type: "promo",
      read: false
    }
  ]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I am your **SneakerHub AI Concierge**. I possess extensive expert knowledge on sneaker history, running dynamics (neutral/overpronation support), sizing recommendations, and casual streetwear trends.\n\nAsk me anything! For example: *'What are some durable running sneakers under $180?'* or *'Tell me details about the Jordan IV'*.",
      timestamp: "Now"
    }
  ]);

  // Active navigation tabs
  // 'home' | 'shop' | 'categories' | 'search' | 'assistant' | 'profile' | 'notifications' | 'offers' | 'admin'
  const [activeTab, setActiveTab] = useState<string>('home');
  const [previousTabs, setPreviousTabs] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Quick Toggles drawers states
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showWishlistDrawer, setShowWishlistDrawer] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  // Active Promo Code (Discount percentage)
  const [appliedPromo, setAppliedPromo] = useState({ percentage: 0, code: "" });

  // Load from database endpoints if available
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const pRes = await fetch("/api/products");
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.length > 0) setProducts(pData);
        }

        const prRes = await fetch("/api/profile");
        if (prRes.ok) {
          const prData = await prRes.json();
          if (prData.name) setProfile(prData);
        }

        const nRes = await fetch("/api/notifications");
        if (nRes.ok) {
          const nData = await nRes.json();
          if (nData.length > 0) setNotifications(nData);
        }
      } catch (err) {
        console.warn("Backend endpoints cold starting or server offline. Running high-fidelity local structures.", err);
      }
    };
    fetchAllData();
  }, []);

  // Update navigation path helper
  const navigateTo = (tab: string, pid: string | null = null) => {
    setPreviousTabs(prev => [...prev, activeTab]);
    setActiveTab(tab);
    if (pid) {
      setSelectedProductId(pid);
    } else {
      setSelectedProductId(null);
    }
    // Close drawers
    setShowCartDrawer(false);
    setShowWishlistDrawer(false);
    setShowNotifDrawer(false);
  };

  const handleBack = () => {
    if (selectedProductId) {
      setSelectedProductId(null);
      return;
    }
    if (previousTabs.length > 0) {
      const copy = [...previousTabs];
      const prev = copy.pop();
      setPreviousTabs(copy);
      setActiveTab(prev || 'home');
    } else {
      setActiveTab('home');
    }
  };

  // 1. ADD SNEAKER TO WISHLIST
  const handleToggleWishlist = (product: SneakerProduct) => {
    setWishlistIds(prev => 
      prev.includes(product.id) 
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  // 2. ADD TO BASKET SHOPPING BUCKET
  const handleAddToCart = (product: SneakerProduct, size: number, colorOption: any) => {
    const existing = cartItems.find(
      item => item.product.id === product.id && item.size === size && item.colorHex === colorOption.hex
    );

    if (existing) {
      setCartItems(prev => prev.map(
        item => item.id === existing.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product: product,
        size: size,
        colorHex: colorOption.hex,
        colorName: colorOption.name,
        quantity: 1
      };
      setCartItems(prev => [...prev, newItem]);
    }

    // Interactive toast message simulation
    const addedNotification: Notification = {
      id: `nt-add-${Date.now()}`,
      title: "Added to Bag!",
      description: `${product.name} (US Size ${size} - ${colorOption.name}) added to your sneaker bag. Ready to verify checkout.`,
      timestamp: "Just now",
      type: "drop",
      read: false
    };
    setNotifications(prev => [addedNotification, ...prev]);
    setShowCartDrawer(true);
  };

  // Update Cart Quantity
  const handleUpdateCartQuantity = (id: string, amount: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(item.quantity + amount, 1);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Submit complete checkout purchase
  const handleSubmitOrder = (address: any, paymentMethod: string) => {
    const orderSum = cartItems.reduce((sum, item) => {
      const activePrice = item.product.discountPrice || item.product.price;
      return sum + (activePrice * item.quantity);
    }, 0);

    const discountVal = orderSum * (appliedPromo.percentage / 100);
    const orderTax = (orderSum - discountVal) * 0.08;
    const isFreeShip = orderSum >= 200;
    const orderShip = isFreeShip ? 0 : 15.00;
    const orderTotal = orderSum - discountVal + orderTax + orderShip;

    const newOrder: Order = {
      id: `SH-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: profile.email,
      items: [...cartItems],
      shippingAddress: address,
      paymentMethod: paymentMethod,
      priceBreakdown: {
        subtotal: orderSum,
        discount: discountVal,
        tax: orderTax,
        shipping: orderShip,
        total: orderTotal
      },
      status: "Confirmed",
      trackingHistory: [
        { status: "Ordered", date: new Date().toLocaleDateString(), description: "Payment verified successfully. Preparing sneaker pairs at SFO warehouse dispatch.", completed: true },
        { status: "Confirmed", date: new Date().toLocaleDateString(), description: "Inventory reserved. Awaiting driver loading bay dispatch.", completed: true },
        { status: "Shipped", date: "Tomorrow (Est)", description: "Transit van loading. Express tracking coordinates created.", completed: false },
        { status: "Out for Delivery", date: "In 2 Days (Est)", description: "Local carrier dispatch en-route to your porch address.", completed: false },
        { status: "Completed", date: "In 2 Days (Est)", description: "Photo verification drop-off confirmed.", completed: false }
      ],
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCartItems([]);
    setAppliedPromo({ percentage: 0, code: "" });

    // Deduct stock levels in product state
    setProducts(prev => prev.map(p => {
      const purchasedPair = cartItems.find(ci => ci.product.id === p.id);
      if (purchasedPair) {
        return { ...p, stock: Math.max(p.stock - purchasedPair.quantity, 0) };
      }
      return p;
    }));

    // Add purchase alert notifications
    const ordNotification: Notification = {
      id: `nt-ord-${Date.now()}`,
      title: "Purchase Authorized!",
      description: `Order ${newOrder.id} confirmed. Tracking driver Marcus live on GPS routing map.`,
      timestamp: "Just now",
      type: "shipping",
      read: false
    };
    setNotifications(prev => [ordNotification, ...prev]);

    // Give loyalty reward points (10 points per dollar spent)
    const pointsAwarded = Math.round(orderTotal * 10);
    setProfile(prev => ({
      ...prev,
      points: prev.points + pointsAwarded
    }));

    navigateTo('tracker');
  };

  // Coupon applicator
  const handleApplyPromoCode = (percentage: number, code: string) => {
    setAppliedPromo({ percentage, code });
  };

  // Add customized review from client form
  const handleAddProductReview = (productId: string, reviewData: { username: string; rating: number; title: string; comment: string }) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newReview = {
          id: `rev-${Date.now()}`,
          username: reviewData.username,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          date: "Today",
          verified: true
        };
        const updatedReviews = [newReview, ...p.reviews];
        // Re-calculate math average rating
        const avg = parseFloat((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
        return {
          ...p,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: avg
        };
      }
      return p;
    }));
  };

  // Notification clear triggers
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // ADMIN DASHBOARD CONTROLLER ACTIONS
  const handleAdminUpdateStock = (productId: string, amount: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(amount, 0) };
      }
      return p;
    }));
  };

  const handleAdminAddProduct = (newP: any) => {
    const formatted: SneakerProduct = {
      id: `p-${Date.now()}`,
      name: newP.name,
      brand: newP.brand,
      category: newP.category,
      price: Number(newP.price),
      discountPrice: newP.discountPrice ? Number(newP.discountPrice) : undefined,
      description: newP.description,
      images: [newP.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80"],
      rating: 5.0,
      reviewsCount: 0,
      stock: Number(newP.stock),
      colors: [{ name: "Standard Black", hex: "#111", imageIndex: 0 }],
      sizes: [8, 9, 10, 11, 12],
      specs: [{ label: "Origin", value: "Imported" }],
      reviews: []
    };
    setProducts(prev => [formatted, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, statusText: "Confirmed" | "Shipped" | "Out for Delivery" | "Completed") => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        // Complete current history items matching status
        const mapping = ["Ordered", "Confirmed", "Shipped", "Out for Delivery", "Completed"];
        const targetIndex = mapping.indexOf(statusText);
        
        const historyCopy = order.trackingHistory.map((h, idx) => {
          const stepIndex = mapping.indexOf(h.status);
          if (stepIndex <= targetIndex) {
            return { ...h, completed: true, date: new Date().toLocaleDateString() };
          }
          return h;
        });

        const updatedOrder = {
          ...order,
          status: statusText,
          trackingHistory: historyCopy
        };

        // If this order is the active tracked one, update detail maps
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder(updatedOrder);
        }

        return updatedOrder;
      }
      return order;
    }));

    // Trigger user notification
    const statNotification: Notification = {
      id: `nt-status-${Date.now()}`,
      title: `Order Status: ${statusText}!`,
      description: `Your SneakerHub package ${orderId} has been updated to '${statusText}' status. Live tracking maps updated.`,
      timestamp: "Just now",
      type: "shipping",
      read: false
    };
    setNotifications(prev => [statNotification, ...prev]);
  };

  // Active product details helper
  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Cart values calculations for headers
  const cartItemTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistIds.length;

  return (
    <div id="app-container" className="min-h-screen bg-slate-50 flex items-center justify-center py-6 px-4 md:py-12 select-none">
      
      {/* 3. PREMIUM SMARTPHONE DEVICE SKIN FRAME */}
      <div id="android-device-wrapper" className="w-full max-w-[430px] h-[860px] bg-white rounded-[40px] shadow-2xl border-[10px] border-black flex flex-col relative overflow-hidden">
        
        {/* Device camera hardware notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-slate-800 rounded-full ml-12" />
        </div>

        {/* 4. APPLICATION STANDARD TOP HEADER */}
        <header id="android-status-bar" className="h-16 bg-white/95 border-b border-slate-100 pt-3 px-6 flex items-center justify-between shrink-0 z-30">
          <div onClick={() => navigateTo('home')} className="flex items-center gap-1.5 cursor-pointer">
            <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs italic tracking-tighter">S</span>
            <span className="text-lg font-black font-sans uppercase tracking-tighter italic text-slate-900">
              SneakerHub
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Wishlist drawer icon info */}
            <button
              id="header-wishlist-btn"
              onClick={() => {
                setShowWishlistDrawer(true);
                setShowCartDrawer(false);
                setShowNotifDrawer(false);
              }}
              className="relative p-1.5 hover:bg-slate-100 rounded-lg text-slate-800 cursor-pointer transition-colors active:scale-90"
            >
              <Heart size={16} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[8px] font-mono font-black rounded-full flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Notifications button */}
            <button
              id="header-notif-btn"
              onClick={() => {
                setShowNotifDrawer(true);
                setShowCartDrawer(false);
                setShowWishlistDrawer(false);
              }}
              className="relative p-1.5 hover:bg-slate-100 rounded-lg text-slate-800 cursor-pointer transition-colors active:scale-90"
            >
              <Bell size={16} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[8px] font-mono font-black rounded-full flex items-center justify-center border border-white">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Shopping cart button */}
            <button
              id="header-cart-btn"
              onClick={() => {
                setShowCartDrawer(true);
                setShowWishlistDrawer(false);
                setShowNotifDrawer(false);
              }}
              className="relative p-1.5 hover:bg-slate-100 rounded-lg text-slate-850 cursor-pointer transition-colors active:scale-90"
            >
              <ShoppingBag size={16} />
              {cartItemTotalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[8px] font-mono font-black rounded-full flex items-center justify-center border border-white">
                  {cartItemTotalCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* 5. INTERMEDIATE MAIN VIEW ROUTER STAGE */}
        <main id="android-screen-viewport" className="flex-1 bg-white relative overflow-hidden flex flex-col pt-2.5">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProductId ? `product-${selectedProductId}` : activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
              className="h-full flex flex-col"
            >
              {/* Product detailed page override */}
              {selectedProductId && selectedProduct ? (
                <ProductDetailView
                  product={selectedProduct}
                  onBack={handleBack}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistIds={wishlistIds}
                  onAddToCart={handleAddToCart}
                  onAddReview={handleAddProductReview}
                />
              ) : (
                /* Primary Tab Renders */
                <>
                  {activeTab === 'home' && (
                    <HomeView
                      products={products}
                      onSelectProduct={(id) => navigateTo('home', id)}
                      onBrandSelect={(brand) => {
                        setSelectedBrandCategory({ brand, category: "All" });
                        navigateTo('shop');
                      }}
                      onNavigateToOffers={() => navigateTo('offers')}
                      onNavigateToAssistant={() => navigateTo('assistant')}
                      onToggleWishlist={handleToggleWishlist}
                      wishlistIds={wishlistIds}
                      onAddToCart={handleAddToCart}
                    />
                  )}

                  {activeTab === 'shop' && (
                    <ProductListingView
                      products={products}
                      selectedBrandFilter={selectedBrandCategory.brand}
                      selectedCategoryFilter={selectedBrandCategory.category}
                      onSelectProduct={(id) => navigateTo('shop', id)}
                      onToggleWishlist={handleToggleWishlist}
                      wishlistIds={wishlistIds}
                      onAddToCart={handleAddToCart}
                    />
                  )}

                  {activeTab === 'categories' && (
                    <CategoriesView
                      onCategorySelect={(category) => {
                        setSelectedBrandCategory({ brand: "All", category });
                        navigateTo('shop');
                      }}
                    />
                  )}

                  {activeTab === 'search' && (
                    <SearchView
                      products={products}
                      onSelectProduct={(id) => navigateTo('search', id)}
                      onNavigateToAssistant={() => navigateTo('assistant')}
                    />
                  )}

                  {activeTab === 'assistant' && (
                    <AiAssistantView
                      products={products}
                      onSelectProduct={(id) => navigateTo('assistant', id)}
                      chatHistory={chatHistory}
                      onUpdateHistory={setChatHistory}
                    />
                  )}

                  {activeTab === 'profile' && (
                    <UserProfileView
                      profile={profile}
                      ordersCount={orders.length}
                      onNavigateToOrderHistory={() => navigateTo('order_history')}
                      onUpdateProfile={async (updatedProfile) => {
                        setProfile(updatedProfile);
                        try {
                          await fetch("/api/profile", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(updatedProfile)
                          });
                        } catch (err) {
                          console.warn("Backend API status: Profile persisted in memory, sync failed: ", err);
                        }
                      }}
                      logout={() => {
                        alert("Simulating sign out credentials reset!");
                        setCartItems([]);
                        setWishlistIds([]);
                        setOrders([]);
                        setActiveOrder(null);
                        setProfile(prev => ({ ...prev, points: 0 }));
                        navigateTo('home');
                      }}
                    />
                  )}

                  {activeTab === 'order_history' && (
                    <OrderHistoryView
                      orders={orders}
                      onBack={() => navigateTo('profile')}
                      onTrackOrder={(order) => {
                        setActiveOrder(order);
                        navigateTo('tracker');
                      }}
                      onNavigateToShop={() => navigateTo('shop')}
                      onSelectOrder={(order) => {
                        setSelectedOrderDetail(order);
                        navigateTo('order_detail');
                      }}
                    />
                  )}

                  {activeTab === 'order_detail' && selectedOrderDetail && (
                    <OrderDetailView
                      order={selectedOrderDetail}
                      onBack={() => navigateTo('order_history')}
                      onTrackOrder={() => {
                        setActiveOrder(selectedOrderDetail);
                        navigateTo('tracker');
                      }}
                      onViewProduct={(productId) => {
                        setSelectedProductId(productId);
                      }}
                    />
                  )}

                  {activeTab === 'cart' && (
                    <CartView
                      cartItems={cartItems}
                      onUpdateQuantity={handleUpdateCartQuantity}
                      onRemoveItem={handleRemoveCartItem}
                      onNavigateToProducts={() => navigateTo('shop')}
                      onStartCheckout={() => navigateTo('checkout')}
                      onApplyPromoCode={handleApplyPromoCode}
                      appliedDiscountPercentage={appliedPromo.percentage}
                      appliedDiscountCode={appliedPromo.code}
                    />
                  )}

                  {activeTab === 'checkout' && (
                    <CheckoutView
                      cartItems={cartItems}
                      subtotal={cartItems.reduce((sum, i) => sum + ((i.product.discountPrice || i.product.price) * i.quantity), 0)}
                      discount={cartItems.reduce((sum, i) => sum + ((i.product.discountPrice || i.product.price) * i.quantity), 0) * (appliedPromo.percentage / 100)}
                      tax={(cartItems.reduce((sum, i) => sum + ((i.product.discountPrice || i.product.price) * i.quantity), 0) - (cartItems.reduce((sum, i) => sum + ((i.product.discountPrice || i.product.price) * i.quantity), 0) * (appliedPromo.percentage / 100))) * 0.08}
                      shipping={cartItems.reduce((sum, i) => sum + ((i.product.discountPrice || i.product.price) * i.quantity), 0) >= 200 ? 0 : 15}
                      total={
                        cartItems.reduce((sum, i) => sum + ((i.product.discountPrice || i.product.price) * i.quantity), 0) 
                        - (cartItems.reduce((sum, i) => sum + ((i.product.discountPrice || i.product.price) * i.quantity), 0) * (appliedPromo.percentage / 100))
                        + ((cartItems.reduce((sum, i) => sum + ((i.product.discountPrice || i.product.price) * i.quantity), 0) - (cartItems.reduce((sum, i) => sum + ((i.product.discountPrice || i.product.price) * i.quantity), 0) * (appliedPromo.percentage / 100))) * 0.08)
                        + (cartItems.reduce((sum, i) => sum + ((i.product.discountPrice || i.product.price) * i.quantity), 0) >= 200 ? 0 : 15)
                      }
                      onBackToCart={() => navigateTo('cart')}
                      onSubmitOrder={handleSubmitOrder}
                      defaultAddresses={profile.addresses}
                    />
                  )}

                  {activeTab === 'tracker' && (
                    <OrderTrackerView
                      order={activeOrder || (orders.length > 0 ? orders[0] : null)}
                      onBack={() => navigateTo('home')}
                    />
                  )}

                  {activeTab === 'offers' && (
                    <OffersView
                      offers={[
                        { code: "SNEAKERHUB15", discountText: "15% OFF SITE", description: "Get 15% discount on all premium brand sneaker catalog items.", expires: "Expires in 3 days", percentage: 15, type: "Voucher" },
                        { code: "RUNNER25", discountText: "25% PRO RACER", description: "Exclusive 25% Off voucher valid for all performance and marathon runners.", expires: "Expires in 5 days", percentage: 25, type: "Flash" }
                      ]}
                      onClaimCode={(code, percentage) => {
                        handleApplyPromoCode(percentage, code);
                        // Direct to Cart for user convenience
                        navigateTo('cart');
                      }}
                      claimedCodes={appliedPromo.code ? [appliedPromo.code] : []}
                    />
                  )}

                  {activeTab === 'notifications' && (
                    <NotificationsView
                      notifications={notifications}
                      onMarkAllRead={handleMarkAllNotificationsRead}
                      onClear={handleClearNotifications}
                    />
                  )}

                  {/* 6. ADMIN SYSTEM ARCHITECTURE INTERACTIVE WORKSPACE */}
                  {activeTab === 'admin' && (
                    <div id="admin-dashboard-screen" className="pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none text-left px-4">
                      <div className="bg-zinc-950 text-white rounded-2xl p-4 mt-2 space-y-2 relative overflow-hidden border border-zinc-800">
                        <div className="flex items-center gap-1.5 text-lime-400">
                          <Database size={16} />
                          <h3 className="text-xs font-black uppercase tracking-wide font-sans">Hub DB & Admin Panel</h3>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          Manage sneaker inventory stock levels, change order logistics status, and explore SQL Database schemas for Android app export.
                        </p>
                      </div>

                      <div className="space-y-5 pt-4">
                        {/* Interactive orders workflow simulator */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono font-extrabold uppercase text-zinc-400 block tracking-wider leading-none">Simulate Order Tracking Milestones</span>
                          {orders.length === 0 ? (
                            <p className="text-[10px] text-zinc-400 bg-zinc-50 p-2.5 rounded border border-dashed text-center">Place a test sneaker purchase to simulate en-route parcel tracking.</p>
                          ) : (
                            <div className="space-y-2">
                              {orders.map((ord) => (
                                <div key={ord.id} className="bg-white border border-zinc-150 p-3 rounded-xl space-y-2 text-[11px] font-bold text-zinc-700 leading-none">
                                  <div className="flex justify-between items-baseline font-black">
                                    <span className="text-zinc-950 uppercase">{ord.id}</span>
                                    <span className="text-lime-700 bg-lime-50 rounded px-1 text-[9px] uppercase">{ord.status}</span>
                                  </div>

                                  <div className="grid grid-cols-4 gap-1 pt-1.5 border-t border-zinc-100">
                                    {["Confirmed", "Shipped", "Out for Delivery", "Completed"].map((status) => (
                                      <button
                                        id={`admin-btn-${ord.id}-${status.toLowerCase().replace(/\s+/g, '-')}`}
                                        key={status}
                                        onClick={() => handleUpdateOrderStatus(ord.id, status as any)}
                                        className={`py-1 text-[9px] font-black rounded text-center cursor-pointer transition-colors ${
                                          ord.status === status 
                                            ? "bg-zinc-950 text-white" 
                                            : "bg-zinc-50 border hover:bg-zinc-100"
                                        }`}
                                      >
                                        {status}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Inventory stock controls */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono font-extrabold uppercase text-zinc-400 block tracking-wider leading-none">Manage Product stock level</span>
                          <div className="grid grid-cols-1 gap-2 max-h-44 overflow-y-auto scrollbar-none pr-1">
                            {products.map((p) => (
                              <div key={p.id} className="bg-zinc-50 border border-zinc-150 p-2.5 rounded-xl flex items-center justify-between text-xs">
                                <div className="text-left font-bold text-zinc-805 truncate max-w-[190px]">
                                  <span>{p.name}</span>
                                  <p className="text-[9px] text-zinc-450 font-mono leading-none mt-0.5">Stock Level: <strong className="text-zinc-800">{p.stock} left</strong></p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    id={`admin-stock-dec-${p.id}`}
                                    onClick={() => handleAdminUpdateStock(p.id, p.stock - 2)}
                                    className="px-2 py-1 bg-white border border-zinc-200 rounded font-black hover:bg-zinc-100 cursor-pointer"
                                  >
                                    -2
                                  </button>
                                  <button
                                    id={`admin-stock-inc-${p.id}`}
                                    onClick={() => handleAdminUpdateStock(p.id, p.stock + 5)}
                                    className="px-2 py-1 bg-white border border-zinc-200 rounded font-black hover:bg-zinc-105 cursor-pointer"
                                  >
                                    +5
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Schema documentation tabs */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono font-extrabold uppercase text-zinc-400 block tracking-wider leading-none font-sans">SQL Table DB Architectures</span>
                          <div className="bg-zinc-900 text-lime-400 p-3 rounded-xl font-mono text-[9px] leading-relaxed max-h-48 overflow-y-auto border border-zinc-800 shadow-md">
                            <span className="text-zinc-400">// SNEAKERS SCHEMA TABLE DEF</span><br />
                            CREATE TABLE sneakers (<br />
                            &nbsp;&nbsp;id VARCHAR(100) PRIMARY KEY,<br />
                            &nbsp;&nbsp;name VARCHAR(255) NOT NULL,<br />
                            &nbsp;&nbsp;brand VARCHAR(150),<br />
                            &nbsp;&nbsp;price DECIMAL(10,2),<br />
                            &nbsp;&nbsp;stock_level INT DEFAULT 12,<br />
                            &nbsp;&nbsp;rating_avg FLOAT<br />
                            );<br /><br />

                            <span className="text-zinc-400">// CUSTOMER REVIEWS SCHEMA</span><br />
                            CREATE TABLE reviews (<br />
                            &nbsp;&nbsp;id SERIAL PRIMARY KEY,<br />
                            &nbsp;&nbsp;sneaker_id VARCHAR(100) REFERENCES sneakers(id),<br />
                            &nbsp;&nbsp;username VARCHAR(100) NOT NULL,<br />
                            &nbsp;&nbsp;score INT CHECK (score BETWEEN 1 AND 5),<br />
                            &nbsp;&nbsp;opinion TEXT<br />
                            );<br /><br />

                            <span className="text-zinc-400">// ORDERS LOGISTICS SCHEMA</span><br />
                            CREATE TABLE purchase_orders (<br />
                            &nbsp;&nbsp;id VARCHAR(100) PRIMARY KEY,<br />
                            &nbsp;&nbsp;total_sum DECIMAL(10,2),<br />
                            &nbsp;&nbsp;courier_status VARCHAR(50) DEFAULT 'Confirmed',<br />
                            &nbsp;&nbsp;placed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP<br />
                            );
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

        </main>

        {/* 7. QUICK INTERACTIVE OVERLAYS DRAWER SYSTEM */}
        
        {/* Wishlist quick drawer panel */}
        <AnimatePresence>
          {showWishlistDrawer && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40 flex justify-end"
            >
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.2 }}
                className="w-4/5 h-full bg-white flex flex-col pt-12 text-left"
              >
                <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                  <span className="text-xs font-black uppercase text-zinc-900 tracking-wide font-sans flex items-center gap-1">
                    <Heart size={14} className="text-rose-500 fill-rose-500" />
                    Wishlisted releases
                  </span>
                  <button onClick={() => setShowWishlistDrawer(false)} className="p-1 hover:bg-zinc-150 rounded"><X size={16} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none">
                  {wishlistIds.length === 0 ? (
                    <div className="py-20 text-center space-y-2">
                      <Heart size={24} className="text-zinc-350 mx-auto" />
                      <p className="text-xs text-zinc-400">Save sneaker drops to wishlist.</p>
                    </div>
                  ) : (
                    products.filter(p => wishlistIds.includes(p.id)).map(p => (
                      <div key={p.id} className="flex gap-2.5 items-center justify-between border-b border-zinc-50 pb-2.5 text-xs font-bold text-zinc-800">
                        <div className="flex items-center gap-2 m-0 select-none">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 bg-zinc-50 object-cover rounded" />
                          <div className="truncate max-w-[130px] leading-tight">
                            <h5 className="font-extrabold truncate text-[11px] leading-tight">{p.name}</h5>
                            <span className="text-[10px] text-zinc-450 font-mono">${(p.discountPrice || p.price).toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5 items-center shrink-0">
                          <button
                            id={`wishlist-view-btn-${p.id}`}
                            onClick={() => {
                              setSelectedProductId(p.id);
                              setShowWishlistDrawer(false);
                            }}
                            className="p-1.5 bg-zinc-950 text-white rounded text-[10px] font-bold"
                          >
                            View
                          </button>
                          <button
                            id={`wishlist-del-btn-${p.id}`}
                            onClick={() => handleToggleWishlist(p)}
                            className="p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications and restocks drawer slide-over drawer */}
        <AnimatePresence>
          {showNotifDrawer && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40 flex justify-end"
            >
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.2 }}
                className="w-4/5 h-full bg-white flex flex-col pt-12 text-left"
              >
                <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                  <span className="text-xs font-black uppercase text-zinc-900 tracking-wide font-sans flex items-center gap-1">
                    <Bell size={14} className="text-zinc-950" />
                    Alerts inbox
                  </span>
                  <button onClick={() => setShowNotifDrawer(false)} className="p-1 hover:bg-zinc-150 rounded"><X size={16} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none text-xs">
                  <NotificationsView
                    notifications={notifications}
                    onMarkAllRead={handleMarkAllNotificationsRead}
                    onClear={handleClearNotifications}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shopping bag quick slide-over drawer */}
        <AnimatePresence>
          {showCartDrawer && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40 flex justify-end"
            >
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.2 }}
                className="w-4/5 h-full bg-white flex flex-col pt-12 text-left"
              >
                <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                  <span className="text-xs font-black uppercase text-zinc-900 tracking-wide font-sans flex items-center gap-1.5">
                    <ShoppingBag size={14} />
                    Cart Basket ({cartItems.length})
                  </span>
                  <button onClick={() => setShowCartDrawer(false)} className="p-1 hover:bg-zinc-150 rounded"><X size={16} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none text-xs">
                  {cartItems.length === 0 ? (
                    <div className="py-20 text-center space-y-2">
                      <ShoppingBag size={24} className="text-zinc-300 mx-auto" />
                      <p className="text-xs text-zinc-400">Sneaker bag is empty.</p>
                    </div>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className="flex gap-2 items-center justify-between border-b border-zinc-50 pb-2.5">
                        <div className="flex items-center gap-2 m-0 select-none">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 bg-zinc-50 object-cover rounded" />
                          <div className="truncate max-w-[110px] leading-tight">
                            <h6 className="font-extrabold truncate text-[10px] text-zinc-900 m-0">{item.product.name}</h6>
                            <span className="text-[9px] text-zinc-450 block font-mono">Size US {item.size} • x{item.quantity}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            id={`drawer-cart-minus-${item.id}`}
                            onClick={() => handleUpdateCartQuantity(item.id, -1)}
                            className="p-1 hover:bg-zinc-100 rounded"
                          >
                            -
                          </button>
                          <span className="font-bold text-[10px] w-4 text-center font-mono">{item.quantity}</span>
                          <button
                            id={`drawer-cart-plus-${item.id}`}
                            onClick={() => handleUpdateCartQuantity(item.id, 1)}
                            className="p-1 hover:bg-zinc-100 rounded"
                          >
                            +
                          </button>
                          <button
                            id={`drawer-cart-del-${item.id}`}
                            onClick={() => handleRemoveCartItem(item.id)}
                            className="p-1 hover:bg-zinc-50 text-zinc-400 hover:text-rose-600 rounded ml-1"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="flex justify-between items-baseline font-bold text-slate-500">
                      <span>Subtotal</span>
                      <span className="text-slate-900 font-extrabold font-mono">
                        ${cartItems.reduce((sum, item) => sum + ((item.product.discountPrice || item.product.price) * item.quantity), 0).toFixed(2)}
                      </span>
                    </div>
                    <button
                      id="drawer-checkout-btn"
                      onClick={() => {
                        setShowCartDrawer(false);
                        navigateTo('cart');
                      }}
                      className="w-full py-2.5 bg-black text-white rounded-lg text-xs font-black tracking-widest uppercase text-center cursor-pointer shadow hover:bg-slate-900 transition-colors"
                    >
                      Process Checkout
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 8. APPLICATION BOTTOM PERSISTENT ACTION FOOTER TAB CLK ACTIONS */}
        <footer id="android-navigation-rail" className="h-[76px] bg-white border-t border-slate-100 pb-4 px-3 flex items-center justify-between shrink-0 z-30">
          
          <button
            id="tab-btn-home"
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-colors ${
              activeTab === 'home' && !selectedProductId ? "text-black bg-slate-50 font-extrabold" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Home size={18} className={activeTab === 'home' && !selectedProductId ? "stroke-[2.5px]" : ""} />
            <span className="text-[9px] font-black uppercase tracking-wider mt-1 font-sans">Home</span>
          </button>

          <button
            id="tab-btn-shop"
            onClick={() => navigateTo('shop')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-colors ${
              activeTab === 'shop' || selectedProductId ? "text-black bg-slate-50 font-extrabold" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <ShoppingBag size={18} className={activeTab === 'shop' || selectedProductId ? "stroke-[2.5px]" : ""} />
            <span className="text-[9px] font-black uppercase tracking-wider mt-1 font-sans">Shop</span>
          </button>

          <button
            id="tab-btn-search"
            onClick={() => navigateTo('search')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-colors ${
              activeTab === 'search' ? "text-black bg-slate-50 font-extrabold" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <SearchIcon size={18} className={activeTab === 'search' ? "stroke-[2.5px]" : ""} />
            <span className="text-[9px] font-black uppercase tracking-wider mt-1 font-sans">Search</span>
          </button>

          {/* AI assistant chatbot navigation link */}
          <button
            id="tab-btn-assistant"
            onClick={() => navigateTo('assistant')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-colors ${
              activeTab === 'assistant' ? "text-black bg-slate-50 font-extrabold" : "text-slate-400 hover:text-slate-605"
            }`}
          >
            <Bot size={18} className={activeTab === 'assistant' ? "stroke-[2.2px]" : ""} />
            <span className="text-[9px] font-black uppercase tracking-wider mt-1 font-sans">Concierge</span>
          </button>

          <button
            id="tab-btn-offers"
            onClick={() => navigateTo('offers')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-colors ${
              activeTab === 'offers' ? "text-black bg-slate-50 font-extrabold" : "text-slate-400 hover:text-slate-650"
            }`}
          >
            <Sliders size={18} className={activeTab === 'offers' ? "stroke-[2.5px]" : ""} />
            <span className="text-[9px] font-black uppercase tracking-wider mt-1 font-sans">Offers</span>
          </button>

          <button
            id="tab-btn-admin"
            onClick={() => navigateTo('admin')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-colors ${
              activeTab === 'admin' ? "text-black bg-slate-50 font-extrabold" : "text-slate-400 hover:text-slate-650"
            }`}
          >
            <Database size={18} className={activeTab === 'admin' ? "stroke-[2.5px]" : ""} />
            <span className="text-[9px] font-black uppercase tracking-wider mt-1 font-sans">Admin</span>
          </button>

        </footer>

      </div>

    </div>
  );
}
