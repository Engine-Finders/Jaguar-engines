/* ============================================================
   JAGUARENGINES.UK — SCROLL EFFECTS
   Fade-in on scroll for sections 3+ (data-lazy-section), with
   prefers-reduced-motion respected. Sections 1-2 render immediately.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var lazySections = document.querySelectorAll("[data-lazy-section]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    lazySections.forEach(function (s) { s.classList.add("lazy-loaded"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("lazy-loaded");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  lazySections.forEach(function (s) { observer.observe(s); });

  // Sections 1-2 (no data-lazy-section) animate immediately on load
  document.querySelectorAll(".section:not([data-lazy-section]) .section-inner").forEach(function (el) {
    requestAnimationFrame(function () {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  });

  // Smooth scroll with sticky-header offset for TOC links
  var TOC_OFFSET = 70;
  document.querySelectorAll('.toc-bar a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - TOC_OFFSET;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
});
