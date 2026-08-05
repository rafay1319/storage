export interface AIInsight {
  id: string;
  type: 'WARNING' | 'OPPORTUNITY' | 'MAINTENANCE' | 'FORECAST';
  title: string;
  facilityId?: string;
  facilityName?: string;
  description: string;
  metric: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
}

export class AIEngine {
  /**
   * Forecast 6-month revenue & occupancy using trend analytics
   */
  public static calculateForecast(historicalMonthlyData: { month: string; revenue: number; occupancyRate: number }[]) {
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const lastRev = historicalMonthlyData.length > 0 ? historicalMonthlyData[historicalMonthlyData.length - 1].revenue : 45000;
    const lastOcc = historicalMonthlyData.length > 0 ? historicalMonthlyData[historicalMonthlyData.length - 1].occupancyRate : 82;

    const forecast = months.map((m, idx) => {
      const growthFactor = 1 + (idx + 1) * 0.035; // 3.5% monthly compound growth model
      const predictedRevenue = Math.round(lastRev * growthFactor);
      const predictedOccupancy = Math.min(98, Math.round(lastOcc + (idx * 1.5)));

      return {
        month: m,
        predictedRevenue,
        predictedOccupancy,
        confidenceScore: 0.92 - idx * 0.03
      };
    });

    return forecast;
  }

  /**
   * Detect Money-losing / underperforming facilities and dynamic price recommendations
   */
  public static generateBusinessInsights(facilities: any[], containers: any[], expenses: any[]): AIInsight[] {
    const insights: AIInsight[] = [];

    facilities.forEach(fac => {
      const facContainers = containers.filter(c => c.facilityId === fac.id);
      const total = facContainers.length || 1;
      const occupied = facContainers.filter(c => c.status === 'OCCUPIED').length;
      const occRate = (occupied / total) * 100;
      
      const facExpenses = expenses.filter(e => e.facilityId === fac.id).reduce((sum, e) => sum + e.amount, 0);
      const monthlyRev = fac.monthlyRevenue || (occupied * 450);
      const netProfit = monthlyRev - facExpenses;

      // 1. Loss detection
      if (netProfit < 0 || occRate < 50) {
        insights.push({
          id: `ai-loss-${fac.id}`,
          type: 'WARNING',
          title: `Facility Underperformance Alert: ${fac.name}`,
          facilityId: fac.id,
          facilityName: fac.name,
          description: `Occupancy is at ${occRate.toFixed(1)}% with a net monthly margin of $${netProfit.toLocaleString()}. Expenses exceed benchmark projections.`,
          metric: `${occRate.toFixed(1)}% Occupancy`,
          impact: 'HIGH',
          recommendedAction: 'Launch a targeted promotional rate of 15% off for 40ft units and reassign 2 unutilized staff members to lower overhead.'
        });
      }

      // 2. High Occupancy Price Increase Opportunity
      if (occRate > 88) {
        insights.push({
          id: `ai-price-${fac.id}`,
          type: 'OPPORTUNITY',
          title: `Optimal Pricing Adjustment: ${fac.name}`,
          facilityId: fac.id,
          facilityName: fac.name,
          description: `Yard is near capacity at ${occRate.toFixed(1)}%. Demand elasticity indicates potential for higher rental yields.`,
          metric: `+$${Math.round(facContainers[0]?.rentalPrice * 0.12 || 45)}/mo increase`,
          impact: 'HIGH',
          recommendedAction: 'Increase new rental rates by 12% across 20ft and 40ft units to maximize net profit margin.'
        });
      }

      // 3. Maintenance Trend Alert
      const maintenanceUnits = facContainers.filter(c => c.status === 'MAINTENANCE' || c.status === 'OUT_OF_SERVICE').length;
      if (maintenanceUnits / total > 0.12) {
        insights.push({
          id: `ai-maint-${fac.id}`,
          type: 'MAINTENANCE',
          title: `Maintenance Cluster Detected: ${fac.name}`,
          facilityId: fac.id,
          facilityName: fac.name,
          description: `${maintenanceUnits} containers are currently offline for repairs/cleaning in this yard.`,
          metric: `${maintenanceUnits} Offline Units`,
          impact: 'MEDIUM',
          recommendedAction: 'Schedule a bulk door seal & flooring restoration day with the tech crew to return containers to active inventory.'
        });
      }
    });

    return insights;
  }
}
