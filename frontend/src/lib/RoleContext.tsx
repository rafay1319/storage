import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from './types';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  roleTitle: string;
  roleDescription: string;
}

const ROLE_INFO: Record<Role, { title: string; description: string }> = {
  OWNER_ADMIN: {
    title: '👑 Executive Owner',
    description: 'Full portfolio oversight, P&L financials, multi-yard directory, and executive delegator.'
  },
  FACILITY_MANAGER: {
    title: '🏢 Yard Facility Manager',
    description: 'Yard-specific operations, field report review & approval, container placement, and team dispatch.'
  },
  EMPLOYEE: {
    title: '🔧 Field Service Tech',
    description: 'On-site maintenance execution, checklist verification, and task report photo uploads.'
  },
  CUSTOMER: {
    title: '👤 Customer Portal View',
    description: 'Self-service tenant access to rented containers, digital keys, billing invoices, and service requests.'
  }
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cy_active_role') as Role;
      if (saved && ROLE_INFO[saved]) return saved;
    }
    return 'OWNER_ADMIN';
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cy_active_role', newRole);
    }
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        roleTitle: ROLE_INFO[role]?.title || 'Executive Owner',
        roleDescription: ROLE_INFO[role]?.description || 'System User'
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      role: 'OWNER_ADMIN',
      setRole: () => {},
      roleTitle: '👑 Executive Owner',
      roleDescription: 'Full portfolio oversight'
    };
  }
  return context;
};
