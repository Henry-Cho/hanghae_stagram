import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBzhGq9Yu1_3PyOSid_Y1b5k4NU5IjKZY4",
  authDomain: "sparta-image-community.firebaseapp.com",
  projectId: "sparta-image-community",
  storageBucket: "sparta-image-community.appspot.com",
  messagingSenderId: "805365268213",
  appId: "1:805365268213:web:7ebb4fce5743ecd78b4fbc",
  measurementId: "G-GRN8Q366NK",
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, apiKey, firestore, storage };
