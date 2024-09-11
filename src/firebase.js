import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAR2SGRLp8LXyeIRsGf3VH41u7vDQa8dxM",
    authDomain: "inventory-fe910.firebaseapp.com",
    projectId: "inventory-fe910",
    storageBucket: "inventory-fe910.appspot.com",
    messagingSenderId: "226605313809",
    appId: "1:226605313809:web:d9c73b07561517fd23e6b0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

