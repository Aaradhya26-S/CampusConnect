import { Router } from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateStatus,
  reopenComplaint,
  addComment,
} from '../controllers/complaintController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
  validateBody,
  createComplaintSchema,
  updateStatusSchema,
  reopenComplaintSchema,
  commentSchema,
} from '../middleware/validate.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.post('/', validateBody(createComplaintSchema), createComplaint);
router.patch('/:id/status', requireRole(['ADMIN']), validateBody(updateStatusSchema), updateStatus);
router.post('/:id/reopen', validateBody(reopenComplaintSchema), reopenComplaint);
router.post('/:id/comments', validateBody(commentSchema), addComment);

export default router;
