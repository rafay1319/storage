'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { Settings, ShieldCheck, Key, Lock, Bell, Database } from 'lucide-react';

export default function SettingsPage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

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

        <main className="p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-slate-400" /> Platform Settings & Security
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Role-based access control (RBAC), multi-factor authentication (2FA), API keys, and audit logging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Security & Access Controls
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div>
                    <span className="font-bold text-white block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[11px] text-slate-400">Enforce 2FA for all yard managers</span>
                  </div>
                  <span className="text-emerald-400 font-bold">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div>
                    <span className="font-bold text-white block">API Rate Limiting</span>
                    <span className="text-[11px] text-slate-400">300 requests / 15 minutes</span>
                  </div>
                  <span className="text-cyan-400 font-bold">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" /> Database & Cloud Backup
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div>
                    <span className="font-bold text-white block">PostgreSQL Replica Sync</span>
                    <span className="text-[11px] text-slate-400">Automated hourly snapshot</span>
                  </div>
                  <span className="text-emerald-400 font-bold">Healthy</span>
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
