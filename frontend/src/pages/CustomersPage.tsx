import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { Users, Plus, Mail, Phone, MapPin, FileText } from 'lucide-react';

export function CustomersPage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          facilities={INITIAL_FACILITIES}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={setSelectedFacilityId}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="p-6 space-y-5 overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Customer Relationship Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Client directory, agreements, active container leases, and ledger balances.
              </p>
            </div>

            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs shadow-blue-500/20 transition-all">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Account</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_CUSTOMERS.map((cust) => (
              <div key={cust.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest block">Commercial Account</span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">{cust.companyName}</h3>
                    <p className="text-xs text-slate-500 font-medium">Contact: {cust.name}</p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    {cust.activeRentalsCount} Active Leases
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-blue-600" /> {cust.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-cyan-600" /> {cust.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-rose-500" /> {cust.address}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase">Balance Ledger</span>
                    <span className={`font-mono font-bold text-xs ${cust.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      ${cust.outstandingBalance.toFixed(2)}
                    </span>
                  </div>

                  <button className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition-all">
                    <FileText className="w-3 h-3 text-blue-600" />
                    <span>View Contracts</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        facilities={INITIAL_FACILITIES}
        containers={INITIAL_CONTAINERS}
        customers={INITIAL_CUSTOMERS}
        tasks={INITIAL_TASKS}
      />
    </div>
  );
}
