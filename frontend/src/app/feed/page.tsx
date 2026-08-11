'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS, INITIAL_FEED_ITEMS } from '@/lib/mockData';
import { FeedItem, FeedCategory } from '@/lib/types';
import { 
  Activity, 
  Search, 
  Play, 
  Pause, 
  Plus, 
  RefreshCw, 
  Truck, 
  DollarSign, 
  ClipboardCheck, 
  AlertTriangle, 
  Sparkles, 
  Wrench, 
  Box, 
  User, 
  ArrowUpRight, 
  ChevronRight, 
  CheckCircle2, 
  ShieldAlert,
  SlidersHorizontal,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function LiveFeedPage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedItems, setFeedItems] = useState<FeedItem[]>(INITIAL_FEED_ITEMS);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [expandedFeedId, setExpandedFeedId] = useState<string | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Auto-stream simulation effect
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      const sampleEvents: Partial<FeedItem>[] = [
        {
          category: 'GATE_MOVE',
          title: 'Automated RFID Gate Scan - Gate 1',
          description: 'Flatbed haulage driver checked in container LBH-1008 for Pacific Rim Freight.',
          facilityId: 'fac-002',
          facilityName: 'Long Beach Harbor Storage',
          containerNumber: 'LBH-1008',
          customerName: 'Pacific Rim Freight',
          actorName: 'RFID Gate Reader #1',
          actorRole: 'Automated Yard Scanner',
          severity: 'info',
          actionable: true,
          actionLabel: 'View RFID Scan Log',
          metadata: { scanTime: new Date().toLocaleTimeString(), rfidTag: 'RFID-99410-LBH' }
        },
        {
          category: 'AI_ALERT',
          title: 'Yard Security Perimeter Scan Clear',
          description: 'Thermal camera AI sweep completed at Austin Port Terminal Yard. Zero unauthorized movements detected.',
          facilityId: 'fac-001',
          facilityName: 'Austin Port Terminal Yard',
          actorName: 'CY AI Vision',
          actorRole: 'Security AI Engine',
          severity: 'success',
          actionable: false,
          metadata: { zone: 'Perimeter West', camerasActive: 12 }
        },
        {
          category: 'RENTAL_PAYMENT',
          title: 'Instant Credit Card Payment Cleared',
          description: 'Payment of $750.00 received for monthly lease of container ATX-2024.',
          facilityId: 'fac-001',
          facilityName: 'Austin Port Terminal Yard',
          containerNumber: 'ATX-2024',
          customerName: 'Apex Global Logistics',
          actorName: 'Stripe Gateway',
          actorRole: 'Payment Automation',
          severity: 'success',
          actionable: true,
          actionLabel: 'View Receipt',
          metadata: { transactionId: 'txn_' + Math.random().toString(36).substring(2, 9) }
        }
      ];

      const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      const newFeedItem: FeedItem = {
        id: 'feed-' + Date.now(),
        timestamp: 'Just now',
        category: randomEvent.category as FeedCategory,
        title: randomEvent.title!,
        description: randomEvent.description!,
        facilityId: randomEvent.facilityId,
        facilityName: randomEvent.facilityName,
        containerNumber: randomEvent.containerNumber,
        customerName: randomEvent.customerName,
        actorName: randomEvent.actorName!,
        actorRole: randomEvent.actorRole!,
        severity: randomEvent.severity as any,
        actionable: randomEvent.actionable,
        actionLabel: randomEvent.actionLabel,
        metadata: randomEvent.metadata
      };

      setFeedItems(prev => [newFeedItem, ...prev]);
    }, 18000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const handleSimulateNewEvent = () => {
    const simItem: FeedItem = {
      id: 'feed-' + Date.now(),
      timestamp: 'Just now',
      category: 'GATE_MOVE',
      title: 'Manual Gate Entry Dispatch',
      description: 'Dispatched heavy forklift to move container ATX-2004 to Bay 4 for scheduled customer pickup.',
      facilityId: 'fac-001',
      facilityName: 'Austin Port Terminal Yard',
      containerNumber: 'ATX-2004',
      actorName: currentRole === 'OWNER_ADMIN' ? 'Executive Owner' : 'Yard Manager',
      actorRole: 'Manual Dispatch',
      severity: 'info',
      actionable: true,
      actionLabel: 'View Movement Ticket',
      metadata: { targetBay: 'Bay 4', priority: 'Immediate' }
    };
    setFeedItems(prev => [simItem, ...prev]);
    showToast('Simulated live yard event injected into feed stream!');
  };

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3000);
  };

  // Filter items based on facility, category tab, and search query
  const filteredFeedItems = useMemo(() => {
    return feedItems.filter((item) => {
      // Facility filter
      if (selectedFacilityId !== 'ALL' && item.facilityId && item.facilityId !== selectedFacilityId) {
        return false;
      }
      // Category filter
      if (activeCategory !== 'ALL' && item.category !== activeCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchContainer = item.containerNumber?.toLowerCase().includes(q);
        const matchCustomer = item.customerName?.toLowerCase().includes(q);
        const matchActor = item.actorName.toLowerCase().includes(q);
        const matchFacility = item.facilityName?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchContainer && !matchCustomer && !matchActor && !matchFacility) {
          return false;
        }
      }
      return true;
    });
  }, [feedItems, selectedFacilityId, activeCategory, searchQuery]);

  // Aggregate metrics
  const totalEventsCount = feedItems.length;
  const dangerAlertsCount = feedItems.filter(i => i.severity === 'danger').length;
  const gateMovesCount = feedItems.filter(i => i.category === 'GATE_MOVE').length;
  const paymentsCount = feedItems.filter(i => i.category === 'RENTAL_PAYMENT').length;

  const categoryIcons: Record<FeedCategory, React.ReactNode> = {
    GATE_MOVE: <Truck className="w-4 h-4 text-blue-400" />,
    RENTAL_PAYMENT: <DollarSign className="w-4 h-4 text-emerald-400" />,
    INSPECTION: <ClipboardCheck className="w-4 h-4 text-purple-400" />,
    AI_ALERT: <Sparkles className="w-4 h-4 text-indigo-400" />,
    MAINTENANCE: <Wrench className="w-4 h-4 text-amber-400" />
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'danger':
        return <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Critical</span>;
      case 'warning':
        return <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Warning</span>;
      case 'success':
        return <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Success</span>;
      default:
        return <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">Info</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          facilities={INITIAL_FACILITIES}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={setSelectedFacilityId}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Feed Body */}
        <main className="p-8 space-y-6 overflow-y-auto">
          {/* Toast Notification banner */}
          {notificationToast && (
            <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-semibold">{notificationToast}</span>
            </div>
          )}

          {/* Page Title & Stream Controller */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isLiveStreaming ? 'animate-ping' : ''}`}></span>
                  {isLiveStreaming ? 'Live Stream Active' : 'Stream Paused'}
                </span>
                <span className="text-xs text-slate-400">• Operations Telemetry Hub</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400" /> Live Yard Activity & Telemetry Feed
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Real-time audit log of container gate movements, RFID scans, IoT temperature telemetry, digital lease transactions, and AI safety alerts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all ${
                  isLiveStreaming
                    ? 'bg-slate-900 text-amber-300 border-amber-500/30 hover:bg-amber-500/10'
                    : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500'
                }`}
              >
                {isLiveStreaming ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Live Stream</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Resume Stream</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSimulateNewEvent}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Simulate Event</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stream Events</p>
                <p className="text-2xl font-black text-white font-mono mt-0.5">{totalEventsCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical IoT & AI Alerts</p>
                <p className="text-2xl font-black text-rose-400 font-mono mt-0.5">{dangerAlertsCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gate Check-Ins / Moves</p>
                <p className="text-2xl font-black text-cyan-400 font-mono mt-0.5">{gateMovesCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Auto Lease Payments</p>
                <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">{paymentsCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter events, containers, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {[
                  { id: 'ALL', label: 'All Activity' },
                  { id: 'GATE_MOVE', label: 'Gate & Moves' },
                  { id: 'RENTAL_PAYMENT', label: 'Leases & Payments' },
                  { id: 'INSPECTION', label: 'Inspections' },
                  { id: 'AI_ALERT', label: 'AI & Safety' },
                  { id: 'MAINTENANCE', label: 'Maintenance' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      activeCategory === tab.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Stream Container */}
          <div className="relative space-y-4">
            {/* Timeline vertical connector line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-800 hidden sm:block"></div>

            {filteredFeedItems.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center space-y-3">
                <SlidersHorizontal className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No matching feed events</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search criteria or category filter to view container yard activity.
                </p>
                <button
                  onClick={() => { setActiveCategory('ALL'); setSearchQuery(''); setSelectedFacilityId('ALL'); }}
                  className="bg-slate-800 text-xs font-semibold text-blue-400 px-4 py-2 rounded-xl hover:bg-slate-700 transition-all"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredFeedItems.map((item) => {
                const isExpanded = expandedFeedId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`relative bg-slate-900 border rounded-2xl p-5 shadow-lg transition-all duration-200 ${
                      item.severity === 'danger'
                        ? 'border-rose-500/40 bg-rose-950/10'
                        : item.severity === 'warning'
                        ? 'border-amber-500/30 bg-amber-950/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {/* Event category icon badge */}
                      <div className="z-10 w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-md">
                        {categoryIcons[item.category] || <Activity className="w-4 h-4 text-blue-400" />}
                      </div>

                      {/* Event main details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-white">{item.title}</h3>
                            {getSeverityBadge(item.severity)}
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {item.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Metadata Tag Pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                          {item.facilityName && (
                            <span className="bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1">
                              <Box className="w-3 h-3 text-blue-400" />
                              {item.facilityName}
                            </span>
                          )}

                          {item.containerNumber && (
                            <span className="bg-slate-950 border border-blue-500/30 text-blue-400 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold">
                              #{item.containerNumber}
                            </span>
                          )}

                          {item.customerName && (
                            <span className="bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1">
                              <User className="w-3 h-3 text-indigo-400" />
                              {item.customerName}
                            </span>
                          )}

                          <span className="text-[11px] text-slate-400 ml-auto">
                            Logged by <strong className="text-slate-200">{item.actorName}</strong> ({item.actorRole})
                          </span>
                        </div>

                        {/* Expandable Metadata drawer */}
                        {isExpanded && item.metadata && (
                          <div className="mt-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attached Telemetry Payload</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                              {Object.entries(item.metadata).map(([key, val]) => (
                                <div key={key} className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
                                  <span className="text-slate-500 text-[10px] block">{key}</span>
                                  <span className="text-cyan-300 font-semibold">{String(val)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Event Footer Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                          {item.metadata ? (
                            <button
                              onClick={() => setExpandedFeedId(isExpanded ? null : item.id)}
                              className="text-[11px] font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90 text-blue-400' : ''}`} />
                              <span>{isExpanded ? 'Hide Telemetry Specs' : 'View Telemetry Specs'}</span>
                            </button>
                          ) : (
                            <span />
                          )}

                          {item.actionable && item.actionLabel && (
                            <button
                              onClick={() => showToast(`Executed: "${item.actionLabel}" for event ${item.id}`)}
                              className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all"
                            >
                              <span>{item.actionLabel}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        facilities={INITIAL_FACILITIES}
        containers={INITIAL_CONTAINERS}
        customers={INITIAL_CUSTOMERS}
        tasks={INITIAL_TASKS}
        onSelectContainer={() => {}}
      />
    </div>
  );
}
