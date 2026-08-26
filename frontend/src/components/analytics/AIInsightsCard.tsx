'use client';

import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';
import { AIInsight } from '@/lib/types';

interface AIInsightsCardProps {
  insights: AIInsight[];
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insights }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50/70 via-white to-blue-50/70 border border-indigo-100 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-indigo-100/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 border border-indigo-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
              AI Yield Intelligence Engine
            </h3>
            <p className="text-[11px] text-slate-500">Autonomous dynamic pricing, loss prevention, and fill-rate predictions</p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
          Autonomous Analysis
        </span>
      </div>

      {/* Insights List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((item) => {
          const isWarning = item.type === 'WARNING';
          const isOpportunity = item.type === 'OPPORTUNITY';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all bg-white shadow-2xs ${
                isWarning
                  ? 'border-rose-200 hover:border-rose-300'
                  : isOpportunity
                  ? 'border-emerald-200 hover:border-emerald-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                    isWarning ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    isOpportunity ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-500">{item.metric}</span>
                </div>

                <h4 className="font-semibold text-xs text-slate-900 leading-snug">{item.title}</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px]">
                <div className="flex items-center gap-1 text-blue-600 font-semibold mb-0.5">
                  <Lightbulb className="w-3 h-3" />
                  <span>Recommended Action</span>
                </div>
                <p className="text-slate-600 leading-snug">{item.recommendedAction}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
