// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbyVDI-57ACOmlDs_GNNsE0RZyuJfSpDo",
  authDomain: "vostra-db083.firebaseapp.com",
  projectId: "vostra-db083",
  storageBucket: "vostra-db083.firebasestorage.app",
  messagingSenderId: "863640133201",
  appId: "1:863640133201:web:341d3f4f630d59d988e270",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// //testing
// const addDataToFirestore = async () => {
//   try {
//     const docRef = await addDoc(collection(db, "testing"), {
//       nama: "jatpi",
//       status: "belajar firebase",
//     });
//     console.log("berhasil ditambahkan dengan id:", docRef.id);
//   } catch (e) {
//     console.error("gagal menambahkan data:", e);
//   }
// };

// addDataToFirestore();
export { db };
