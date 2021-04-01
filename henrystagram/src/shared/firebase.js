import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAkAf474834rPo0IFomMGXG4PFAmNR8pAQ",
  authDomain: "sparta-instagram.firebaseapp.com",
  projectId: "sparta-instagram",
  storageBucket: "sparta-instagram.appspot.com",
  messagingSenderId: "106304362073",
  appId: "1:106304362073:web:2bb772cacc772067c30348",
  measurementId: "G-37YFNY9ZT7",
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, apiKey, firestore, storage };
