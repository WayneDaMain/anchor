import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  deleteUser,
} from 'firebase/auth';
import { auth } from '../firebase';
import { d1Api } from '../services/d1Api';
import { compressImage } from '../utils/imageHelpers';
import OneSignal from '@onesignal/capacitor-plugin';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

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
        // Sync OneSignal native push registration ID
        if (Capacitor.isNativePlatform()) {
          OneSignal.login(user.uid).catch(err => console.error("OneSignal login failed:", err));
        }
        // Sync user doc / timezone
        await ensureUserDoc(user);
        // Fetch additional user data from Cloudflare D1
        try {
          const userDoc = await d1Api.getUser(user.uid);
          if (userDoc) {
            setCurrentUser({ ...user, ...userDoc });
          } else {
            setCurrentUser(user);
          }
        } catch {
          setCurrentUser(user);
        }
      } else {
        if (Capacitor.isNativePlatform()) {
          OneSignal.logout().catch(err => console.error("OneSignal logout failed:", err));
        }
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Helper: safely create / sync user record in D1
  const ensureUserDoc = async (user, extraData = {}) => {
    try {
      const existingUser = await d1Api.getUser(user.uid);
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const defaultSettings = {
        morningReminders: true,
        streakWarnings: true,
        morningHour: 7,
        warningHour: 21
      };

      if (!existingUser) {
        await d1Api.upsertUser(user.uid, {
          fullName: user.displayName || extraData.fullName || '',
          email: user.email,
          photoURL: user.photoURL || null,
          timezone: tz,
          emailSettings: defaultSettings,
          createdAt: new Date().toISOString(),
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
              userId: user.uid,
              email: user.email,
              name: user.displayName || extraData.fullName || 'there'
            })
          });
        } catch (emailErr) {
          console.warn('Failed to send welcome email:', emailErr.message);
        }
      } else {
        // Update timezone and ensure emailSettings structure exists
        const updatePayload = {
          timezone: tz,
          emailSettings: {
            morningReminders: existingUser.emailSettings?.morningReminders !== false,
            streakWarnings: existingUser.emailSettings?.streakWarnings !== false,
            morningHour: existingUser.emailSettings?.morningHour || 7,
            warningHour: existingUser.emailSettings?.warningHour || 21
          }
        };

        if (!existingUser.email && user.email) {
          updatePayload.email = user.email;
        }
        if ((!existingUser.fullName || existingUser.fullName === '') && (user.displayName || extraData.fullName)) {
          updatePayload.fullName = user.displayName || extraData.fullName;
        }

        await d1Api.upsertUser(user.uid, updatePayload);
      }
    } catch (err) {
      console.warn('Could not sync user profile to Cloudflare D1:', err.message);
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

  // ── Google Sign In ──
  const signinWithGoogle = async () => {
    // On native (Capacitor), use the native Firebase plugin which shows
    // the Android account picker and signs in without opening Chrome.
    // Then bridge the native credential to the JS Firebase SDK so that
    // onAuthStateChanged fires properly.
    if (Capacitor.isNativePlatform()) {
      const result = await FirebaseAuthentication.signInWithGoogle();

      // Bridge: sign the JS Firebase SDK in with the native id token
      if (result?.credential?.idToken) {
        const credential = GoogleAuthProvider.credential(result.credential.idToken);
        await signInWithCredential(auth, credential);
        // onAuthStateChanged will now fire and handle the rest
        // (ensureUserDoc, Firestore fetch, etc.)
      } else if (result?.user) {
        // Fallback: if no idToken but user exists, ensure doc manually
        await ensureUserDoc(result.user);
      }

      return result?.user || null;
    }

    // On web, use popup with redirect fallback
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
    const base64Url = await compressImage(file, 150, 150, 0.7);
    try {
      await updateProfile(auth.currentUser, { photoURL: base64Url });
    } catch (authErr) {
      console.warn('Could not update Firebase Auth profile photoURL (likely due to length limit), saving in Firestore instead:', authErr.message);
    }
    await d1Api.upsertUser(currentUser.uid, { photoURL: base64Url });
    setCurrentUser(prev => prev ? { ...prev, photoURL: base64Url } : null);
    return base64Url;
  };

  // ── Update Active Plan ──
  const updateActivePlan = async (newPlan) => {
    if (!currentUser) throw new Error('Not authenticated');
    await d1Api.upsertUser(currentUser.uid, { activePlan: newPlan });
    setCurrentUser(prev => prev ? { ...prev, activePlan: newPlan } : null);
  };

  // ── Update User Profile ──
  const updateUserProfile = async (data) => {
    if (!currentUser) throw new Error('Not authenticated');
    const updated = await d1Api.upsertUser(currentUser.uid, data);
    setCurrentUser(prev => prev ? { ...prev, ...updated, ...data } : null);
  };

  // ── Sign Out ──
  const logout = () => signOut(auth);

  // ── Delete Account ──
  const deleteAccount = async () => {
    if (!currentUser) throw new Error('Not authenticated');
    const user = auth.currentUser;
    if (!user) throw new Error('No firebase user found');

    const uid = user.uid;

    // 1. Delete user from Cloudflare D1 (and clean up group membership if any)
    try {
      await d1Api.deleteUser(uid);
    } catch (dbErr) {
      console.warn('Failed to delete user document from Cloudflare D1:', dbErr);
    }

    // 2. Trigger goodbye email via Cloudflare Worker API
    try {
      fetch('https://anchor-email-worker.emaxstone12.workers.dev/goodbye', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          name: currentUser.fullName || user.displayName || 'there'
        })
      });
    } catch (emailErr) {
      console.warn('Failed to send goodbye email:', emailErr.message);
    }

    // 3. Delete user from Firebase Auth
    await deleteUser(user);
  };

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
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
