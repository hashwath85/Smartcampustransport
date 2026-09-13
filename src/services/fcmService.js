const { messaging } = require('../config/firebase');

async function sendToDevice(fcmToken, title, body, dataPayload = {}) {
  if (!fcmToken) return null;
  const message = {
    notification: { title, body },
    data: dataPayload,
    token: fcmToken
  };
  try {
    return await messaging.send(message);
  } catch (error) {
    console.error('FCM Device Error:', error.message);
    return null;
  }
}

async function sendToTopic(topic, title, body, dataPayload = {}) {
  const message = {
    notification: { title, body },
    data: dataPayload,
    topic: topic
  };
  try {
    return await messaging.send(message);
  } catch (error) {
    console.error('FCM Topic Error:', error.message);
    return null;
  }
}

module.exports = { sendToDevice, sendToTopic };
