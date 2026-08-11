import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ExecutiveDashboard from '@/app/page';
import LiveFeedPage from '@/app/feed/page';
import FacilitiesPage from '@/app/facilities/page';
import VisualYardMapPage from '@/app/map/page';
import ContainersPage from '@/app/containers/page';
import CustomersPage from '@/app/customers/page';
import RentalsPage from '@/app/rentals/page';
import TasksPage from '@/app/tasks/page';
import FinancePage from '@/app/finance/page';
import AIInsightsPage from '@/app/ai-insights/page';
import SettingsPage from '@/app/settings/page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExecutiveDashboard />} />
        <Route path="/feed" element={<LiveFeedPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/map" element={<VisualYardMapPage />} />
        <Route path="/containers" element={<ContainersPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/ai-insights" element={<AIInsightsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
