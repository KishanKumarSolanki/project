// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6K-pzJQdYLDz9e0_r_Ctqr_7Om4tkRLw",
  authDomain: "e-commerce-f7f84.firebaseapp.com",
  projectId: "e-commerce-f7f84",
  storageBucket: "e-commerce-f7f84.firebasestorage.app",
  messagingSenderId: "835515287",
  appId: "1:835515287:web:e637a85ec5108679ec8ad2",
  measurementId: "G-ZYLV7W8RZD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);