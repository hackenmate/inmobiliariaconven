import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, FieldValue, type Firestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;
let dbUnavailable = false;

function getAdminApp(): App | null {
  if (dbUnavailable) return null;
  if (cachedApp) return cachedApp;

  try {
    if (getApps().length > 0) {
      cachedApp = getApps()[0];
      return cachedApp;
    }

    const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    if (serviceAccountRaw) {
      const parsed = JSON.parse(serviceAccountRaw);
      cachedApp = initializeApp({
        credential: cert(parsed),
        projectId: firebaseConfig.projectId,
      });
    } else {
      cachedApp = initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
    return cachedApp;
  } catch {
    dbUnavailable = true;
    return null;
  }
}

export function getAdminFirestore(): Firestore | null {
  if (dbUnavailable) return null;
  if (cachedDb) return cachedDb;

  const app = getAdminApp();
  if (!app) return null;

  try {
    cachedDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    return cachedDb;
  } catch {
    dbUnavailable = true;
    return null;
  }
}

export interface LeadRecordInput {
  referenceCode: string;
  intent: 'buy' | 'sell';
  fullName: string;
  email: string;
  phone: string;
  interest: string;
  receivedAt: string;
}

export async function saveLeadToFirestore(record: LeadRecordInput): Promise<boolean> {
  const adminDb = getAdminFirestore();
  if (!adminDb) return false;

  try {
    await adminDb.collection('leads').doc(record.referenceCode).set({
      referenceCode: record.referenceCode,
      intent: record.intent,
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      interest: record.interest,
      status: 'new',
      ownerUid: 'web-lead-submission',
      createdAt: FieldValue.serverTimestamp(),
    });
    return true;
  } catch {
    dbUnavailable = true;
    return false;
  }
}
