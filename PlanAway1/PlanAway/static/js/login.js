// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkb-EcRxHOmeaiwv32RvpbiBqhZmnz7RQ",
  authDomain: "planaway-440ba.firebaseapp.com",
  projectId: "planaway-440ba",
  storageBucket: "planaway-440ba.appspot.com",
  messagingSenderId: "1013793686325",
  appId: "1:1013793686325:web:10059ff420ec912f37427c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function ingresar(){
  console.log('diste un click')
}

function registrar(){
  console.log('registrate')
}