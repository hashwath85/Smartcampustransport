import { Router } from 'express';
import {
  getOverviewReport,
  getFleetPerformance,
  getStudentAttendance,
  getBreakdownAnalytics,
  getComplaintsAnalytics
} from '../controllers/reportController.js';

const router = Router();

router.get('/', getOverviewReport);
router.get('/overview', getOverviewReport);
router.get('/fleet-performance', getFleetPerformance);
router.get('/student-attendance', getStudentAttendance);
router.get('/breakdowns', getBreakdownAnalytics);
router.get('/complaints', getComplaintsAnalytics);

export default router;
