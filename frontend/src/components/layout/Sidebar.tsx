'use client';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  ClipboardCheck,
  MessageSquare,
  Settings,
  ShieldCheck,
  Layers,
  Camera,
  DollarSign,
  Box,
  CreditCard,
  Wrench,
  UserCheck
} from 'lucide-react';
import { useRole } from '@/lib/RoleContext';
import { Role } from '@/lib/types';

interface SidebarProps {
  currentRole?: Role | string;
  onRoleChange?: (role: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole: propRole, onRoleChange: propOnRoleChange }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { role, setRole, roleDescription } = useRole();

  const activeRole = role;

  const handleRoleChange = (newRole: string) => {
    setRole(newRole as Role);
    if (propOnRoleChange) propOnRoleChange(newRole);
  };

  // Role-specific navigation menus
  const getNavItemsForRole = (role: Role) => {
    switch (role) {
      case 'EMPLOYEE':
        return [
          { name: 'Field Reports', href: '/feed', icon: Camera, badge: 'Tech Hub' },
          { name: 'My Tasks & Repairs', href: '/tasks', icon: ClipboardCheck, badge: 'Work' },
          { name: 'Yard Map & Slots', href: '/locations', icon: MapPin },
          { name: 'Messages & Comms', href: '/messages', icon: MessageSquare },
        ];

      case 'CUSTOMER':
        return [
          { name: 'My Units & Leases', href: '/customers', icon: Box, badge: 'Tenant' },
          { name: 'Invoices & Billing', href: '/finance', icon: DollarSign },
          { name: 'Request Service', href: '/tasks', icon: Wrench },
          { name: 'Manager Support', href: '/messages', icon: MessageSquare },
        ];

      case 'FACILITY_MANAGER':
        return [
          { name: 'Yard Dashboard', href: '/', icon: LayoutDashboard },
          { name: 'Field Reports', href: '/feed', icon: Camera, badge: 'Approvals' },
          { name: 'Yard Map & Units', href: '/locations', icon: MapPin },
          { name: 'Active Tenants', href: '/customers', icon: Users },
          { name: 'Task Dispatch', href: '/tasks', icon: ClipboardCheck },
          { name: 'Messages', href: '/messages', icon: MessageSquare },
        ];

      case 'OWNER_ADMIN':
      default:
        return [
          { name: 'Portfolio Dashboard', href: '/', icon: LayoutDashboard },
          { name: 'Field Reports', href: '/feed', icon: Camera },
          { name: 'Locations & Yards', href: '/locations', icon: MapPin },
          { name: 'Customers & Leases', href: '/customers', icon: Users },
          { name: 'Financial Reports', href: '/finance', icon: DollarSign, badge: 'P&L' },
          { name: 'Tasks & Operations', href: '/tasks', icon: ClipboardCheck },
          { name: 'Messages', href: '/messages', icon: MessageSquare },
        ];
    }
  };

  const navItems = getNavItemsForRole(activeRole);

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'OWNER_ADMIN': return { label: 'Executive Owner', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'FACILITY_MANAGER': return { label: 'Yard Manager', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
      case 'EMPLOYEE': return { label: 'Field Tech', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'CUSTOMER': return { label: 'Tenant Portal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      default: return { label: 'Executive', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    }
  };

  const roleBadge = getRoleBadge(activeRole);

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

      {/* Role / Persona Switcher */}
      <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Active Role</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
        <select
          value={activeRole}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="w-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer shadow-xs"
        >
          <option value="OWNER_ADMIN">👑 Executive Owner</option>
          <option value="FACILITY_MANAGER">🏢 Yard Facility Manager</option>
          <option value="EMPLOYEE">🔧 Field Service Tech</option>
          <option value="CUSTOMER">👤 Customer Portal View</option>
        </select>
        <p className="text-[9px] text-slate-400 mt-1 px-1 line-clamp-1 leading-tight">
          {roleDescription}
        </p>
      </div>

      {/* Main Role-Tailored Navigation List */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        <div className="flex items-center justify-between px-2.5 pb-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Role Navigation</span>
          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${roleBadge.color}`}>
            {roleBadge.label}
          </span>
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) || (item.href === '/locations' && pathname.startsWith('/facilities'));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 group ${isActive
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${isActive ? 'bg-blue-200/60 text-blue-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Pinned: Settings & RBAC Level */}
      <div className="p-2.5 border-t border-slate-100 bg-slate-50/70 space-y-1">
        {/* Settings is only accessible to Owner and Yard Manager */}
        {(activeRole === 'OWNER_ADMIN' || activeRole === 'FACILITY_MANAGER') && (
          <Link
            to="/settings"
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 group ${pathname.startsWith('/settings')
              ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
          >
            <Settings className={`w-4 h-4 transition-colors ${pathname.startsWith('/settings') ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span className="truncate">Settings & Config</span>
          </Link>
        )}

        <div className="px-2 pt-1 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>RBAC: {activeRole.replace('_', ' ')}</span>
          </div>
          <span className="font-mono text-[9px]">v1.5</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
