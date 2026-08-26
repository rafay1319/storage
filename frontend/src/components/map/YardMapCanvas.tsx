'use client';

import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Lock, 
  Unlock, 
  Box
} from 'lucide-react';
import { Container, ContainerStatus } from '@/lib/types';

interface YardMapCanvasProps {
  containers: Container[];
  gridRows?: number;
  gridCols?: number;
  onSelectContainer: (container: Container) => void;
  onUpdateContainerPositions?: (updatedContainers: Container[]) => void;
}

export const YardMapCanvas: React.FC<YardMapCanvasProps> = ({
  containers: initialContainers,
  gridRows = 6,
  gridCols = 8,
  onSelectContainer,
  onUpdateContainerPositions
}) => {
  const [containers, setContainers] = useState<Container[]>(initialContainers);
  const [zoom, setZoom] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedContainerId, setDraggedContainerId] = useState<string | null>(null);

  const getStatusBorder = (status: ContainerStatus) => {
    switch (status) {
      case 'Available': return 'border-emerald-300 hover:border-emerald-400 bg-emerald-50/40 text-slate-800';
      case 'Occupied': return 'border-rose-300 hover:border-rose-400 bg-rose-50/40 text-slate-800';
      case 'Reserved': return 'border-amber-300 hover:border-amber-400 bg-amber-50/40 text-slate-800';
      case 'Maintenance': return 'border-blue-300 hover:border-blue-400 bg-blue-50/40 text-slate-800';
      case 'Out of Service': return 'border-slate-300 bg-slate-100 text-slate-700';
      case 'Cleaning': return 'border-purple-300 hover:border-purple-400 bg-purple-50/40 text-slate-800';
      default: return 'border-slate-300 bg-slate-50 text-slate-800';
    }
  };

  const getStatusDot = (status: ContainerStatus) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500';
      case 'Occupied': return 'bg-rose-500';
      case 'Reserved': return 'bg-amber-500';
      case 'Maintenance': return 'bg-blue-500';
      case 'Out of Service': return 'bg-slate-400';
      case 'Cleaning': return 'bg-purple-500';
      default: return 'bg-slate-400';
    }
  };

  const getStatusTextBadge = (status: ContainerStatus) => {
    switch (status) {
      case 'Available': return 'text-emerald-700 bg-emerald-100/70 border-emerald-200';
      case 'Occupied': return 'text-rose-700 bg-rose-100/70 border-rose-200';
      case 'Reserved': return 'text-amber-700 bg-amber-100/70 border-amber-200';
      case 'Maintenance': return 'text-blue-700 bg-blue-100/70 border-blue-200';
      case 'Cleaning': return 'text-purple-700 bg-purple-100/70 border-purple-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  // Build grid representation
  const gridCells = [];
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      gridCells.push({ row: r, col: c });
    }
  }

  const handleDragStart = (containerId: string) => {
    if (!isEditMode) return;
    setDraggedContainerId(containerId);
  };

  const handleDrop = (r: number, c: number) => {
    if (!isEditMode || !draggedContainerId) return;

    const updated = containers.map(ct => {
      if (ct.id === draggedContainerId) {
        return { ...ct, posX: c, posY: r };
      }
      return ct;
    });

    setContainers(updated);
    setDraggedContainerId(null);

    if (onUpdateContainerPositions) {
      onUpdateContainerPositions(updated);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Map Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Visual Yard Matrix
            </h2>
            <p className="text-[11px] text-slate-500">
              Interactive physical yard grid layout with live occupancy status
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          {[
            { label: 'Available', color: 'bg-emerald-500' },
            { label: 'Occupied', color: 'bg-rose-500' },
            { label: 'Reserved', color: 'bg-amber-500' },
            { label: 'Maintenance', color: 'bg-blue-500' },
            { label: 'Cleaning', color: 'bg-purple-500' },
          ].map((lg) => (
            <span key={lg.label} className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className={`w-2 h-2 rounded-full ${lg.color}`}></span>
              <span>{lg.label}</span>
            </span>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom In/Out */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            <button 
              onClick={() => setZoom(Math.max(0.75, zoom - 0.1))} 
              className="p-1 hover:bg-slate-200/60 rounded text-slate-600 hover:text-slate-900 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[10px] font-mono text-blue-600 font-semibold">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={() => setZoom(Math.min(1.3, zoom + 0.1))} 
              className="p-1 hover:bg-slate-200/60 rounded text-slate-600 hover:text-slate-900 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoom(1)} 
              className="p-1 hover:bg-slate-200/60 rounded text-slate-600 hover:text-slate-900 border-l border-slate-200 ml-0.5 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Edit Mode Toggle */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all border ${
              isEditMode
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isEditMode ? <Unlock className="w-3.5 h-3.5 text-amber-600" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
            <span className="text-[11px]">{isEditMode ? 'Layout Active' : 'Lock'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 overflow-x-auto">
          {['ALL', 'Available', 'Occupied', 'Reserved', 'Maintenance', 'Cleaning'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Quick Yard Unit Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search unit # (e.g. ATX-2004)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 rounded-lg pl-8 pr-3 py-1.5 w-60 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Graphical Yard Canvas */}
      <div className="overflow-auto max-h-[520px] border border-slate-200 rounded-xl bg-slate-50/70 p-5 relative">
        <div 
          className="grid gap-2.5 transition-transform duration-150 origin-top-left"
          style={{ 
            gridTemplateColumns: `repeat(${gridCols}, minmax(130px, 1fr))`,
            transform: `scale(${zoom})`
          }}
        >
          {gridCells.map(({ row, col }) => {
            const matchedContainer = containers.find(c => c.posX === col && c.posY === row);
            
            // Apply filtering logic
            const matchesFilter = filterStatus === 'ALL' || (matchedContainer && matchedContainer.status === filterStatus);
            const matchesSearch = !searchQuery || (matchedContainer && matchedContainer.containerNumber.toLowerCase().includes(searchQuery.toLowerCase()));
            const isHighlighted = matchedContainer && matchesFilter && matchesSearch;

            return (
              <div
                key={`grid-${row}-${col}`}
                onDragOver={(e) => isEditMode && e.preventDefault()}
                onDrop={() => handleDrop(row, col)}
                className={`min-h-[92px] rounded-xl border transition-all p-2.5 flex flex-col justify-between relative select-none shadow-xs ${
                  matchedContainer
                    ? isHighlighted
                      ? `${getStatusBorder(matchedContainer.status)} cursor-pointer hover:scale-[1.02] hover:shadow-md`
                      : 'opacity-30 bg-white border-slate-200'
                    : 'border-dashed border-slate-200 bg-white/40 hover:border-slate-300 flex items-center justify-center'
                }`}
                onClick={() => matchedContainer && isHighlighted && onSelectContainer(matchedContainer)}
                draggable={isEditMode && !!matchedContainer}
                onDragStart={() => matchedContainer && handleDragStart(matchedContainer.id)}
              >
                {matchedContainer ? (
                  <>
                    {/* Top Row: Unit Code & Status Dot */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 font-mono tracking-tight">
                        {matchedContainer.containerNumber}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${getStatusDot(matchedContainer.status)}`}></span>
                    </div>

                    {/* Middle Specs */}
                    <div className="text-[10px] text-slate-600 font-medium space-y-0.5 my-1">
                      <p className="text-slate-500">{matchedContainer.size} • {matchedContainer.type}</p>
                      {matchedContainer.currentCustomerCompany ? (
                        <p className="text-[10px] truncate text-slate-900 font-semibold">
                          {matchedContainer.currentCustomerCompany}
                        </p>
                      ) : (
                        <p className="text-[9px] text-slate-400 italic">Ready for lease</p>
                      )}
                    </div>

                    {/* Bottom Pricing & Status Pill */}
                    <div className="flex items-center justify-between text-[10px] border-t border-slate-200/80 pt-1 mt-0.5">
                      <span className="font-mono font-bold text-slate-800">${matchedContainer.rentalPrice}<span className="text-[8px] text-slate-500 font-normal">/mo</span></span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border ${getStatusTextBadge(matchedContainer.status)}`}>
                        {matchedContainer.status}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400 text-[9px] font-mono select-none">
                    R{row + 1} C{col + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
