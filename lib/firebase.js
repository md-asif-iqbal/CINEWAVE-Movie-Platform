import { initializeApp, getApps } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCUHkhNuyQcgZUOIUcqbV22IHfPOF22FnM",
  authDomain: "cinewave-movie-platfrom.firebaseapp.com",
  projectId: "cinewave-movie-platfrom",
  storageBucket: "cinewave-movie-platfrom.firebasestorage.app",
  messagingSenderId: "512003068640",
  appId: "1:512003068640:web:13d84a40b487529fbfb685",
  measurementId: "G-BVMVLEJ9K0",
};

// Initialize Firebase (prevent duplicate init)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Google provider
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup };
