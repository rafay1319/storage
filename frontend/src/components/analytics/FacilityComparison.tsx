'use client';

import React from 'react';
import { Warehouse, TrendingUp, TrendingDown, DollarSign, Award, AlertTriangle, ArrowRight } from 'lucide-react';
import { Facility } from '@/lib/types';

interface FacilityComparisonProps {
  facilities: Facility[];
}

export const FacilityComparison: React.FC<FacilityComparisonProps> = ({ facilities }) => {
  const sortedByProfit = [...facilities].sort((a, b) => b.netProfit - a.netProfit);
  const sortedByOccupancy = [...facilities].sort((a, b) => b.occupancyRate - a.occupancyRate);

  const bestPerformer = sortedByProfit[0];
  const worstPerformer = sortedByProfit[sortedByProfit.length - 1];

  return (
    <div className="space-y-6">
      {/* Top Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most Profitable Facility */}
        {bestPerformer && (
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 p-5 rounded-3xl shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Top Performing Facility</span>
              <h4 className="font-bold text-white text-base">{bestPerformer.name}</h4>
              <p className="text-xs text-slate-300">
                Monthly Net Profit: <strong className="text-emerald-400 font-mono text-sm">${bestPerformer.netProfit.toLocaleString()}</strong> ({bestPerformer.occupancyRate}% Occupied)
              </p>
            </div>
          </div>
        )}

        {/* Underperforming Facility */}
        {worstPerformer && (
          <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 p-5 rounded-3xl shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Requires Intervention</span>
              <h4 className="font-bold text-white text-base">{worstPerformer.name}</h4>
              <p className="text-xs text-slate-300">
                Net Margin: <strong className="text-rose-400 font-mono text-sm">${worstPerformer.netProfit.toLocaleString()}</strong> ({worstPerformer.occupancyRate}% Fill Rate)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-cyan-400" />
              Executive Multi-Facility Performance Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Comparative ROI, fill rate, and revenue breakdown</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <th className="p-4">Facility & Code</th>
                <th className="p-4">Location</th>
                <th className="p-4">Containers</th>
                <th className="p-4">Occupancy %</th>
                <th className="p-4">Gross Revenue</th>
                <th className="p-4">Expenses</th>
                <th className="p-4">Net Profit</th>
                <th className="p-4 text-right">Yield Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {facilities.map((fac) => {
                const isPositive = fac.netProfit >= 0;
                return (
                  <tr key={fac.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-white block">{fac.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">[{fac.code}]</span>
                    </td>
                    <td className="p-4 font-medium text-slate-400">
                      {fac.city}, {fac.state}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-white">{fac.occupiedContainers}</span> / {fac.totalContainers}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              fac.occupancyRate > 80 ? 'bg-emerald-500' :
                              fac.occupancyRate > 60 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${fac.occupancyRate}%` }}
                          ></div>
                        </div>
                        <span className="font-bold font-mono text-white">{fac.occupancyRate}%</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      ${fac.monthlyRevenue.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-rose-400">
                      ${fac.monthlyExpenses.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono font-extrabold">
                      <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                        ${fac.netProfit.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        fac.occupancyRate >= 80 ? 'bg-emerald-500/20 text-emerald-300' :
                        fac.occupancyRate >= 60 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {fac.occupancyRate >= 80 ? 'Grade A+' : fac.occupancyRate >= 60 ? 'Grade B' : 'Action Required'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
