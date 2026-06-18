# Whoosh — From Hardware Bet to Expansion Engine

A single-page, scroll-based strategy case study on **Whoosh** (Russia's micromobility
leader), built for an *Information Systems* group project at HSE.

The through-line: Whoosh bet on proprietary hardware; hardware is a cost center until
you mine its data; so the first digital-transformation project should be the **Nav Data
Platform** — Phase 1 of a three-phase roadmap.

**Live site:** https://melodiz.github.io/whoosh-case-study/

## Stack
Plain HTML + CSS + vanilla JS — no framework, no build step. Google Fonts and
[Chart.js](https://www.chartjs.org/) (one chart) loaded via CDN; everything else is
hand-written. All asset paths are relative so the site works from a GitHub Pages subpath.

```
index.html      styles.css      script.js
assets/         .nojekyll
```

## Run locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Team
Novosad Ivan · Rodionova Anna · Sardak Pavel
