import { Request, Response } from 'express';
import { db, adminFieldValue } from '../config/firebase.js';
import { sendToDevice } from '../services/fcmService.js';

export const createWaitRequest = async (req: Request, res: Response) => {
  try {
    const { studentId, busId, stopId, requestedWaitTime } = req.body;

    const requestRef = db.collection('waitRequests').doc();
    const waitData = {
      requestId: requestRef.id,
      studentId,
      busId,
      stopId,
      requestedWaitTime: requestedWaitTime || 5,
      status: 'PENDING',
      createdAt: adminFieldValue.serverTimestamp()
    };

    await requestRef.set(waitData);
    return res.status(200).json({ success: true, message: 'Wait request submitted', data: waitData });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const respondToWaitRequest = async (req: Request, res: Response) => {
  try {
    const { requestId, status } = req.body;

    if (!requestId || !status) {
      return res.status(400).json({ success: false, message: 'requestId and status are required' });
    }

    const requestRef = db.collection('waitRequests').doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      return res.status(404).json({ success: false, message: 'Wait request not found' });
    }

    const requestData = requestDoc.data();
    const studentId = requestData?.studentId;

    await requestRef.update({
      status,
      updatedAt: adminFieldValue.serverTimestamp()
    });

    if (studentId) {
      const studentDoc = await db.collection('students').doc(studentId).get();
      const studentData = studentDoc.data();

      if (studentDoc.exists && studentData?.fcmToken) {
        const title = `Wait Request ${status === 'ACCEPTED' ? 'Accepted' : 'Declined'}`;
        const body = `Driver has ${status.toLowerCase()} your hold request at stop ${requestData?.stopId || ''}.`;

        await sendToDevice(studentData.fcmToken, title, body, {
          requestId,
          status: String(status)
        });
      }
    }

    return res.status(200).json({ success: true, message: `Request ${status.toLowerCase()}` });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
