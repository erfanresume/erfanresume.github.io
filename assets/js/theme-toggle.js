(function () {
  const root = document.documentElement;
  const button = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (button) {
      button.textContent = theme === "dark" ? "☀️" : "🌙";
      button.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  applyTheme(initialTheme);

  if (button) {
    button.addEventListener("click", function () {
      const currentTheme = root.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      localStorage.setItem("theme", nextTheme);
      applyTheme(nextTheme);
    });
  }
})();
