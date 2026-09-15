const { db } = require('../config/firebase');

/**
 * Reusable helper to record an audit log in Firestore
 * @param {Object} params
 * @param {string} params.action - The action performed (e.g., 'COMPLAINT_SUBMITTED', 'STATUS_UPDATED', 'BREAKDOWN_REPORTED')
 * @param {string} params.performedBy - User ID or identifier who performed the action
 * @param {string} [params.role] - Role of the performer (e.g., 'STUDENT', 'DRIVER', 'ADMIN', 'SYSTEM')
 * @param {string} params.entityType - Type of entity affected (e.g., 'COMPLAINT', 'BREAKDOWN', 'TRIP', 'BUS')
 * @param {string} params.entityId - ID of the entity affected
 * @param {Object|string} [params.details] - Additional contextual metadata or changes
 * @returns {Promise<Object>} The saved audit log payload
 */
async function createAuditLog({
  action,
  performedBy,
  role = 'SYSTEM',
  entityType,
  entityId,
  details = null
}) {
  try {
    if (!action || !performedBy || !entityType || !entityId) {
      throw new Error('Missing required audit log fields: action, performedBy, entityType, and entityId are required.');
    }

    const logRef = db.collection('audit_logs').doc();
    const logId = logRef.id || 'mock_log_id';

    const payload = {
      logId,
      action: action.toUpperCase(),
      performedBy,
      role: role.toUpperCase(),
      entityType: entityType.toUpperCase(),
      entityId,
      details: details || null,
      timestamp: new Date().toISOString()
    };

    await logRef.set(payload);
    return payload;
  } catch (error) {
    console.error('Failed to write audit log:', error.message);
    return null;
  }
}

module.exports = {
  createAuditLog
};
