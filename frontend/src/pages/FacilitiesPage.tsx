import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { FacilityComparison } from '@/components/analytics/FacilityComparison';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { Warehouse, Plus, MapPin, Phone, Clock, ArrowRightLeft } from 'lucide-react';

export function FacilitiesPage() {
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
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Storage Yard Facilities Directory
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage, compare, and configure physical yards across your enterprise portfolio.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-all"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
                <span>Transfer Units</span>
              </button>
              <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs shadow-blue-500/20 transition-all">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Yard Facility</span>
              </button>
            </div>
          </div>

          {/* Facilities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_FACILITIES.map((fac) => (
              <div key={fac.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-all">
                <div className="h-36 relative">
                  <img src={fac.photos[0]} alt={fac.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                      {fac.code}
                    </span>
                    <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      {fac.occupancyRate}% Occupied
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{fac.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {fac.address}, {fac.city}, {fac.state}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">Containers</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">{fac.occupiedContainers} / {fac.totalContainers}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">Monthly Rev</span>
                      <span className="font-semibold text-emerald-700 mt-0.5 block">${fac.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">Net Profit</span>
                      <span className={`font-semibold mt-0.5 block ${fac.netProfit >= 0 ? 'text-blue-700' : 'text-rose-600'}`}>
                        ${fac.netProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-blue-600" />
                      Manager: <strong className="text-slate-800">{fac.managerName}</strong> ({fac.contactNumber})
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-amber-600" />
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
