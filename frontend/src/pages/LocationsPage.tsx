'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { YardMapCanvas } from '@/components/map/YardMapCanvas';
import { ContainerDetailModal } from '@/components/map/ContainerDetailModal';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS, INITIAL_FEED_ITEMS } from '@/lib/mockData';
import { Facility, Container, ContainerStatus, ContainerSize } from '@/lib/types';
import {
  MapPin,
  Plus,
  Phone,
  Clock,
  Search,
  X,
  Warehouse,
  DollarSign,
  Box,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Layers,
  Sparkles,
  Filter,
  Grid,
  List,
  Wrench,
  Camera,
  AlertTriangle,
  QrCode,
  Download,
  Calendar,
  Zap,
  Maximize2
} from 'lucide-react';

import { useRole } from '@/lib/RoleContext';

export function LocationsPage() {
  const params = useParams<{ facilityId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { role: currentRole, setRole: setCurrentRole } = useRole();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Location state
  const activeLocationId = params.facilityId || searchParams.get('id') || null;
  const activeLocation = activeLocationId
    ? INITIAL_FACILITIES.find(f => f.id === activeLocationId || f.code.toLowerCase() === activeLocationId.toLowerCase()) || null
    : null;

  // View state inside location
  const [viewMode, setViewMode] = useState<'MAP' | 'TABLE'>('MAP');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sizeFilter, setSizeFilter] = useState<string>('ALL');
  const [unitSearchQuery, setUnitSearchQuery] = useState('');

  // Containers & Selection
  const [containers, setContainers] = useState<Container[]>(INITIAL_CONTAINERS);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Unit Modal
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [newUnitNumber, setNewUnitNumber] = useState('');
  const [newUnitSize, setNewUnitSize] = useState<ContainerSize>('20ft');
  const [newUnitType, setNewUnitType] = useState<string>('Storage');
  const [newUnitRent, setNewUnitRent] = useState('450');

  // Keep Header synced
  useEffect(() => {
    if (activeLocation) {
      setSelectedFacilityId(activeLocation.id);
    } else {
      setSelectedFacilityId('ALL');
    }
  }, [activeLocation]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectLocation = (fac: Facility) => {
    navigate(`/locations/${fac.id}`);
  };

  const handleBackToDirectory = () => {
    navigate('/locations');
  };

  // Filtered facilities for directory
  const filteredFacilities = INITIAL_FACILITIES.filter(fac =>
    fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fac.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fac.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fac.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered containers for active location
  const locationContainers = activeLocation
    ? containers.filter(c => c.facilityId === activeLocation.id)
    : [];

  const filteredLocationContainers = locationContainers.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (sizeFilter !== 'ALL' && c.size !== sizeFilter) return false;
    if (unitSearchQuery.trim()) {
      const q = unitSearchQuery.toLowerCase();
      const matchNum = c.containerNumber.toLowerCase().includes(q);
      const matchType = c.type.toLowerCase().includes(q);
      const matchCustomer = c.currentCustomerCompany?.toLowerCase().includes(q) || c.currentCustomerName?.toLowerCase().includes(q);
      return matchNum || matchType || matchCustomer;
    }
    return true;
  });

  // Recent reports for active location
  const locationReports = activeLocation
    ? INITIAL_FEED_ITEMS.filter(item => item.facilityId === activeLocation.id)
    : [];

  // Recent tasks for active location
  const locationTasks = activeLocation
    ? INITIAL_TASKS.filter(task => task.facilityId === activeLocation.id)
    : [];

  // Add new unit handler
  const handleAddNewUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLocation) return;

    const newUnit: Container = {
      id: `c-${Date.now()}`,
      containerNumber: newUnitNumber || `UNT-${Math.floor(1000 + Math.random() * 9000)}`,
      facilityId: activeLocation.id,
      facilityName: activeLocation.name,
      size: newUnitSize,
      type: newUnitType as any,
      status: 'Available',
      rentalPrice: Number(newUnitRent) || 450,
      purchaseCost: 5000,
      currentValue: 4500,
      insuranceValue: 6500,
      posX: locationContainers.length % activeLocation.gridCols,
      posY: Math.floor(locationContainers.length / activeLocation.gridCols) % activeLocation.gridRows,
      qrCode: `QR-${newUnitNumber}`,
      barcode: `BC-${newUnitNumber}`,
      lastInspectedAt: new Date().toISOString().split('T')[0],
      photos: []
    };

    setContainers(prev => [...prev, newUnit]);
    setIsAddUnitModalOpen(false);
    setNewUnitNumber('');
    showToast(`✅ Container ${newUnit.containerNumber} added to ${activeLocation.name}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          facilities={INITIAL_FACILITIES}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={(facId) => {
            setSelectedFacilityId(facId);
            if (facId === 'ALL') {
              navigate('/locations');
            } else {
              navigate(`/locations/${facId}`);
            }
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* ========================================================================= */}
        {/* VIEW 1: DEDICATED FULL-PAGE LOCATION & YARD MAP VIEW                      */}
        {/* ========================================================================= */}
        {activeLocation ? (
          <main className="flex-1 p-5 md:p-7 max-w-7xl w-full mx-auto space-y-6">

            {/* Top Navigation & Breadcrumb Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToDirectory}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Locations</span>
                </button>

                <div className="h-4 w-px bg-slate-200" />

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Locations Directory</span>
                  <span className="text-slate-300">/</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    {activeLocation.name}
                    <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                      {activeLocation.code}
                    </span>
                  </span>
                </div>
              </div>

              {/* Location Quick Switcher */}
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">Switch Yard:</span>
                <select
                  value={activeLocation.id}
                  onChange={(e) => navigate(`/locations/${e.target.value}`)}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  {INITIAL_FACILITIES.map(fac => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Facility Hero Banner */}
            <div className="relative rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-slate-900 text-white">
              <div className="absolute inset-0 z-0">
                <img
                  src={activeLocation.photos[0]}
                  alt={activeLocation.name}
                  className="w-full h-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              </div>

              <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/50">
                      {activeLocation.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Operations
                    </span>
                    <span className="text-[10px] text-slate-300">
                      GPS: {activeLocation.gpsLat}° N, {activeLocation.gpsLng}° W
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    {activeLocation.name}
                  </h1>

                  <p className="text-xs md:text-sm text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{activeLocation.address}, {activeLocation.city}, {activeLocation.state} {activeLocation.country}</span>
                  </p>

                  <p className="text-xs text-slate-300/90 leading-relaxed pt-1">
                    {activeLocation.notes || 'Equipped with heavy-duty reach stackers, 24/7 automated security gate, and high-density container bays.'}
                  </p>
                </div>

                {/* Hero Actions */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setIsAddUnitModalOpen(true)}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Unit to Yard</span>
                  </button>

                  <Link
                    to="/messages"
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl backdrop-blur-md border border-white/20 transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-cyan-300" />
                    <span>Contact Manager</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Core Metrics Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Capacity Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Yard Capacity</span>
                  <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                    {activeLocation.occupancyRate}% Fill Rate
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {locationContainers.filter(c => c.status === 'Occupied').length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ {activeLocation.totalContainers} Total Units</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${activeLocation.occupancyRate}%` }}
                  />
                </div>
              </div>

              {/* Monthly Revenue */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Monthly Gross Revenue</span>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-emerald-700">
                    ${activeLocation.monthlyRevenue.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +8.4%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Recurring commercial leases</p>
              </div>

              {/* Operating Expenses */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Monthly Expenses</span>
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-800">
                    ${activeLocation.monthlyExpenses.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">OPEX</span>
                </div>
                <p className="text-[11px] text-slate-400">Forklifts, power, yard lease</p>
              </div>

              {/* Net Operating Profit */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Net Operating Income</span>
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-blue-700">
                    ${activeLocation.netProfit.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-blue-600 font-semibold">Net / mo</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Grid: {activeLocation.gridRows} Rows × {activeLocation.gridCols} Cols
                </p>
              </div>
            </div>

            {/* Manager & Facility Operations Details Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Yard Facility Manager</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm">
                    {activeLocation.managerName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{activeLocation.managerName}</h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-blue-600" /> {activeLocation.contactNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Access & Operating Hours</span>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{activeLocation.operatingHours}</span>
                </div>
                <p className="text-[11px] text-slate-500">Automated RFID gate badge access 24/7</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">On-Site Capabilities</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    45t Reach Stacker
                  </span>
                  <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Hazmat Certified
                  </span>
                  <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    480V Reefer Plugs
                  </span>
                </div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* SECTION: INTERACTIVE YARD MAP & UNITS INVENTORY                       */}
            {/* ===================================================================== */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-0">
              {/* Map Header & Controls */}
              <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-gradient-to-r from-white via-white to-slate-50/50">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-blue-600" />
                      Yard Units Map View & Spatial Grid
                    </span>
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {locationContainers.length} Units Located
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Interactive 2D container layout for {activeLocation.name}. Click any unit to inspect tenant, lease, and maintenance status.
                  </p>
                </div>

                {/* Filters & View Switcher */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Available">Available (Green)</option>
                    <option value="Occupied">Occupied (Red)</option>
                    <option value="Reserved">Reserved (Amber)</option>
                    <option value="Maintenance">Maintenance (Blue)</option>
                    <option value="Cleaning">Cleaning (Purple)</option>
                  </select>

                  {/* Size Filter */}
                  <select
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                  >
                    <option value="ALL">All Sizes</option>
                    <option value="20ft">20ft Units</option>
                    <option value="40ft">40ft Units</option>
                    <option value="45ft">45ft High Cube</option>
                  </select>

                  {/* Search Unit */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search unit #..."
                      value={unitSearchQuery}
                      onChange={(e) => setUnitSearchQuery(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-36"
                    />
                  </div>

                  {/* View Mode Toggle: Map vs Table */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setViewMode('MAP')}
                      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${viewMode === 'MAP'
                          ? 'bg-white text-blue-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>Map</span>
                    </button>
                    <button
                      onClick={() => setViewMode('TABLE')}
                      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${viewMode === 'TABLE'
                          ? 'bg-white text-blue-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>List</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Map Canvas / Table Content */}
              <div className="p-4 md:p-6 bg-slate-50/40">
                {viewMode === 'MAP' ? (
                  <YardMapCanvas
                    containers={filteredLocationContainers}
                    gridRows={activeLocation.gridRows}
                    gridCols={activeLocation.gridCols}
                    onSelectContainer={(c) => setSelectedContainer(c)}
                    onUpdateContainerPositions={(updated) => {
                      setContainers(prev => {
                        const otherContainers = prev.filter(c => c.facilityId !== activeLocation.id);
                        return [...otherContainers, ...updated];
                      });
                      showToast('Yard container positions updated');
                    }}
                  />
                ) : (
                  /* Tabular Inventory View */
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 font-semibold">
                            <th className="p-3">Container #</th>
                            <th className="p-3">Size & Type</th>
                            <th className="p-3">Grid Slot</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Current Tenant</th>
                            <th className="p-3">Monthly Rent</th>
                            <th className="p-3">Last Inspected</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredLocationContainers.map((c) => (
                            <tr
                              key={c.id}
                              onClick={() => setSelectedContainer(c)}
                              className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                            >
                              <td className="p-3 font-mono font-bold text-slate-900">
                                {c.containerNumber}
                              </td>
                              <td className="p-3">
                                <span className="font-semibold text-slate-800">{c.size}</span>{' '}
                                <span className="text-slate-500">({c.type})</span>
                              </td>
                              <td className="p-3 font-mono text-slate-600">
                                Row {c.posY + 1}, Col {c.posX + 1}
                              </td>
                              <td className="p-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.status === 'Occupied' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                    c.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                      c.status === 'Reserved' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        'bg-blue-50 text-blue-700 border-blue-200'
                                  }`}>
                                  {c.status}
                                </span>
                              </td>
                              <td className="p-3 text-slate-700 font-medium">
                                {c.currentCustomerCompany || (
                                  <span className="text-slate-400 italic">Unassigned</span>
                                )}
                              </td>
                              <td className="p-3 font-mono font-bold text-emerald-700">
                                ${c.rentalPrice}/mo
                              </td>
                              <td className="p-3 text-slate-500 font-mono text-[11px]">
                                {c.lastInspectedAt || '2026-07-28'}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedContainer(c);
                                  }}
                                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-all"
                                >
                                  Inspect Unit
                                </button>
                              </td>
                            </tr>
                          ))}
                          {filteredLocationContainers.length === 0 && (
                            <tr>
                              <td colSpan={8} className="p-6 text-center text-slate-400">
                                No container units match your filter criteria.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Location Reports & Field Submissions */}
            {locationReports.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-blue-600" />
                    Recent Field Reports for this Yard ({locationReports.length})
                  </h3>
                  <Link to="/feed" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    View Full Feed →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {locationReports.map(rep => (
                    <div key={rep.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={rep.actorAvatar} alt={rep.actorName} className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-xs font-bold text-slate-800">{rep.actorName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{rep.timestamp}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{rep.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{rep.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: STORAGE LOCATIONS & YARDS DIRECTORY OVERVIEW                       */
          /* ========================================================================= */
          <main className="flex-1 p-5 md:p-7 max-w-7xl w-full mx-auto space-y-6">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Warehouse className="w-5 h-5 text-blue-600" />
                  Storage Locations & Yards Directory
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse physical storage yards across your portfolio. Click any location card to open its dedicated full-page map view.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search yards, cities, codes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors w-60 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Locations Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFacilities.map((fac) => {
                const facContainers = containers.filter(c => c.facilityId === fac.id);
                return (
                  <div
                    key={fac.id}
                    onClick={() => handleSelectLocation(fac)}
                    className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Facility Photo Header */}
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={fac.photos[0]}
                          alt={fac.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs border border-white/20">
                            {fac.code}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-emerald-700/60">
                            {fac.occupancyRate}% Occupancy
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h2 className="text-base font-bold group-hover:text-blue-300 transition-colors leading-tight">
                            {fac.name}
                          </h2>
                          <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>{fac.address}, {fac.city}, {fac.state}</span>
                          </p>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-[9px] uppercase font-semibold text-slate-400 block">Total Units</span>
                            <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 block">
                              {fac.occupiedContainers} / {fac.totalContainers}
                            </span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-[9px] uppercase font-semibold text-slate-400 block">Monthly Rev</span>
                            <span className="font-mono font-bold text-emerald-700 text-xs mt-0.5 block">
                              ${fac.monthlyRevenue.toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-[9px] uppercase font-semibold text-slate-400 block">Grid Layout</span>
                            <span className="font-mono font-bold text-blue-700 text-xs mt-0.5 block">
                              {fac.gridRows}×{fac.gridCols} Bays
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                          <span className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Phone className="w-3 h-3 text-blue-600" />
                            Manager: <strong className="text-slate-800">{fac.managerName}</strong>
                          </span>
                          <span className="text-[11px] text-slate-400">{fac.operatingHours}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Button */}
                    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {facContainers.length} Container Units Plotted
                      </span>
                      <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                        <span>Open Yard Map Page</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD CONTAINER UNIT TO ACTIVE YARD                                  */}
      {/* ========================================================================= */}
      {isAddUnitModalOpen && activeLocation && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                  Yard Inventory Dispatch
                </span>
                <h3 className="font-bold text-sm text-slate-900">Add Container to {activeLocation.name}</h3>
              </div>
              <button
                onClick={() => setIsAddUnitModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewUnit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Container Serial Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ATX-2015"
                  value={newUnitNumber}
                  onChange={(e) => setNewUnitNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono uppercase font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Size</label>
                  <select
                    value={newUnitSize}
                    onChange={(e) => setNewUnitSize(e.target.value as ContainerSize)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                  >
                    <option value="20ft">20ft Standard</option>
                    <option value="40ft">40ft High Cube</option>
                    <option value="45ft">45ft Extended</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Type</label>
                  <select
                    value={newUnitType}
                    onChange={(e) => setNewUnitType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                  >
                    <option value="Storage">Dry Storage</option>
                    <option value="Climate Controlled">Climate Controlled</option>
                    <option value="Refrigerated">Refrigerated (Reefer)</option>
                    <option value="Hazardous">Hazardous Certified</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Monthly Rental Rate ($)</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  <input
                    type="number"
                    value={newUnitRent}
                    onChange={(e) => setNewUnitRent(e.target.value)}
                    className="bg-transparent w-full focus:outline-none font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUnitModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  Place Unit on Yard Grid
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
        containers={containers}
        customers={INITIAL_CUSTOMERS}
        tasks={INITIAL_TASKS}
        onSelectContainer={(c) => setSelectedContainer(c)}
      />

      {/* Container Detail Modal Inspector */}
      <ContainerDetailModal
        container={selectedContainer}
        onClose={() => setSelectedContainer(null)}
      />
    </div>
  );
}

export default LocationsPage;
