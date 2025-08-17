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

  const pesertaIsi = peserta.filter((p) => p && p.trim() !== "");

  const setPeserta = new Set(pesertaIsi);
  if (setPeserta.size !== pesertaIsi.length) {
    alert("Satu peserta tidak boleh menempati lebih dari satu posisi juara!");
    return;
  }

  const showSuccessPopup = (message) => {
    const popup = document.getElementById("success-popup");
    popup.textContent = "✅ " + message;
    popup.classList.remove("hidden");
    setTimeout(() => popup.classList.add("show"), 10);

    setTimeout(() => {
      popup.classList.remove("show");
      setTimeout(() => popup.classList.add("hidden"), 300);
    }, 3000);
  };

  try {
    await addDoc(collection(db, "hasil_lomba"), data);
    showSuccessPopup("Data berhasil disimpan!");

    const lombaValue = document.getElementById("lomba").value;

    form.reset();
    document.getElementById("lomba").value = lombaValue;

    // 🔥 cek apakah sesi lomba ini sudah selesai
    await cekSelesaiLomba(lombaValue);
  } catch (error) {
    console.error("Gagal menyimpan data", error);
  }
});

// ✅ fungsi cek sesi selesai
async function cekSelesaiLomba(lomba) {
  const q = query(collection(db, "hasil_lomba"), where("lomba", "==", lomba));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return;

  const hasil = snapshot.docs.map((doc) => doc.data());
  const sesiSet = new Set(hasil.map((h) => h.sesi));
  const jumlahSesi = sesiSet.size;

  // default: anggap selesai kalau >=5 sesi
  if (jumlahSesi >= 5) {
    const juara1List = hasil
      .map((h) => h.juara1)
      .filter((n) => n && n.trim() !== "");

    showFinalPopup(lomba, juara1List);
  }
}

// ✅ popup final
function showFinalPopup(lomba, juara1List) {
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
    <h2>Final ${lomba}</h2>
    <p>Daftar Juara 1 dari setiap sesi:</p>
    <ul>
      ${juara1List.map((nama) => `<li>${nama}</li>`).join("")}
    </ul>
    <button id="closePopup">Tutup</button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  document.getElementById("closePopup").addEventListener("click", () => {
    document.body.removeChild(overlay);
  });
}
