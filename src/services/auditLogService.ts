import { db } from '../config/firebase.js';

type AuditLogInput = {
  action: string;
  performedBy: string;
  role?: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown> | string | null;
};

export async function createAuditLog({
  action,
  performedBy,
  role = 'SYSTEM',
  entityType,
  entityId,
  details = null
}: AuditLogInput): Promise<{
  logId: string;
  action: string;
  performedBy: string;
  role: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown> | string | null;
  timestamp: string;
} | null> {
  try {
    if (!action || !performedBy || !entityType || !entityId) {
      throw new Error(
        'Missing required audit log fields: action, performedBy, entityType, and entityId are required.'
      );
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
  } catch (error: any) {
    console.error('Failed to write audit log:', error.message);
    return null;
  }
}
