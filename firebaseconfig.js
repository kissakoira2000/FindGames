import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDci78DERnHha-iRD90Fu_80aN04AZcfwc",
  authDomain: "findgames-b0407.firebaseapp.com",
  projectId: "findgames-b0407",
  storageBucket: "findgames-b0407.firebasestorage.app",
  messagingSenderId: "711135087589",
  appId: "1:711135087589:web:f002ae74cdd3c0e6b5bd0c",
  measurementId: "G-61W5K6MYR3"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;