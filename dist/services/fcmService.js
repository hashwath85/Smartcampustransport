import { messaging } from '../config/firebase.js';
export const sendToDevice = async (fcmToken, title, body, dataPayload = {}) => {
    try {
        return await messaging.send({
            token: fcmToken,
            notification: { title, body },
            data: dataPayload
        });
    }
    catch (error) {
        console.error('[FCM Device Error]:', error);
        return null;
    }
};
export const sendToTopic = async (topic, title, body, dataPayload = {}) => {
    try {
        return await messaging.send({
            topic,
            notification: { title, body },
            data: dataPayload
        });
    }
    catch (error) {
        console.error('[FCM Topic Error]:', error);
        return null;
    }
};
