const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
let db, messaging;

if (fs.existsSync(serviceAccountPath)) {
  if (getApps().length === 0) {
    const serviceAccount = require(serviceAccountPath);
    initializeApp({
      credential: cert(serviceAccount)
    });
  }
  db = getFirestore();
  messaging = getMessaging();
} else {
  console.log('?? Running Firebase in Local Mock Mode (No serviceAccountKey.json found)');
  
  // Lightweight Firestore mock for local endpoint testing
  const mockCollection = () => ({
    doc: () => ({
      set: async () => ({ id: 'mock_doc_id' }),
      get: async () => ({ exists: true, data: () => ({}) }),
      update: async () => ({})
    }),
    add: async () => ({ id: 'mock_doc_id' })
  });

  db = {
    collection: mockCollection
  };

  messaging = {
    send: async () => ({ status: 'mock_sent' })
  };
}

module.exports = { db, messaging };
