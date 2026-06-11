import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, storage, db } from '../firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle redirect result on mount
  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Sync user doc / timezone
        await ensureUserDoc(user);
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ ...user, ...userDoc.data() });
          } else {
            setCurrentUser(user);
          }
        } catch {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Helper: safely create user doc (don't throw if Firestore is offline)
  const ensureUserDoc = async (user, extraData = {}) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const defaultSettings = {
        email: user.email,
        timezone: tz,
        emailSettings: {
          morningReminders: true,
          streakWarnings: true,
          morningHour: 7,
          warningHour: 21
        }
      };
      if (!snap.exists()) {
        await setDoc(userRef, {
          fullName: user.displayName || extraData.fullName || '',
          email: user.email,
          photoURL: user.photoURL || null,
          createdAt: new Date().toISOString(),
          ...defaultSettings,
          ...extraData,
        });

        // Trigger welcome email via Cloudflare Worker API
        try {
          fetch('https://anchor-email-worker.emaxstone12.workers.dev/welcome', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: user.email,
              name: user.displayName || extraData.fullName || 'there'
            })
          });
        } catch (emailErr) {
          console.warn('Failed to send welcome email:', emailErr.message);
        }
      } else {
        // Update timezone and ensure emailSettings structure exists
        const existingData = snap.data();
        await setDoc(userRef, {
          timezone: tz,
          emailSettings: {
            morningReminders: existingData.emailSettings?.morningReminders !== false,
            streakWarnings: existingData.emailSettings?.streakWarnings !== false,
            morningHour: existingData.emailSettings?.morningHour || 7,
            warningHour: existingData.emailSettings?.warningHour || 21
          }
        }, { merge: true });
      }
    } catch (err) {
      // Firestore offline — auth still succeeded, doc will be created on next online session
      console.warn('Could not write user doc to Firestore:', err.message);
    }
  };

  // ── Sign Up ──
  const signup = async (email, password, fullName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: fullName });
    await ensureUserDoc(cred.user, { fullName });
    return cred.user;
  };

  // ── Sign In ──
  const signin = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // ── Google Sign In (popup with redirect fallback) ──
  const signinWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    let result;
    try {
      result = await signInWithPopup(auth, provider);
    } catch (popupErr) {
      // Fallback to redirect if popup is blocked (CORS / popup-blocker)
      if (
        popupErr.code === 'auth/cors-unsupported' ||
        popupErr.code === 'auth/popup-blocked' ||
        popupErr.code === 'auth/network-request-failed'
      ) {
        await signInWithRedirect(auth, provider);
        return; // page will reload after redirect
      }
      throw popupErr;
    }
    // Auth succeeded — create user doc (won't throw if Firestore is offline)
    await ensureUserDoc(result.user);
    return result.user;
  };

  // ── Forgot Password ──
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // ── Upload Profile Photo ──
  const uploadProfilePhoto = async (file) => {
    if (!currentUser) throw new Error('Not authenticated');
    const storageRef = ref(storage, `profile-photos/${currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await updateProfile(auth.currentUser, { photoURL: url });
    await setDoc(
      doc(db, 'users', currentUser.uid),
      { photoURL: url },
      { merge: true }
    );
    setCurrentUser(prev => prev ? { ...prev, photoURL: url } : null);
    return url;
  };

  // ── Update Active Plan ──
  const updateActivePlan = async (newPlan) => {
    if (!currentUser) throw new Error('Not authenticated');
    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, { activePlan: newPlan }, { merge: true });
    setCurrentUser(prev => prev ? { ...prev, activePlan: newPlan } : null);
  };

  // ── Update User Profile ──
  const updateUserProfile = async (data) => {
    if (!currentUser) throw new Error('Not authenticated');
    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, data, { merge: true });
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
  };

  // ── Sign Out ──
  const logout = () => signOut(auth);

  const value = {
    currentUser,
    loading,
    signup,
    signin,
    signinWithGoogle,
    resetPassword,
    uploadProfilePhoto,
    logout,
    updateActivePlan,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
