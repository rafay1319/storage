'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Box, Warehouse, User, FileText, ClipboardCheck } from 'lucide-react';
import { Facility, Container, Customer, Task } from '@/lib/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: Facility[];
  containers: Container[];
  customers: Customer[];
  tasks: Task[];
  onSelectContainer?: (container: Container) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  facilities,
  containers,
  customers,
  tasks,
  onSelectContainer
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : undefined;
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredFacilities = facilities.filter(f => f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q) || f.city.toLowerCase().includes(q));
  const filteredContainers = containers.filter(c => c.containerNumber.toLowerCase().includes(q) || c.qrCode.toLowerCase().includes(q) || c.barcode.toLowerCase().includes(q));
  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(q) || c.companyName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  const filteredTasks = tasks.filter(t => t.taskNumber.toLowerCase().includes(q) || t.title.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search facilities, container numbers (ATX-2001), customers, tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!query && (
            <p className="text-xs text-slate-500 text-center py-6">
              Type anything to search across yards, shipping units, CRM clients, and maintenance logs...
            </p>
          )}

          {/* Containers */}
          {filteredContainers.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-cyan-400" /> Containers ({filteredContainers.length})
              </h4>
              <div className="space-y-1">
                {filteredContainers.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (onSelectContainer) onSelectContainer(c);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 bg-slate-950/40 border border-slate-800/60 flex items-center justify-between transition-all"
                  >
                    <div>
                      <span className="font-bold text-xs text-white">{c.containerNumber}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({c.size} - {c.type})</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{c.facilityName} • {c.currentCustomerCompany || 'Unassigned'}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === 'Occupied' ? 'bg-rose-500/20 text-rose-300' :
                      c.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {c.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {filteredFacilities.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Warehouse className="w-3.5 h-3.5 text-indigo-400" /> Facilities ({filteredFacilities.length})
              </h4>
              <div className="space-y-1">
                {filteredFacilities.map((f) => (
                  <div key={f.id} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-white">{f.name}</span>
                      <span className="text-[11px] text-indigo-400 ml-2">[{f.code}]</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{f.city}, {f.state} • {f.totalContainers} Total Containers</p>
                    </div>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                      {f.occupancyRate}% Occupied
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {filteredCustomers.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" /> Customers ({filteredCustomers.length})
              </h4>
              <div className="space-y-1">
                {filteredCustomers.map((cust) => (
                  <div key={cust.id} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-white">{cust.name}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({cust.companyName})</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{cust.email} • {cust.phone}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {cust.activeRentalsCount} Rentals
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
