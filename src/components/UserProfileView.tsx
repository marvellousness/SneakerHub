import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Award, Settings, MapPin, Key, LogOut, CheckCircle2, 
  ChevronRight, Compass, ShieldCheck, Mail, LogIn, ExternalLink 
} from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileViewProps {
  profile: UserProfile;
  logout: () => void;
  ordersCount: number;
  onNavigateToOrderHistory: () => void;
}

export default function UserProfileView({
  profile,
  logout,
  ordersCount,
  onNavigateToOrderHistory
}: UserProfileViewProps) {
  const [successMsg, setSuccessMsg] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("Details saved successfully!");
    setEditMode(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Progression bars parameters
  const targetPoints = 2000;
  const rankPercent = Math.min((profile.points / targetPoints) * 100, 100);

  return (
    <div id="user-profile-container" className="pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none text-left px-4 bg-white">
      
      {/* 1. MEMBERSHIP PROGRESSION STATUS GAUGE */}
      <div id="profile-vip-card" className="bg-black text-white rounded-xl p-4 mt-2 relative overflow-hidden shadow border border-slate-900">
        <div className="absolute right-[-15px] bottom-[-15px] text-slate-900/40 text-8xl font-black font-sans leading-none pointer-events-none select-none">VIP</div>
        
        <div className="flex gap-3.5 items-center relative z-10">
          <div className="w-13 h-13 rounded-full bg-slate-800 border-2 border-orange-400 overflow-hidden shrink-0 flex items-center justify-center">
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          
          <div className="text-left space-y-0.5 min-w-0">
            <div className="flex items-center gap-1 leading-none">
              <Award size={12} className="text-orange-400 animate-pulse animate-duration-1000" />
              <span className="text-[9px] font-mono font-black uppercase text-orange-400 tracking-widest">
                {profile.membershipLevel} MEMBER
              </span>
            </div>
            <h4 className="text-base font-black truncate text-white uppercase italic">{profile.name}</h4>
            <p className="text-[10px] text-slate-400 truncate font-mono">{profile.email}</p>
          </div>
        </div>

        {/* Loyalty Progression Gauge */}
        <div className="pt-4 mt-3 border-t border-slate-900 relative z-10 space-y-1.5 text-xs text-slate-400">
          <div className="flex justify-between items-baseline text-[9px] font-mono uppercase tracking-tight">
            <span>Next Rank: VIP ELITE ACCESS</span>
            <span className="text-white font-mono font-black">{profile.points} / {targetPoints} PTS</span>
          </div>
          
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-950">
            <div 
              style={{ width: `${rankPercent}%` }} 
              className="bg-orange-400 h-full rounded-full transition-all duration-700"
            />
          </div>
          <p className="text-[9px] text-slate-450 leading-relaxed font-sans mt-1">
            Earn loyalty points on every check-out loop (10 Points for every $1 spent) to unlock early drop queues, customized laser engraving, and zero-fee logistics.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-2.5 text-xs rounded-xl mt-3 flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-500" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* 2. SAVE PROFILE DETAILS PANEL */}
      <div id="profile-details-panel" className="pt-4 space-y-3.5">
        <div className="flex justify-between items-baseline border-b border-slate-100 pb-1.5">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Account Profile</span>
          <button 
            id="toggle-edit-profile-btn"
            onClick={() => setEditMode(!editMode)} 
            className="text-[11px] font-black uppercase text-black hover:underline cursor-pointer"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleSave} className="space-y-3 bg-slate-50 border border-slate-150 p-3 rounded-xl shadow-xs">
            <div className="space-y-1">
              <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block leading-none">Full Name</label>
              <input
                id="edit-profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-black font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block leading-none">Email Address</label>
              <input
                id="edit-profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-black font-semibold"
              />
            </div>
            <button
              id="save-profile-btn"
              type="submit"
              className="py-2.5 bg-black hover:bg-slate-900 text-white text-xs font-black rounded-xl px-4 uppercase tracking-wider cursor-pointer"
            >
              Save Details
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 leading-none">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Standard Account Rank</span>
              <span className="text-slate-900 font-black uppercase italic text-[11px]">Platinum VIP Elite</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 leading-none">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Loyalty Wallet Balance</span>
              <span className="text-slate-900 font-mono font-black text-[11px]">{profile.points} Points</span>
            </div>
            <div 
              id="profile-purchases-row"
              onClick={onNavigateToOrderHistory}
              className="flex justify-between items-center py-2 border-b border-slate-100 leading-none cursor-pointer hover:bg-slate-50 px-1 transition-all rounded group"
            >
              <span className="text-slate-400 font-bold uppercase text-[10px] group-hover:text-black transition-colors">Completed Hub Purchases</span>
              <div className="flex items-center gap-1 text-slate-900 font-sans font-black text-[11px]">
                <span className="font-mono bg-slate-150 py-0.5 px-1.5 rounded">{ordersCount} Sneaker Orders</span>
                <ChevronRight size={12} className="text-slate-400 group-hover:text-black transition-all group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. DEFAULT ADDRESS BOOK SHEET LIST */}
      <div id="default-address-book" className="pt-5 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Address Directory</span>
        
        {profile.addresses.map((addr, i) => (
          <div key={i} className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-left relative shadow-xs">
            <MapPin size={14} className="text-slate-405 absolute top-3 right-3" />
            <h5 className="font-extrabold text-slate-850 leading-tight uppercase tracking-wide font-sans">{addr.fullName}</h5>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm font-medium leading-relaxed">
              {addr.street}<br />
              {addr.city}, {addr.state} {addr.zipCode}<br />
              {addr.phone}
            </p>
          </div>
        ))}
      </div>

      {/* 4. SECURITY & EXPORTS SECTIONS */}
      <div id="profile-actions-bottom" className="pt-6 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">APK Development Logs</span>
        
        {/* Mock Android config instructions */}
        <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl text-[10px] text-slate-500 leading-normal space-y-1 shadow-xs">
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <ShieldCheck size={12} className="text-orange-500" />
            <span className="uppercase text-[9px] tracking-wider">APK Config Package Verified</span>
          </div>
          <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
            Build parameters denote standard release logs compliant with compileSdk: 34 target modules. Fully optimized for production container instances.
          </p>
          <div className="pt-1.5 select-all font-mono bg-slate-100 border border-slate-200 rounded p-1 text-[8px] leading-tight text-slate-600">
            src/main/AndroidManifest.xml &lt;manifest package="com.sneakerhub.app"&gt;
          </div>
        </div>

        {/* Mock logout CTA */}
        <button
          id="profile-logout-btn"
          onClick={logout}
          className="w-full py-3.5 mt-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed text-slate-600 rounded-xl text-xs font-black tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <LogOut size={12} />
          Sign Out of Account
        </button>
      </div>

    </div>
  );
}
