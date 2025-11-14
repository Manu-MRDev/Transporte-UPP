// /lib/firebaseAdmin.js
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: "potrobus-7dd0f",
  });
}

export const db = admin.firestore();
