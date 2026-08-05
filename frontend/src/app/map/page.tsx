'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { YardMapCanvas } from '@/components/map/YardMapCanvas';
import { ContainerDetailModal } from '@/components/map/ContainerDetailModal';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { Container } from '@/lib/types';

export default function VisualYardMapPage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('fac-001');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);

  const activeFacility = INITIAL_FACILITIES.find(f => f.id === selectedFacilityId) || INITIAL_FACILITIES[0];
  const containers = INITIAL_CONTAINERS.filter(c => c.facilityId === activeFacility.id);

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
          {/* Yard Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">{activeFacility.name}</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeFacility.address}, {activeFacility.city} • Grid: {activeFacility.gridRows} Rows x {activeFacility.gridCols} Cols
              </p>
            </div>
            <span className="bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs px-3 py-1 rounded-full border border-cyan-500/30">
              {containers.length} Containers Plotted
            </span>
          </div>

          {/* Canvas */}
          <YardMapCanvas
            containers={containers}
            gridRows={activeFacility.gridRows}
            gridCols={activeFacility.gridCols}
            onSelectContainer={(c) => setSelectedContainer(c)}
          />
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
