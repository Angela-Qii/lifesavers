// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHrH1nO3VNlPYmf0Tl4qbRLn8-revwk8I",
  authDomain: "lifesavers-d109c.firebaseapp.com",
  projectId: "lifesavers-d109c",
  storageBucket: "lifesavers-d109c.firebasestorage.app",
  messagingSenderId: "849219452280",
  appId: "1:849219452280:web:e2e366aff22fc3430ddc8d",
  databaseURL: "https://lifesavers-d109c.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);