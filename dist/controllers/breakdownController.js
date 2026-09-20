import { db, adminFieldValue } from '../config/firebase.js';
import { sendToTopic } from '../services/fcmService.js';
import { createAuditLog } from '../services/auditLogService.js';
export const reportBreakdown = async (req, res) => {
    try {
        const { busId, reason, severity, location, estimatedDelayMinutes, description, backupBusId } = req.body;
        const driverId = req.user?.uid || 'UNKNOWN_DRIVER';
        const busRef = db.collection('buses').doc(busId);
        const busDoc = await busRef.get();
        if (!busDoc.exists) {
            return res.status(404).json({ success: false, message: 'Bus not found' });
        }
        const busData = busDoc.data();
        const breakdownRef = db.collection('breakdowns').doc();
        const breakdownData = {
            breakdownId: breakdownRef.id,
            busId,
            driverId,
            activeTripId: busData?.activeTripId || null,
            reason,
            severity: severity || 'MEDIUM',
            location: location || busData?.lastLocation || null,
            estimatedDelayMinutes: estimatedDelayMinutes || 30,
            description: description || '',
            backupBusId: backupBusId || null,
            status: 'REPORTED',
            createdAt: adminFieldValue.serverTimestamp()
        };
        const batch = db.batch();
        batch.set(breakdownRef, breakdownData);
        batch.update(busRef, { status: 'BREAKDOWN' });
        await batch.commit();
        await sendToTopic(`bus_${busId}`, '⚠️ Emergency Bus Breakdown', `Bus ${busId} reported: ${reason}. Support dispatched.`);
        await createAuditLog({
            action: 'REPORT_BREAKDOWN',
            performedBy: driverId,
            role: req.user?.role || 'DRIVER',
            entityType: 'BREAKDOWN',
            entityId: breakdownRef.id,
            details: { busId, reason }
        });
        return res.status(200).json({ success: true, message: 'Breakdown reported', data: breakdownData });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllBreakdowns = async (req, res) => {
    try {
        const { status, busId, severity } = req.query;
        let query = db.collection('breakdowns');
        if (status && typeof status === 'string')
            query = query.where('status', '==', status);
        if (busId && typeof busId === 'string')
            query = query.where('busId', '==', busId);
        if (severity && typeof severity === 'string')
            query = query.where('severity', '==', severity);
        const snapshot = await query.get();
        const records = snapshot.docs.map(doc => doc.data());
        return res.status(200).json({ success: true, data: records });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getActiveBreakdowns = async (req, res) => {
    try {
        const snapshot = await db.collection('breakdowns')
            .where('status', 'in', ['REPORTED', 'BACKUP_ASSIGNED', 'IN_REPAIR'])
            .get();
        const records = snapshot.docs.map(doc => doc.data());
        return res.status(200).json({ success: true, data: records });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getBreakdownById = async (req, res) => {
    try {
        const id = req.params.id;
        const doc = await db.collection('breakdowns').doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Breakdown not found' });
        }
        return res.status(200).json({ success: true, data: doc.data() });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const assignBackupBus = async (req, res) => {
    try {
        const id = req.params.id;
        const { backupBusId } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Breakdown ID required' });
        }
        const breakdownRef = db.collection('breakdowns').doc(id);
        const breakdownDoc = await breakdownRef.get();
        if (!breakdownDoc.exists) {
            return res.status(404).json({ success: false, message: 'Breakdown ticket not found' });
        }
        const existingData = breakdownDoc.data();
        const targetBusId = existingData?.busId || 'unknown';
        await breakdownRef.update({
            backupBusId,
            status: 'BACKUP_ASSIGNED',
            updatedAt: adminFieldValue.serverTimestamp()
        });
        await createAuditLog({
            action: 'ASSIGN_BACKUP_BUS',
            performedBy: req.user?.uid || 'ADMIN',
            role: req.user?.role || 'ADMIN',
            entityType: 'BREAKDOWN',
            entityId: id,
            details: { backupBusId, busId: targetBusId }
        });
        return res.status(200).json({ success: true, message: 'Backup bus assigned successfully' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const resolveBreakdown = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Breakdown ID required' });
        }
        const breakdownRef = db.collection('breakdowns').doc(id);
        await breakdownRef.update({
            status: 'RESOLVED',
            resolvedAt: adminFieldValue.serverTimestamp()
        });
        await createAuditLog({
            action: 'RESOLVE_BREAKDOWN',
            performedBy: req.user?.uid || 'ADMIN',
            role: req.user?.role || 'ADMIN',
            entityType: 'BREAKDOWN',
            entityId: id,
            details: { status: 'RESOLVED' }
        });
        return res.status(200).json({ success: true, message: 'Breakdown resolved' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
