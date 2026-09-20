import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';

dotenv.config();

const serviceAccountPath = path.resolve(
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json'
);

let app: App;

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, 'utf8')
  ) as Record<string, unknown>;

  if (getApps().length === 0) {
    app = initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    app = getApps()[0];
  }
} else {
  if (getApps().length === 0) {
    app = initializeApp({
      projectId: 'local-mock-project'
    });
  } else {
    app = getApps()[0];
  }
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export const adminFieldValue = FieldValue;
