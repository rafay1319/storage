import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from '@/pages/DashboardPage';
import { FacilitiesPage } from '@/pages/FacilitiesPage';
import { MapPage } from '@/pages/MapPage';
import { ContainersPage } from '@/pages/ContainersPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { RentalsPage } from '@/pages/RentalsPage';
import { TasksPage } from '@/pages/TasksPage';
import { FinancePage } from '@/pages/FinancePage';
import { AiInsightsPage } from '@/pages/AiInsightsPage';
import { SettingsPage } from '@/pages/SettingsPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/containers" element={<ContainersPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/ai-insights" element={<AiInsightsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
