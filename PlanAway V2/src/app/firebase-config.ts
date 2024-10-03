// src/app/firebase-config.ts
import { initializeApp } from 'firebase/app';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBkb-EcRxHOmeaiwv32RvpbiBqhZmnz7RQ",
  authDomain: "planaway-440ba.firebaseapp.com",
  projectId: "planaway-440ba",
  storageBucket: "planaway-440ba.appspot.com",
  messagingSenderId: "1013793686325",
  appId: "1:1013793686325:web:10059ff420ec912f37427c"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);
