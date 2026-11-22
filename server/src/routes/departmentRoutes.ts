import { Router } from 'express';
import { getDepartments, createDepartment } from '../controllers/departmentController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateBody, departmentSchema } from '../middleware/validate.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getDepartments);
router.post('/', requireRole(['ADMIN']), validateBody(departmentSchema), createDepartment);

export default router;
