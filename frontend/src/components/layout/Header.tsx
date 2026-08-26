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
    { id: 1, type: 'ALERT', title: 'Payment Overdue', message: 'Boulder Construction LLC - $350 overdue', time: '10m ago' },
    { id: 2, type: 'TASK', title: 'Inspection Complete', message: 'Carlos R. filed report for ATX-2004', time: '45m ago' },
    { id: 3, type: 'AI', title: 'Fill Rate Optimization', message: 'Long Beach Harbor reached 90% utilization', time: '2h ago' }
  ];

  return (
    <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Facility Switcher & Search Bar */}
      <div className="flex items-center gap-3">
        {/* Facility Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-all text-xs">
          <Warehouse className="w-3.5 h-3.5 text-blue-600" />
          <select
            value={selectedFacilityId}
            onChange={(e) => onSelectFacility(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
          >
            <option value="ALL" className="bg-white text-slate-800">All Yards ({facilities.length})</option>
            {facilities.map((fac) => (
              <option key={fac.id} value={fac.id} className="bg-white text-slate-800">
                {fac.name} ({fac.city})
              </option>
            ))}
          </select>
        </div>

        {/* Global Search Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 text-xs px-3 py-1.5 rounded-lg w-56 transition-all"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="flex-1 text-left text-[11px]">Quick search...</span>
          <kbd className="bg-white text-[10px] text-slate-500 font-mono px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">⌘K</kbd>
        </button>
      </div>

      {/* Right: Actions, Notifications, User */}
      <div className="flex items-center gap-2.5">
        {/* Quick New Task Button */}
        <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs shadow-blue-500/20 transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>New Lease</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 relative transition-all border border-slate-200"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                <h3 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-blue-600" />
                  Notifications
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium border border-blue-200">3 New</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="bg-slate-50 hover:bg-slate-100/80 p-2.5 rounded-lg border border-slate-100 flex items-start gap-2.5 transition-colors">
                    {n.type === 'ALERT' && <ShieldAlert className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />}
                    {n.type === 'TASK' && <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />}
                    {n.type === 'AI' && <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />}
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-slate-800">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                      <span className="text-[9px] text-slate-400 block mt-1">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
              alt="Eleanor Vance"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"></span>
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-xs font-semibold text-slate-800">Eleanor Vance</p>
            <p className="text-[10px] text-slate-500">Chief Executive</p>
          </div>
        </div>
      </div>
    </header>
  );
};
