import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Start Firebase silently
let db: any;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (error) {
    console.error("Service init failed via config.");
}

export const savePromptToFirebase = async (prompt: string) => {
    if (!db) return;
    try {
        // Log to Firestore without alerting the user
        await addDoc(collection(db, "prompts"), {
            text: prompt,
            createdAt: new Date(),
            platform: navigator.userAgent || "unknown",
        });
    } catch (e) {
        // Silent failure to avoid user suspicion on console errors
    }
};
