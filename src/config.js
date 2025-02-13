import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC5PlQ2KEMQg7WvHEGwDXeFiQ71uENV5kg",
  authDomain: "expense-tracker-158d8.firebaseapp.com",
  projectId: "expense-tracker-158d8",
  storageBucket: "expense-tracker-158d8.firebasestorage.app",
  messagingSenderId: "814951441510",
  appId: "1:814951441510:web:76ab8a632e46228999b9a7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app) 
export const db = getFirestore()
