import { db } from '../config/firebase.js';
export async function createAuditLog({ action, performedBy, role = 'SYSTEM', entityType, entityId, details = null }) {
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
    }
    catch (error) {
        console.error('Failed to write audit log:', error.message);
        return null;
    }
}
