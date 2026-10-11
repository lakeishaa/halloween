
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWO4bllHzDPwM2kju6U27J4bdGiHI5NN4",
    authDomain: "halloween-43c89.firebaseapp.com",
    projectId: "halloween-43c89",
    storageBucket: "halloween-43c89.firebasestorage.app",
    messagingSenderId: "423504644859",
    appId: "1:423504644859:web:c48f23680ad556074a3e5e",
    measurementId: "G-4ZRELDHCK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to RSVP collection
export const rsvpsCollection = collection(db, "rsvps");

// Save a new RSVP
export async function saveRSVP(name, status, plusOnes) {
  return await addDoc(rsvpsCollection, {
    name,
    status,
    plusOnes
  });
}

// Listen for real-time updates
export function listenToRSVPs(callback, onError) {
  return onSnapshot(rsvpsCollection, (snapshot) => {
    const guests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    callback(guests);
  }, onError);
}
