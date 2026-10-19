import { Router } from 'express';
import { register, login, getMe, updateProfile, getDemoAccounts } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody, registerSchema, loginSchema } from '../middleware/validate.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);
router.get('/demo-accounts', getDemoAccounts);

export default router;
