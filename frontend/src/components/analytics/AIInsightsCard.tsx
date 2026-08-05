'use client';

import React from 'react';
import { Sparkles, AlertTriangle, TrendingUp, Wrench, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { AIInsight } from '@/lib/types';

interface AIInsightsCardProps {
  insights: AIInsight[];
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insights }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">AI Business Intelligence Engine</h3>
            <p className="text-xs text-indigo-300/80">Predictive occupancy, loss prevention & dynamic rate optimizer</p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
          Autonomous Analysis
        </span>
      </div>

      {/* Insights List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item) => {
          const isWarning = item.type === 'WARNING';
          const isOpportunity = item.type === 'OPPORTUNITY';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all hover:scale-[1.01] ${
                isWarning
                  ? 'bg-rose-950/30 border-rose-500/30 text-rose-100'
                  : isOpportunity
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
                  : 'bg-slate-800/60 border-slate-700 text-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isWarning ? 'bg-rose-500/20 text-rose-300' :
                    isOpportunity ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{item.metric}</span>
                </div>

                <h4 className="font-bold text-xs text-white leading-snug">{item.title}</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed opacity-90">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-white/10 text-[10px]">
                <strong className="block text-cyan-400 font-semibold mb-0.5">Recommended AI Action:</strong>
                <p className="text-slate-300">{item.recommendedAction}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
