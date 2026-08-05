import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { getFacilities, getFacilityById, createFacility, updateFacilityLayout, transferContainer } from '../controllers/facilityController';
import { getContainers, getContainerById, createContainer, updateContainerStatus } from '../controllers/containerController';
import { getCustomers, createCustomer } from '../controllers/customerController';
import { getRentals, createRentalAgreement, terminateRentalAgreement } from '../controllers/rentalController';
import { getTasks, createTask, submitMobileTaskReport } from '../controllers/taskController';
import { getFinancialSummary, createExpense, exportFinancialReportCSV } from '../controllers/financeController';
import { getAIInsights } from '../controllers/aiController';
import { globalSearch } from '../controllers/searchController';

const router = Router();

// Global Search
router.get('/search', authenticateToken, globalSearch);

// Facilities
router.get('/facilities', authenticateToken, getFacilities);
router.get('/facilities/:id', authenticateToken, getFacilityById);
router.post('/facilities', authenticateToken, requireRole(['OWNER_ADMIN']), createFacility);
router.put('/facilities/:id/layout', authenticateToken, updateFacilityLayout);
router.post('/facilities/transfer-container', authenticateToken, requireRole(['OWNER_ADMIN', 'FACILITY_MANAGER']), transferContainer);

// Containers
router.get('/containers', authenticateToken, getContainers);
router.get('/containers/:id', authenticateToken, getContainerById);
router.post('/containers', authenticateToken, createContainer);
router.patch('/containers/:id/status', authenticateToken, updateContainerStatus);

// Customers
router.get('/customers', authenticateToken, getCustomers);
router.post('/customers', authenticateToken, createCustomer);

// Rentals
router.get('/rentals', authenticateToken, getRentals);
router.post('/rentals', authenticateToken, createRentalAgreement);
router.post('/rentals/:id/terminate', authenticateToken, terminateRentalAgreement);

// Tasks & Mobile Reports
router.get('/tasks', authenticateToken, getTasks);
router.post('/tasks', authenticateToken, createTask);
router.post('/tasks/report', authenticateToken, submitMobileTaskReport);

// Finance & Reports
router.get('/finance/summary', authenticateToken, getFinancialSummary);
router.post('/finance/expenses', authenticateToken, createExpense);
router.get('/finance/export-csv', authenticateToken, exportFinancialReportCSV);

// AI Engine Insights
router.get('/ai/insights', authenticateToken, getAIInsights);

export default router;
