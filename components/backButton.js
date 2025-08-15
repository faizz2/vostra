const createBackButton = () => {
  const button = document.createElement("button");
  button.classList.add("back-btn");

  const icon = document.createElement("span");
  icon.classList.add("material-symbols-outlined");
  icon.textContent = "arrow_back_ios";

  button.appendChild(icon);

  button.addEventListener("click", () => {
    window.history.back();
  });

  return button;
};

export { createBackButton };
