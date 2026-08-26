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
  TrendingUp, 
  Users, 
  ArrowUpRight,
} from 'lucide-react';

export function DashboardPage() {
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
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
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
        <main className="p-6 space-y-5 overflow-y-auto">
          {/* Welcome & Persona Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-blue-50 via-indigo-50/30 to-transparent pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Global Operations
                </span>
                <span className="text-[11px] text-slate-500">• Multi-Yard Network Telemetry</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Yard Operations & Inventory Hub</h1>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                Real-time operational telemetry across {facilities.length} active facilities and {totalContainersCount} container units.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right border-r border-slate-200 pr-4">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Monthly Net Run Rate</span>
                <span className="text-lg font-bold text-emerald-700 font-mono">${totalNetProfit.toLocaleString()}<span className="text-xs font-normal text-slate-500">/mo</span></span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Portfolio Fill Rate</span>
                <span className="text-lg font-bold text-blue-700 font-mono">{avgOccupancyRate}%</span>
              </div>
            </div>
          </div>

          {/* AI Intelligence Banner */}
          <AIInsightsCard insights={INITIAL_AI_INSIGHTS} />

          {/* Core Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Gross Revenue */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1.5 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Gross Monthly Revenue</span>
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl font-bold text-slate-900 font-mono">${totalRevenue.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                <ArrowUpRight className="w-3 h-3" />
                <span>+14.2% vs previous month</span>
              </div>
            </div>

            {/* 2. Net Profit */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1.5 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Net Operating Profit</span>
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl font-bold text-emerald-700 font-mono">${totalNetProfit.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500 font-medium">
                Operating Cost: ${totalExpenses.toLocaleString()}
              </div>
            </div>

            {/* 3. Occupancy */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1.5 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Yard Occupancy Rate</span>
                <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-200">
                  <Warehouse className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl font-bold text-blue-700 font-mono">{avgOccupancyRate}%</div>
              <div className="text-[10px] text-slate-500 font-medium">
                {totalOccupiedCount} of {totalContainersCount} containers leased
              </div>
            </div>

            {/* 4. Customers */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1.5 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active CRM Accounts</span>
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl font-bold text-slate-900 font-mono">{INITIAL_CUSTOMERS.length}</div>
              <div className="text-[10px] text-slate-500 font-medium">
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
