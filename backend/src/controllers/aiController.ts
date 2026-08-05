import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/db';
import { AIEngine } from '../services/aiEngine';

export const getAIInsights = async (req: AuthRequest, res: Response) => {
  try {
    const facilities = await prisma.facility.findMany({
      include: {
        containers: true,
        expenses: true
      }
    });

    const containers = await prisma.container.findMany();
    const expenses = await prisma.expense.findMany();

    const insights = AIEngine.generateBusinessInsights(facilities, containers, expenses);

    // Generate 6-month forecast
    const monthlyHistory = [
      { month: 'Feb', revenue: 38000, occupancyRate: 74 },
      { month: 'Mar', revenue: 41200, occupancyRate: 77 },
      { month: 'Apr', revenue: 44500, occupancyRate: 80 },
      { month: 'May', revenue: 46800, occupancyRate: 82 },
      { month: 'Jun', revenue: 49100, occupancyRate: 85 },
      { month: 'Jul', revenue: 52400, occupancyRate: 87 }
    ];

    const forecast = AIEngine.calculateForecast(monthlyHistory);

    return res.json({
      success: true,
      data: {
        insights,
        forecast,
        summary: {
          totalInsightsCount: insights.length,
          highImpactAlerts: insights.filter(i => i.impact === 'HIGH').length,
          opportunityCount: insights.filter(i => i.type === 'OPPORTUNITY').length
        }
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch AI insights' });
  }
};
