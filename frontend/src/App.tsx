import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '@/pages/DashboardPage';
import { FeedPage } from '@/pages/FeedPage';
import { LocationsPage } from '@/pages/LocationsPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { TasksPage } from '@/pages/TasksPage';
import { MessagesPage } from '@/pages/MessagesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { FinancePage } from '@/pages/FinancePage';
import { RoleProvider } from '@/lib/RoleContext';

export function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/locations/:facilityId" element={<LocationsPage />} />
        <Route path="/facilities" element={<Navigate to="/locations" replace />} />
        <Route path="/facilities/:facilityId" element={<Navigate to="/locations" replace />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/financial-reports" element={<Navigate to="/finance" replace />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/chat" element={<Navigate to="/messages" replace />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* Graceful fallback for any previously bookmarkable routes */}
        <Route path="/map" element={<Navigate to="/locations" replace />} />
        <Route path="/containers" element={<Navigate to="/" replace />} />
        <Route path="/rentals" element={<Navigate to="/customers" replace />} />
        <Route path="/ai-insights" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </RoleProvider>
  );
}

export default App;
