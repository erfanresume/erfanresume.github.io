(() => {
  const root = document.documentElement;
  const header = document.getElementById("siteHeader");
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const progress = document.querySelector(".page-progress span");
  const cursorGlow = document.querySelector(".cursor-glow");

  const savedTheme = localStorage.getItem("erfan-theme-v4");
  root.dataset.theme = savedTheme || "light";

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("erfan-theme-v4", next);
    window.dispatchEvent(new CustomEvent("themechange", { detail: next }));
  });

  function setMenu(open) {
    menuToggle?.classList.toggle("open", open);
    mobileMenu?.classList.toggle("open", open);
    mobileMenu?.setAttribute("aria-hidden", String(!open));
  }

  menuToggle?.addEventListener("click", () => {
    setMenu(!mobileMenu.classList.contains("open"));
  });

  mobileMenu?.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => setMenu(false));
  });

  function onScroll() {
    const y = window.scrollY;
    header?.classList.toggle("scrolled", y > 24);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (window.matchMedia("(pointer: fine)").matches && cursorGlow) {
    let raf = 0;
    window.addEventListener("pointermove", e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
        raf = 0;
      });
    }, { passive: true });
  }

  // Lightweight 3D tilt — no GSAP required.
  const tiltTargets = [
    [document.getElementById("portraitTilt"), document.getElementById("portraitCard")],
    ...[...document.querySelectorAll(".tilt-card")].map(el => [el, el])
  ];

  if (window.matchMedia("(pointer: fine)").matches) {
    tiltTargets.forEach(([area, target]) => {
      if (!area || !target) return;

      area.addEventListener("pointermove", e => {
        const r = area.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;

        target.style.transform =
          `perspective(1100px) rotateX(${-(py - .5) * 5}deg) rotateY(${(px - .5) * 6}deg) translateY(-2px)`;

        target.style.setProperty("--mx", `${px * 100}%`);
        target.style.setProperty("--my", `${py * 100}%`);
      });

      area.addEventListener("pointerleave", () => {
        target.style.transform = "";
      });
    });
  }

  // Native reveal observer: lighter than a full animation library.
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Active navigation.
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".desktop-nav a")];

  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach(a => {
      a.classList.toggle(
        "active",
        a.getAttribute("href") === `#${visible.target.id}`
      );
    });
  }, { threshold: [0.18, .35], rootMargin: "-10% 0px -45% 0px" });

  sections.forEach(s => sectionObserver.observe(s));
})();
/* =========================================================
   HERO PORTRAIT — NATURAL MOUSE TILT
   ========================================================= */

   const portraitWrap =
   document.querySelector(".portrait-wrap");
 
 const portrait =
   document.querySelector(".hero-cutout");
 
 
 if (
   portraitWrap &&
   portrait &&
   window.matchMedia("(pointer: fine)").matches
 ) {
 
   let targetX = 0;
   let targetY = 0;
 
   let currentX = 0;
   let currentY = 0;
 
   let active = false;
 
 
   portraitWrap.addEventListener(
     "mousemove",
     (event) => {
 
       const rect =
         portraitWrap.getBoundingClientRect();
 
       const x =
         (event.clientX - rect.left) /
         rect.width - 0.5;
 
       const y =
         (event.clientY - rect.top) /
         rect.height - 0.5;
 
 
       /*
        * Sam-style range:
        * mouse edge ≈ ±8 degrees
        */
       targetY = x * 8;
 
       targetX = y * -8;
 
       active = true;
     }
   );
 
 
   portraitWrap.addEventListener(
     "mouseleave",
     () => {
 
       targetX = 0;
       targetY = 0;
 
       active = false;
     }
   );
 
 
   function animatePortrait() {
 
     /*
      * Smooth delayed tracking.
      * This is what prevents the tilt
      * from feeling mechanical.
      */
 
     currentX +=
       (targetX - currentX) * 0.075;
 
     currentY +=
       (targetY - currentY) * 0.075;
 
 
     portrait.style.transform =
       `
         rotateX(${currentX}deg)
         rotateY(${currentY}deg)
         translateZ(8px)
       `;
 
 
     requestAnimationFrame(
       animatePortrait
     );
   }
 
 
   animatePortrait();
 }

 /* =========================================
   PUBLICATIONS SHOW / HIDE
   ========================================= */

const publicationsStack =
document.querySelector(".publication-stack");

const publicationsToggle =
document.getElementById("publicationsToggle");

if (publicationsStack && publicationsToggle) {

const toggleLabel =
  publicationsToggle.querySelector(
    ".publications-toggle-label"
  );

publicationsToggle.addEventListener("click", () => {

  const isExpanded =
    publicationsStack.classList.toggle("show-all");

  publicationsToggle.setAttribute(
    "aria-expanded",
    String(isExpanded)
  );

  toggleLabel.textContent = isExpanded
    ? "Show fewer publications"
    : "Show all publications";

  if (isExpanded) {
    const hiddenPublications =
      publicationsStack.querySelectorAll(
        ".publication-card:nth-child(n + 5)"
      );

    hiddenPublications.forEach((card) => {
      card.classList.add("is-visible");
    });
  }

});
}

/* =========================================
   JOURNAL METRICS
   ========================================= */

fetch("assets/data/journal-metrics.json")
  .then((response) => {

    if (!response.ok) {
      throw new Error("Could not load journal metrics");
    }

    return response.json();
  })

  .then((data) => {

    document
      .querySelectorAll(".publication-metrics")
      .forEach((metrics) => {

        const journalId = metrics.dataset.journal;
        const journal = data[journalId];

        if (!journal) return;

        const quartile =
          metrics.querySelector(".journal-quartile");

        const impactFactor =
          metrics.querySelector(".journal-impact strong");

        if (quartile) {
          quartile.textContent = journal.quartile;
        }

        if (impactFactor) {
          impactFactor.textContent = journal.impactFactor;
        }

      });

  })

  .catch((error) => {
    console.error(
      "Journal metrics could not be loaded:",
      error
    );
  });

const honorsGrid = document.getElementById("honorsGrid");
const honorsToggle = document.getElementById("honorsToggle");

if (honorsGrid && honorsToggle) {
  const honorsLabel =
    honorsToggle.querySelector(".honors-toggle-label");

  const hiddenHonorCards =
    honorsGrid.querySelectorAll(".honor-card:nth-child(n + 4)");

  honorsToggle.addEventListener("click", () => {
    const expanded =
      honorsGrid.classList.toggle("show-all");

    honorsToggle.setAttribute(
      "aria-expanded",
      expanded ? "true" : "false"
    );

    honorsLabel.textContent =
      expanded
        ? "Show fewer honors"
        : "Show all honors";

    hiddenHonorCards.forEach((card) => {
      if (expanded) {
        card.classList.add("is-visible");
      }
    });
  });
}