// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDppVpnM2rAfzTg5oOaGvyRRvV3mkkhmpw",
  authDomain: "mess-report.firebaseapp.com",
  projectId: "mess-report",
  storageBucket: "mess-report.firebasestorage.app",
  messagingSenderId: "1003561122369",
  appId: "1:1003561122369:web:6c929698b576f9a6a9a4c0",
  measurementId: "G-QFENSQN22F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
