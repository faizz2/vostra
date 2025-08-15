import { db } from "./firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.querySelector(".form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    kategori: document.getElementById("kategori").value,
    lomba: document.getElementById("lomba").value,
    sesi: document.getElementById("sesi").value,
    juara1: document.getElementById("participant_juara1").value,
    juara2: document.getElementById("participant_juara2").value,
    juara3: document.getElementById("participant_juara3").value,
    juara4: document.getElementById("participant_juara4").value,
    juara5: document.getElementById("participant_juara5").value,
  };

  const peserta = [
    data.juara1,
    data.juara2,
    data.juara3,
    data.juara4,
    data.juara5,
  ];

  const pesertaIsi = peserta.filter((p) => p !== "");
  const setPeserta = new Set(pesertaIsi);

  if (setPeserta.size !== peserta.length) {
    alert("Satu peserta tidak boleh menempati lebih dari satu posisi juara!");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "hasil_lomba"), data);
    console.log(`Data berhasil disimpan! dengan id ${docRef.id}`);
    form.reset();
  } catch (error) {
    console.error("Gagal menyimpan data", error);
  }
});
