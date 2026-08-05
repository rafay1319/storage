'use client';

import React, { useState } from 'react';
import { Search, Bell, Plus, Warehouse, ShieldAlert, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { Facility } from '@/lib/types';

interface HeaderProps {
  facilities: Facility[];
  selectedFacilityId: string;
  onSelectFacility: (facId: string) => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  facilities,
  selectedFacilityId,
  onSelectFacility,
  onOpenCommandPalette
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, type: 'ALERT', title: 'Payment Overdue', message: 'Boulder Construction LLC - $350 unpaid invoice', time: '10m ago' },
    { id: 2, type: 'TASK', title: 'Inspection Complete', message: 'Carlos Ramirez submitted report for ATX-2004', time: '45m ago' },
    { id: 3, type: 'AI', title: 'Price Adjustment Opportunity', message: 'Long Beach Harbor reached 90% fill rate', time: '2h ago' }
  ];

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 shadow-md">
      {/* Left: Facility Switcher & Search Bar */}
      <div className="flex items-center gap-4">
        {/* Facility Dropdown */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5">
          <Warehouse className="w-4 h-4 text-cyan-400" />
          <select
            value={selectedFacilityId}
            onChange={(e) => onSelectFacility(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-white">🌐 All Storage Facilities ({facilities.length})</option>
            {facilities.map((fac) => (
              <option key={fac.id} value={fac.id} className="bg-slate-900 text-white">
                🏢 {fac.name} ({fac.city})
              </option>
            ))}
          </select>
        </div>

        {/* Global Search Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs px-3.5 py-1.5 rounded-xl w-64 transition-all"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span className="flex-1 text-left">Search facilities, containers...</span>
          <kbd className="bg-slate-800 text-[10px] text-slate-300 font-mono px-1.5 py-0.5 rounded border border-slate-700">Ctrl K</kbd>
        </button>
      </div>

      {/* Right: Quick Action, Notifications, User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick New Task Button */}
        <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>New Rental</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 relative transition-all border border-slate-700/50"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-900 animate-pulse"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  Notifications
                </h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold">3 New</span>
              </div>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="bg-slate-800/50 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                    {n.type === 'ALERT' && <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />}
                    {n.type === 'TASK' && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />}
                    {n.type === 'AI' && <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-slate-200">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                      <span className="text-[9px] text-slate-500 block mt-1">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
            alt="Eleanor Vance"
            className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-tight">Eleanor Vance</p>
            <p className="text-[10px] text-slate-400">Chief Executive</p>
          </div>
        </div>
      </div>
    </header>
  );
};
