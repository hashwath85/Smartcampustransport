const { db } = require('../config/firebase');
const { sendToTopic } = require('../services/fcmService');
const { createAuditLog } = require('../services/auditLogService');

const ALLOWED_STATUSES = ['REPORTED', 'BACKUP_ASSIGNED', 'IN_REPAIR', 'RESOLVED'];
const ALLOWED_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

// POST /api/v1/breakdowns
exports.reportBreakdown = async (req, res) => {
  try {
    const { busId, driverId, reason, tripId, description, location, severity, estimatedDelayMinutes } = req.body;

    if (!busId || !driverId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: busId, driverId, and reason are required.'
      });
    }

    let finalTripId = tripId || null;
    let finalLocation = location || null;

    // Auto-fetch activeTripId and lastLocation from buses collection if omitted
    try {
      const busDoc = await db.collection('buses').doc(busId).get();
      if (busDoc.exists) {
        const busData = typeof busDoc.data === 'function' ? busDoc.data() : {};
        if (!finalTripId && busData && busData.activeTripId) {
          finalTripId = busData.activeTripId;
        }
        if (!finalLocation && busData && busData.lastLocation) {
          finalLocation = busData.lastLocation;
        }
      }
    } catch (fetchError) {
      // Proceed gracefully if bus lookup fails or in mock mode
    }

    const assignedSeverity = severity && ALLOWED_SEVERITIES.includes(severity.toUpperCase())
      ? severity.toUpperCase()
      : 'HIGH';

    const breakdownRef = db.collection('breakdowns').doc();
    const docId = breakdownRef.id || 'mock_breakdown_id';

    const payload = {
      breakdownId: docId,
      busId,
      driverId,
      tripId: finalTripId,
      reason,
      description: description || null,
      location: finalLocation,
      severity: assignedSeverity,
      status: 'REPORTED',
      backupBusId: null,
      estimatedDelayMinutes: estimatedDelayMinutes !== undefined ? Number(estimatedDelayMinutes) : null,
      reportedAt: new Date().toISOString(),
      resolvedAt: null,
      updatedAt: null,
      resolutionNotes: null
    };

    await breakdownRef.set(payload);

    // Broadcast FCM notification to students subscribed to the affected bus route
    const fcmTitle = 'Bus Breakdown Alert';
    const fcmBody = `Bus ${busId} has reported a breakdown (${reason}). Maintenance is being coordinated.`;
    await sendToTopic(
      `bus_${busId}`,
      fcmTitle,
      fcmBody,
      {
        breakdownId: docId,
        busId,
        reason,
        type: 'BREAKDOWN_ALERT'
      }
    );

    // Record audit trail entry
    await createAuditLog({
      action: 'BREAKDOWN_REPORTED',
      performedBy: driverId,
      role: 'DRIVER',
      entityType: 'BREAKDOWN',
      entityId: docId,
      details: {
        busId,
        reason,
        severity: assignedSeverity,
        estimatedDelayMinutes: payload.estimatedDelayMinutes
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Breakdown incident reported successfully',
      data: payload
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/v1/breakdowns
exports.getAllBreakdowns = async (req, res) => {
  try {
    const { status, busId, severity } = req.query;

    let query = db.collection('breakdowns');

    if (status) {
      query = query.where('status', '==', status);
    }
    if (busId) {
      query = query.where('busId', '==', busId);
    }
    if (severity) {
      query = query.where('severity', '==', severity);
    }

    const snapshot = await query.get();
    const breakdowns = [];

    if (snapshot.docs && Array.isArray(snapshot.docs)) {
      snapshot.docs.forEach((doc) => {
        breakdowns.push(typeof doc.data === 'function' ? doc.data() : doc);
      });
    } else if (typeof snapshot.forEach === 'function') {
      snapshot.forEach((doc) => {
        breakdowns.push(typeof doc.data === 'function' ? doc.data() : doc);
      });
    }

    return res.status(200).json({
      success: true,
      data: breakdowns
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/v1/breakdowns/active
exports.getActiveBreakdowns = async (req, res) => {
  try {
    const snapshot = await db.collection('breakdowns').get();
    const allBreakdowns = [];

    if (snapshot.docs && Array.isArray(snapshot.docs)) {
      snapshot.docs.forEach((doc) => {
        allBreakdowns.push(typeof doc.data === 'function' ? doc.data() : doc);
      });
    } else if (typeof snapshot.forEach === 'function') {
      snapshot.forEach((doc) => {
        allBreakdowns.push(typeof doc.data === 'function' ? doc.data() : doc);
      });
    }

    const activeBreakdowns = allBreakdowns.filter(
      (item) => item && item.status && item.status !== 'RESOLVED'
    );

    return res.status(200).json({
      success: true,
      data: activeBreakdowns
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/v1/breakdowns/:id
exports.getBreakdownById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Missing breakdown ID'
      });
    }

    const breakdownRef = db.collection('breakdowns').doc(id);
    const doc = await breakdownRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Breakdown incident not found'
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

// PATCH /api/v1/breakdowns/:id/assign-backup
exports.assignBackupBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { backupBusId, estimatedDelayMinutes } = req.body;

    if (!backupBusId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: backupBusId is required.'
      });
    }

    const breakdownRef = db.collection('breakdowns').doc(id);
    const doc = await breakdownRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Breakdown incident not found'
      });
    }

    const existingData = typeof doc.data === 'function' ? doc.data() : {};

    if (existingData && existingData.busId && existingData.busId === backupBusId) {
      return res.status(400).json({
        success: false,
        message: 'backupBusId cannot be the same as the broken-down busId.'
      });
    }

    const updateData = {
      backupBusId,
      status: 'BACKUP_ASSIGNED',
      updatedAt: new Date().toISOString()
    };

    if (estimatedDelayMinutes !== undefined) {
      updateData.estimatedDelayMinutes = Number(estimatedDelayMinutes);
    }

    await breakdownRef.update(updateData);

    const targetBusId = existingData.busId || 'unknown';
    const delayText = updateData.estimatedDelayMinutes
      ? `Estimated delay: ${updateData.estimatedDelayMinutes} mins.`
      : '';
    const fcmTitle = 'Replacement Bus Dispatched';
    const fcmBody = `Backup Bus ${backupBusId} has been assigned to replace Bus ${targetBusId}. ${delayText}`.trim();

    await sendToTopic(
      `bus_${targetBusId}`,
      fcmTitle,
      fcmBody,
      {
        breakdownId: id,
        busId: targetBusId,
        backupBusId,
        type: 'BACKUP_BUS_DISPATCH'
      }
    );

    // Record audit trail entry
    await createAuditLog({
      action: 'BACKUP_ASSIGNED',
      performedBy: req.user?.uid || req.user?.driverId || 'ADMIN',
      role: req.user?.role || 'ADMIN',
      entityType: 'BREAKDOWN',
      entityId: id,
      details: {
        originalBusId: targetBusId,
        backupBusId,
        estimatedDelayMinutes: updateData.estimatedDelayMinutes || null
      }
    });

    const updatedDoc = await breakdownRef.get();

    return res.status(200).json({
      success: true,
      message: 'Backup bus assigned successfully',
      data: typeof updatedDoc.data === 'function' ? updatedDoc.data() : updateData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PATCH /api/v1/breakdowns/:id/resolve
exports.resolveBreakdown = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    const breakdownRef = db.collection('breakdowns').doc(id);
    const doc = await breakdownRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Breakdown incident not found'
      });
    }

    const updateData = {
      status: 'RESOLVED',
      resolvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (resolutionNotes !== undefined) {
      updateData.resolutionNotes = resolutionNotes;
    }

    await breakdownRef.update(updateData);

    // Record audit trail entry
    await createAuditLog({
      action: 'BREAKDOWN_RESOLVED',
      performedBy: req.user?.uid || req.user?.driverId || 'ADMIN',
      role: req.user?.role || 'ADMIN',
      entityType: 'BREAKDOWN',
      entityId: id,
      details: {
        resolutionNotes: resolutionNotes || null
      }
    });

    const updatedDoc = await breakdownRef.get();

    return res.status(200).json({
      success: true,
      message: 'Breakdown incident resolved successfully',
      data: typeof updatedDoc.data === 'function' ? updatedDoc.data() : updateData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
