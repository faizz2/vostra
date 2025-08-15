const createNavbar = (title = "Vostra") => {
  const nav = document.createElement("nav");
  nav.classList.add("navbar");

  // Judul
  const navTitle = document.createElement("div");
  navTitle.classList.add("navbar-title");
  navTitle.textContent = title;

  // Tombol menu
  const menuBtn = document.createElement("button");
  menuBtn.classList.add("menu-btn");
  const icon = document.createElement("span");
  icon.classList.add("material-symbols-outlined");
  icon.textContent = "menu";
  menuBtn.appendChild(icon);

  // Menu links
  const navMenu = document.createElement("div");
  navMenu.classList.add("nav-menu");
  navMenu.innerHTML = `
    <a href="../index.html">🏠 Home</a>
    <a href="/pages/jadwal.html">📅 Jadwal</a>
    <a href="/pages/input.html">➕ Input</a>
    <a href="/pages/leaderboard.html">🏆 Leaderboard</a>
  `;

  // Event toggle
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Tutup menu jika klik di luar
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove("active");
    }
  });

  nav.appendChild(navTitle);
  nav.appendChild(menuBtn);
  document.body.appendChild(nav);
  document.body.appendChild(navMenu);
};

export { createNavbar };
