import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { Customer } from '@/lib/types';
import {
  Users,
  Plus,
  Mail,
  Phone,
  MapPin,
  FileText,
  Search,
  ChevronRight,
  X,
  ShieldCheck,
  Box,
  DollarSign,
  MessageSquare,
  Building2,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRole } from '@/lib/RoleContext';

export function CustomersPage() {
  const { role: currentRole, setRole: setCurrentRole } = useRole();
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = INITIAL_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const customerContainers = selectedCustomer
    ? INITIAL_CONTAINERS.filter(c => c.currentCustomerCompany === selectedCustomer.companyName)
    : [];

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
          {/* Top Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Customer & Accounts Directory
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Client directory, active container leases, billing balances, and communication history.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors w-56"
                />
              </div>

              <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs shadow-blue-500/20 transition-all">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Customer</span>
              </button>
            </div>
          </div>

          {/* Customers List View */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                {filteredCustomers.length} Commercial Accounts
              </span>
              <span className="text-[11px] text-slate-400">Click on any account row to open detailed profile</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className="p-4 hover:bg-blue-50/40 transition-colors cursor-pointer flex flex-wrap items-center justify-between gap-4 group"
                >
                  {/* Left: Customer & Company Info */}
                  <div className="flex items-center gap-3 min-w-[240px]">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {cust.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {cust.companyName}
                        </h3>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                          Commercial
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Contact: <strong className="text-slate-700">{cust.name}</strong> • {cust.email}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Phone & Location */}
                  <div className="text-xs text-slate-600 space-y-0.5">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-cyan-600" />
                      {cust.phone}
                    </p>
                    <p className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {cust.address}
                    </p>
                  </div>

                  {/* Right: Leases & Balance */}
                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Leases</span>
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mt-0.5">
                        {cust.activeRentalsCount} Containers
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Balance</span>
                      <span className={`font-mono font-bold block mt-0.5 ${cust.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        ${cust.outstandingBalance.toFixed(2)}
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* DETAILED VIEW MODAL FOR CUSTOMER */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
                  {selectedCustomer.companyName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{selectedCustomer.companyName}</h2>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Active Account
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Primary Contact: <strong className="text-slate-800">{selectedCustomer.name}</strong> • Tax ID: {selectedCustomer.govId}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content Scroll */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Financial Snapshot */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Leases</span>
                  <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">
                    {selectedCustomer.activeRentalsCount} Container Units
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ledger Balance</span>
                  <span className={`text-sm font-bold font-mono mt-0.5 block ${selectedCustomer.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-700'
                    }`}>
                    ${selectedCustomer.outstandingBalance.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Account Health</span>
                  <span className="text-sm font-bold text-emerald-700 mt-0.5 block">
                    Good Standing
                  </span>
                </div>
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Communication Channels</span>
                  <p className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    {selectedCustomer.email}
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-cyan-600" />
                    {selectedCustomer.phone}
                  </p>
                  <p className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Emergency: {selectedCustomer.emergencyContact}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billing Address & Notes</span>
                  <p className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {selectedCustomer.address}
                  </p>
                  <p className="text-slate-600 italic mt-1">
                    {selectedCustomer.notes || 'No special handling instructions recorded.'}
                  </p>
                </div>
              </div>

              {/* Leased Container Units */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-blue-600" />
                  Currently Leased Units ({customerContainers.length})
                </h4>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {customerContainers.map((c) => (
                    <div key={c.id} className="p-3 flex items-center justify-between text-xs bg-white hover:bg-slate-50">
                      <div>
                        <span className="font-mono font-bold text-slate-800 block">{c.containerNumber}</span>
                        <span className="text-[11px] text-slate-500">{c.facilityName} • {c.size} ({c.type})</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200">
                          Active Lease
                        </span>
                        <span className="font-mono font-bold text-slate-900">${c.rentalPrice}/mo</span>
                      </div>
                    </div>
                  ))}
                  {customerContainers.length === 0 && (
                    <p className="p-3 text-center text-slate-400">No active container units currently assigned.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Link
                to="/messages"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Direct Message Client</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default CustomersPage;
