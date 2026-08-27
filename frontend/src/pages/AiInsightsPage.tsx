import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { AIInsightsCard } from '@/components/analytics/AIInsightsCard';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS, INITIAL_AI_INSIGHTS } from '@/lib/mockData';
import { Sparkles, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const forecastData = [
  { month: 'Aug 2026', predictedRevenue: 54200, predictedOccupancy: 88 },
  { month: 'Sep 2026', predictedRevenue: 56100, predictedOccupancy: 90 },
  { month: 'Oct 2026', predictedRevenue: 58000, predictedOccupancy: 91 },
  { month: 'Nov 2026', predictedRevenue: 60100, predictedOccupancy: 93 },
  { month: 'Dec 2026', predictedRevenue: 62400, predictedOccupancy: 95 },
  { month: 'Jan 2027', predictedRevenue: 64500, predictedOccupancy: 96 }
];

import { useRole } from '@/lib/RoleContext';

export function AiInsightsPage() {
  const { role: currentRole, setRole: setCurrentRole } = useRole();
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
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> AI Business Intelligence Suite
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Autonomous forecast engine, fill-rate elasticity analysis, loss prevention, and dynamic pricing models.
            </p>
          </div>

          <AIInsightsCard insights={INITIAL_AI_INSIGHTS} />

          {/* 6-Month Predictive Forecast Chart */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                    6-Month Predictive Revenue & Lease Velocity
                  </h3>
                  <p className="text-[10px] text-slate-500">ML projection based on historical lease velocity and regional price sensitivity</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Confidence: 94.2%
              </span>
            </div>

            <div className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorForecastLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Predicted Revenue']}
                  />
                  <Area type="monotone" dataKey="predictedRevenue" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorForecastLight)" />
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
