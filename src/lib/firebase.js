// /lib/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Config que Firebase te dio
const firebaseConfig = {
  apiKey: "AIzaSyCv7AeP-RRdrMpE1RbPdciHQWOOk1At-AE",
  authDomain: "potrobus-7dd0f.firebaseapp.com",
  projectId: "potrobus-7dd0f",
  storageBucket: "potrobus-7dd0f.firebasestorage.app",
  messagingSenderId: "1078381444700",
  appId: "1:1078381444700:web:94c521089753a9f8ca3099",
  measurementId: "G-P4559NVW49"
};

// Evitar inicializar Firebase más de una vez
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Exportar Firestore
export const db = getFirestore(app);
