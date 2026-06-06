(function () {
  "use strict";

  // --- Navbar scroll ---
  var nav = document.querySelector(".nav");
  function checkScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", checkScroll, { passive: true });
  checkScroll();

  // --- Mobile menu ---
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("open");
      links.classList.toggle("open");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        toggle.classList.remove("open");
        links.classList.remove("open");
      }
    });
  }

  // --- Card mouse glow ---
  document.querySelectorAll(".project-card, .project-featured").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // --- Count-up ---
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var dur = 1800;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      var val = target * eased;
      el.textContent = decimals ? val.toFixed(decimals) : Math.round(val);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // --- Intersection observer for reveals ---
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var d = parseInt(el.getAttribute("data-decimals") || "0", 10);
      el.textContent = d ? parseFloat(el.getAttribute("data-count")).toFixed(d) : el.getAttribute("data-count");
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll("[data-count]").forEach(countUp);
      if (entry.target.hasAttribute("data-count")) countUp(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

  document.querySelectorAll(".reveal, [data-count]").forEach(function (el) {
    if (el.hasAttribute("data-count") && el.closest(".reveal") && el.closest(".reveal") !== el) return;
    io.observe(el);
  });
})();
