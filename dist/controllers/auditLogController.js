import { db } from '../config/firebase.js';
import { createAuditLog as saveAuditLog } from '../services/auditLogService.js';
export const createAuditLogEntry = async (req, res) => {
    try {
        const { action, performedBy, role, entityType, entityId, details } = req.body;
        const result = await saveAuditLog({
            action,
            performedBy: performedBy || req.user?.uid || 'UNKNOWN',
            role: role || req.user?.role || 'SYSTEM',
            entityType,
            entityId,
            details
        });
        return res.status(200).json({ success: true, message: 'Audit log created', data: result });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getAuditLogs = async (req, res) => {
    try {
        const { action, performedBy, role, entityType, entityId } = req.query;
        let query = db.collection('audit_logs');
        if (action && typeof action === 'string')
            query = query.where('action', '==', action.toUpperCase());
        if (performedBy && typeof performedBy === 'string')
            query = query.where('performedBy', '==', performedBy);
        if (role && typeof role === 'string')
            query = query.where('role', '==', role.toUpperCase());
        if (entityType && typeof entityType === 'string')
            query = query.where('entityType', '==', entityType.toUpperCase());
        if (entityId && typeof entityId === 'string')
            query = query.where('entityId', '==', entityId);
        const snapshot = await query.get();
        const records = snapshot.docs.map(doc => doc.data());
        return res.status(200).json({ success: true, data: records });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getAuditLogsByEntity = async (req, res) => {
    try {
        const entityType = req.params.entityType.toUpperCase();
        const entityId = req.params.entityId;
        const snapshot = await db.collection('audit_logs')
            .where('entityType', '==', entityType)
            .where('entityId', '==', entityId)
            .get();
        const records = snapshot.docs.map(doc => doc.data());
        return res.status(200).json({ success: true, data: records });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getAuditLogById = async (req, res) => {
    try {
        const id = req.params.id;
        const doc = await db.collection('audit_logs').doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Audit log not found' });
        }
        return res.status(200).json({ success: true, data: doc.data() });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
