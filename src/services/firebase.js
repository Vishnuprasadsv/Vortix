import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAEsR8Y_wifE-F2LucLm01mP1xDKEGC9LE",
    authDomain: "vortix-crypto-analysis.firebaseapp.com",
    projectId: "vortix-crypto-analysis",
    storageBucket: "vortix-crypto-analysis.firebasestorage.app",
    messagingSenderId: "79677005188",
    appId: "1:79677005188:web:f2129f6fd9701c370f11d1",
    measurementId: "G-L2ND5HYKE0"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
