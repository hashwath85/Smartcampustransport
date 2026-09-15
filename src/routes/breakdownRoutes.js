const express = require('express');
const router = express.Router();
const breakdownController = require('../controllers/breakdownController');

// Define specific routes before parameterized /:id routes
router.post('/', breakdownController.reportBreakdown);
router.get('/', breakdownController.getAllBreakdowns);
router.get('/active', breakdownController.getActiveBreakdowns);
router.get('/:id', breakdownController.getBreakdownById);
router.patch('/:id/assign-backup', breakdownController.assignBackupBus);
router.patch('/:id/resolve', breakdownController.resolveBreakdown);

module.exports = router;
