import { Response } from 'express';
import { campusStore } from '../services/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getDashboardAnalytics(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const metrics = await campusStore.getAnalyticsMetrics();
    res.status(200).json({ success: true, metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve analytics', error: error.message });
  }
}

export async function getStudentDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const stats = await campusStore.getStudentStats(req.user.id);
    res.status(200).json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve student stats', error: error.message });
  }
}

export async function exportCsv(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const complaints = await campusStore.getComplaints();

    const headers = [
      'Reference ID',
      'Title',
      'Category',
      'Priority',
      'Status',
      'Student Roll No',
      'Student Name',
      'Location',
      'Assigned Department',
      'Assigned Staff',
      'Created Date',
      'Resolved Date',
      'Resolution Notes',
    ];

    const escapeCsv = (str?: string | null) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""').replace(/\r?\n/g, ' ');
      return `"${clean}"`;
    };

    const rows = complaints.map((c) => [
      escapeCsv(c.referenceId),
      escapeCsv(c.title),
      escapeCsv(c.category),
      escapeCsv(c.priority),
      escapeCsv(c.status),
      escapeCsv(c.studentRollNumber || 'N/A'),
      escapeCsv(c.studentName || 'N/A'),
      escapeCsv(c.location),
      escapeCsv(c.assignedDepartmentName || 'Unassigned'),
      escapeCsv(c.assignedStaffName || 'None'),
      escapeCsv(new Date(c.createdAt).toLocaleDateString()),
      escapeCsv(c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString() : 'N/A'),
      escapeCsv(c.resolutionNotes || ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="campus-connect-complaints-${Date.now()}.csv"`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to generate CSV export', error: error.message });
  }
}
