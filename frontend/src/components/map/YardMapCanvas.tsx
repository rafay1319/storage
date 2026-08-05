'use client';

import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move, 
  Search, 
  Filter, 
  Lock, 
  Unlock, 
  Box, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Sparkles,
  Info
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

  const getStatusBgColor = (status: ContainerStatus) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20';
      case 'Occupied': return 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20';
      case 'Reserved': return 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20';
      case 'Maintenance': return 'bg-blue-500 hover:bg-blue-400 text-white shadow-blue-500/20';
      case 'Out of Service': return 'bg-slate-700 hover:bg-slate-600 text-slate-300 shadow-slate-700/20';
      case 'Cleaning': return 'bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/20';
      default: return 'bg-slate-600 text-white';
    }
  };

  const getStatusBadgeDot = (status: ContainerStatus) => {
    switch (status) {
      case 'Available': return 'bg-emerald-400';
      case 'Occupied': return 'bg-rose-400';
      case 'Reserved': return 'bg-amber-400';
      case 'Maintenance': return 'bg-blue-400';
      case 'Out of Service': return 'bg-slate-400';
      case 'Cleaning': return 'bg-purple-400';
      default: return 'bg-slate-400';
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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Map Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-cyan-400" />
            Interactive Storage Yard Canvas
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time graphical rendering of physical yard inventory layout. Drag & drop enabled in Edit mode.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
          {[
            { label: 'Available', color: '🟢 bg-emerald-500' },
            { label: 'Occupied', color: '🔴 bg-rose-500' },
            { label: 'Reserved', color: '🟡 bg-amber-500' },
            { label: 'Maintenance', color: '🔵 bg-blue-500' },
            { label: 'Cleaning', color: '🟣 bg-purple-500' },
            { label: 'Out of Service', color: '⚫ bg-slate-700' }
          ].map((lg) => (
            <span key={lg.label} className="flex items-center gap-1.5 font-medium text-slate-300">
              <span className={`w-2.5 h-2.5 rounded-full ${lg.color.split(' ')[1]}`}></span>
              {lg.label}
            </span>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom In/Out */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1">
            <button onClick={() => setZoom(Math.max(0.7, zoom - 0.1))} className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono text-cyan-400 font-bold">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => setZoom(1)} className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 border-l border-slate-700 ml-1">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Edit Mode Toggle */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all border ${
              isEditMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isEditMode ? <Unlock className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4 text-slate-400" />}
            <span>{isEditMode ? 'Layout Editing Active' : 'Lock Layout'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
          {['ALL', 'Available', 'Occupied', 'Reserved', 'Maintenance', 'Cleaning'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Quick Yard Unit Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Highlight container (e.g. ATX-2004)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 rounded-xl pl-8 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Graphical Yard Canvas */}
      <div className="overflow-auto max-h-[600px] border border-slate-800 rounded-2xl bg-slate-950/80 p-8 relative">
        <div 
          className="grid gap-4 transition-transform duration-200 transform-origin-top-left"
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
                className={`min-h-[110px] rounded-2xl border-2 transition-all p-3 flex flex-col justify-between relative group ${
                  matchedContainer
                    ? isHighlighted
                      ? `${getStatusBgColor(matchedContainer.status)} shadow-lg cursor-pointer transform hover:-translate-y-1`
                      : 'opacity-25 bg-slate-800 border-slate-700'
                    : 'border-dashed border-slate-800/80 bg-slate-900/30 hover:border-slate-700 flex items-center justify-center'
                }`}
                onClick={() => matchedContainer && isHighlighted && onSelectContainer(matchedContainer)}
                draggable={isEditMode && !!matchedContainer}
                onDragStart={() => matchedContainer && handleDragStart(matchedContainer.id)}
              >
                {matchedContainer ? (
                  <>
                    {/* Top Row: Unit Code & Status Dot */}
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm tracking-wide font-mono drop-shadow-sm">
                        {matchedContainer.containerNumber}
                      </span>
                      <span className={`w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${getStatusBadgeDot(matchedContainer.status)}`}></span>
                    </div>

                    {/* Middle Specs */}
                    <div className="text-[11px] font-medium opacity-90 space-y-0.5 my-1">
                      <p>{matchedContainer.size} • {matchedContainer.type}</p>
                      {matchedContainer.currentCustomerCompany && (
                        <p className="text-[10px] truncate font-semibold underline decoration-white/30">
                          {matchedContainer.currentCustomerCompany}
                        </p>
                      )}
                    </div>

                    {/* Bottom Pricing & Action */}
                    <div className="flex items-center justify-between text-[10px] font-bold border-t border-white/20 pt-1.5 mt-1">
                      <span>${matchedContainer.rentalPrice}/mo</span>
                      <span className="bg-black/30 px-1.5 py-0.5 rounded text-[9px]">Inspect</span>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-700 text-[10px] font-mono select-none">
                    R{row + 1}-C{col + 1}
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
