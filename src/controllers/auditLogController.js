const { db } = require('../config/firebase');
const { createAuditLog } = require('../services/auditLogService');

// POST /api/v1/audit-logs (Development & Manual logging endpoint)
exports.createAuditLogEntry = async (req, res) => {
  try {
    const { action, performedBy, role, entityType, entityId, details } = req.body;

    if (!action || !performedBy || !entityType || !entityId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: action, performedBy, entityType, and entityId are required.'
      });
    }

    const log = await createAuditLog({
      action,
      performedBy,
      role: role || 'ADMIN',
      entityType,
      entityId,
      details: details || null
    });

    if (!log) {
      return res.status(500).json({
        success: false,
        message: 'Failed to record audit log'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Audit log recorded successfully',
      data: log
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllAuditLogs = async (req, res) => {
  try {
    const { action, performedBy, role, entityType, entityId } = req.query;

    let query = db.collection('audit_logs');

    if (action) {
      query = query.where('action', '==', action.toUpperCase());
    }
    if (performedBy) {
      query = query.where('performedBy', '==', performedBy);
    }
    if (role) {
      query = query.where('role', '==', role.toUpperCase());
    }
    if (entityType) {
      query = query.where('entityType', '==', entityType.toUpperCase());
    }
    if (entityId) {
      query = query.where('entityId', '==', entityId);
    }

    const snapshot = await query.get();
    const logs = [];

    if (snapshot.docs && Array.isArray(snapshot.docs)) {
      snapshot.docs.forEach((doc) => {
        logs.push(typeof doc.data === 'function' ? doc.data() : doc);
      });
    } else if (typeof snapshot.forEach === 'function') {
      snapshot.forEach((doc) => {
        logs.push(typeof doc.data === 'function' ? doc.data() : doc);
      });
    }

    return res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/v1/audit-logs/entity/:entityType/:entityId
exports.getAuditLogsByEntity = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    if (!entityType || !entityId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: entityType and entityId are required.'
      });
    }

    let query = db.collection('audit_logs')
      .where('entityType', '==', entityType.toUpperCase())
      .where('entityId', '==', entityId);

    const snapshot = await query.get();
    const logs = [];

    if (snapshot.docs && Array.isArray(snapshot.docs)) {
      snapshot.docs.forEach((doc) => {
        logs.push(typeof doc.data === 'function' ? doc.data() : doc);
      });
    } else if (typeof snapshot.forEach === 'function') {
      snapshot.forEach((doc) => {
        logs.push(typeof doc.data === 'function' ? doc.data() : doc);
      });
    }

    return res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/v1/audit-logs/:id
exports.getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Missing audit log ID'
      });
    }

    const logRef = db.collection('audit_logs').doc(id);
    const doc = await logRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Audit log not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: typeof doc.data === 'function' ? doc.data() : doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
