import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCEqXR1tMVLA28GHHkOjF1pCK1VVlTOnLw",
  authDomain: "findgames2.firebaseapp.com",
  databaseURL: "https://findgames2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "findgames2",
  storageBucket: "findgames2.firebasestorage.app",
  messagingSenderId: "135428462089",
  appId: "1:135428462089:web:aad3717bb6aef03f764ad8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);