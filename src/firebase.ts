import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import {
  buildUserProfileFromFirebaseAuth,
  deriveAccountIdFromUid,
  type UserProfile,
} from './utils/dashboardLogic';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;

const resolvedAuthDomain =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN?.trim()) ||
  firebaseConfig.authDomain;

export const app = initializeApp({
  ...firebaseConfig,
  authDomain: resolvedAuthDomain,
});
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const inFlightSyncByUid = new Map<string, Promise<UserProfile>>();

/**
 * Ensures the authenticated Firebase user has a strictly isolated profile document in /users/{uid}.
 * Never falls back to any hardcoded user profile, and deduplicates concurrent sync calls.
 */
export async function syncAuthenticatedUserProfile(
  firebaseUser: FirebaseUser
): Promise<UserProfile> {
  const existingSync = inFlightSyncByUid.get(firebaseUser.uid);
  if (existingSync) {
    return existingSync;
  }

  const syncPromise = (async () => {
    if (!firebaseUser.emailVerified || auth.currentUser?.uid !== firebaseUser.uid) {
      return buildUserProfileFromFirebaseAuth(firebaseUser);
    }

    const userPath = `users/${firebaseUser.uid}`;
    const userRef = doc(db, 'users', firebaseUser.uid);

    let existingData: Partial<UserProfile> | null = null;
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        existingData = snap.data() as Partial<UserProfile>;
      }
    } catch (error) {
      if (auth.currentUser?.uid !== firebaseUser.uid) {
        return buildUserProfileFromFirebaseAuth(firebaseUser);
      }
      handleFirestoreError(error, OperationType.GET, userPath);
    }

    if (auth.currentUser?.uid !== firebaseUser.uid) {
      return buildUserProfileFromFirebaseAuth(firebaseUser);
    }

    if (!existingData) {
      const derivedAccountId = deriveAccountIdFromUid(firebaseUser.uid);
      const email = (firebaseUser.email || '').trim().slice(0, 100);
      const trimmedDisplayName = (firebaseUser.displayName || '').trim();
      const displayName = (
        trimmedDisplayName ||
        (email ? email.split('@')[0] : 'Eyemaze Client')
      )
        .trim()
        .slice(0, 100);
      const photoUrl = (firebaseUser.photoURL || '').slice(0, 512);

      const newUserDoc = {
        uid: firebaseUser.uid,
        name: displayName,
        email,
        role: 'client' as const,
        accountId: derivedAccountId,
        photoUrl,
        emailVerified: Boolean(firebaseUser.emailVerified),
        balanceNpr: 0,
        isVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      try {
        await setDoc(userRef, newUserDoc);
      } catch (error) {
        if (auth.currentUser?.uid !== firebaseUser.uid) {
          return buildUserProfileFromFirebaseAuth(firebaseUser);
        }
        handleFirestoreError(error, OperationType.CREATE, userPath);
      }

      return buildUserProfileFromFirebaseAuth(firebaseUser, newUserDoc);
    }

    // Sync fresh displayName/photoUrl from Google on allowed keys only
    const latestName = (firebaseUser.displayName || existingData.name || '').trim().slice(0, 100);
    const latestPhoto = (firebaseUser.photoURL || existingData.photoUrl || '').slice(0, 512);
    if (
      latestName &&
      (latestName !== existingData.name || latestPhoto !== (existingData.photoUrl || ''))
    ) {
      try {
        await updateDoc(userRef, {
          name: latestName,
          photoUrl: latestPhoto,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        if (auth.currentUser?.uid !== firebaseUser.uid) {
          return buildUserProfileFromFirebaseAuth(firebaseUser);
        }
        handleFirestoreError(error, OperationType.UPDATE, userPath);
      }
    }

    return buildUserProfileFromFirebaseAuth(firebaseUser, {
      ...existingData,
      name: latestName || existingData.name,
      photoUrl: latestPhoto,
    });
  })();

  inFlightSyncByUid.set(firebaseUser.uid, syncPromise);
  try {
    return await syncPromise;
  } finally {
    inFlightSyncByUid.delete(firebaseUser.uid);
  }
}

export async function signInWithGoogle(): Promise<UserProfile> {
  const credential = await signInWithPopup(auth, googleProvider);
  try {
    await credential.user.reload();
    await credential.user.getIdToken(true);
  } catch {
    // Ignore transient reload error and inspect token state directly
  }
  if (!credential.user.emailVerified) {
    let verificationSent = false;
    try {
      await sendEmailVerification(credential.user);
      verificationSent = true;
    } catch {
      // Ignore if verification email rate-limited or unsupported
    }
    await signOut(auth);
    const err = new Error(
      verificationSent
        ? `Verification link sent to ${credential.user.email || 'your email'}. Please verify it in your inbox and sign in again.`
        : 'Google account email must be verified before signing in. Please use a verified @gmail.com account or check Firebase Auth User Account Linking settings.'
    ) as Error & { code?: string };
    err.code = verificationSent ? 'auth/verification-sent' : 'auth/email-not-verified';
    throw err;
  }
  return syncAuthenticatedUserProfile(credential.user);
}

export async function signOutFirebase(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthChanges(
  onUser: (user: UserProfile | null) => void,
  onError?: (err: unknown) => void
): () => void {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      onUser(null);
      return;
    }
    if (!firebaseUser.emailVerified) {
      try {
        await firebaseUser.reload();
      } catch {
        // Ignore transient reload errors
      }
      if (!firebaseUser.emailVerified || auth.currentUser?.uid !== firebaseUser.uid) {
        onUser(null);
        return;
      }
    }
    if (auth.currentUser?.uid !== firebaseUser.uid) {
      onUser(null);
      return;
    }
    try {
      const profile = await syncAuthenticatedUserProfile(firebaseUser);
      if (auth.currentUser?.uid === firebaseUser.uid) {
        onUser(profile);
      } else {
        onUser(null);
      }
    } catch (err) {
      if (auth.currentUser?.uid !== firebaseUser.uid) {
        onUser(null);
        return;
      }
      if (onError) onError(err);
      onUser(buildUserProfileFromFirebaseAuth(firebaseUser));
    }
  });
}

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore connection: Client is offline or check configuration.');
      return false;
    }
    return true;
  }
}
