import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/db';

export const globalSearch = async (req: AuthRequest, res: Response) => {
  try {
    const query = String(req.query.q || '').trim();

    if (!query || query.length < 2) {
      return res.json({ success: true, data: { facilities: [], containers: [], customers: [], tasks: [], invoices: [] } });
    }

    const [facilities, containers, customers, tasks, invoices] = await Promise.all([
      prisma.facility.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { code: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5
      }),
      prisma.container.findMany({
        where: {
          OR: [
            { containerNumber: { contains: query, mode: 'insensitive' } },
            { qrCode: { contains: query, mode: 'insensitive' } },
            { barcode: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: { facility: { select: { name: true } } },
        take: 5
      }),
      prisma.customer.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { companyName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5
      }),
      prisma.task.findMany({
        where: {
          OR: [
            { taskNumber: { contains: query, mode: 'insensitive' } },
            { title: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5
      }),
      prisma.invoice.findMany({
        where: {
          OR: [
            { invoiceNumber: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5
      })
    ]);

    return res.json({
      success: true,
      data: {
        facilities,
        containers,
        customers,
        tasks,
        invoices
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Global search failed' });
  }
};
