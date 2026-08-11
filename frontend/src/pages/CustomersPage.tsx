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
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          facilities={INITIAL_FACILITIES}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={setSelectedFacilityId}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-400" /> Customer Relationship Management (CRM)
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Customer profiles, government identification, uploaded agreements, and balance ledgers.
              </p>
            </div>

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all">
              <Plus className="w-4 h-4" />
              <span>Add Customer Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INITIAL_CUSTOMERS.map((cust) => (
              <div key={cust.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">Enterprise Account</span>
                    <h3 className="font-extrabold text-lg text-white mt-0.5">{cust.companyName}</h3>
                    <p className="text-xs text-slate-400 font-medium">Contact: {cust.name}</p>
                  </div>
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-extrabold px-3 py-1 rounded-full">
                    {cust.activeRentalsCount} Active Leases
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> {cust.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" /> {cust.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {cust.address}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Outstanding Ledger</span>
                    <span className={`font-mono font-bold text-sm ${cust.outstandingBalance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      ${cust.outstandingBalance.toFixed(2)}
                    </span>
                  </div>

                  <button className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition-all">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>View Agreements</span>
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
