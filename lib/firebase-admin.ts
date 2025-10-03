import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "@/confidential/firebase-admin.json";

let adminApp: App;

if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert(serviceAccount as any),
  });
} else {
  adminApp = getApps()[0];
}

export { adminApp };
export const adminAuth = getAuth();
export const adminDb = getFirestore();
