// Firebase config (Auth + Firestore)

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDi91-uXBDIOzAGAi5KkjGer9ihPgn5Zgk",
  authDomain: "mcqprojectr3413.firebaseapp.com",
  projectId: "mcqprojectr3413",
  storageBucket: "mcqprojectr3413.firebasestorage.app",
  messagingSenderId: "55518735088",
  appId: "1:55518735088:web:322ea24c35e327e91bf035",
  measurementId: "G-K8M670D9SC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();