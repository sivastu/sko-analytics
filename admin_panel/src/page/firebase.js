// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHHkz3Xz7hbQo5csbcJA-pmZhLJx91rdQ",
  authDomain: "fir-libdemo-53192.firebaseapp.com",
  databaseURL: "https://fir-libdemo-53192-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-libdemo-53192",
  databaseUrl : "https://fir-libdemo-53192-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "fir-libdemo-53192.appspot.com",
  messagingSenderId: "57477045352",
  appId: "1:57477045352:web:e8d393314a67fbef502fdd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app