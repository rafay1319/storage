import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { ContainerDetailModal } from '@/components/map/ContainerDetailModal';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { Container } from '@/lib/types';
import { Box, Plus, Search, QrCode } from 'lucide-react';

export function ContainersPage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [search, setSearch] = useState('');
  const [sizeFilter, setSizeFilter] = useState('ALL');

  const filteredContainers = INITIAL_CONTAINERS.filter((c) => {
    const matchesFacility = selectedFacilityId === 'ALL' || c.facilityId === selectedFacilityId;
    const matchesSearch = c.containerNumber.toLowerCase().includes(search.toLowerCase()) || (c.currentCustomerCompany && c.currentCustomerCompany.toLowerCase().includes(search.toLowerCase()));
    const matchesSize = sizeFilter === 'ALL' || c.size === sizeFilter;
    return matchesFacility && matchesSearch && matchesSize;
  });

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
                Container Fleet Registry
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete inventory of 20ft, 40ft, 45ft, and specialty container assets across facilities.
              </p>
            </div>

            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs shadow-blue-500/20 transition-all">
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Unit</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter unit # or customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 rounded-lg pl-8 pr-3 py-1.5 w-60 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Sizes</option>
                <option value="20ft">20ft Standard</option>
                <option value="40ft">40ft High Cube</option>
                <option value="45ft">45ft Extended</option>
              </select>
            </div>

            <span className="text-[11px] text-slate-500 font-mono">
              Showing <strong>{filteredContainers.length}</strong> units
            </span>
          </div>

          {/* Containers Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <th className="py-3 px-4 font-semibold">Unit Number</th>
                    <th className="py-3 px-4 font-semibold">Facility Yard</th>
                    <th className="py-3 px-4 font-semibold">Specs</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Assigned Customer</th>
                    <th className="py-3 px-4 font-semibold">Rate</th>
                    <th className="py-3 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredContainers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-600">
                            <QrCode className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 font-mono block">{c.containerNumber}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{c.qrCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {c.facilityName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{c.size}</span>
                        <span className="text-[10px] text-slate-400">{c.type}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          c.status === 'Occupied' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          c.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {c.currentCustomerCompany || <span className="text-slate-400 italic font-normal">Unassigned</span>}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-700">
                        ${c.rentalPrice}/mo
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedContainer(c)}
                          className="bg-slate-50 hover:bg-slate-100 text-blue-600 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition-all"
                        >
                          Specs
                        </button>
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
        onSelectContainer={(c) => setSelectedContainer(c)}
      />

      <ContainerDetailModal
        container={selectedContainer}
        onClose={() => setSelectedContainer(null)}
      />
    </div>
  );
}
