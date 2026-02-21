// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDCtQuf6HwD84B_07hZn_ezsljvHGSJ_p8",
    authDomain: "vibrend-agency.firebaseapp.com",
    projectId: "vibrend-agency",
    storageBucket: "vibrend-agency.firebasestorage.app",
    messagingSenderId: "811723000002",
    appId: "1:811723000002:web:5f5302ea35f86e9284d35b",
    measurementId: "G-Z0VJYY8E6E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);