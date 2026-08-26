import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';

interface SidebarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, onRoleChange }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Live Feed', href: '/feed', icon: Activity, badge: 'LIVE', badgeColor: 'emerald' },
    { name: 'Facilities', href: '/facilities', icon: Warehouse },
    { name: 'Visual Yard Map', href: '/map', icon: Map },
    { name: 'Containers', href: '/containers', icon: Box },
    { name: 'Customers & CRM', href: '/customers', icon: Users },
    { name: 'Rentals & Leases', href: '/rentals', icon: FileText },
    { name: 'Tasks & Inspection', href: '/tasks', icon: ClipboardCheck },
    { name: 'Financial Accounting', href: '/finance', icon: DollarSign },
    { name: 'AI Intelligence', href: '/ai-insights', icon: Sparkles, badge: 'AI', badgeColor: 'indigo' },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 text-slate-600 flex flex-col h-screen sticky top-0 z-30 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-sm">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-slate-900 tracking-tight text-sm">ContainerYard</h1>
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded font-mono">PRO</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Yard Management OS</p>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Active Persona</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>
        <select 
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full bg-white border border-slate-200 text-[11px] font-medium text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer shadow-xs"
        >
          <option value="OWNER_ADMIN">👑 Executive Owner</option>
          <option value="FACILITY_MANAGER">🏢 Yard Facility Manager</option>
          <option value="EMPLOYEE">🔧 Field Service Tech</option>
          <option value="CUSTOMER">👤 Customer Portal View</option>
        </select>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        <div className="px-2.5 pb-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Navigation</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="truncate">{item.name}</span>

              {item.badge === 'LIVE' && (
                <span className="ml-auto flex items-center gap-1 text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
                  LIVE
                </span>
              )}
              {item.badge === 'AI' && (
                <span className="ml-auto text-[9px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 px-1.5 py-0.5 rounded">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Security Status Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[10px] font-medium">RBAC Security Active</span>
        </div>
        <span className="text-[9px] bg-slate-200/70 px-1.5 py-0.5 rounded text-slate-600 font-mono">v1.4</span>
      </div>
    </aside>
  );
};
