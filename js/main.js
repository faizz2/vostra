const jadwalCard = document.getElementById("jadwalCard");
const inputCard = document.getElementById("inputCard");
const leaderboardCard = document.getElementById("leaderboard-card");

jadwalCard.addEventListener("click", () => {
  window.location.href = "pages/jadwal.html";
});

inputCard.addEventListener("click", () => {
  window.location.href = "pages/input.html";
});

leaderboardCard.addEventListener("click", () => {
  window.location.href = "pages/leaderboard.html";
});
