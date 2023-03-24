
import app from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyDVCweL6mS6oBQQo_N8UkC38Gc70osZZ5Q",
  authDomain: "bt3103-finalproject.firebaseapp.com",
  projectId: "bt3103-finalproject",
  storageBucket: "bt3103-finalproject.appspot.com",
  messagingSenderId: "154283137147",
  appId: "1:154283137147:web:db05648c55c5a468556ade",
  measurementId: "G-E80P9W6FDE",
};
// Initialize Firebase
app.initializeApp(firebaseConfig);

export const firebase = app;
export const storage = app.storage();
export const db = app.firestore();
export const storageRef = app.storage().ref();

export const usersRef = db.collection("users");
export const roomsRef = db.collection("chatRooms");
export const messagesRef = (roomId) =>
  roomsRef.doc(roomId).collection("messages");

export const filesRef = storageRef.child("files");

export const dbTimestamp = firebase.firestore.FieldValue.serverTimestamp();
export const deleteDbField = firebase.firestore.FieldValue.delete();