import type { Firestore } from "firebase/firestore";

// Not: Firebase web config'i (apiKey dahil) gizli değildir, tarayıcıda görünmesi
// normaldir. Asıl koruma firestore.rules dosyasındaki kurallardır — o kurallar
// Firebase'e deploy edilmeden bu koleksiyonlar dışarıya açık kalır.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firestore kurallarındaki sınırlarla aynı tutulmalı
export const CONTACT_LIMITS = {
    name: 80,
    email: 254,
    message: 5000,
} as const;
const PROMPT_MAX = 600;
const UA_MAX = 500;

// Firebase SDK büyük (~300 KB); ilk açılışı yavaşlatmasın diye sadece
// gerektiğinde (sayaç, form, chatbot) dinamik olarak yükleniyor.
// Corporate firewall'lar Firebase'i bloklarsa sessizce fail olsun.
let dbPromise: Promise<Firestore | null> | null = null;
const getDb = () => {
    dbPromise ??= Promise.all([import("firebase/app"), import("firebase/firestore")])
        .then(([{ initializeApp }, { getFirestore }]) => getFirestore(initializeApp(firebaseConfig)))
        .catch(() => null);
    return dbPromise;
};

const userAgent = () => (navigator.userAgent || "unknown").slice(0, UA_MAX);

export const savePromptToFirebase = async (prompt: string) => {
    const db = await getDb();
    if (!db) return;
    try {
        const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
        await addDoc(collection(db, "prompts"), {
            text: prompt.slice(0, PROMPT_MAX),
            createdAt: serverTimestamp(),
            platform: userAgent(),
        });
    } catch {
        // kayıt başarısız olsa da sohbet devam etsin
    }
};

export type ContactMessage = {
    email: string;
    firstName: string;
    lastName: string;
    message: string;
};

export const saveContactMessage = async (data: ContactMessage): Promise<boolean> => {
    const db = await getDb();
    if (!db) {
        return false;
    }
    try {
        const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
        await addDoc(collection(db, "contacts"), {
            email: data.email.trim().slice(0, CONTACT_LIMITS.email),
            firstName: data.firstName.trim().slice(0, CONTACT_LIMITS.name),
            lastName: data.lastName.trim().slice(0, CONTACT_LIMITS.name),
            message: data.message.trim().slice(0, CONTACT_LIMITS.message),
            createdAt: serverTimestamp(),
            platform: userAgent(),
        });
        return true;
    } catch {
        return false;
    }
};

/**
 * Atomic visitor counter via Firestore.
 * - Sadece session başına 1 kez increment yapar (sessionStorage flag ile)
 * - Firebase blokluysa veya hata varsa null döner — UI hide eder
 */
export const getVisitorCount = async (): Promise<number | null> => {
    const db = await getDb();
    if (!db) return null;

    const SESSION_KEY = "visit_counted";
    const shouldIncrement = !sessionStorage.getItem(SESSION_KEY);

    try {
        const { doc, getDoc, setDoc, increment } = await import("firebase/firestore");
        const counterRef = doc(db, "stats", "visitors");

        if (shouldIncrement) {
            await setDoc(counterRef, { count: increment(1) }, { merge: true });
            sessionStorage.setItem(SESSION_KEY, "1");
        }

        const snapshot = await getDoc(counterRef);
        if (snapshot.exists()) {
            const value = snapshot.data().count;
            return typeof value === "number" ? value : null;
        }
        return 0;
    } catch {
        return null;
    }
};
