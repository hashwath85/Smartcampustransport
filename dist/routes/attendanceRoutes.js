import { Router } from 'express';
import { validateQR } from '../controllers/attendanceController.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateRoles } from '../middleware/validateRoles.js';
const router = Router();
// Only DRIVER role can execute QR validation scans
router.post('/validate-qr', authenticateUser, validateRoles(['DRIVER']), validateQR);
export default router;
