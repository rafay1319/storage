import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { YardMapCanvas } from '@/components/map/YardMapCanvas';
import { ContainerDetailModal } from '@/components/map/ContainerDetailModal';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { Container } from '@/lib/types';
import { useRole } from '@/lib/RoleContext';

export function MapPage() {
  const { role: currentRole, setRole: setCurrentRole } = useRole();
  const [selectedFacilityId, setSelectedFacilityId] = useState('fac-001');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);

  const activeFacility = INITIAL_FACILITIES.find(f => f.id === selectedFacilityId) || INITIAL_FACILITIES[0];
  const containers = INITIAL_CONTAINERS.filter(c => c.facilityId === activeFacility.id);

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
          {/* Yard Title */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {activeFacility.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeFacility.address}, {activeFacility.city} • Grid: {activeFacility.gridRows} Rows x {activeFacility.gridCols} Cols
              </p>
            </div>
            <span className="bg-blue-50 text-blue-700 font-mono font-semibold text-xs px-2.5 py-1 rounded-full border border-blue-200">
              {containers.length} Units Plotted
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
