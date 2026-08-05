import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/db';

export const getRentals = async (req: AuthRequest, res: Response) => {
  try {
    const { facilityId, customerId, status } = req.query;
    const where: any = {};

    if (facilityId) where.facilityId = String(facilityId);
    if (customerId) where.customerId = String(customerId);
    if (status) where.status = String(status);

    const rentals = await prisma.rentalAgreement.findMany({
      where,
      include: {
        customer: true,
        container: { include: { facility: { select: { name: true, code: true } } } },
        invoices: true,
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: rentals });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch rentals' });
  }
};

export const createRentalAgreement = async (req: AuthRequest, res: Response) => {
  try {
    const { customerId, containerId, facilityId, startDate, endDate, billingCycle, rentRate, depositAmount, lateFeeRate, autoRenew, digitalSignatureUrl } = req.body;

    const rentalNumber = `RENT-${Date.now().toString().slice(-6)}`;

    // Create rental in transaction and mark container occupied
    const rental = await prisma.$transaction(async (tx) => {
      const newRental = await tx.rentalAgreement.create({
        data: {
          rentalNumber,
          customerId,
          containerId,
          facilityId,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          billingCycle: billingCycle || 'MONTHLY',
          rentRate: Number(rentRate),
          depositAmount: depositAmount ? Number(depositAmount) : 0,
          lateFeeRate: lateFeeRate ? Number(lateFeeRate) : 25,
          autoRenew: autoRenew !== undefined ? autoRenew : true,
          digitalSignatureUrl,
          status: 'ACTIVE'
        }
      });

      // Update container status
      await tx.container.update({
        where: { id: containerId },
        data: { status: 'OCCUPIED' }
      });

      // Create initial deposit/rent invoice
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      const totalAmount = Number(rentRate) + (depositAmount ? Number(depositAmount) : 0);

      await tx.invoice.create({
        data: {
          invoiceNumber,
          customerId,
          rentalId: newRental.id,
          subtotal: Number(rentRate),
          lateFee: 0,
          tax: 0,
          total: totalAmount,
          status: 'PENDING',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days grace
        }
      });

      return newRental;
    });

    return res.status(201).json({ success: true, data: rental });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create rental agreement' });
  }
};

export const terminateRentalAgreement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const updated = await prisma.$transaction(async (tx) => {
      const rental = await tx.rentalAgreement.update({
        where: { id },
        data: { status: 'TERMINATED', endDate: new Date() }
      });

      await tx.container.update({
        where: { id: rental.containerId },
        data: { status: 'CLEANING' }
      });

      return rental;
    });

    return res.json({ success: true, data: updated, message: 'Rental agreement terminated and container set to CLEANING status.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to terminate rental agreement' });
  }
};
