import React from 'react';
import { motion } from 'motion/react';
import { Bell, Flame, Percent, Truck, HelpCircle, Check, Trash2, CheckSquare } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onClear: () => void;
}

export default function NotificationsView({
  notifications,
  onMarkAllRead,
  onClear
}: NotificationsViewProps) {
  // Map notification typings to icons
  const getIcon = (type: string) => {
    switch (type) {
      case 'drop':
        return <Flame size={14} className="text-orange-500 fill-orange-500" />;
      case 'promo':
        return <Percent size={14} className="text-orange-600" />;
      case 'shipping':
        return <Truck size={14} className="text-black" />;
      default:
        return <HelpCircle size={14} className="text-slate-400" />;
    }
  };

  return (
    <div id="notifications-view-container" className="pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none text-left px-4 bg-white">
      
      {/* Notifications Actions bar */}
      <div id="notif-actions-bar" className="flex items-center justify-between py-2 border-b border-slate-100 mt-2 leading-none bg-white">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider">
          ALERTS INBOX ({notifications.filter(n => !n.read).length} UNREAD)
        </span>
        
        {notifications.length > 0 && (
          <div className="flex gap-2">
            <button
              id="notif-mark-read"
              onClick={onMarkAllRead}
              className="text-[10px] font-black text-black hover:underline flex items-center gap-0.5 cursor-pointer leading-none uppercase tracking-wide"
            >
              <CheckSquare size={10} /> Mark Read
            </button>
            <button
              id="notif-clear-all"
              onClick={onClear}
              className="text-[10px] font-black text-rose-600 hover:underline flex items-center gap-0.5 cursor-pointer leading-none uppercase tracking-wide"
            >
              <Trash2 size={10} /> Clear All
            </button>
          </div>
        )}
      </div>

      <div id="notif-list-block" className="pt-3 space-y-2.5 bg-white">
        {notifications.length === 0 ? (
          <div id="notif-empty-state" className="py-20 text-center space-y-3">
            <Bell size={40} className="text-slate-200 mx-auto" strokeWidth={1} />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Your notifications inbox is clean</h4>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed font-sans">We'll alert you here when highly-anticipated sneaker releases drop or restock.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border flex gap-3 relative shadow-xs text-xs text-left ${
                  notif.read 
                    ? "bg-white border-slate-150/60 text-slate-500" 
                    : "bg-slate-50 border-slate-250 text-black font-semibold"
                }`}
              >
                {/* Read indicator dot */}
                {!notif.read && (
                  <span className="absolute top-3.5 right-3.5 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                )}

                {/* Type icon box */}
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-150 flex items-center justify-center shrink-0 shadow-sm">
                  {getIcon(notif.type)}
                </div>

                {/* details */}
                <div className="space-y-0.5 pr-2.5 min-w-0">
                  <div className="flex justify-between items-baseline leading-none gap-2">
                    <h5 className="font-extrabold text-slate-900 truncate max-w-[200px] leading-tight font-sans uppercase">
                      {notif.title}
                    </h5>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans mt-0.5">
                    {notif.description}
                  </p>
                  <span className="text-[8px] text-slate-400 font-mono block pt-1 uppercase leading-none font-bold">
                    {notif.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
