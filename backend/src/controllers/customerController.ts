import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/db';

export const getCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { companyName: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
        { phone: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        rentals: {
          include: { container: { select: { containerNumber: true, facility: { select: { name: true } } } } }
        },
        invoices: { where: { status: 'PENDING' } },
        payments: { orderBy: { paymentDate: 'desc' }, take: 5 }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: customers });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch customers' });
  }
};

export const createCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const { name, companyName, email, phone, govId, address, emergencyContact, notes } = req.body;

    const newCustomer = await prisma.customer.create({
      data: {
        name,
        companyName,
        email,
        phone,
        govId,
        address,
        emergencyContact,
        notes
      }
    });

    return res.status(201).json({ success: true, data: newCustomer });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create customer' });
  }
};
