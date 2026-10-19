import { Router } from 'express';
import { getDashboardAnalytics, getStudentDashboardStats, exportCsv } from '../controllers/analyticsController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/dashboard', requireRole(['ADMIN']), getDashboardAnalytics);
router.get('/student-stats', getStudentDashboardStats);
router.get('/export-csv', requireRole(['ADMIN']), exportCsv);

export default router;
