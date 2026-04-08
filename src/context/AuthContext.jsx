import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Try to get extra data from Firestore
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        setUser({ ...firebaseUser, profile: docSnap.exists() ? docSnap.data() : {} });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      displayName,
      email,
      photoURL: null,
      role: 'user',
      createdAt: serverTimestamp(),
    });
    return cred.user;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const docRef = doc(db, 'users', cred.user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        uid: cred.user.uid,
        displayName: cred.user.displayName,
        email: cred.user.email,
        photoURL: cred.user.photoURL,
        role: 'user',
        createdAt: serverTimestamp(),
      });
    }
    return cred.user;
  };

  const logout = () => signOut(auth);

  // Admin: Firestore role OR dev override via localStorage
  const isAdmin = user?.profile?.role === 'admin' ||
    (user && localStorage.getItem('nkstore_admin_override') === user.uid);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
