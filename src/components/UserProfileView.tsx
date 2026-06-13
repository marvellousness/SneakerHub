import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Award, Settings, MapPin, Key, LogOut, CheckCircle2, 
  ChevronRight, Compass, ShieldCheck, Mail, LogIn, ExternalLink,
  Plus, Trash2, Edit3, Heart, Check, Sparkles, HelpCircle, Phone
} from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileViewProps {
  profile: UserProfile;
  logout: () => void;
  ordersCount: number;
  onNavigateToOrderHistory: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
}

const PRESET_AVATARS = [
  {
    name: "Classic Alex",
    url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Sarah (runner)",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Marcus (courier)",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Jess (hypebeast)",
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Ryan (designer)",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Elena (collector)",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  }
];

const POPULAR_BRANDS = ["Nike", "Adidas", "Jordan", "New Balance", "Asics", "Yeeze", "Puma", "Reebok"];
const SNEAKER_SIZES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];

export default function UserProfileView({
  profile,
  logout,
  ordersCount,
  onNavigateToOrderHistory,
  onUpdateProfile
}: UserProfileViewProps) {
  const [successMsg, setSuccessMsg] = useState("");
  const [editMode, setEditMode] = useState(false);
  
  // Profile form state
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [shoeSize, setShoeSize] = useState(profile.shoeSize || 10.5);
  const [favoriteBrand, setFavoriteBrand] = useState(profile.favoriteBrand || "Jordan");
  const [bio, setBio] = useState(profile.bio || "Sneakerhead since '08.");
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Address editing states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);

  // Address form draft
  const [addrName, setAddrName] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrZip, setAddrZip] = useState("");
  const [addrPhone, setAddrPhone] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updated: UserProfile = {
      ...profile,
      name,
      email,
      avatar: selectedAvatar,
      shoeSize: Number(shoeSize),
      favoriteBrand,
      bio
    };

    onUpdateProfile(updated);
    setSuccessMsg("Details saved successfully!");
    setEditMode(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleOpenAddAddress = () => {
    setAddrName("");
    setAddrStreet("");
    setAddrCity("");
    setAddrState("");
    setAddrZip("");
    setAddrPhone("");
    setEditingAddressIndex(null);
    setShowAddressForm(true);
  };

  const handleOpenEditAddress = (idx: number) => {
    const addr = profile.addresses[idx];
    setAddrName(addr.fullName);
    setAddrStreet(addr.street);
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrZip(addr.zipCode);
    setAddrPhone(addr.phone);
    setEditingAddressIndex(idx);
    setShowAddressForm(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrStreet || !addrCity || !addrState || !addrZip || !addrPhone) {
      alert("Please complete all address required fields.");
      return;
    }

    const nextAddresses = [...profile.addresses];
    const targetAddress = {
      fullName: addrName,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      zipCode: addrZip,
      phone: addrPhone
    };

    if (editingAddressIndex !== null) {
      nextAddresses[editingAddressIndex] = targetAddress;
    } else {
      nextAddresses.push(targetAddress);
    }

    const updatedProfile: UserProfile = {
      ...profile,
      addresses: nextAddresses
    };

    onUpdateProfile(updatedProfile);
    setShowAddressForm(false);
    setSuccessMsg(editingAddressIndex !== null ? "Address updated!" : "New address added!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDeleteAddress = (idx: number) => {
    if (profile.addresses.length <= 1) {
      alert("At least one address is required for checkout systems integration.");
      return;
    }
    if (!confirm("Are you sure you want to delete this shipping address record?")) {
      return;
    }

    const nextAddresses = profile.addresses.filter((_, i) => i !== idx);
    const updatedProfile: UserProfile = {
      ...profile,
      addresses: nextAddresses
    };

    onUpdateProfile(updatedProfile);
    setSuccessMsg("Address removed.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Progression calculation
  const targetPoints = 2000;
  const rankPercent = Math.min((profile.points / targetPoints) * 100, 100);

  return (
    <div id="user-profile-container" className="pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none text-left px-4 bg-white font-sans">
      
      {/* 1. MEMBERSHIP PROGRESSION STATUS GAUGE */}
      <div id="profile-vip-card" className="bg-black text-white rounded-2xl p-4 mt-2.5 relative overflow-hidden shadow-lg border border-slate-900 transition-all duration-300">
        <div className="absolute right-[-15px] bottom-[-15px] text-slate-900/40 text-8xl font-black font-sans leading-none pointer-events-none select-none italic">VIP</div>
        
        <div className="flex gap-4 items-center relative z-10">
          <div className="relative group shrink-0">
            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-orange-400 overflow-hidden flex items-center justify-center shadow-md">
              <img src={selectedAvatar} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            {editMode && (
              <button 
                type="button"
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                className="absolute -bottom-1 -right-1 bg-orange-400 text-black hover:bg-orange-500 w-5.5 h-5.5 rounded-full flex items-center justify-center border border-black shadow-xs cursor-pointer transition-all"
                title="Change Avatar"
              >
                <Edit3 size={10} className="stroke-[3]" />
              </button>
            )}
          </div>
          
          <div className="text-left space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1 leading-none">
              <Award size={12} className="text-orange-400 animate-pulse" />
              <span className="text-[9px] font-mono font-black uppercase text-orange-400 tracking-widest leading-none">
                {profile.points >= 1500 ? 'VIP PLATINUM' : profile.points >= 800 ? 'GOLD' : profile.points >= 300 ? 'SILVER' : 'BRONZE'} MEMBER
              </span>
            </div>
            <h4 className="text-base font-black truncate text-white uppercase italic leading-tight">{profile.name}</h4>
            <p className="text-[10px] text-slate-400 truncate font-mono">{profile.email}</p>
          </div>
        </div>

        {/* Dynamic Bio */}
        {profile.bio && (
          <p className="mt-2.5 text-[10.5px] text-slate-300 italic border-l-2 border-orange-400/40 pl-2 leading-tight">
            "{profile.bio}"
          </p>
        )}

        {/* Loyalty Progression Gauge */}
        <div className="pt-3 ml-0.5 mt-3 border-t border-slate-900 relative z-10 space-y-1.5 text-xs text-slate-400">
          <div className="flex justify-between items-baseline text-[9px] font-mono uppercase tracking-tight">
            <span>Next Level Rewards</span>
            <span className="text-white font-mono font-black">{profile.points} / {targetPoints} PTS</span>
          </div>
          
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-950">
            <div 
              style={{ width: `${rankPercent}%` }} 
              className="bg-orange-400 h-full rounded-full transition-all duration-750"
            />
          </div>
          <p className="text-[8.5px] text-slate-450 leading-relaxed font-sans font-medium">
            Earn points on checkouts (10 PTS per $1). Platinum unlocked early catalog drops & laser custom-embroidery options.
          </p>
        </div>
      </div>

      {/* Interactive Avatar Grid Selector (under VIP header during editMode) */}
      <AnimatePresence>
        {editMode && showAvatarSelector && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-slate-50 border border-slate-200 mt-2 p-3 rounded-xl space-y-2"
          >
            <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest block">Choose Sneakerhead Avatar</span>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_AVATARS.map((av) => (
                <button
                  key={av.name}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(av.url);
                    setShowAvatarSelector(false);
                  }}
                  className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer bg-white mx-auto ${
                    selectedAvatar === av.url ? 'border-orange-500 scale-105 shadow' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={av.url} alt={av.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {selectedAvatar === av.url && (
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <Check size={12} className="text-white stroke-[3.5]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-2.5 text-xs rounded-xl mt-3.5 flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 size={13} className="text-emerald-500" />
          <span className="font-extrabold uppercase text-[9.5px] tracking-wide">{successMsg}</span>
        </div>
      )}

      {/* Quick preferences stats pills */}
      {!editMode && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-left shadow-xs">
            <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block leading-none">FAVORITE FAMILIES</span>
            <span className="text-xs font-black text-slate-900 flex items-center gap-1 mt-1 font-sans italic">
              <Sparkles size={11} className="text-amber-500 shrink-0" />
              {profile.favoriteBrand || "Jordan"}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-left shadow-xs">
            <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block leading-none">US SPREAD SIZE</span>
            <span className="text-xs font-black text-slate-900 flex items-center gap-1 mt-1 font-mono">
              👟 US {profile.shoeSize || 10.5}
            </span>
          </div>
        </div>
      )}

      {/* 2. SAVE PROFILE DETAILS PANEL */}
      <div id="profile-details-panel" className="pt-4.5 space-y-3">
        <div className="flex justify-between items-baseline border-b border-slate-100 pb-1.5">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Account Profile</span>
          <button 
            id="toggle-edit-profile-btn"
            onClick={() => {
              setEditMode(!editMode);
              setShowAvatarSelector(false);
            }} 
            className="text-[11px] font-black uppercase text-black hover:underline cursor-pointer flex items-center gap-1"
          >
            <Edit3 size={11} />
            {editMode ? "Cancel Edit" : "Edit Preferences"}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleSaveProfile} className="space-y-3.5 bg-slate-50 border border-slate-150 p-3.5 rounded-2xl shadow-sm">
            <div className="space-y-1">
              <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block leading-none">Full Name Character</label>
              <input
                id="edit-profile-name"
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-black font-semibold"
                placeholder="First Last"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block leading-none">Fit Size (US)</label>
                <select
                  value={shoeSize}
                  onChange={(e) => setShoeSize(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-black font-bold"
                >
                  {SNEAKER_SIZES.map(sz => (
                    <option key={sz} value={sz}>US {sz}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block leading-none">Favored Hub Brand</label>
                <select
                  value={favoriteBrand}
                  onChange={(e) => setFavoriteBrand(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-black font-bold"
                >
                  {POPULAR_BRANDS.map(br => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block leading-none">Contact Email Link</label>
              <input
                id="edit-profile-email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-black font-mono font-bold text-slate-700"
                placeholder="example@mail.com"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block leading-none">Collector Biography</label>
                <span className="text-[8px] font-mono text-slate-400 font-bold">{bio.length}/100</span>
              </div>
              <textarea
                value={bio}
                maxLength={100}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-black font-medium leading-relaxed h-11 resize-none"
                placeholder="Write a quick intro about your sneaker collection..."
              />
            </div>

            <div className="flex gap-2">
              <button
                id="save-profile-btn"
                type="submit"
                className="flex-1 py-3 bg-black hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer leading-none flex items-center justify-center gap-1 border-none shadow"
              >
                <CheckCircle2 size={12} className="text-orange-400 animate-bounce" />
                Synchronize Account
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-1 text-xs bg-slate-50 border border-slate-150 rounded-2xl p-3 shadow-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 leading-none">
              <span className="text-slate-405 font-bold uppercase text-[9.5px] font-mono">Vault Member Grade</span>
              <span className="text-slate-900 font-black uppercase italic text-[10.5px]">VIP Tier IV Access</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 leading-none">
              <span className="text-slate-405 font-bold uppercase text-[9.5px] font-mono">Bio Snippet</span>
              <span className="text-slate-600 font-medium text-[10.5px] text-right truncate max-w-[200px]" title={profile.bio}>
                {profile.bio || "No bio yet."}
              </span>
            </div>
            <div 
              id="profile-purchases-row"
              onClick={onNavigateToOrderHistory}
              className="flex justify-between items-center py-2 border-b border-none leading-none cursor-pointer hover:bg-slate-100/50 px-1 transition-all rounded-lg group"
            >
              <span className="text-slate-405 font-bold uppercase text-[9.5px] font-mono group-hover:text-black transition-colors">Completed Purchases</span>
              <div className="flex items-center gap-1 text-slate-900 font-sans font-black text-[10.5px]">
                <span className="font-mono bg-slate-200 py-0.5 px-1.5 rounded">{ordersCount} Sneaker Orders</span>
                <ChevronRight size={12} className="text-slate-400 group-hover:text-black transition-all group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. DYNAMIC ADDRESS BOOK SHEET LIST */}
      <div id="default-address-book" className="pt-4.5 space-y-2.5">
        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Address Directory</span>
          <button
            type="button"
            onClick={handleOpenAddAddress}
            className="text-[10px] font-black uppercase text-amber-600 hover:text-amber-800 cursor-pointer flex items-center gap-1"
          >
            <Plus size={11} className="stroke-[3]" /> Add Address
          </button>
        </div>

        {/* Address Form Drawer/Block inline */}
        <AnimatePresence>
          {showAddressForm && (
            <motion.form 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onSubmit={handleSaveAddress}
              className="bg-slate-50 border-2 border-orange-400/30 p-3.5 rounded-2xl space-y-3 shadow-md text-slate-850"
            >
              <h5 className="text-[10px] font-mono font-black uppercase text-black italic">
                {editingAddressIndex !== null ? 'Modify Shipping Point' : 'Assemble Shipping Destination'}
              </h5>
              
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Recipient Name (e.g. Alex Smith)"
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.75 text-xs focus:outline-none focus:border-black font-semibold text-slate-850"
                />
                
                <input
                  type="text"
                  required
                  placeholder="Street (e.g. 128 Innovation Way, Suite B)"
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.75 text-xs focus:outline-none focus:border-black font-semibold text-slate-850"
                />

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="col-span-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.75 text-xs focus:outline-none focus:border-black font-semibold text-slate-850"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State (CA)"
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="col-span-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.75 text-xs focus:outline-none focus:border-black font-semibold text-slate-850 text-center"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Zip Code"
                    value={addrZip}
                    onChange={(e) => setAddrZip(e.target.value)}
                    className="col-span-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.75 text-xs focus:outline-none focus:border-black font-mono font-bold text-slate-850 text-center"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold leading-none select-none pointer-events-none">
                    <Phone size={10} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Phone (e.g. +1 (555) 902-1234)"
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-6.5 pr-2.5 py-1.75 text-xs focus:outline-none focus:border-black font-mono font-bold text-slate-850"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-3.5 py-2 hover:bg-slate-100 rounded-xl text-slate-500 font-bold transition-all border-none bg-transparent cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white hover:bg-slate-900 rounded-xl font-bold transition-all shadow-sm flex items-center gap-1 border-none cursor-pointer"
                >
                  <CheckCircle2 size={11} className="text-orange-400" /> Save Record
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {profile.addresses.map((addr, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 text-xs text-left relative shadow-xs flex justify-between items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 leading-none">
                  <MapPin size={11} className="text-slate-400" />
                  <h5 className="font-extrabold text-slate-900 leading-tight uppercase tracking-wide font-sans truncate">{addr.fullName}</h5>
                  {idx === 0 && (
                    <span className="text-[7.5px] font-mono bg-orange-100 text-orange-850 border border-orange-200 px-1 py-0.25 font-bold uppercase rounded leading-none shrink-0">
                      Primary Ship
                    </span>
                  )}
                </div>
                <p className="text-[10.5px] text-slate-600 mt-1.5 font-medium leading-relaxed">
                  {addr.street}<br />
                  {addr.city}, {addr.state} {addr.zipCode}<br />
                  <span className="text-[9.5px] font-mono text-slate-450">{addr.phone}</span>
                </p>
              </div>

              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEditAddress(idx)}
                  className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-700 border border-slate-150 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs"
                  title="Modify Address"
                >
                  <Edit3 size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAddress(idx)}
                  className="w-7 h-7 bg-white hover:bg-rose-50 text-rose-600 hover:border-rose-200 border border-slate-150 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs"
                  title="Remove Address"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECURITY & EXPORTS SECTIONS */}
      <div id="profile-actions-bottom" className="pt-5.5 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Hub Logistics Verified</span>
        
        {/* Mock Android config instructions */}
        <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl text-[10px] text-slate-500 leading-normal space-y-1 shadow-xs">
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <ShieldCheck size={12} className="text-orange-500" />
            <span className="uppercase text-[9px] tracking-wider leading-none">Security Encryption Protocol (NFC Active)</span>
          </div>
          <p className="text-[9.5px] text-slate-450 leading-relaxed font-sans">
            Verify original release batches by hovering physical tags behind mobile scanner panels. Fully compatible with OAuth verification systems.
          </p>
        </div>

        {/* Mock logout CTA */}
        <button
          id="profile-logout-btn"
          onClick={logout}
          className="w-full py-3.5 mt-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed text-slate-600 rounded-xl text-xs font-black tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <LogOut size={12} />
          Sign Out of Account
        </button>
      </div>

    </div>
  );
}
