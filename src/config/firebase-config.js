import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwdB8P9V65fgDtMDBNMRYMOhuF5c-KP5Q",
  authDomain: "database-schema-construc-58881.firebaseapp.com",
  projectId: "database-schema-construc-58881",
  storageBucket: "database-schema-construc-58881.appspot.com",
  messagingSenderId: "7723800929",
  appId: "1:7723800929:web:c045f763abee2a05698d20"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);