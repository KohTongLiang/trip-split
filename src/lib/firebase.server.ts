import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { env } from '$env/dynamic/private';

let app: App;

if (!getApps().length) {
    // If GOOGLE_APPLICATION_CREDENTIALS is set, it will be used automatically by initializeApp()
    // Alternatively, we can use a service account object if provided in env vars
    // For now, we rely on standard auto-discovery or env vars.
    if (env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
            app = initializeApp({
                credential: cert(serviceAccount),
                projectId: env.VITE_FIREBASE_PROJECT_ID
            });
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT", e);
            app = initializeApp({
                projectId: env.VITE_FIREBASE_PROJECT_ID
            });
        }
    } else {
        // Fallback: Use explicit project ID from .env to avoid "Unable to detect Project Id"
        // This relies on ADC (gcloud auth application-default login) for actual credentials if interacting with proper services
        app = initializeApp({
            projectId: env.VITE_FIREBASE_PROJECT_ID
        });
    }
} else {
    app = getApp();
}

export { app };
export const db = getFirestore(app);
