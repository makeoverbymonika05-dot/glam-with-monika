import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuQwokIYnz65-0-bVD9RSrn3f9ZTfPuGc",
  authDomain: "monika-glam-8fb10.firebaseapp.com",
  projectId: "monika-glam-8fb10",
  storageBucket: "monika-glam-8fb10.firebasestorage.app",
  messagingSenderId: "557369211681",
  appId: "1:557369211681:web:1b822d02a30b6a4a011c60",
  measurementId: "G-WWK9MZYYWY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
