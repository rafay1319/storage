'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { ContainerDetailModal } from '@/components/map/ContainerDetailModal';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { Container } from '@/lib/types';
import { Box, Plus, Search, Filter, QrCode, ShieldCheck, Wrench } from 'lucide-react';

export default function ContainersPage() {
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
                <Box className="w-6 h-6 text-cyan-400" /> Container Fleet Management
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Complete inventory of 20ft, 40ft, 45ft, and specialty container assets across facilities.
              </p>
            </div>

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all">
              <Plus className="w-4 h-4" />
              <span>Register New Container</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search unit # or customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 rounded-xl pl-8 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="ALL">All Sizes</option>
                <option value="20ft">20ft Units</option>
                <option value="40ft">40ft Units</option>
                <option value="45ft">45ft Units</option>
              </select>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              Showing <strong>{filteredContainers.length}</strong> units
            </span>
          </div>

          {/* Containers Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <th className="p-4">Unit # & QR Code</th>
                    <th className="p-4">Yard Location</th>
                    <th className="p-4">Specs</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Current Customer</th>
                    <th className="p-4">Rate</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredContainers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                            <QrCode className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-white font-mono block">{c.containerNumber}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{c.qrCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-300">
                        {c.facilityName}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{c.size}</span>
                        <span className="text-[10px] text-slate-400">{c.type}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          c.status === 'Occupied' ? 'bg-rose-500/20 text-rose-300' :
                          c.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-200">
                        {c.currentCustomerCompany || <span className="text-slate-500 italic">Unassigned</span>}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        ${c.rentalPrice}/mo
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedContainer(c)}
                          className="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition-all"
                        >
                          View Specs
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
