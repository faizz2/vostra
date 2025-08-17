import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.querySelector(".form");
const kategori = document.getElementById("kategori");
const participant_juara1 = document.getElementById("participant_juara1");
const participant_juara2 = document.getElementById("participant_juara2");
const participant_juara3 = document.getElementById("participant_juara3");
const participant_juara4 = document.getElementById("participant_juara4");
const participant_juara5 = document.getElementById("participant_juara5");

const nama_anak = [
  { value: "", label: "Tidak Ada" },
  { value: "ciro", label: "Ciro" },
  { value: "haikal", label: "Haikal" },
  { value: "jani", label: "Jani" },
  { value: "maurel", label: "Maurel" },
  { value: "icha", label: "Icha" },
  { value: "lula", label: "Lula" },
  { value: "tiara", label: "Tiara" },
  { value: "alesa", label: "Alesa" },
  { value: "gaji", label: "Gaji" },
  { value: "aldi", label: "Aldi" },
  { value: "salma", label: "Salma" },
  { value: "rahel", label: "Rahel" },
  { value: "kansa", label: "Kansa" },
  { value: "valen", label: "Valen" },
  { value: "rajik", label: "Rajik" },
  { value: "fayra", label: "Fayra" },
  { value: "naurel", label: "Naurel" },
  { value: "fathian", label: "Fathian" },
  { value: "marvel", label: "Marvel" },
  { value: "hendi", label: "Hendi" },
  { value: "gani", label: "Gani" },
  { value: "keenan", label: "Keenan" },
  { value: "camilla", label: "Camilla" },
  { value: "beryl", label: "Beryl" },
  { value: "ubai", label: "Ubai" },
  { value: "unai", label: "Unai" },
  { value: "zia", label: "Zia" },
];

const nama_ortu = [
  { value: "", label: "Tidak Ada" },
  { value: "teh-sinta", label: "Teh Sinta", poin: 4 },
  { value: "mamah-eja", label: "Mamah Eja", poin: 4 },
  { value: "mamah-kembar", label: "Mamah Kembar", poin: null },
  { value: "mamah-aldi", label: "Mamah Aldi", poin: 2 },
  { value: "mamah-iwan", label: "Mamah Iwan", poin: 3 },
  { value: "bapa-iwan", label: "Bapa Iwan", poin: 1 },
  { value: "mamah-meru", label: "Mamah Meru", poin: 3 },
  { value: "bapa-haikal", label: "Bapa Haikal", poin: 4 },
  { value: "mamah-dapa", label: "Mamah Dapa", poin: 2 },
  { value: "mamah-io", label: "Mamah Io", poin: 1 },
  { value: "pade", label: "Pade", poin: 5 },
  { value: "mamah-valen", label: "Mamah Valen", poin: 5 },
  { value: "mamah-pais", label: "Mamah Pais", poin: 1 },
  { value: "mamah-ica", label: "Mamah Ica", poin: 3 },
  { value: "teh-adel", label: "Teh Adel", poin: 3 },
  { value: "teh-elfa", label: "Teh Elfa", poin: 4 },
  { value: "teh-dewi", label: "Teh Dewi", poin: 5 },
  { value: "mamah-gani", label: "Mamah Gani", poin: 1 },
  { value: "mamah-akbar", label: "Mamah Akbar", poin: 2 },
  { value: "mamah-rachel", label: "Mamah Rachel", poin: null },
  { value: "a-io", label: "A Io", poin: 2 },
  { value: "a-endi", label: "A Endi", poin: 1 },
  { value: "ibu-iman", label: "Ibu Iman", poin: 4 },
  { value: "bapa-aldi", label: "Bapa Aldi", poin: 2 },
  { value: "bapa-iman", label: "Bapa Iman", poin: 3 },
];

const participants = [
  participant_juara1,
  participant_juara2,
  participant_juara3,
  participant_juara4,
  participant_juara5,
];

// 🔥 ganti isi select saat kategori berubah
kategori.addEventListener("change", () => {
  let source = [];
  if (kategori.value === "anak") {
    source = nama_anak;
  } else if (kategori.value === "orangtua") {
    source = nama_ortu;
  } else {
    source = [{ value: "", label: "Tidak Ada" }];
  }
  const optionHTML = source
    .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
    .join("");

  participants.forEach((participant) => {
    participant.innerHTML = optionHTML;
  });
});

// 🔥 submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    kategori: kategori.value,
    lomba: document.getElementById("lomba").value,
    sesi: document.getElementById("sesi").value,
    juara1: participant_juara1.value,
    juara2: participant_juara2.value,
    juara3: participant_juara3.value,
    juara4: participant_juara4.value,
    juara5: participant_juara5.value,
  };

  // ✅ validasi duplikat
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

  try {
    await addDoc(collection(db, "hasil_lomba"), data);
    showSuccessPopup("Data berhasil disimpan!");

    const lombaValue = data.lomba;
    form.reset();
    document.getElementById("lomba").value = lombaValue;

    await cekSelesaiLomba(lombaValue);
  } catch (error) {
    console.error("Gagal menyimpan data", error);
  }
});

// ✅ popup sukses
function showSuccessPopup(message) {
  const popup = document.getElementById("success-popup");
  popup.textContent = "✅ " + message;
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("show"), 10);

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.classList.add("hidden"), 300);
  }, 3000);
}

// ✅ fungsi cek sesi selesai
async function cekSelesaiLomba(lomba) {
  const q = query(collection(db, "hasil_lomba"), where("lomba", "==", lomba));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return;

  const hasil = snapshot.docs.map((doc) => doc.data());
  const sesiSet = new Set(hasil.map((h) => h.sesi));
  const jumlahSesi = sesiSet.size;

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
