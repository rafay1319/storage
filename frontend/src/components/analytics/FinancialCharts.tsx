'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';

const monthlyFinancialData = [
  { month: 'Feb', revenue: 38000, expenses: 14000, profit: 24000, occupancy: 74 },
  { month: 'Mar', revenue: 41200, expenses: 14500, profit: 26700, occupancy: 77 },
  { month: 'Apr', revenue: 44500, expenses: 15200, profit: 29300, occupancy: 80 },
  { month: 'May', revenue: 46800, expenses: 15800, profit: 31000, occupancy: 82 },
  { month: 'Jun', revenue: 49100, expenses: 16100, profit: 33000, occupancy: 85 },
  { month: 'Jul', revenue: 52400, expenses: 16900, profit: 35500, occupancy: 87 }
];

const expenseBreakdown = [
  { name: 'Staff Salaries', value: 6800, color: '#3b82f6' },
  { name: 'Power & Utilities', value: 2400, color: '#06b6d4' },
  { name: 'Property Tax', value: 3100, color: '#8b5cf6' },
  { name: 'Yard Insurance', value: 2200, color: '#10b981' },
  { name: 'Maintenance', value: 2400, color: '#f59e0b' }
];

export const FinancialCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Monthly Revenue vs Expenses (Area Chart) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">Cash Flow & P&L Trajectory</h3>
              <p className="text-[11px] text-slate-500">Gross revenue vs operating expenses across facilities</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            +18.4% YoY
          </span>
        </div>

        <div className="h-56 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyFinancialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenueLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpensesLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenueLight)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={1.5} fillOpacity={1} fill="url(#colorExpensesLight)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Expense Breakdown (Donut Chart) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">Operating Expense Distribution</h3>
              <p className="text-[11px] text-slate-500">Current fiscal period cost allocations</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            Total: $16.9k
          </span>
        </div>

        <div className="h-44 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-[10px] pt-1">
          {expenseBreakdown.map((exp) => (
            <span key={exp.name} className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: exp.color }}></span>
              <span>{exp.name}</span>
              <span className="font-mono text-slate-400 font-normal">(${exp.value})</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
