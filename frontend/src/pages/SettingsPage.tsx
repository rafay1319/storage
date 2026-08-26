import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { Settings, ShieldCheck, Database } from 'lucide-react';

export function SettingsPage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

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
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              System Settings & Access Controls
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Role-based permissions, multi-factor authentication (2FA), API credentials, and database telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
              <h3 className="font-semibold text-xs text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Security & Access Controls
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <span className="font-medium text-slate-800 block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[10px] text-slate-500">Enforce hardware/TOTP 2FA for staff</span>
                  </div>
                  <span className="text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <span className="font-medium text-slate-800 block">API Rate Limiting</span>
                    <span className="text-[10px] text-slate-500">300 requests / 15 minutes</span>
                  </div>
                  <span className="text-blue-700 font-semibold text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
              <h3 className="font-semibold text-xs text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" /> Database & Cloud Backup
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <span className="font-medium text-slate-800 block">PostgreSQL Replica Sync</span>
                    <span className="text-[10px] text-slate-500">Automated hourly snapshot replication</span>
                  </div>
                  <span className="text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Healthy</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <span className="font-medium text-slate-800 block">Telemetry Webhooks</span>
                    <span className="text-[10px] text-slate-500">Dispatching to 4 external listeners</span>
                  </div>
                  <span className="text-indigo-700 font-semibold text-xs bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">Connected</span>
                </div>
              </div>
            </div>
          </div>
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
