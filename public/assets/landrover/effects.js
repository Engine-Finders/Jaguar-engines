/* ============================================================
   IBS SHARED EFFECTS SCRIPT — v2
   Used identically across all four brand sites (Land Rover, Jaguar,
   BMW, Mercedes-Benz). Brand visual differences live entirely in
   each site's style.css; this script only handles behaviour.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. DIRECTIONAL FADE-IN ON SCROLL ----------
     Section wrappers carry one of: fade-up, fade-down, fade-left,
     fade-right. Each becomes .visible once ~12% in view, and children
     inside a fade element with the .stagger class reveal in sequence
     rather than all at once. */
  var fadeEls = document.querySelectorAll(".fade-up, .fade-down, .fade-left, .fade-right");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add("visible");

      var staggerChildren = el.querySelectorAll(".stagger > *");
      staggerChildren.forEach(function (child, i) {
        setTimeout(function () { child.classList.add("visible"); }, i * 90);
      });

      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  fadeEls.forEach(function (el) { io.observe(el); });

  /* ---------- 2. LAZY-LOAD LOWER SECTIONS ----------
     Sections beyond the first two carry data-lazy-section. Their
     heavy content (tables, chart bars) is left in the DOM (so it's
     still crawlable/indexable) but visually deferred — this only
     controls the animation/paint timing, never hides content from
     search engines or removes it from the page. */
  var lazySections = document.querySelectorAll("[data-lazy-section]");
  var lazyIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("lazy-loaded");
        lazyIo.unobserve(entry.target);
      }
    });
  }, { rootMargin: "200px 0px 200px 0px" });
  lazySections.forEach(function (el) { lazyIo.observe(el); });

  /* ---------- 3. SMOOTH SCROLL WITH STICKY-HEADER OFFSET ----------
     Native `scroll-behavior: smooth` (set in CSS) handles the easing.
     This adds the offset correction so anchored sections don't land
     underneath the sticky TOC bar, and works even in browsers that
     ignore CSS smooth-scroll. */
  var TOC_OFFSET = 70; // px — matches .toc-bar height in both stylesheets

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href");
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - TOC_OFFSET;
      window.scrollTo({ top: top, behavior: "smooth" });
      history.pushState(null, "", targetId);
    });
  });

  /* ---------- 4. TOC ACTIVE-STATE TRACKING ---------- */
  var tocLinks = document.querySelectorAll(".toc-bar a");
  var sections = Array.prototype.map.call(tocLinks, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  function onScroll() {
    var pos = window.scrollY + 110;
    var activeIndex = 0;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= pos) activeIndex = i; });
    tocLinks.forEach(function (a, i) { a.classList.toggle("active", i === activeIndex); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
