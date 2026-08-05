'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { FileText, Plus, CheckCircle2, ShieldCheck, DollarSign, Calendar } from 'lucide-react';

export default function RentalsPage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const mockRentals = [
    { id: 'r-1', rentalNumber: 'RENT-99401', customerName: 'Apex Global Logistics', containerNumber: 'ATX-2001', facilityName: 'Austin Port Terminal Yard', rentRate: 450, deposit: 450, billingCycle: 'Monthly', status: 'ACTIVE', startDate: '2026-01-15' },
    { id: 'r-2', rentalNumber: 'RENT-99402', customerName: 'Boulder Construction LLC', containerNumber: 'ATX-2002', facilityName: 'Austin Port Terminal Yard', rentRate: 750, deposit: 750, billingCycle: 'Monthly', status: 'ACTIVE', startDate: '2026-03-01' },
    { id: 'r-3', rentalNumber: 'RENT-99403', customerName: 'Bell Event Planning', containerNumber: 'ATX-2012', facilityName: 'Austin Port Terminal Yard', rentRate: 750, deposit: 0, billingCycle: 'Monthly', status: 'ACTIVE', startDate: '2026-05-10' }
  ];

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
                <FileText className="w-6 h-6 text-cyan-400" /> Rental & Lease Management
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Lease contracts, recurring monthly billing, digital signature archives, and auto-renewals.
              </p>
            </div>

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all">
              <Plus className="w-4 h-4" />
              <span>Create Rental Agreement</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <th className="p-4">Agreement #</th>
                    <th className="p-4">Tenant</th>
                    <th className="p-4">Container Unit</th>
                    <th className="p-4">Yard</th>
                    <th className="p-4">Billing Cycle</th>
                    <th className="p-4">Monthly Rent</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {mockRentals.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-extrabold text-cyan-400">
                        {r.rentalNumber}
                      </td>
                      <td className="p-4 font-bold text-white">
                        {r.customerName}
                      </td>
                      <td className="p-4 font-mono text-slate-200">
                        {r.containerNumber}
                      </td>
                      <td className="p-4 text-slate-400">
                        {r.facilityName}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-800 px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-300">
                          {r.billingCycle}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        ${r.rentRate}/mo
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
