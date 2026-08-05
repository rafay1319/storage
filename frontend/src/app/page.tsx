'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { YardMapCanvas } from '@/components/map/YardMapCanvas';
import { ContainerDetailModal } from '@/components/map/ContainerDetailModal';
import { FinancialCharts } from '@/components/analytics/FinancialCharts';
import { AIInsightsCard } from '@/components/analytics/AIInsightsCard';
import { FacilityComparison } from '@/components/analytics/FacilityComparison';
import { 
  INITIAL_FACILITIES, 
  INITIAL_CONTAINERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_TASKS, 
  INITIAL_AI_INSIGHTS 
} from '@/lib/mockData';
import { Container } from '@/lib/types';
import { 
  DollarSign, 
  Warehouse, 
  Box, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export default function ExecutiveDashboard() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);

  const facilities = INITIAL_FACILITIES;
  const containers = selectedFacilityId === 'ALL'
    ? INITIAL_CONTAINERS
    : INITIAL_CONTAINERS.filter(c => c.facilityId === selectedFacilityId);

  // Aggregated KPIs
  const totalRevenue = facilities.reduce((sum, f) => sum + f.monthlyRevenue, 0);
  const totalExpenses = facilities.reduce((sum, f) => sum + f.monthlyExpenses, 0);
  const totalNetProfit = totalRevenue - totalExpenses;
  const totalContainersCount = facilities.reduce((sum, f) => sum + f.totalContainers, 0);
  const totalOccupiedCount = facilities.reduce((sum, f) => sum + f.occupiedContainers, 0);
  const avgOccupancyRate = Math.round((totalOccupiedCount / totalContainersCount) * 100);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          facilities={facilities}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={setSelectedFacilityId}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Dashboard Body */}
        <main className="p-8 space-y-8 overflow-y-auto">
          {/* Welcome & Persona Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/30 border border-slate-800 p-6 rounded-3xl shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Global Control Tower
                </span>
                <span className="text-xs text-slate-400">• Multi-Yard Network active</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Storage Facility Command Dashboard</h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Real-time operational health across {facilities.length} storage yards and {totalContainersCount} shipping container units.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right border-r border-slate-800 pr-4">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Portfolio Profitability</span>
                <span className="text-xl font-black text-emerald-400 font-mono">${totalNetProfit.toLocaleString()}/mo</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Fill Rate</span>
                <span className="text-xl font-black text-cyan-400 font-mono">{avgOccupancyRate}%</span>
              </div>
            </div>
          </div>

          {/* AI Intelligence Banner */}
          <AIInsightsCard insights={INITIAL_AI_INSIGHTS} />

          {/* Core Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Monthly Revenue</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono">${totalRevenue.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+14.2% vs previous month</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Profit Margin</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">${totalNetProfit.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400 font-medium">
                Operating Cost: ${totalExpenses.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Occupancy Utilization</span>
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Warehouse className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-cyan-400 font-mono">{avgOccupancyRate}%</div>
              <div className="text-[11px] text-slate-400 font-medium">
                {totalOccupiedCount} of {totalContainersCount} containers leased
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Customers</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono">{INITIAL_CUSTOMERS.length}</div>
              <div className="text-[11px] text-slate-400 font-medium">
                0 account delinquencies
              </div>
            </div>
          </div>

          {/* Interactive Visual Storage Yard Map */}
          <YardMapCanvas
            containers={containers}
            gridRows={6}
            gridCols={8}
            onSelectContainer={(c) => setSelectedContainer(c)}
          />

          {/* Recharts Financial Visuals */}
          <FinancialCharts />

          {/* Executive Multi-Facility Comparison Matrix */}
          <FacilityComparison facilities={facilities} />
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        facilities={facilities}
        containers={containers}
        customers={INITIAL_CUSTOMERS}
        tasks={INITIAL_TASKS}
        onSelectContainer={(c) => setSelectedContainer(c)}
      />

      {/* Container Detail Inspector Sheet */}
      <ContainerDetailModal
        container={selectedContainer}
        onClose={() => setSelectedContainer(null)}
      />
    </div>
  );
}
