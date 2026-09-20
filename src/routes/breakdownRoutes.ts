import { Router } from 'express';
import {
  reportBreakdown,
  getAllBreakdowns,
  getActiveBreakdowns,
  getBreakdownById,
  assignBackupBus,
  resolveBreakdown
} from '../controllers/breakdownController.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateRoles } from '../middleware/validateRoles.js';

const router = Router();

router.post('/', authenticateUser, validateRoles(['DRIVER']), reportBreakdown);
router.get('/', authenticateUser, validateRoles(['ADMIN']), getAllBreakdowns);
router.get('/active', authenticateUser, validateRoles(['ADMIN', 'STUDENT']), getActiveBreakdowns);
router.get('/:id', authenticateUser, validateRoles(['ADMIN', 'DRIVER']), getBreakdownById);
router.patch('/:id/assign-backup', authenticateUser, validateRoles(['ADMIN']), assignBackupBus);
router.patch('/:id/resolve', authenticateUser, validateRoles(['ADMIN']), resolveBreakdown);

export default router;
