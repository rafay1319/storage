'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import {
  DollarSign,
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Building2,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Wallet,
  CreditCard,
  ShieldCheck,
  Sparkles,
  X,
  Printer,
  Layers,
  ChevronDown,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Monthly Financial Trajectory Data
const MONTHLY_P_AND_L = [
  { month: 'Jan', revenue: 42500, expenses: 16800, profit: 25700, margin: 60.5 },
  { month: 'Feb', revenue: 44200, expenses: 17100, profit: 27100, margin: 61.3 },
  { month: 'Mar', revenue: 46800, expenses: 17900, profit: 28900, margin: 61.8 },
  { month: 'Apr', revenue: 48100, expenses: 18400, profit: 29700, margin: 61.7 },
  { month: 'May', revenue: 49500, expenses: 19100, profit: 30400, margin: 61.4 },
  { month: 'Jun', revenue: 50650, expenses: 20000, profit: 30650, margin: 60.5 }
];

// Revenue Stream by Unit Classification
const REVENUE_BY_CATEGORY = [
  { name: 'Climate & Reefer', value: 21400, percentage: 42.2, color: '#3b82f6' },
  { name: 'Standard Dry Storage', value: 18750, percentage: 37.0, color: '#10b981' },
  { name: 'Hazmat Approved Bays', value: 6800, percentage: 13.4, color: '#8b5cf6' },
  { name: 'Gate & Stacking Fees', value: 3700, percentage: 7.4, color: '#f59e0b' }
];

// Operating Expense Breakdown
const EXPENSE_BREAKDOWN = [
  { name: 'Staff & Tech Payroll', value: 8500, percentage: 42.5, color: '#ef4444' },
  { name: 'Power & 480V Utilities', value: 4200, percentage: 21.0, color: '#f97316' },
  { name: 'Property Tax & Ins.', value: 4100, percentage: 20.5, color: '#06b6d4' },
  { name: 'Equipment & Forklifts', value: 3200, percentage: 16.0, color: '#6366f1' }
];

// Initial Transactions Ledger
const INITIAL_TRANSACTIONS = [
  { id: 'TX-9041', date: '2026-08-01', customer: 'Apex Global Logistics', facility: 'Austin Port Terminal', description: '40ft High-Cube Lease (ATX-2001) - Aug 2026', type: 'INCOME', amount: 450, method: 'ACH Transfer', status: 'PAID' },
  { id: 'TX-9042', date: '2026-08-01', customer: 'Boulder Construction LLC', facility: 'Austin Port Terminal', description: 'Climate Controlled Lease (ATX-2002) - Aug 2026', type: 'INCOME', amount: 750, method: 'Credit Card', status: 'PAID' },
  { id: 'TX-9043', date: '2026-07-31', customer: 'Texas Energy Corp', facility: 'Austin Port Terminal', description: 'Yard Grid 480V Commercial Power Billing', type: 'EXPENSE', amount: 2400, method: 'Auto-Debit', status: 'PAID' },
  { id: 'TX-9044', date: '2026-07-30', customer: 'Golden Gate Cold Chain', facility: 'Long Beach Harbor', description: 'Reefer Unit #LBH-1002 Monthly Lease', type: 'INCOME', amount: 1100, method: 'ACH Transfer', status: 'PAID' },
  { id: 'TX-9045', date: '2026-07-29', customer: 'Marine Rubber & Gasket Supply', facility: 'Austin Port Terminal', description: 'OEM EPDM Door Gasket Seals (x12 kits)', type: 'EXPENSE', amount: 850, method: 'Corporate Card', status: 'PAID' },
  { id: 'TX-9046', date: '2026-07-28', customer: 'Caribbean Distribution LLC', facility: 'Miami Inland Depot', description: 'Unit MIA-4001 Lease + Security Surcharge', type: 'INCOME', amount: 780, method: 'Wire Transfer', status: 'PAID' },
  { id: 'TX-9047', date: '2026-07-27', customer: 'Boulder Construction LLC', facility: 'Austin Port Terminal', description: 'Late Gate Entry Overstay Fee', type: 'INCOME', amount: 350, method: 'Pending Invoice', status: 'OVERDUE' }
];

import { useRole } from '@/lib/RoleContext';

export function FinancePage() {
  const { role: currentRole, setRole: setCurrentRole } = useRole();
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<'MONTH' | 'Q2' | 'YTD' | 'ANNUAL'>('MONTH');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'P_AND_L' | 'TRANSACTIONS' | 'FACILITY_COMPARISON'>('OVERVIEW');
  const [searchTransaction, setSearchTransaction] = useState('');
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Log Expense Modal
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState(false);
  const [expenseFacility, setExpenseFacility] = useState('Austin Port Terminal Yard');
  const [expenseCategory, setExpenseCategory] = useState('Maintenance & Repairs');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseVendor, setExpenseVendor] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Facility filter calculations
  const activeFacilities = selectedFacilityId === 'ALL'
    ? INITIAL_FACILITIES
    : INITIAL_FACILITIES.filter(f => f.id === selectedFacilityId);

  const totalRevenue = activeFacilities.reduce((sum, f) => sum + f.monthlyRevenue, 0);
  const totalExpenses = activeFacilities.reduce((sum, f) => sum + f.monthlyExpenses, 0);
  const totalNetProfit = totalRevenue - totalExpenses;
  const netMargin = totalRevenue > 0 ? ((totalNetProfit / totalRevenue) * 100).toFixed(1) : '0';
  const totalUnits = activeFacilities.reduce((sum, f) => sum + f.totalContainers, 0);
  const occupiedUnits = activeFacilities.reduce((sum, f) => sum + f.occupiedContainers, 0);
  const arpu = occupiedUnits > 0 ? Math.round(totalRevenue / occupiedUnits) : 0;

  // Export CSV Handler
  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      let csvData = "Transaction ID,Date,Entity / Customer,Facility,Description,Type,Amount ($),Method,Status\n";
      transactions.forEach(t => {
        csvData += `${t.id},${t.date},"${t.customer}","${t.facility}","${t.description}",${t.type},${t.amount},${t.method},${t.status}\n`;
      });

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ContainerYard_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
      showToast('✅ Financial statement CSV downloaded successfully!');
    }, 500);
  };

  // Log Expense Submission
  const handleLogExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || !expenseDesc) return;

    const newTx = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      customer: expenseVendor || 'Vendor Expense',
      facility: expenseFacility,
      description: `${expenseCategory}: ${expenseDesc}`,
      type: 'EXPENSE',
      amount: Number(expenseAmount),
      method: 'Corporate Invoice',
      status: 'PAID'
    };

    setTransactions([newTx, ...transactions]);
    setIsLogExpenseOpen(false);
    setExpenseAmount('');
    setExpenseDesc('');
    setExpenseVendor('');
    showToast(`✅ Expense of $${newTx.amount} logged successfully!`);
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    if (selectedFacilityId !== 'ALL') {
      const facObj = INITIAL_FACILITIES.find(f => f.id === selectedFacilityId);
      if (facObj && !t.facility.toLowerCase().includes(facObj.city.toLowerCase()) && !t.facility.toLowerCase().includes(facObj.name.toLowerCase())) {
        return false;
      }
    }
    if (searchTransaction.trim()) {
      const q = searchTransaction.toLowerCase();
      return (
        t.customer.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.method.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          facilities={INITIAL_FACILITIES}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={setSelectedFacilityId}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 p-5 md:p-7 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">

          {/* Top Banner & Control Strip */}
          <div className="bg-gradient-to-br from-white via-white to-blue-50/40 border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> P&L Audit Ready
                </span>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Fiscal Year 2026
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Financial Reports & P&L Statement</h1>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Real-time income statement, operational cost centers, cash flow velocity, accounts receivable, and multi-yard yield analysis.
              </p>
            </div>

            {/* Quick Actions & Timeframe */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Timeframe selector */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setTimeframe('MONTH')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${timeframe === 'MONTH' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setTimeframe('Q2')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${timeframe === 'Q2' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  Q2
                </button>
                <button
                  onClick={() => setTimeframe('YTD')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${timeframe === 'YTD' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  YTD
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
              </button>

              {/* Log Expense Button */}
              <button
                onClick={() => setIsLogExpenseOpen(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log Expense</span>
              </button>
            </div>
          </div>

          {/* 5-Column Executive KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* 1. Monthly Revenue */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gross Revenue</span>
                <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-700">
                ${totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                <span>+18.4% YoY Growth</span>
              </div>
            </div>

            {/* 2. Total OPEX */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total OPEX</span>
                <span className="p-1 rounded-md bg-rose-50 text-rose-600">
                  <TrendingDown className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-800">
                ${totalExpenses.toLocaleString()}
              </div>
              <div className="text-[10px] font-medium text-slate-400">
                Operating Cost Ratio: 39.5%
              </div>
            </div>

            {/* 3. Net Operating Profit */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Net Operating Income</span>
                <span className="p-1 rounded-md bg-blue-50 text-blue-600">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-blue-700">
                ${totalNetProfit.toLocaleString()}
              </div>
              <div className="text-[10px] font-semibold text-blue-600">
                {netMargin}% Net Margin
              </div>
            </div>

            {/* 4. ARPU */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Rev / Unit (ARPU)</span>
                <span className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                  <Layers className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900">
                ${arpu}
              </div>
              <div className="text-[10px] font-medium text-slate-400">
                Across {occupiedUnits} active leases
              </div>
            </div>

            {/* 5. Invoicing & Collections */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Collection Rate</span>
                <span className="p-1 rounded-md bg-cyan-50 text-cyan-600">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-cyan-700">
                98.2%
              </div>
              <div className="text-[10px] font-semibold text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>$350.00 Overdue</span>
              </div>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === 'OVERVIEW'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              Financial Analytics & Charts
            </button>
            <button
              onClick={() => setActiveTab('P_AND_L')}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === 'P_AND_L'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              Structured P&L Income Statement
            </button>
            <button
              onClick={() => setActiveTab('FACILITY_COMPARISON')}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === 'FACILITY_COMPARISON'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              Facility Yield Matrix ({activeFacilities.length} Yards)
            </button>
            <button
              onClick={() => setActiveTab('TRANSACTIONS')}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === 'TRANSACTIONS'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              Transactions & Invoicing Ledger ({transactions.length})
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: FINANCIAL CHARTS & BREAKDOWN                                       */}
          {/* ========================================================================= */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* 1. Monthly Revenue & OPEX Area Chart */}
              <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      Monthly Revenue, OPEX & Net Profit Trajectory
                    </h3>
                    <p className="text-xs text-slate-500">6-Month historical cash flow performance across active yards</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Gross Revenue
                    </span>
                    <span className="flex items-center gap-1 text-rose-500 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expenses
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Net Profit
                    </span>
                  </div>
                </div>

                <div className="h-64 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MONTHLY_P_AND_L} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '11px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                        formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                      <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Net Profit" />
                      <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={1.5} fillOpacity={0} name="OPEX" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. Donut Charts: Revenue Sources vs Expense Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Revenue Streams */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <PieIcon className="w-4 h-4 text-blue-600" />
                        Revenue Distribution by Unit Type
                      </h3>
                      <p className="text-[11px] text-slate-500">Gross monthly revenue stream segmentation</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                      ${totalRevenue.toLocaleString()} Total
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={REVENUE_BY_CATEGORY}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {REVENUE_BY_CATEGORY.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                            formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-2">
                      {REVENUE_BY_CATEGORY.map((cat, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="font-medium text-slate-700">{cat.name}</span>
                          </div>
                          <div className="font-mono font-bold text-slate-900">
                            ${cat.value.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">({cat.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Operating Expense Centers */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-rose-600" />
                        Operating Expense (OPEX) Allocation
                      </h3>
                      <p className="text-[11px] text-slate-500">Current cost allocation breakdown</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                      ${totalExpenses.toLocaleString()} Total
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={EXPENSE_BREAKDOWN}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {EXPENSE_BREAKDOWN.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                            formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-2">
                      {EXPENSE_BREAKDOWN.map((exp, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: exp.color }} />
                            <span className="font-medium text-slate-700">{exp.name}</span>
                          </div>
                          <div className="font-mono font-bold text-slate-900">
                            ${exp.value.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">({exp.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: STRUCTURED P&L INCOME STATEMENT                                    */}
          {/* ========================================================================= */}
          {activeTab === 'P_AND_L' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-white to-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Structured Multi-Yard Income Statement (P&L)
                  </h3>
                  <p className="text-xs text-slate-500">Period: July 1, 2026 – August 1, 2026 • Prepared according to US GAAP</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print P&L</span>
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* 1. OPERATING REVENUE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b-2 border-slate-900 font-bold text-xs text-slate-900 uppercase tracking-wider">
                    <span>1. Operating Revenue</span>
                    <span className="font-mono">${totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="space-y-1.5 text-xs pl-3">
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Commercial & Industrial Long-Term Leases</span>
                      <span className="font-mono font-semibold text-slate-900">$34,800.00</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Short-Term Monthly Storage Rentals</span>
                      <span className="font-mono font-semibold text-slate-900">$10,250.00</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">480V Refrigerated Reefer Power Surcharges</span>
                      <span className="font-mono font-semibold text-slate-900">$3,400.00</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Forklift Stacking & Late Gate Handling Fees</span>
                      <span className="font-mono font-semibold text-slate-900">$2,200.00</span>
                    </div>
                  </div>
                </div>

                {/* 2. COST OF OPERATIONS (OPEX) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b-2 border-slate-900 font-bold text-xs text-slate-900 uppercase tracking-wider">
                    <span>2. Operating Expenses (OPEX)</span>
                    <span className="font-mono text-rose-700">(${totalExpenses.toLocaleString()})</span>
                  </div>
                  <div className="space-y-1.5 text-xs pl-3">
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Yard Management & Field Technician Payroll</span>
                      <span className="font-mono font-semibold text-slate-900">$8,500.00</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Electricity, Yard Floodlighting & Reefer Power</span>
                      <span className="font-mono font-semibold text-slate-900">$4,200.00</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Commercial Property, Hazmat & Casualty Insurance</span>
                      <span className="font-mono font-semibold text-slate-900">$4,100.00</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Heavy Forklift Lease, Fuel & Routine Maintenance</span>
                      <span className="font-mono font-semibold text-slate-900">$3,200.00</span>
                    </div>
                  </div>
                </div>

                {/* 3. NET OPERATING INCOME (NOI) SUMMARY */}
                <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Net Operating Income (NOI)
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Earnings before tax, depreciation and amortization (EBITDA)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-blue-700 block">
                      ${totalNetProfit.toLocaleString()}.00
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {netMargin}% Profit Margin
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: FACILITY COMPARISON MATRIX                                         */}
          {/* ========================================================================= */}
          {activeTab === 'FACILITY_COMPARISON' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    Multi-Yard Performance & Financial Yield Comparison
                  </h3>
                  <p className="text-xs text-slate-500">Side-by-side comparison of occupancy, revenue, OPEX and margin per yard</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 font-semibold">
                      <th className="p-3.5">Facility Yard</th>
                      <th className="p-3.5">Capacity / Occupancy</th>
                      <th className="p-3.5">Monthly Gross</th>
                      <th className="p-3.5">Monthly OPEX</th>
                      <th className="p-3.5">Net Profit</th>
                      <th className="p-3.5">Profit Margin</th>
                      <th className="p-3.5 text-right">Performance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {INITIAL_FACILITIES.map((fac) => {
                      const profit = fac.monthlyRevenue - fac.monthlyExpenses;
                      const margin = ((profit / fac.monthlyRevenue) * 100).toFixed(1);
                      const isHigh = fac.occupancyRate >= 80;
                      const isLow = fac.occupancyRate < 50;

                      return (
                        <tr key={fac.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{fac.name}</div>
                            <div className="text-[11px] text-slate-400">{fac.city}, {fac.state} ({fac.code})</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-mono font-bold text-slate-800">
                              {fac.occupiedContainers} / {fac.totalContainers} Units ({fac.occupancyRate}%)
                            </div>
                            <div className="w-28 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isHigh ? 'bg-indigo-600' : isLow ? 'bg-rose-500' : 'bg-blue-600'}`}
                                style={{ width: `${fac.occupancyRate}%` }}
                              />
                            </div>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-emerald-700">
                            ${fac.monthlyRevenue.toLocaleString()}
                          </td>
                          <td className="p-3.5 font-mono text-slate-700">
                            ${fac.monthlyExpenses.toLocaleString()}
                          </td>
                          <td className="p-3.5 font-mono font-bold text-blue-700">
                            ${profit.toLocaleString()}
                          </td>
                          <td className="p-3.5 font-mono font-semibold text-slate-800">
                            {margin}%
                          </td>
                          <td className="p-3.5 text-right">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isHigh
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isLow
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                              {isHigh ? 'High Yield' : isLow ? 'Underperforming' : 'Stable'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: TRANSACTIONS & INVOICING LEDGER                                    */}
          {/* ========================================================================= */}
          {activeTab === 'TRANSACTIONS' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-0">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-blue-600" />
                    Live Transactions & Invoices Ledger
                  </h3>
                  <p className="text-[11px] text-slate-500">Full audit log of incoming customer payments and outgoing operational costs</p>
                </div>

                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search invoices, clients..."
                    value={searchTransaction}
                    onChange={(e) => setSearchTransaction(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 font-semibold">
                      <th className="p-3">Reference #</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Client / Vendor</th>
                      <th className="p-3">Facility</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Method</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {tx.id}
                        </td>
                        <td className="p-3 font-mono text-slate-500 text-[11px]">
                          {tx.date}
                        </td>
                        <td className="p-3 font-semibold text-slate-800">
                          {tx.customer}
                        </td>
                        <td className="p-3 text-slate-500">
                          {tx.facility}
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">
                          {tx.description}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${tx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {tx.type === 'INCOME' ? `+$${tx.amount}` : `-$${tx.amount}`}
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">
                          {tx.method}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tx.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : tx.status === 'OVERDUE'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: LOG OPERATIONAL EXPENSE                                            */}
      {/* ========================================================================= */}
      {isLogExpenseOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">
                  Accounting & AP Entry
                </span>
                <h3 className="font-bold text-sm text-slate-900">Log Operational Expense</h3>
              </div>
              <button
                onClick={() => setIsLogExpenseOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogExpenseSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Storage Facility</label>
                <select
                  value={expenseFacility}
                  onChange={(e) => setExpenseFacility(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  {INITIAL_FACILITIES.map(fac => (
                    <option key={fac.id} value={fac.name}>{fac.name} ({fac.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Cost Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                  >
                    <option value="Maintenance & Repairs">Maintenance & Repairs</option>
                    <option value="Power & Utilities">Power & Utilities</option>
                    <option value="Staff Payroll">Staff Payroll</option>
                    <option value="Equipment Lease & Fuel">Equipment Lease & Fuel</option>
                    <option value="Security & Telemetry">Security & Telemetry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Amount ($)</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-rose-600 mr-1" />
                    <input
                      type="number"
                      required
                      placeholder="500"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="bg-transparent w-full focus:outline-none font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Vendor / Payee</label>
                <input
                  type="text"
                  placeholder="e.g. Marine Rubber & Gasket Supply"
                  value={expenseVendor}
                  onChange={(e) => setExpenseVendor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Expense Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe parts replaced or service rendered..."
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogExpenseOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Command Palette */}
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

export default FinancePage;
