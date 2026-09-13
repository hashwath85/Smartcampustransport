import { db, adminFieldValue } from '../config/firebase.js';
import { verifyQRSignature } from '../utils/crypto.js';
import { calculateHaversineDistance } from '../utils/distance.js';

interface ValidateQRInput {
  qrPayload: string;
  driverGps: {
    latitude: number;
    longitude: number;
  };
  driverId: string;
}

export const validateAndRecordAttendance = async ({
  qrPayload,
  driverGps,
  driverId
}: ValidateQRInput) => {
  // 1. Extract QR Payload
  const parts = qrPayload.split('|');
  if (parts.length !== 4) {
    throw { statusCode: 400, errorCode: 'ERR_INVALID_QR_FORMAT', message: 'Malformed QR payload structure.' };
  }

  const studentId = parts[0];
  const busId = parts[1];
  const timestampStr = parts[2];
  const signature = parts[3];

  if (!studentId || !busId || !timestampStr || !signature) {
    throw { statusCode: 400, errorCode: 'ERR_INVALID_QR_PAYLOAD', message: 'QR payload contains empty fields.' };
  }

  const qrTimestamp = parseInt(timestampStr, 10);
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // 2. Timestamp Expiration Check (120 seconds window)
  if (Math.abs(currentTimestamp - qrTimestamp) > 120) {
    throw { statusCode: 400, errorCode: 'ERR_QR_EXPIRED', message: 'QR code has expired. Please refresh QR.' };
  }

  // 3. HMAC Cryptographic Verification
  const isValidSignature = verifyQRSignature(studentId, busId, qrTimestamp, signature);
  if (!isValidSignature) {
    throw { statusCode: 403, errorCode: 'ERR_INVALID_SIGNATURE', message: 'Cryptographic signature verification failed.' };
  }

  // Execute Atomic Firestore Transaction
  return await db.runTransaction(async (transaction) => {
    // 4. Student Account Verification
    const studentRef = db.collection('students').doc(studentId);
    const studentDoc = await transaction.get(studentRef);
    if (!studentDoc.exists || studentDoc.data()?.accountStatus !== 'ACTIVE') {
      throw { statusCode: 403, errorCode: 'ERR_STUDENT_INACTIVE', message: 'Student account is inactive or non-existent.' };
    }

    // 5. Check Active Bus & Trip ID (Handshake with BE2)
    const busRef = db.collection('buses').doc(busId);
    const busDoc = await transaction.get(busRef);
    if (!busDoc.exists || !busDoc.data()?.activeTripId) {
      throw { statusCode: 400, errorCode: 'ERR_NO_ACTIVE_TRIP', message: 'Bus is not currently on an active trip shift.' };
    }

    const busData = busDoc.data();
    const activeTripId = busData?.activeTripId;

    // Verify driver assignment match
    if (busData?.driverId !== driverId) {
      throw { statusCode: 403, errorCode: 'ERR_DRIVER_MISMATCH', message: 'Driver is not assigned to this bus.' };
    }

    // 6. Geofence Distance Calculation (<= 100 meters)
    const busGps = busData?.lastLocation;
    if (busGps && typeof busGps.latitude === 'number' && typeof busGps.longitude === 'number') {
      const distance = calculateHaversineDistance(
        driverGps.latitude,
        driverGps.longitude,
        busGps.latitude,
        busGps.longitude
      );

      if (distance > 100) {
        throw { statusCode: 400, errorCode: 'ERR_GEOFENCE_EXCEEDED', message: `Distance mismatch (${Math.round(distance)}m exceeds 100m radius).` };
      }
    }

    // 7. Duplicate Attendance Check for Today's Shift
    const todayStr = new Date().toISOString().split('T')[0];
    const attendanceRef = db.collection('attendance');
    const duplicateQuery = await attendanceRef
      .where('studentId', '==', studentId)
      .where('tripId', '==', activeTripId)
      .where('date', '==', todayStr)
      .get();

    if (!duplicateQuery.empty) {
      throw { statusCode: 409, errorCode: 'ERR_DUPLICATE_ATTENDANCE', message: 'Attendance already recorded for this trip shift.' };
    }

    // 8. Auto-Fulfill Pending Wait Requests (Handshake with BE2)
    const waitRequestsRef = db.collection('waitRequests');
    const pendingWaitQuery = await waitRequestsRef
      .where('studentId', '==', studentId)
      .where('busId', '==', busId)
      .where('status', '==', 'PENDING')
      .get();

    pendingWaitQuery.forEach((doc) => {
      transaction.update(doc.ref, {
        status: 'FULFILLED',
        updatedAt: adminFieldValue.serverTimestamp()
      });
    });

    // 9. Write New Attendance Record
    const newAttendanceRef = attendanceRef.doc();
    transaction.set(newAttendanceRef, {
      attendanceId: newAttendanceRef.id,
      studentId,
      busId,
      tripId: activeTripId,
      date: todayStr,
      timestamp: adminFieldValue.serverTimestamp(),
      location: driverGps,
      status: 'BOARDED'
    });

    return {
      attendanceId: newAttendanceRef.id,
      studentName: studentDoc.data()?.name,
      studentId,
      status: 'BOARDED'
    };
  });
};
