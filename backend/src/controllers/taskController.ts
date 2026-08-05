import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/db';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { facilityId, assignedToId, status, priority, type } = req.query;
    const where: any = {};

    if (facilityId) where.facilityId = String(facilityId);
    if (assignedToId) where.assignedToId = String(assignedToId);
    if (status) where.status = String(status);
    if (priority) where.priority = String(priority);
    if (type) where.type = String(type);

    const tasks = await prisma.task.findMany({
      where,
      include: {
        facility: { select: { name: true, code: true } },
        container: { select: { containerNumber: true } },
        assignedTo: { select: { id: true, name: true, avatar: true } },
        createdBy: { select: { name: true } },
        reports: {
          include: { submittedBy: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    return res.json({ success: true, data: tasks });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch tasks' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, facilityId, containerId, assignedToId, type, priority, dueDate, estimatedHours, checklist } = req.body;
    const taskNumber = `TSK-${Date.now().toString().slice(-6)}`;

    const newTask = await prisma.task.create({
      data: {
        taskNumber,
        title,
        description,
        facilityId,
        containerId,
        assignedToId,
        createdById: req.user?.id || null,
        type: type || 'INSPECTION',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? Number(estimatedHours) : 1,
        checklist,
        status: 'PENDING'
      }
    });

    return res.status(201).json({ success: true, data: newTask });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create task' });
  }
};

export const submitMobileTaskReport = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId, notes, completionTimeMinutes, beforePhotos, duringPhotos, afterPhotos, voiceNoteUrl, videoUrl, gpsLat, gpsLng, digitalSignatureUrl, materialsUsed, extraCosts } = req.body;

    const report = await prisma.$transaction(async (tx) => {
      const newReport = await tx.taskReport.create({
        data: {
          taskId,
          submittedById: req.user?.id || 'usr-emp-001',
          notes,
          completionTimeMinutes: completionTimeMinutes ? Number(completionTimeMinutes) : 30,
          beforePhotos: beforePhotos || [],
          duringPhotos: duringPhotos || [],
          afterPhotos: afterPhotos || [],
          voiceNoteUrl,
          videoUrl,
          gpsLat: gpsLat ? Number(gpsLat) : null,
          gpsLng: gpsLng ? Number(gpsLng) : null,
          digitalSignatureUrl,
          materialsUsed,
          extraCosts: extraCosts ? Number(extraCosts) : 0.0
        }
      });

      // Update task status to COMPLETED
      await tx.task.update({
        where: { id: taskId },
        data: { status: 'COMPLETED' }
      });

      return newReport;
    });

    return res.status(201).json({ success: true, data: report, message: 'Mobile inspection report submitted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to submit task report' });
  }
};
