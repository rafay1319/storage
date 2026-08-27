import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import {
  Settings,
  ShieldCheck,
  Bell,
  Building2,
  Check,
  Save,
  Key,
  Globe,
  Smartphone,
  Lock
} from 'lucide-react';

import { useRole } from '@/lib/RoleContext';

export function SettingsPage() {
  const { role: currentRole, setRole: setCurrentRole } = useRole();
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings State
  const [orgName, setOrgName] = useState('ContainerYard Operations LLC');
  const [supportEmail, setSupportEmail] = useState('operations@containeryard.io');
  const [timezone, setTimezone] = useState('America/Chicago (CST)');
  const [currency, setCurrency] = useState('USD ($)');

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [occupancyWarning, setOccupancyWarning] = useState(true);
  const [smsDispatch, setSmsDispatch] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);

  // Security Toggles
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

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
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                System & Workspace Settings
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your organization profile, notification rules, and team access permissions.
              </p>
            </div>

            {savedSuccess && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Preferences saved successfully!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Organization Profile */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Organization & Regional Profile
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Organization Legal Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Operations Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Primary Time Zone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option>America/Chicago (CST)</option>
                    <option>America/New_York (EST)</option>
                    <option>America/Los_Angeles (PST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Base Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>CAD ($)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Rules */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                Notification Preferences
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800 block">Low Occupancy Alert Emails</span>
                    <span className="text-[11px] text-slate-500">Receive warning notifications if any yard dips below 50% capacity</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={occupancyWarning}
                    onChange={(e) => setOccupancyWarning(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800 block">Daily Morning Performance Digest</span>
                    <span className="text-[11px] text-slate-500">Summary email of active leases and revenue run rate</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyDigest}
                    onChange={(e) => setDailyDigest(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800 block">SMS Gate & Tech Dispatch Alerts</span>
                    <span className="text-[11px] text-slate-500">Instant SMS notification for emergency task dispatches</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsDispatch}
                    onChange={(e) => setSmsDispatch(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Security & Access Controls */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Security & Team Permissions
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800 block">Enforce Two-Factor Authentication (2FA)</span>
                    <span className="text-[11px] text-slate-500">Mandate TOTP authenticator app verification for all staff roles</span>
                  </div>
                  <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800 block">Session Inactivity Timeout</span>
                    <span className="text-[11px] text-slate-500">Automatically lock idle terminal sessions</span>
                  </div>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="120">2 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs shadow-blue-500/20 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
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

export default SettingsPage;
