const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');

// Specific literal/entity routes must precede parameterized /:id routes
router.post('/', auditLogController.createAuditLogEntry);
router.get('/', auditLogController.getAllAuditLogs);
router.get('/entity/:entityType/:entityId', auditLogController.getAuditLogsByEntity);
router.get('/:id', auditLogController.getAuditLogById);

module.exports = router;
