'use client';

import React from 'react';
import { Warehouse, Award, AlertTriangle } from 'lucide-react';
import { Facility } from '@/lib/types';

interface FacilityComparisonProps {
  facilities: Facility[];
}

export const FacilityComparison: React.FC<FacilityComparisonProps> = ({ facilities }) => {
  const sortedByProfit = [...facilities].sort((a, b) => b.netProfit - a.netProfit);
  const bestPerformer = sortedByProfit[0];
  const worstPerformer = sortedByProfit[sortedByProfit.length - 1];

  return (
    <div className="space-y-4">
      {/* Top Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Most Profitable Facility */}
        {bestPerformer && (
          <div className="bg-gradient-to-br from-emerald-50/70 via-white to-white border border-emerald-200 p-4 rounded-xl shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Top Performing Facility</span>
              <h4 className="font-bold text-slate-900 text-sm">{bestPerformer.name}</h4>
              <p className="text-xs text-slate-600">
                Net Profit: <strong className="text-emerald-700 font-mono">${bestPerformer.netProfit.toLocaleString()}/mo</strong> • {bestPerformer.occupancyRate}% Fill Rate
              </p>
            </div>
          </div>
        )}

        {/* Underperforming Facility */}
        {worstPerformer && (
          <div className="bg-gradient-to-br from-rose-50/70 via-white to-white border border-rose-200 p-4 rounded-xl shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider">Requires Intervention</span>
              <h4 className="font-bold text-slate-900 text-sm">{worstPerformer.name}</h4>
              <p className="text-xs text-slate-600">
                Net Margin: <strong className="text-rose-700 font-mono">${worstPerformer.netProfit.toLocaleString()}/mo</strong> • {worstPerformer.occupancyRate}% Fill Rate
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <Warehouse className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                Multi-Yard Operational Performance Matrix
              </h3>
              <p className="text-[10px] text-slate-500">Comparative ROI, unit utilization, and gross margin across facilities</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Facility</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Containers</th>
                <th className="py-3 px-4 font-semibold">Occupancy</th>
                <th className="py-3 px-4 font-semibold">Gross Revenue</th>
                <th className="py-3 px-4 font-semibold">Expenses</th>
                <th className="py-3 px-4 font-semibold">Net Profit</th>
                <th className="py-3 px-4 text-right font-semibold">Yield Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {facilities.map((fac) => {
                const isPositive = fac.netProfit >= 0;
                return (
                  <tr key={fac.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{fac.name}</span>
                        <span className="text-[10px] text-blue-600 font-mono bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">{fac.code}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {fac.city}, {fac.state}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium">
                      <span className="text-slate-900">{fac.occupiedContainers}</span> / <span className="text-slate-500">{fac.totalContainers}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              fac.occupancyRate > 80 ? 'bg-emerald-500' :
                              fac.occupancyRate > 60 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${fac.occupancyRate}%` }}
                          ></div>
                        </div>
                        <span className="font-mono font-semibold text-xs text-slate-800">{fac.occupancyRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-700 text-xs">
                      ${fac.monthlyRevenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-600 text-xs">
                      ${fac.monthlyExpenses.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-xs">
                      <span className={isPositive ? 'text-emerald-700' : 'text-rose-600'}>
                        ${fac.netProfit.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        fac.occupancyRate >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        fac.occupancyRate >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {fac.occupancyRate >= 80 ? 'Grade A+' : fac.occupancyRate >= 60 ? 'Grade B' : 'Needs Action'}
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
