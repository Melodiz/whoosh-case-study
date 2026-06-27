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

  /* ===================================================================
     5. LIVE CITY-SCORING MODEL  (interactive · zero backend)
     -------------------------------------------------------------------
     EDIT YOUR DATA HERE:
       · CITIES  — one object per candidate city (pop is real public
                   data; the 1–10 factor scores are MVP-grade estimates).
       · DEFAULT_WEIGHTS / PRESETS — the weighting scenarios.
     This object is the SINGLE place to change city values or weights.
     =================================================================== */

  // -- Candidate cities. pop = real public data; factor scores 1–10 = team estimates.
  var CITIES = [
    // Russia (100k+ expansion candidates)
    { city: "Kazan",           country: "RU", pop: "1.3M",  gps: 8, demand: 7, whitespace: 5, regulation: 7, macro: 6, infra: 7 },
    { city: "Krasnodar",       country: "RU", pop: "1.1M",  gps: 7, demand: 8, whitespace: 6, regulation: 6, macro: 6, infra: 6 },
    { city: "Nizhny Novgorod", country: "RU", pop: "1.2M",  gps: 8, demand: 6, whitespace: 5, regulation: 7, macro: 6, infra: 6 },
    { city: "Voronezh",        country: "RU", pop: "1.05M", gps: 7, demand: 6, whitespace: 7, regulation: 6, macro: 6, infra: 5 },
    { city: "Samara",          country: "RU", pop: "1.16M", gps: 7, demand: 6, whitespace: 6, regulation: 6, macro: 6, infra: 6 },
    // Latin America
    { city: "Bogotá",          country: "CO", pop: "7.9M",  gps: 3, demand: 9, whitespace: 7, regulation: 6, macro: 5, infra: 6 },
    { city: "Lima",            country: "PE", pop: "9.7M",  gps: 3, demand: 8, whitespace: 8, regulation: 5, macro: 5, infra: 5 },
    { city: "Santiago",        country: "CL", pop: "6.3M",  gps: 3, demand: 7, whitespace: 6, regulation: 8, macro: 7, infra: 8 },
    { city: "Mexico City",     country: "MX", pop: "9.2M",  gps: 4, demand: 9, whitespace: 4, regulation: 6, macro: 6, infra: 6 },
    { city: "São Paulo",       country: "BR", pop: "12.3M", gps: 4, demand: 9, whitespace: 4, regulation: 6, macro: 5, infra: 6 }
  ];

  var DEFAULT_WEIGHTS = { gps: 25, demand: 25, whitespace: 15, regulation: 15, macro: 10, infra: 10 };

  // -- Presets (the punchy Q&A scenarios). Reset returns to "Balanced".
  var PRESETS = {
    balanced: { gps: 25, demand: 25, whitespace: 15, regulation: 15, macro: 10, infra: 10 },
    gps:      { gps: 40, demand: 14, whitespace: 10, regulation: 10, macro: 8,  infra: 8 },
    demand:   { gps: 8,  demand: 40, whitespace: 14, regulation: 10, macro: 10, infra: 12 }
  };

  var PRESET_BUTTONS = [
    { id: "gps",      label: "GPS-first (our tech edge)" },
    { id: "demand",   label: "Demand-first" },
    { id: "balanced", label: "Balanced (recommended)" }
  ];

  // -- Factor metadata. order = display order; max weight decides the rationale.
  var FACTORS = [
    { key: "gps",        name: "GPS disruption severity", desc: "High = bigger edge for our inertial nav",  word: "our GPS edge" },
    { key: "demand",     name: "Demand potential",        desc: "Population density + urban-mobility need", word: "raw demand" },
    { key: "whitespace", name: "Competitive whitespace",  desc: "10 = little competition",                  word: "open whitespace" },
    { key: "regulation", name: "Regulatory readiness",    desc: "10 = friendly / fast permits",             word: "regulatory ease" },
    { key: "macro",      name: "Macro & FX stability",    desc: "10 = low currency / macro risk",           word: "macro stability" },
    { key: "infra",      name: "Infrastructure readiness",desc: "Bike lanes, urban density suitability",    word: "infrastructure" }
  ];

  var FACTOR_TAIL = {
    gps:        "where GPS-blind streets turn inertial nav into a moat.",
    demand:     "the densest, highest-demand markets.",
    whitespace: "the markets with the most competitive whitespace.",
    regulation: "where permits clear fastest.",
    macro:      "the most macro- and FX-stable markets.",
    infra:      "the most ride-ready streets."
  };

  var FLAGS = { RU: "🇷🇺", CO: "🇨🇴", PE: "🇵🇪", CL: "🇨🇱", MX: "🇲🇽", BR: "🇧🇷" };

  var lmRank = document.getElementById("lmRank");
  if (!lmRank) return; // section not present

  var SLIDER_MAX = 40;
  var weights = Object.assign({}, DEFAULT_WEIGHTS);
  var openCity = null; // which row is expanded

  function region(c) { return c.country === "RU" ? "ru" : "latam"; }

  function totalWeight() {
    var t = 0;
    FACTORS.forEach(function (f) { t += weights[f.key]; });
    return t;
  }

  function scoreOf(c) {
    var t = totalWeight();
    if (t === 0) return 0;
    var s = 0;
    FACTORS.forEach(function (f) { s += weights[f.key] * c[f.key]; });
    return s / t;
  }

  function ranked() {
    return CITIES
      .map(function (c) { return { c: c, score: scoreOf(c) }; })
      .sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.c.city.localeCompare(b.c.city);
      });
  }

  function dominantFactor() {
    var best = FACTORS[0], bestW = -1, tied = 0;
    FACTORS.forEach(function (f) {
      if (weights[f.key] > bestW) { bestW = weights[f.key]; best = f; }
    });
    FACTORS.forEach(function (f) { if (weights[f.key] === bestW) tied++; });
    // "Dominant" only if one factor clearly leads; otherwise it's a balanced blend.
    return { factor: best, balanced: tied > 1 };
  }

  /* ---------- Presets UI ---------- */
  var presetWrap = document.getElementById("lmPresets");
  PRESET_BUTTONS.forEach(function (p) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "lm-preset";
    b.textContent = p.label;
    b.setAttribute("data-preset", p.id);
    b.addEventListener("click", function () { applyWeights(PRESETS[p.id]); });
    presetWrap.appendChild(b);
  });
  var resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "lm-preset lm-preset--reset";
  resetBtn.textContent = "↺ Reset";
  resetBtn.addEventListener("click", function () { applyWeights(DEFAULT_WEIGHTS); });
  presetWrap.appendChild(resetBtn);

  function presetMatch() {
    var found = null;
    Object.keys(PRESETS).forEach(function (id) {
      var p = PRESETS[id], same = true;
      FACTORS.forEach(function (f) { if (p[f.key] !== weights[f.key]) same = false; });
      if (same) found = id;
    });
    return found;
  }

  function syncPresetButtons() {
    var active = presetMatch();
    Array.prototype.forEach.call(presetWrap.querySelectorAll(".lm-preset[data-preset]"), function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-preset") === active);
    });
  }

  /* ---------- Sliders UI ---------- */
  var sliderWrap = document.getElementById("lmSliders");
  var shareEls = {};
  FACTORS.forEach(function (f) {
    var row = document.createElement("div");
    row.className = "lm-slider";

    var head = document.createElement("div");
    head.className = "lm-slider__head";
    var name = document.createElement("label");
    name.className = "lm-slider__name";
    name.setAttribute("for", "lm-w-" + f.key);
    name.textContent = f.name;
    var share = document.createElement("span");
    share.className = "lm-slider__share";
    head.appendChild(name);
    head.appendChild(share);

    var input = document.createElement("input");
    input.type = "range";
    input.className = "lm-slider__range";
    input.id = "lm-w-" + f.key;
    input.min = "0";
    input.max = String(SLIDER_MAX);
    input.step = "1";
    input.value = String(weights[f.key]);
    input.setAttribute("aria-label", f.name + " weight");
    input.addEventListener("input", function () {
      weights[f.key] = Number(input.value);
      update();
    });

    var desc = document.createElement("p");
    desc.className = "lm-slider__desc";
    desc.textContent = f.desc;

    row.appendChild(head);
    row.appendChild(input);
    row.appendChild(desc);
    sliderWrap.appendChild(row);

    shareEls[f.key] = { share: share, input: input };
  });

  function syncSliders() {
    var t = totalWeight();
    FACTORS.forEach(function (f) {
      var el = shareEls[f.key];
      el.input.value = String(weights[f.key]);
      var pct = t === 0 ? 0 : (weights[f.key] / t) * 100;
      el.share.textContent = Math.round(pct) + "%";
    });
  }

  /* ---------- Legend ---------- */
  var legend = document.getElementById("lmLegend");
  legend.innerHTML =
    '<span><i class="lm-sw--ru"></i>Russia</span>' +
    '<span><i class="lm-sw--latam"></i>Latin America</span>';

  /* ---------- Ranking rows (built once, reordered + animated on update) ---------- */
  var rowEls = {}; // city name -> { li, fill, score, rank, factorFills:{}, factorVals:{} }

  CITIES.forEach(function (c) {
    var li = document.createElement("li");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lm-row is-" + region(c);
    btn.setAttribute("aria-expanded", "false");

    var main = document.createElement("div");
    main.className = "lm-row__main";

    var rank = document.createElement("span");
    rank.className = "lm-row__rank";

    var id = document.createElement("span");
    id.className = "lm-row__id";
    var cityName = document.createElement("span");
    cityName.className = "lm-row__city";
    cityName.innerHTML = '<span class="lm-row__flag" aria-hidden="true">' + (FLAGS[c.country] || "") + "</span> " + c.city;
    var meta = document.createElement("span");
    meta.className = "lm-row__meta";
    meta.textContent = c.country + " · " + c.pop;
    id.appendChild(cityName);
    id.appendChild(meta);

    var bar = document.createElement("span");
    bar.className = "lm-row__bar";
    var fill = document.createElement("span");
    fill.className = "lm-row__fill";
    bar.appendChild(fill);

    var score = document.createElement("span");
    score.className = "lm-row__score";

    main.appendChild(rank);
    main.appendChild(id);
    main.appendChild(bar);
    main.appendChild(score);
    btn.appendChild(main);

    // detail (per-factor 1–10 breakdown)
    var detail = document.createElement("div");
    detail.className = "lm-row__detail";
    var facWrap = document.createElement("div");
    facWrap.className = "lm-row__factors";
    var factorFills = {}, factorVals = {};
    FACTORS.forEach(function (f) {
      var fac = document.createElement("div");
      fac.className = "lm-fac";
      var fname = document.createElement("span");
      fname.className = "lm-fac__name";
      fname.textContent = f.name;
      var fbar = document.createElement("span");
      fbar.className = "lm-fac__bar";
      var ffill = document.createElement("span");
      ffill.className = "lm-fac__fill";
      fbar.appendChild(ffill);
      var fval = document.createElement("span");
      fval.className = "lm-fac__val";
      fac.appendChild(fname);
      fac.appendChild(fbar);
      fac.appendChild(fval);
      facWrap.appendChild(fac);
      factorFills[f.key] = ffill;
      factorVals[f.key] = fval;
    });
    detail.appendChild(facWrap);
    btn.appendChild(detail);

    btn.addEventListener("click", function () {
      openCity = (openCity === c.city) ? null : c.city;
      syncOpenStates();
    });

    li.appendChild(btn);
    lmRank.appendChild(li);
    rowEls[c.city] = { li: li, btn: btn, fill: fill, score: score, rank: rank, factorFills: factorFills, factorVals: factorVals };
  });

  function syncOpenStates() {
    CITIES.forEach(function (c) {
      var r = rowEls[c.city];
      var isOpen = openCity === c.city;
      r.btn.classList.toggle("is-open", isOpen);
      r.btn.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        FACTORS.forEach(function (f) {
          r.factorFills[f.key].style.width = (c[f.key] * 10) + "%";
          r.factorVals[f.key].textContent = c[f.key];
        });
      }
    });
  }

  /* ---------- Recommended card ---------- */
  var reco = document.getElementById("lmReco");
  function renderReco(order) {
    var top = order.slice(0, 3);
    var dom = dominantFactor();
    var c1 = top[0].c.city, c2 = top[1].c.city;
    var chips = top.map(function (e, i) {
      return '<span class="lm-reco__city">' +
               '<span class="lm-reco__rank">' + (i + 1) + "</span>" +
               '<span class="lm-reco__name">' + (FLAGS[e.c.country] || "") + " " + e.c.city + "</span>" +
               '<span class="lm-reco__sc">' + e.score.toFixed(1) + "</span>" +
             "</span>";
    }).join("");
    var rationale = dom.balanced
      ? "On a <strong>balanced blend</strong> → " + c1 + " and " + c2 +
          " lead — strong across the board, with our GPS edge tipping the balance."
      : "Weighted toward <strong>" + dom.factor.word + "</strong> → " + c1 + " and " + c2 +
          " lead — " + FACTOR_TAIL[dom.factor.key];
    reco.innerHTML =
      '<p class="lm-reco__kicker">Recommended next launches</p>' +
      '<div class="lm-reco__cities">' + chips + "</div>" +
      '<p class="lm-reco__rationale">' + rationale + "</p>";
  }

  /* ---------- Update (with FLIP reorder animation) ---------- */
  var prefersReducedMotion = prefersReduced;

  function update() {
    var order = ranked();

    // FLIP: capture current positions
    var first = {};
    CITIES.forEach(function (c) { first[c.city] = rowEls[c.city].li.getBoundingClientRect().top; });

    // Reorder DOM + set bar/score/rank
    order.forEach(function (e, i) {
      var r = rowEls[e.c.city];
      lmRank.appendChild(r.li); // move to new position (sorted order)
      r.fill.style.width = (e.score * 10) + "%";
      r.score.textContent = e.score.toFixed(1);
      r.rank.textContent = (i + 1);
      r.btn.classList.toggle("is-top", i < 2);
    });

    // FLIP: invert + play
    if (!prefersReducedMotion) {
      CITIES.forEach(function (c) {
        var r = rowEls[c.city];
        var last = r.li.getBoundingClientRect().top;
        var delta = first[c.city] - last;
        if (delta) {
          r.li.style.transition = "none";
          r.li.style.transform = "translateY(" + delta + "px)";
          // force reflow then animate to natural position
          void r.li.offsetWidth;
          r.li.style.transition = "transform 0.5s cubic-bezier(0.2,0.8,0.2,1)";
          r.li.style.transform = "";
        }
      });
    }

    renderReco(order);
    syncSliders();
    syncPresetButtons();
    syncOpenStates();
  }

  function applyWeights(w) {
    FACTORS.forEach(function (f) { weights[f.key] = w[f.key]; });
    update();
  }

  update();
})();
