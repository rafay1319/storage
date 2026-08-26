'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Box, Warehouse, User } from 'lucide-react';
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-3">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
          <Search className="w-4 h-4 text-blue-600" />
          <input
            type="text"
            autoFocus
            placeholder="Search across yards, unit numbers (ATX-2001), customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-200/60 text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-3">
          {!query && (
            <p className="text-[11px] text-slate-500 text-center py-6">
              Type anything to quickly locate facilities, containers, CRM customers, or task dispatches...
            </p>
          )}

          {/* Containers */}
          {filteredContainers.length > 0 && (
            <div>
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Box className="w-3 h-3 text-blue-600" /> Containers ({filteredContainers.length})
              </h4>
              <div className="space-y-1">
                {filteredContainers.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (onSelectContainer) onSelectContainer(c);
                      onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 bg-white border border-slate-200 flex items-center justify-between transition-all shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900 font-mono">{c.containerNumber}</span>
                      <span className="text-[10px] text-slate-500 ml-2">({c.size} • {c.type})</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{c.facilityName} • {c.currentCustomerCompany || 'Available'}</p>
                    </div>
                    <span className={`text-[9px] font-semibold px-2 py-0.2 rounded-full border ${
                      c.status === 'Occupied' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      c.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
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
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Warehouse className="w-3 h-3 text-indigo-600" /> Facilities ({filteredFacilities.length})
              </h4>
              <div className="space-y-1">
                {filteredFacilities.map((f) => (
                  <div key={f.id} className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="font-semibold text-xs text-slate-900">{f.name}</span>
                      <span className="text-[10px] text-blue-600 font-mono ml-2">[{f.code}]</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{f.city}, {f.state} • {f.totalContainers} Total Units</p>
                    </div>
                    <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-200">
                      {f.occupancyRate}% Fill
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {filteredCustomers.length > 0 && (
            <div>
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <User className="w-3 h-3 text-blue-600" /> Customers ({filteredCustomers.length})
              </h4>
              <div className="space-y-1">
                {filteredCustomers.map((cust) => (
                  <div key={cust.id} className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="font-semibold text-xs text-slate-900">{cust.name}</span>
                      <span className="text-[10px] text-slate-500 ml-2">({cust.companyName})</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{cust.email}</p>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono">
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
