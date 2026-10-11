import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

// Replace these placeholders with your own Firebase web app configuration
// from Firebase Console > Project settings > General > Your apps > Config.
// Firebase web configuration is public; never add service-account private keys.
const firebaseConfig = {
  apiKey: "AIzaSyAWO4bllHzDPwM2kju6U27J4bdGiHI5NN4",
  authDomain: "halloween-43c89.firebaseapp.com",
  projectId: "halloween-43c89",
  storageBucket: "halloween-43c89.firebasestorage.app",
  messagingSenderId: "423504644859",
  appId: "1:423504644859:web:c48f23680ad556074a3e5e",
  measurementId: "G-4ZRELDHCK5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rsvps = collection(db, "rsvps");
export const isConfigured = !Object.values(firebaseConfig).some((v) =>
  v.includes("XXXX")
);
export function saveRSVP(name, status, plusOnes) {
  return addDoc(rsvps, { name, status, plusOnes });
}
export function listenToRSVPs(onGuests, onError) {
  return onSnapshot(
    rsvps,
    (snapshot) => {
      onGuests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    },
    onError
  );
}
