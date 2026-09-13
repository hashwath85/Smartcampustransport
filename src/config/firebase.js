const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

if (getApps().length === 0) {
  const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    // Fallback initialization if service account key is not present locally
    initializeApp();
  }
}

const db = getFirestore();
const messaging = getMessaging();

module.exports = { db, messaging };
