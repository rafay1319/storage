import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/db';

export const getContainers = async (req: AuthRequest, res: Response) => {
  try {
    const { facilityId, status, size, type, search } = req.query;

    const where: any = {};
    if (facilityId) where.facilityId = String(facilityId);
    if (status) where.status = String(status);
    if (size) where.size = String(size);
    if (type) where.type = String(type);
    if (search) {
      where.OR = [
        { containerNumber: { contains: String(search), mode: 'insensitive' } },
        { qrCode: { contains: String(search), mode: 'insensitive' } },
        { barcode: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    const containers = await prisma.container.findMany({
      where,
      include: {
        facility: { select: { id: true, name: true, code: true } },
        rentals: {
          where: { status: 'ACTIVE' },
          include: { customer: { select: { id: true, name: true, companyName: true } } }
        },
        tasks: { select: { id: true, title: true, status: true, priority: true } }
      },
      orderBy: { containerNumber: 'asc' }
    });

    return res.json({ success: true, data: containers });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch containers' });
  }
};

export const getContainerById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const container = await prisma.container.findUnique({
      where: { id },
      include: {
        facility: true,
        rentals: {
          include: { customer: true, payments: true, invoices: true },
          orderBy: { startDate: 'desc' }
        },
        tasks: {
          include: { assignedTo: true, reports: true },
          orderBy: { createdAt: 'desc' }
        },
        photoVault: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!container) {
      return res.status(404).json({ error: 'Container not found' });
    }

    return res.json({ success: true, data: container });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch container' });
  }
};

export const createContainer = async (req: AuthRequest, res: Response) => {
  try {
    const { containerNumber, facilityId, size, type, rentalPrice, purchaseCost, currentValue, insuranceValue, posX, posY } = req.body;

    const qrCode = `QR-${containerNumber}-${Date.now()}`;
    const barcode = `BC-${containerNumber}`;

    const newContainer = await prisma.container.create({
      data: {
        containerNumber,
        facilityId,
        size: size || 'SIZE_20FT',
        type: type || 'STORAGE',
        rentalPrice: Number(rentalPrice),
        purchaseCost: purchaseCost ? Number(purchaseCost) : 5000,
        currentValue: currentValue ? Number(currentValue) : 4500,
        insuranceValue: insuranceValue ? Number(insuranceValue) : 6000,
        posX: posX ? Number(posX) : 0,
        posY: posY ? Number(posY) : 0,
        qrCode,
        barcode,
        status: 'AVAILABLE'
      }
    });

    return res.status(201).json({ success: true, data: newContainer });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create container' });
  }
};

export const updateContainerStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updated = await prisma.container.update({
      where: { id },
      data: {
        status,
        ...(notes ? { notes } : {}),
        ...(status === 'AVAILABLE' ? { lastInspectedAt: new Date() } : {})
      }
    });

    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update container status' });
  }
};
