// src/firestoreHelpers.js
import { db } from "./firebase";
import { collection, doc, getDoc, setDoc, getDocs } from "firebase/firestore";

// ইউজারভেদে Path
const dataDoc = (userId, month) => doc(db, "users", userId, "months", month);

export async function getMessData(userId, month) {
  const snap = await getDoc(dataDoc(userId, month));
  return snap.exists() ? snap.data() : { members: [], meals: [], expenses: [] };
}

export async function setMessData(userId, month, data) {
  return setDoc(dataDoc(userId, month), data, { merge: true });
}