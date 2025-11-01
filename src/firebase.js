// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHuMyQtEsf1ai7-M6xwCncnPqsAlhq6jc",
  authDomain: "kindergarden-advance.firebaseapp.com",
  projectId: "kindergarden-advance",
  storageBucket: "kindergarden-advance.firebasestorage.app",
  messagingSenderId: "378873765917",
  appId: "1:378873765917:web:aeb8b470f7aced84efe6f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and database
export const auth = getAuth(app);
export const db = getFirestore(app);
