(function () {
  function initThemeToggle() {
    const root = document.documentElement;
    const button = document.getElementById("theme-toggle");

    if (!button) {
      console.error("Theme toggle button not found");
      return;
    }

    function applyTheme(theme) {
      root.setAttribute("data-theme", theme);

      if (theme === "dark") {
        button.textContent = "☀️";
        button.setAttribute("aria-label", "Switch to light mode");
      } else {
        button.textContent = "🌙";
        button.setAttribute("aria-label", "Switch to dark mode");
      }
    }

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    applyTheme(initialTheme);

    button.addEventListener("click", function () {
      const currentTheme = root.getAttribute("data-theme") || "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      localStorage.setItem("theme", nextTheme);
      applyTheme(nextTheme);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle);
  } else {
    initThemeToggle();
  }
})();
