import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDEUZbhJFNuIGCEc4UHMM9-l74nozsvUa0",
  authDomain: "game-of-life-27d2f.firebaseapp.com",
  projectId: "game-of-life-27d2f",
  storageBucket: "game-of-life-27d2f.appspot.com",
  messagingSenderId: "979344373657",
  appId: "1:979344373657:web:97ee4d4864447946ad0508",
  measurementId: "G-J76Q92XYB6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);

export { auth, firestore, database };
export default app;
