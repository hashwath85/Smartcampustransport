const { db } = require('../config/firebase');
const { sendToDevice } = require('../services/fcmService');

exports.createWaitRequest = async (req, res) => {
  try {
    const { studentId, busId, stopId, requestedWaitTime } = req.body;
    if (!studentId || !busId || !stopId) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    const requestRef = db.collection('waitRequests').doc();
    const payload = {
      requestId: requestRef.id,
      studentId,
      busId,
      stopId,
      requestedWaitTime: requestedWaitTime || 5,
      status: 'PENDING',
      timestamp: new Date().toISOString()
    };
    await requestRef.set(payload);
    return res.status(201).json({ success: true, message: 'Wait request submitted', data: payload });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.respondToWaitRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    if (!requestId || !['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid requestId or status' });
    }
    const requestRef = db.collection('waitRequests').doc(requestId);
    const doc = await requestRef.get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    await requestRef.update({ status });
    const studentDoc = await db.collection('students').doc(doc.data().studentId).get();
    if (studentDoc.exists && studentDoc.data().fcmToken) {
      const title = 'Wait Request ' + (status === 'ACCEPTED' ? 'Approved' : 'Declined');
      const body = 'Driver has ' + status.toLowerCase() + ' your wait request for stop: ' + doc.data().stopId;
      await sendToDevice(studentDoc.data().fcmToken, title, body, { requestId, status });
    }
    return res.status(200).json({ success: true, message: 'Request ' + status.toLowerCase() });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
