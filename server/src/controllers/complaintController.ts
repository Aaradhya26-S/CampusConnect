import { Response } from 'express';
import { campusStore, ComplaintStatus, ComplaintPriority } from '../services/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getComplaints(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { status, category, priority, departmentId, search, page = '1', limit = '10' } = req.query;

    const filter: any = {};
    if (status && status !== 'ALL') filter.status = status as string;
    if (category && category !== 'ALL') filter.category = category as string;
    if (priority && priority !== 'ALL') filter.priority = priority as string;
    if (departmentId && departmentId !== 'ALL') filter.departmentId = departmentId as string;
    if (search) filter.search = search as string;

    // Students can ONLY view their own complaints
    if (req.user.role === 'STUDENT') {
      filter.studentId = req.user.id;
    }

    const allMatching = await campusStore.getComplaints(filter);
    
    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = allMatching.slice(startIndex, startIndex + limitNum);
    const totalPages = Math.ceil(allMatching.length / limitNum);

    res.status(200).json({
      success: true,
      complaints: paginated,
      pagination: {
        total: allMatching.length,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaints', error: error.message });
  }
}

export async function getComplaintById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const id = req.params.id as string;
    const complaint = await campusStore.findComplaintById(id);

    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found' });
      return;
    }

    // Authorization check: student can only view their own complaint
    if (req.user.role === 'STUDENT' && complaint.studentId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Forbidden. You are not authorized to view this complaint.' });
      return;
    }

    // Filter out internal comments for students
    let sanitizedComplaint = { ...complaint };
    if (req.user.role === 'STUDENT' && sanitizedComplaint.comments) {
      sanitizedComplaint.comments = sanitizedComplaint.comments.filter((c) => !c.isInternal);
    }

    res.status(200).json({ success: true, complaint: sanitizedComplaint });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaint details', error: error.message });
  }
}

export async function createComplaint(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { title, description, category, location, priority, attachmentUrl } = req.body;

    const newComplaint = await campusStore.createComplaint({
      title,
      description,
      category,
      location,
      priority: priority as ComplaintPriority,
      studentId: req.user.id,
      attachmentUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint lodged successfully! Reference ID assigned.',
      complaint: newComplaint,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create complaint', error: error.message });
  }
}

export async function updateStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const id = req.params.id as string;
    const { status, note, assignedDepartmentId, assignedStaffName, rejectionReason, resolutionNotes } = req.body;

    const complaint = await campusStore.findComplaintById(id);
    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found' });
      return;
    }

    // Validate lifecycle transitions
    const validTransitions: Record<ComplaintStatus, ComplaintStatus[]> = {
      SUBMITTED: ['UNDER_REVIEW', 'REJECTED'],
      UNDER_REVIEW: ['ASSIGNED', 'IN_PROGRESS', 'REJECTED'],
      ASSIGNED: ['IN_PROGRESS', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
      IN_PROGRESS: ['RESOLVED', 'UNDER_REVIEW', 'ASSIGNED'],
      RESOLVED: ['CLOSED', 'UNDER_REVIEW'], // Under review if reopened
      CLOSED: ['UNDER_REVIEW'], // Can be reopened under exceptional review
      REJECTED: ['UNDER_REVIEW'],
    };

    const allowedNext = validTransitions[complaint.status] || [];
    if (!allowedNext.includes(status as ComplaintStatus)) {
      res.status(400).json({
        success: false,
        message: `Invalid status transition from ${complaint.status} to ${status}. Allowed next states: [${allowedNext.join(', ')}]`,
      });
      return;
    }

    const updated = await campusStore.updateComplaintStatus(id, status as ComplaintStatus, req.user.id, {
      note,
      assignedDepartmentId,
      assignedStaffName,
      rejectionReason,
      resolutionNotes,
    });

    res.status(200).json({
      success: true,
      message: `Complaint status updated to ${status}.`,
      complaint: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update complaint status', error: error.message });
  }
}

export async function reopenComplaint(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const id = req.params.id as string;
    const { reopenReason } = req.body;

    const complaint = await campusStore.findComplaintById(id);
    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found' });
      return;
    }

    // Only owner student or admin can reopen
    if (req.user.role === 'STUDENT' && complaint.studentId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Forbidden. You cannot reopen another student\'s complaint.' });
      return;
    }

    // Only resolved or closed complaints are eligible to be reopened
    if (complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED') {
      res.status(400).json({
        success: false,
        message: `Only RESOLVED or CLOSED complaints can be reopened. Current status is ${complaint.status}.`,
      });
      return;
    }

    const updated = await campusStore.updateComplaintStatus(id, 'UNDER_REVIEW', req.user.id, {
      reopenReason,
      note: `Complaint reopened by ${req.user.fullName}. Reason: ${reopenReason}`,
    });

    res.status(200).json({
      success: true,
      message: 'Complaint successfully reopened for administrative review.',
      complaint: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to reopen complaint', error: error.message });
  }
}

export async function addComment(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const id = req.params.id as string;
    const { message, isInternal } = req.body;

    const complaint = await campusStore.findComplaintById(id);
    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found' });
      return;
    }

    // Check authorization: Student can only comment on their own complaint
    if (req.user.role === 'STUDENT' && complaint.studentId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Forbidden. You cannot comment on another student\'s complaint.' });
      return;
    }

    // Only admin can post internal comments
    const internalFlag = req.user.role === 'ADMIN' ? !!isInternal : false;

    const comment = await campusStore.addComment({
      complaintId: id,
      userId: req.user.id,
      message,
      isInternal: internalFlag,
    });

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      comment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to post comment', error: error.message });
  }
}
