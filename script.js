/* =====================================================================
   Whoosh case study — script.js
   1. Reveal-on-scroll (IntersectionObserver)
   2. Scroll-spy active nav link
   3. Mobile nav toggle
   4. Weighted-score bar chart (Chart.js via CDN)
   ===================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el, i) {
      // gentle stagger for groups of cards
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + "ms";
      revealObserver.observe(el);
    });
  }

  /* ---------- 2. Scroll-spy active nav link ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 3. Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".nav__links");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 4. Weighted-score bar chart ---------- */
  function drawChart() {
    var canvas = document.getElementById("scoreChart");
    if (!canvas || typeof Chart === "undefined") return;

    var styles = getComputedStyle(document.documentElement);
    var orange = (styles.getPropertyValue("--orange") || "#F15A29").trim();
    var teal = (styles.getPropertyValue("--teal") || "#169B88").trim();
    var blue = (styles.getPropertyValue("--blue") || "#2B6CB0").trim();
    var grid = "rgba(255,255,255,0.12)";
    var label = "rgba(255,255,255,0.75)";

    new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: ["Digital Twin", "Safety Control", "Nav Data Platform"],
        datasets: [{
          label: "Weighted total",
          data: [3.05, 3.65, 4.35],
          backgroundColor: [blue, teal, orange],
          borderRadius: 8,
          maxBarThickness: 64
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        animation: prefersReduced ? false : { duration: 900, easing: "easeOutCubic" },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) { return ctx.parsed.x.toFixed(2) + " / 5"; }
            }
          }
        },
        scales: {
          x: {
            min: 0, max: 5,
            ticks: { color: label, font: { family: "Space Mono, monospace" } },
            grid: { color: grid }
          },
          y: {
            ticks: { color: label, font: { family: "Inter, sans-serif", size: 13 } },
            grid: { display: false }
          }
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", drawChart);
  } else {
    drawChart();
  }
})();
