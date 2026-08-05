'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { FinancialCharts } from '@/components/analytics/FinancialCharts';
import { FacilityComparison } from '@/components/analytics/FacilityComparison';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { DollarSign, Download, Plus, TrendingUp, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function FinancePage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvData = "Facility,Category,Amount,Date,Description\nAustin Port Terminal,Salary,6800,2026-07-30,Staff Payroll\nAustin Port Terminal,Utility,2400,2026-07-28,Yard Electricity & Lighting\nLong Beach Harbor,Insurance,3100,2026-07-25,Property Coverage";
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Storage_Facility_Financial_Report.csv';
      a.click();
      setIsExporting(false);
    }, 500);
  };

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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-emerald-400" /> Executive Financial Accounting & P&L
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Multi-yard income statement, operating expenses, cash flow analysis, and balance ledgers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{isExporting ? 'Generating CSV...' : 'Export Financial CSV'}</span>
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all">
                <Plus className="w-4 h-4" />
                <span>Log Operating Expense</span>
              </button>
            </div>
          </div>

          {/* Charts */}
          <FinancialCharts />

          {/* Comparison Matrix */}
          <FacilityComparison facilities={INITIAL_FACILITIES} />
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
