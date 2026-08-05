'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Warehouse, 
  Map, 
  Box, 
  Users, 
  FileText, 
  ClipboardCheck, 
  DollarSign, 
  Sparkles, 
  Settings,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, onRoleChange }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Facilities', href: '/facilities', icon: Warehouse },
    { name: 'Visual Yard Map', href: '/map', icon: Map },
    { name: 'Containers', href: '/containers', icon: Box },
    { name: 'Customers & CRM', href: '/customers', icon: Users },
    { name: 'Rentals & Leases', href: '/rentals', icon: FileText },
    { name: 'Tasks & Inspection', href: '/tasks', icon: ClipboardCheck },
    { name: 'Financial Accounting', href: '/finance', icon: DollarSign },
    { name: 'AI Intelligence', href: '/ai-insights', icon: Sparkles },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold text-xl">
          CY
        </div>
        <div>
          <h1 className="font-bold text-white tracking-wide text-base leading-tight">ContainerYard</h1>
          <p className="text-xs text-cyan-400 font-medium tracking-wider uppercase">SaaS Enterprise</p>
        </div>
      </div>

      {/* Role Switcher Pills */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/40">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Active Persona Role</label>
        <select 
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-xs font-semibold text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="OWNER_ADMIN">👑 Executive Owner</option>
          <option value="FACILITY_MANAGER">🏢 Yard Facility Manager</option>
          <option value="EMPLOYEE">🔧 Field Service Tech</option>
          <option value="CUSTOMER">👤 Customer Portal View</option>
        </select>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border-l-4 border-blue-500 font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              <span>{item.name}</span>
              {item.name === 'AI Intelligence' && (
                <span className="ml-auto text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded-full animate-pulse">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Security Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>RBAC Protected</span>
        </div>
        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">v1.4.2</span>
      </div>
    </aside>
  );
};
