import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACzRZuA1xA-xtd3OTKeoyMe6wJs7vD4Wo",
  authDomain: "tic-tac-toe-38147.firebaseapp.com",
  projectId: "tic-tac-toe-38147",
  storageBucket: "tic-tac-toe-38147.firebasestorage.app",
  messagingSenderId: "274521955654",
  appId: "1:274521955654:web:a3e5c3036bcd427c0c9947"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
