'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const monthlyFinancialData = [
  { month: 'Feb', revenue: 38000, expenses: 14000, profit: 24000, occupancy: 74 },
  { month: 'Mar', revenue: 41200, expenses: 14500, profit: 26700, occupancy: 77 },
  { month: 'Apr', revenue: 44500, expenses: 15200, profit: 29300, occupancy: 80 },
  { month: 'May', revenue: 46800, expenses: 15800, profit: 31000, occupancy: 82 },
  { month: 'Jun', revenue: 49100, expenses: 16100, profit: 33000, occupancy: 85 },
  { month: 'Jul', revenue: 52400, expenses: 16900, profit: 35500, occupancy: 87 }
];

const expenseBreakdown = [
  { name: 'Employee Salaries', value: 6800, color: '#3b82f6' },
  { name: 'Utility & Power', value: 2400, color: '#06b6d4' },
  { name: 'Property Tax', value: 3100, color: '#8b5cf6' },
  { name: 'Insurance', value: 2200, color: '#10b981' },
  { name: 'Container Maintenance', value: 2400, color: '#f59e0b' }
];

export const FinancialCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Monthly Revenue vs Expenses (Area Chart) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Monthly Cash Flow & Profitability</h3>
            <p className="text-xs text-slate-400 mt-0.5">Gross Revenue vs Operating Expenses across all yards</p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            +18.4% Growth
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyFinancialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Gross Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Expense Category Breakdown (Pie Chart) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Expense Category Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Operating breakdown for current fiscal month</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-full">
            Total: $16,900
          </span>
        </div>

        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
          {expenseBreakdown.map((exp) => (
            <span key={exp.name} className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: exp.color }}></span>
              {exp.name} (${exp.value})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
