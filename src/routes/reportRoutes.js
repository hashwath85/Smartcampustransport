const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/', reportController.getOverviewReport);
router.get('/overview', reportController.getOverviewReport);
router.get('/fleet-performance', reportController.getFleetPerformance);
router.get('/student-attendance', reportController.getStudentAttendance);
router.get('/breakdowns', reportController.getBreakdownAnalytics);
router.get('/complaints', reportController.getComplaintsAnalytics);

module.exports = router;
