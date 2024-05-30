// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAiTT5f_a4ldnRmbyiPIAh2kV5wQIM_x4",
  authDomain: "webchat-87265.firebaseapp.com",
  projectId: "webchat-87265",
  storageBucket: "webchat-87265.appspot.com",
  messagingSenderId: "960065690729",
  appId: "1:960065690729:web:20794eb965d06d334416f8",
  measurementId: "G-Y2X8E8ZMT8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);