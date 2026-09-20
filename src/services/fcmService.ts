import { messaging } from '../config/firebase.js';

export const sendToDevice = async (
  fcmToken: string,
  title: string,
  body: string,
  dataPayload: Record<string, string> = {}
) => {
  try {
    return await messaging.send({
      token: fcmToken,
      notification: { title, body },
      data: dataPayload
    });
  } catch (error) {
    console.error('[FCM Device Error]:', error);
    return null;
  }
};

export const sendToTopic = async (
  topic: string,
  title: string,
  body: string,
  dataPayload: Record<string, string> = {}
) => {
  try {
    return await messaging.send({
      topic,
      notification: { title, body },
      data: dataPayload
    });
  } catch (error) {
    console.error('[FCM Topic Error]:', error);
    return null;
  }
};
