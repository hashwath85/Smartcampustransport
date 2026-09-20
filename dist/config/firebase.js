import path from 'path';
import dotenv from 'dotenv';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';
dotenv.config();
const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json');
let app;
if (getApps().length === 0) {
    app = initializeApp({
        credential: cert(serviceAccountPath)
    });
}
else {
    app = getApps()[0];
}
export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export const adminFieldValue = FieldValue;
