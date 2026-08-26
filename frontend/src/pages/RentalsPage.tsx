import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { FileText, Plus, CheckCircle2 } from 'lucide-react';

export function RentalsPage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const mockRentals = [
    { id: 'r-1', rentalNumber: 'RENT-99401', customerName: 'Apex Global Logistics', containerNumber: 'ATX-2001', facilityName: 'Austin Port Terminal Yard', rentRate: 450, deposit: 450, billingCycle: 'Monthly', status: 'ACTIVE', startDate: '2026-01-15' },
    { id: 'r-2', rentalNumber: 'RENT-99402', customerName: 'Boulder Construction LLC', containerNumber: 'ATX-2002', facilityName: 'Austin Port Terminal Yard', rentRate: 750, deposit: 750, billingCycle: 'Monthly', status: 'ACTIVE', startDate: '2026-03-01' },
    { id: 'r-3', rentalNumber: 'RENT-99403', customerName: 'Bell Event Planning', containerNumber: 'ATX-2012', facilityName: 'Austin Port Terminal Yard', rentRate: 750, deposit: 0, billingCycle: 'Monthly', status: 'ACTIVE', startDate: '2026-05-10' }
  ];

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
                Leases & Rental Agreements
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Active tenant agreements, monthly recurring billing terms, and renewal cycles.
              </p>
            </div>

            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs shadow-blue-500/20 transition-all">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Agreement</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <th className="py-3 px-4 font-semibold">Agreement #</th>
                    <th className="py-3 px-4 font-semibold">Tenant Account</th>
                    <th className="py-3 px-4 font-semibold">Unit Assigned</th>
                    <th className="py-3 px-4 font-semibold">Yard Facility</th>
                    <th className="py-3 px-4 font-semibold">Billing Term</th>
                    <th className="py-3 px-4 font-semibold">Monthly Rate</th>
                    <th className="py-3 px-4 text-right font-semibold">Lease Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {mockRentals.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700 text-xs">
                        {r.rentalNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {r.customerName}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-800">
                        {r.containerNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {r.facilityName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-medium text-slate-700 border border-slate-200">
                          {r.billingCycle}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-700">
                        ${r.rentRate}/mo
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
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
