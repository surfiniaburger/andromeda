import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// --- Secret Manager Setup ---
const client = new SecretManagerServiceClient();
const secretName = 'projects/gem-rush-007/secrets/firebase-config/versions/latest'; // IMPORTANT: Replace with your project ID and secret name

async function getFirebaseConfig() {
    try {
        const [version] = await client.accessSecretVersion({ name: secretName });
        if (!version.payload || !version.payload.data) {
            throw new Error("Secret payload is empty or undefined.");
        }
        const secretString = version.payload.data.toString();
        const firebaseConfig = JSON.parse(secretString);
        return firebaseConfig;
    } catch (error) {
        console.error('Error accessing Secret Manager:', error);
        // Handle the error appropriately.  In production, you might:
        // - Log the error to a monitoring system.
        // - Throw the error to stop the application (fail fast).
        // - Display a user-friendly error message (if appropriate).
        throw error; // Re-throw to prevent initialization with invalid config.
    }
}
// --- Firebase Initialization ---
async function initializeFirebase() {
    try{
        const firebaseConfig = await getFirebaseConfig();

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        // Initialize analytics conditionally (only in production and if supported)
        const initializeAnalytics = async () => {
            const analyticsSupported = await isSupported();
            if (analyticsSupported && !import.meta.env.DEV) {
                return getAnalytics(app);
            }
            return null;
        };

        const analytics = await initializeAnalytics();

        // Connect to auth emulator only in development
        if (import.meta.env.DEV) {
            console.log("Running in emulator mode. Do not use with production credentials.");
            connectAuthEmulator(auth, 'http://127.0.0.1:9099');
        } else {
            console.log("Running in production mode with real Firebase services.");
        }

        return { app, auth, analytics };

    }catch(error){
        console.error('Error during firebase initialization', error);
        throw error
    }

}

const { app, auth, analytics } = await initializeFirebase();
export { app, auth, analytics };