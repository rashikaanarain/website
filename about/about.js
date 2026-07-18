(function () {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-site-nav]");

  function closeMenu() {
    if (!menuButton || !menu) return;
    menuButton.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(willOpen));
      menu.classList.toggle("is-open", willOpen);
      document.body.classList.toggle("nav-open", willOpen);
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = Array.from(document.querySelectorAll(".reveal"));

  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (element) {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 }
    );

    reveals.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  const timeline = document.querySelector("[data-timeline]");
  let scheduled = false;

  function updateTimelineProgress() {
    scheduled = false;
    if (!timeline) return;

    const bounds = timeline.getBoundingClientRect();
    const journey = Math.max(bounds.height - window.innerHeight * 0.35, 1);
    const travelled = window.innerHeight * 0.42 - bounds.top;
    const progress = Math.min(1, Math.max(0, travelled / journey));
    timeline.style.setProperty("--story-progress", progress.toFixed(4));
  }

  function requestProgressUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateTimelineProgress);
  }

  if (timeline) {
    updateTimelineProgress();
    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate);
  }
})();
