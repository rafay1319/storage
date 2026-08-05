import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/db';

export const getFacilities = async (req: AuthRequest, res: Response) => {
  try {
    const facilities = await prisma.facility.findMany({
      include: {
        manager: { select: { id: true, name: true, email: true, phone: true } },
        containers: true,
        employees: { select: { id: true, name: true, role: true } },
        expenses: true
      }
    });

    const enriched = facilities.map(fac => {
      const totalContainers = fac.containers.length;
      const occupiedContainers = fac.containers.filter(c => c.status === 'OCCUPIED').length;
      const occupancyRate = totalContainers > 0 ? Math.round((occupiedContainers / totalContainers) * 100) : 0;
      
      const monthlyRevenue = fac.containers
        .filter(c => c.status === 'OCCUPIED')
        .reduce((sum, c) => sum + c.rentalPrice, 0);

      const monthlyExpenses = fac.expenses.reduce((sum, e) => sum + e.amount, 0);
      const netProfit = monthlyRevenue - monthlyExpenses;

      return {
        ...fac,
        totalContainers,
        occupiedContainers,
        occupancyRate,
        monthlyRevenue,
        monthlyExpenses,
        netProfit
      };
    });

    return res.json({ success: true, data: enriched });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch facilities' });
  }
};

export const getFacilityById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const facility = await prisma.facility.findUnique({
      where: { id },
      include: {
        manager: true,
        containers: {
          include: {
            rentals: {
              where: { status: 'ACTIVE' },
              include: { customer: true }
            },
            tasks: {
              where: { status: { in: ['PENDING', 'IN_PROGRESS', 'REVIEW'] } }
            }
          }
        },
        employees: true,
        tasks: {
          include: { assignedTo: true }
        },
        expenses: true
      }
    });

    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    return res.json({ success: true, data: facility });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch facility' });
  }
};

export const createFacility = async (req: AuthRequest, res: Response) => {
  try {
    const { name, code, address, city, state, country, contactNumber, operatingHours, notes, gridRows, gridCols, managerId } = req.body;
    
    const newFacility = await prisma.facility.create({
      data: {
        name,
        code,
        address,
        city,
        state,
        country: country || 'USA',
        contactNumber,
        operatingHours: operatingHours || '08:00 AM - 08:00 PM',
        notes,
        gridRows: gridRows ? Number(gridRows) : 10,
        gridCols: gridCols ? Number(gridCols) : 12,
        managerId
      }
    });

    return res.status(201).json({ success: true, data: newFacility });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create facility' });
  }
};

export const updateFacilityLayout = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { containerPositions } = req.body; // array of { containerId, posX, posY }

    if (Array.isArray(containerPositions)) {
      await prisma.$transaction(
        containerPositions.map(pos => 
          prisma.container.update({
            where: { id: pos.containerId },
            data: { posX: pos.posX, posY: pos.posY }
          })
        )
      );
    }

    return res.json({ success: true, message: 'Yard map layout updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update facility layout' });
  }
};

export const transferContainer = async (req: AuthRequest, res: Response) => {
  try {
    const { containerId, targetFacilityId } = req.body;
    
    const updated = await prisma.container.update({
      where: { id: containerId },
      data: { facilityId: targetFacilityId }
    });

    return res.json({ success: true, data: updated, message: 'Container transferred successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to transfer container' });
  }
};
