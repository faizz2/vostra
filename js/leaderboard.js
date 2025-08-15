import { db } from "./firebase.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const leaderboardContainer = document.getElementById("leaderboard");

const poinJuara = {
  juara1: 5,
  juara2: 4,
  juara3: 3,
  juara4: 2,
  juara5: 1,
};

// Function to update chart bars
const updateChart = (leaderboard) => {
  if (!leaderboard || leaderboard.length < 3) {
    // Reset chart if less than 3 players
    const bars = {
      1: document.getElementById("bar-1"),
      2: document.getElementById("bar-2"),
      3: document.getElementById("bar-3"),
    };

    Object.values(bars).forEach((bar) => {
      if (bar) {
        const label = bar.querySelector(".bar-label");
        if (label) label.textContent = "-";
      }
    });
    return;
  }

  const bars = {
    1: document.getElementById("bar-1"), // Gold - center
    2: document.getElementById("bar-2"), // Silver - left
    3: document.getElementById("bar-3"), // Bronze - right
  };

  const maxPoints = Math.max(
    ...leaderboard.slice(0, 3).map((item) => item.poin)
  );

  // Update heights and labels based on points
  leaderboard.slice(0, 3).forEach((item, index) => {
    const barIndex = index + 1;
    if (bars[barIndex]) {
      const percentage = (item.poin / maxPoints) * 100;
      let baseHeight;

      // Set different base heights for visual hierarchy
      if (barIndex === 1) baseHeight = 160; // Gold - tallest
      else if (barIndex === 2) baseHeight = 120; // Silver - medium
      else baseHeight = 100; // Bronze - shortest

      const finalHeight = Math.max(
        baseHeight * 0.6,
        (percentage / 100) * baseHeight
      );
      bars[barIndex].style.height = `${finalHeight}px`;

      // Update label with player name
      const label = bars[barIndex].querySelector(".bar-label");
      if (label) {
        label.textContent = item.nama;
      }
    }
  });
};

// Function to render leaderboard
const renderLeaderboard = (leaderboard) => {
  if (!leaderboard || leaderboard.length === 0) {
    leaderboardContainer.innerHTML =
      '<div class="error">Tidak ada data leaderboard</div>';
    return;
  }

  // Limit to top 10 only
  const top10 = leaderboard.slice(0, 10);

  const html = top10
    .map((item, index) => {
      const rank = index + 1;
      const rankString = String(rank).padStart(2, "0");
      const rankClass = rank <= 3 ? `rank-${rank}` : "";

      return `
        <div class="leaderboard-item ${rankClass}">
          <div class="rank-info">
            <span class="rank-number">${rankString}</span>
            <span class="player-name">${item.nama}</span>
          </div>
          <div class="points">
            <span class="points-value">${item.poin.toLocaleString()}</span>
            <span class="points-label">pts</span>
          </div>
        </div>
      `;
    })
    .join("");

  leaderboardContainer.innerHTML = html;

  // Update chart with top 3 data
  updateChart(leaderboard);
};

const loadLeaderboard = async (filter = "anak") => {
  try {
    leaderboardContainer.innerHTML =
      '<div class="loading">Memuat data leaderboard...</div>';

    const querySnapshot = await getDocs(collection(db, "hasil_lomba"));
    const skor = {};
    const pesertaKategori = {}; // Menyimpan kategori setiap peserta

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const kategori = data.kategori; // Ambil kategori dari document

      // Hitung poin untuk tiap posisi juara
      for (let posisi in poinJuara) {
        const peserta = data[posisi];
        if (peserta) {
          // Inisialisasi skor jika belum ada
          if (!skor[peserta]) skor[peserta] = 0;
          skor[peserta] += poinJuara[posisi];

          // Simpan kategori peserta
          pesertaKategori[peserta] = kategori;
        }
      }
    });

    // Ubah jadi array & urutkan
    let leaderboard = Object.entries(skor)
      .map(([nama, poin]) => ({
        nama,
        poin,
        kategori: pesertaKategori[nama],
      }))
      .sort((a, b) => b.poin - a.poin);

    // Filter berdasarkan kategori yang dipilih
    if (filter === "anak") {
      leaderboard = leaderboard.filter((item) => item.kategori === "anak");
    } else if (filter === "orang-tua") {
      leaderboard = leaderboard.filter(
        (item) => item.kategori === "orang tua" || item.kategori === "orang_tua"
      );
    } else if (filter === "panitia") {
      leaderboard = leaderboard.filter((item) => item.kategori === "panitia");
    }

    // Render ke HTML
    renderLeaderboard(leaderboard);
  } catch (error) {
    console.error("Gagal memuat leaderboard:", error);
    leaderboardContainer.innerHTML =
      '<div class="error">Gagal memuat data leaderboard</div>';
  }
};

// Filter tab functionality
const initializeFilterTabs = () => {
  const filterTabs = document.querySelectorAll(".filter-tab");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      // Remove active class from all tabs
      filterTabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      e.target.classList.add("active");

      // Get filter category
      const category = e.target.dataset.category;

      // Reload leaderboard with filter
      loadLeaderboard(category);
    });
  });
};

// Initialize everything when page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeFilterTabs();
  loadLeaderboard();
});

// Also load leaderboard immediately (in case DOMContentLoaded already fired)
loadLeaderboard();
