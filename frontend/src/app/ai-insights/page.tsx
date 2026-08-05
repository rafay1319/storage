'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { AIInsightsCard } from '@/components/analytics/AIInsightsCard';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS, INITIAL_AI_INSIGHTS } from '@/lib/mockData';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const forecastData = [
  { month: 'Aug 2026', predictedRevenue: 54200, predictedOccupancy: 88 },
  { month: 'Sep 2026', predictedRevenue: 56100, predictedOccupancy: 90 },
  { month: 'Oct 2026', predictedRevenue: 58000, predictedOccupancy: 91 },
  { month: 'Nov 2026', predictedRevenue: 60100, predictedOccupancy: 93 },
  { month: 'Dec 2026', predictedRevenue: 62400, predictedOccupancy: 95 },
  { month: 'Jan 2027', predictedRevenue: 64500, predictedOccupancy: 96 }
];

export default function AIInsightsPage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

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
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" /> AI Business Intelligence Suite
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous forecast engine, fill-rate elasticity analysis, loss prevention, and smart pricing recommendations.
            </p>
          </div>

          <AIInsightsCard insights={INITIAL_AI_INSIGHTS} />

          {/* 6-Month Predictive Forecast Chart */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  6-Month AI Revenue & Occupancy Forecast
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Machine learning projection based on historical lease velocity</p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Confidence: 94.2%
              </span>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Predicted Revenue']}
                  />
                  <Area type="monotone" dataKey="predictedRevenue" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" />
                </AreaChart>
              </ResponsiveContainer>
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
      />
    </div>
  );
}
