import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import {
  INITIAL_FACILITIES,
  INITIAL_CONTAINERS,
  INITIAL_CUSTOMERS,
  INITIAL_TASKS,
  INITIAL_AI_INSIGHTS
} from '@/lib/mockData';
import {
  DollarSign,
  Warehouse,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  BarChart3,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRole } from '@/lib/RoleContext';

export function DashboardPage() {
  const { role: currentRole, setRole: setCurrentRole } = useRole();
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'OPERATIONS' | 'FINANCIALS' | 'INSIGHTS'>('OVERVIEW');

  const facilities = selectedFacilityId === 'ALL'
    ? INITIAL_FACILITIES
    : INITIAL_FACILITIES.filter(f => f.id === selectedFacilityId);

  // Aggregated KPIs
  const totalRevenue = facilities.reduce((sum, f) => sum + f.monthlyRevenue, 0);
  const totalExpenses = facilities.reduce((sum, f) => sum + f.monthlyExpenses, 0);
  const totalNetProfit = totalRevenue - totalExpenses;
  const totalContainersCount = facilities.reduce((sum, f) => sum + f.totalContainers, 0);
  const totalOccupiedCount = facilities.reduce((sum, f) => sum + f.occupiedContainers, 0);
  const avgOccupancyRate = totalContainersCount > 0
    ? Math.round((totalOccupiedCount / totalContainersCount) * 100)
    : 0;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
      {/* Sidebar */}
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          facilities={INITIAL_FACILITIES}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={setSelectedFacilityId}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="p-6 space-y-5 overflow-y-auto">
          {/* Top Welcome Bar & Tab Switcher */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Operations Dashboard</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Portfolio monitoring across {facilities.length} locations & {totalContainersCount} total container units.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/locations"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View Locations</span>
                </Link>
                <Link
                  to="/messages"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Open Messages</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
              {[
                { id: 'OVERVIEW', label: 'Overview', icon: Layers },
                { id: 'OPERATIONS', label: 'Operations & Units', icon: Activity },
                { id: 'FINANCIALS', label: 'Financial Performance', icon: BarChart3 },
                { id: 'INSIGHTS', label: 'Smart Insights', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${isActive
                      ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-5">
              {/* 4 Core Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Gross Monthly Revenue */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Gross Revenue</span>
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 font-mono">${totalRevenue.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+12.4% this month</span>
                  </div>
                </div>

                {/* Portfolio Occupancy */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Portfolio Occupancy</span>
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                      <Warehouse className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 font-mono">{avgOccupancyRate}%</div>
                  <div className="text-[11px] text-slate-500">
                    {totalOccupiedCount} of {totalContainersCount} units active
                  </div>
                </div>

                {/* Net Operating Income */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Net Profit</span>
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className={`text-2xl font-bold font-mono ${totalNetProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    ${totalNetProfit.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Operating costs: ${totalExpenses.toLocaleString()}
                  </div>
                </div>

                {/* Active Customers */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Customers</span>
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 font-mono">{INITIAL_CUSTOMERS.length}</div>
                  <div className="text-[11px] text-emerald-600 font-medium">
                    100% current on ledger
                  </div>
                </div>
              </div>

              {/* 2-Column Overview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left 2 Cols: Locations Status */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Locations Occupancy Status</h3>
                      <p className="text-xs text-slate-500">Capacity breakdown across operating storage yards</p>
                    </div>
                    <Link to="/locations" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {facilities.map((fac) => {
                      const occ = fac.occupancyRate;
                      return (
                        <div key={fac.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-xs font-bold text-slate-800">{fac.name}</span>
                              <span className="text-[11px] text-slate-500 ml-2">({fac.city}, {fac.state})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-slate-700">
                                {fac.occupiedContainers}/{fac.totalContainers} units
                              </span>
                              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                {occ}%
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${occ >= 85 ? 'bg-indigo-600' : occ >= 60 ? 'bg-blue-600' : 'bg-amber-500'
                                }`}
                              style={{ width: `${occ}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right 1 Col: Recent Operations & Tasks */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Recent Priority Tasks</h3>
                      <p className="text-xs text-slate-500">Field work orders</p>
                    </div>
                    <Link to="/tasks" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <span>Tasks</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {INITIAL_TASKS.map((t) => (
                      <div key={t.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-semibold text-blue-700">{t.taskNumber}</span>
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            t.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                            {t.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 leading-snug">{t.title}</h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                          <span>Assignee: {t.assignedToName}</span>
                          <span>Due: {t.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPERATIONS & UNITS */}
          {activeTab === 'OPERATIONS' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Available Units</span>
                  <div className="text-2xl font-bold text-emerald-600 font-mono">
                    {totalContainersCount - totalOccupiedCount} Units
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Ready for immediate customer lease</p>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Occupied Units</span>
                  <div className="text-2xl font-bold text-blue-600 font-mono">
                    {totalOccupiedCount} Units
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Under active rental contracts</p>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Maintenance / Cleaning</span>
                  <div className="text-2xl font-bold text-amber-600 font-mono">
                    2 Units
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Scheduled for turnover inspection</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900">Container Inventory Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100 font-semibold">
                      <tr>
                        <th className="p-3">Container #</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Size / Type</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Assigned Client</th>
                        <th className="p-3 text-right">Monthly Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {INITIAL_CONTAINERS.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-800">{c.containerNumber}</td>
                          <td className="p-3">{c.facilityName}</td>
                          <td className="p-3">{c.size} • {c.type}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${c.status === 'Occupied' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              c.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-slate-800">{c.currentCustomerCompany || '—'}</td>
                          <td className="p-3 font-mono font-bold text-slate-900 text-right">${c.rentalPrice}/mo</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCIALS */}
          {activeTab === 'FINANCIALS' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Monthly Invoiced</span>
                  <div className="text-2xl font-bold text-slate-900 font-mono">${totalRevenue.toLocaleString()}</div>
                  <span className="text-[11px] text-emerald-600 font-medium">+14% vs Q2 average</span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Operating Expenses</span>
                  <div className="text-2xl font-bold text-slate-700 font-mono">${totalExpenses.toLocaleString()}</div>
                  <span className="text-[11px] text-slate-500">Utilities, leaseholds & staff</span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Net Portfolio Profit</span>
                  <div className="text-2xl font-bold text-emerald-700 font-mono">${totalNetProfit.toLocaleString()}</div>
                  <span className="text-[11px] text-emerald-600 font-medium">Profit margin ~{Math.round((totalNetProfit / (totalRevenue || 1)) * 100)}%</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900">Location Financial Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100 font-semibold">
                      <tr>
                        <th className="p-3">Location Name</th>
                        <th className="p-3">City / State</th>
                        <th className="p-3">Occupancy</th>
                        <th className="p-3 text-right">Monthly Revenue</th>
                        <th className="p-3 text-right">Expenses</th>
                        <th className="p-3 text-right">Net Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {facilities.map((fac) => (
                        <tr key={fac.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3 font-bold text-slate-900">{fac.name}</td>
                          <td className="p-3">{fac.city}, {fac.state}</td>
                          <td className="p-3 font-semibold text-blue-700">{fac.occupancyRate}%</td>
                          <td className="p-3 font-mono font-bold text-slate-800 text-right">${fac.monthlyRevenue.toLocaleString()}</td>
                          <td className="p-3 font-mono text-slate-500 text-right">${fac.monthlyExpenses.toLocaleString()}</td>
                          <td className={`p-3 font-mono font-bold text-right ${fac.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                            ${fac.netProfit.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SMART INSIGHTS */}
          {activeTab === 'INSIGHTS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INITIAL_AI_INSIGHTS.map((insight) => (
                  <div key={insight.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${insight.type === 'WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        insight.type === 'OPPORTUNITY' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                        {insight.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{insight.impact} IMPACT</span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug">{insight.title}</h4>
                    <p className="text-xs text-slate-600">{insight.description}</p>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-700">
                      <strong className="text-blue-700">Recommendation:</strong> {insight.recommendedAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default DashboardPage;
