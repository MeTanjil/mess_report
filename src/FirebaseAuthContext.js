import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const FirebaseAuthContext = createContext();
export function useFirebaseAuth() {
  return useContext(FirebaseAuthContext);
}

export function FirebaseAuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  // Signup (object destructure + error handling)
  const signup = async ({ email, password }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      return { success: false, msg: err.message };
    }
  };

  // Signin (object destructure + error handling)
  const signin = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      return { success: false, msg: err.message };
    }
  };

  // Signout
  const signout = () => signOut(auth);

  return (
    <FirebaseAuthContext.Provider value={{ user, signup, signin, signout }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}
