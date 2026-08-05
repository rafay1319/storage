'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { FacilityComparison } from '@/components/analytics/FacilityComparison';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { Warehouse, Plus, MapPin, Phone, Clock, ArrowRightLeft, ShieldCheck } from 'lucide-react';

export default function FacilitiesPage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

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

        <main className="p-8 space-y-8 overflow-y-auto">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Warehouse className="w-6 h-6 text-cyan-400" />
                Multi-Storage Facility Directory
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage, compare, and configure physical yards across your enterprise portfolio.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTransferModal(true)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition-all"
              >
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <span>Transfer Containers</span>
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all">
                <Plus className="w-4 h-4" />
                <span>Add Storage Facility</span>
              </button>
            </div>
          </div>

          {/* Facilities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INITIAL_FACILITIES.map((fac) => (
              <div key={fac.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all">
                <div className="h-44 relative">
                  <img src={fac.photos[0]} alt={fac.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="bg-cyan-500/20 backdrop-blur-md text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
                      {fac.code}
                    </span>
                    <span className="bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-xs font-extrabold px-3 py-1 rounded-full">
                      {fac.occupancyRate}% Occupied
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">{fac.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {fac.address}, {fac.city}, {fac.state}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Containers</span>
                      <span className="font-bold text-white mt-0.5 block">{fac.occupiedContainers} / {fac.totalContainers}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Monthly Revenue</span>
                      <span className="font-bold text-emerald-400 mt-0.5 block">${fac.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Net Profit</span>
                      <span className={`font-bold mt-0.5 block ${fac.netProfit >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                        ${fac.netProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      Yard Manager: <strong>{fac.managerName}</strong> ({fac.contactNumber})
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Hours: {fac.operatingHours}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Side-by-Side Comparison Matrix */}
          <FacilityComparison facilities={INITIAL_FACILITIES} />
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
