import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/db';

export const getFinancialSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, facilityId } = req.query;

    const facilities = await prisma.facility.findMany({
      include: {
        expenses: true,
        containers: true,
        rentals: { where: { status: 'ACTIVE' } }
      }
    });

    const invoices = await prisma.invoice.findMany({
      include: { customer: true, rental: true }
    });

    const payments = await prisma.payment.findMany();
    const expenses = await prisma.expense.findMany();

    const grossRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = grossRevenue - totalExpenses;
    const outstandingInvoices = invoices.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').reduce((sum, i) => sum + i.total, 0);

    // Breakdown by facility
    const facilityAnalytics = facilities.map(fac => {
      const facContainers = fac.containers.length;
      const occupied = fac.containers.filter(c => c.status === 'OCCUPIED').length;
      const occRate = facContainers > 0 ? Math.round((occupied / facContainers) * 100) : 0;
      
      const facRevenue = fac.rentals.reduce((sum, r) => sum + r.rentRate, 0);
      const facExpenses = fac.expenses.reduce((sum, e) => sum + e.amount, 0);
      const facNet = facRevenue - facExpenses;
      const roi = facExpenses > 0 ? Number(((facNet / facExpenses) * 100).toFixed(1)) : 100;

      return {
        facilityId: fac.id,
        facilityName: fac.name,
        code: fac.code,
        city: fac.city,
        totalContainers: facContainers,
        occupiedContainers: occupied,
        occupancyRate: occRate,
        revenue: facRevenue,
        expenses: facExpenses,
        netProfit: facNet,
        roi
      };
    });

    // Best & worst performers
    const sortedByProfit = [...facilityAnalytics].sort((a, b) => b.netProfit - a.netProfit);
    const sortedByOccupancy = [...facilityAnalytics].sort((a, b) => b.occupancyRate - a.occupancyRate);

    return res.json({
      success: true,
      data: {
        summary: {
          grossRevenue,
          totalExpenses,
          netProfit,
          outstandingInvoices,
          profitMarginPct: grossRevenue > 0 ? Number(((netProfit / grossRevenue) * 100).toFixed(1)) : 0
        },
        performers: {
          mostProfitable: sortedByProfit[0] || null,
          leastProfitable: sortedByProfit[sortedByProfit.length - 1] || null,
          mostOccupied: sortedByOccupancy[0] || null,
          mostVacant: sortedByOccupancy[sortedByOccupancy.length - 1] || null
        },
        facilityAnalytics
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch financial summary' });
  }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { facilityId, category, amount, description, expenseDate, receiptPhotoUrl } = req.body;

    const newExpense = await prisma.expense.create({
      data: {
        facilityId,
        category: category || 'OPERATIONAL',
        amount: Number(amount),
        description,
        expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
        receiptPhotoUrl
      }
    });

    return res.status(201).json({ success: true, data: newExpense });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to record expense' });
  }
};

export const exportFinancialReportCSV = async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany({
      include: { facility: { select: { name: true } } }
    });

    let csvContent = 'Expense ID,Facility,Category,Amount,Description,Date\n';
    expenses.forEach(e => {
      csvContent += `"${e.id}","${e.facility.name}","${e.category}",${e.amount},"${e.description.replace(/"/g, '""')}","${e.expenseDate.toISOString().split('T')[0]}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=Financial_Report_Expenses.csv');
    return res.send(csvContent);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to export CSV report' });
  }
};
