(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var EMAIL = "anant_s@ce.iitr.ac.in";

  // ---------------------------------------------------------------
  // Basics
  // ---------------------------------------------------------------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme: swaps which sections are dark and which are light.
  var themeBtn = document.getElementById("theme-toggle");
  function setInverted(on) {
    root.classList.toggle("inverted", on);
    if (themeBtn) themeBtn.setAttribute("aria-pressed", on ? "true" : "false");
  }
  try { setInverted(localStorage.getItem("site-inverted") === "1"); } catch (e) { /* storage unavailable */ }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var on = !root.classList.contains("inverted");
      if (!reduceMotion) {
        root.classList.add("theming");
        setTimeout(function () { root.classList.remove("theming"); }, 500);
      }
      setInverted(on);
      try { localStorage.setItem("site-inverted", on ? "1" : "0"); } catch (e) { /* ignore */ }
    });
  }

  // Menu dialog
  var navDialog = document.getElementById("nav-dialog");
  var menuBtn = document.getElementById("menu-toggle");
  if (navDialog && menuBtn) {
    menuBtn.addEventListener("click", function () {
      navDialog.showModal();
      menuBtn.setAttribute("aria-expanded", "true");
    });
    navDialog.addEventListener("close", function () { menuBtn.setAttribute("aria-expanded", "false"); });
    navDialog.querySelectorAll("[data-close-nav], .nav-links a").forEach(function (el) {
      el.addEventListener("click", function () { navDialog.close(); });
    });
    navDialog.addEventListener("click", function (e) { if (e.target === navDialog) navDialog.close(); });
  }

  // Pill navigation shrinks once the page scrolls.
  var pill = document.getElementById("pill");

  // ---------------------------------------------------------------
  // Project details
  // ---------------------------------------------------------------
  var projects = {
    nes: {
      meta: "AI Velocity, May to Jul 2026",
      title: "Next Edit Suggestion model",
      points: [
        "Fine-tuned 7B LLMs across all three post-training stages on a proprietary codebase.",
        "Built a Next Edit Suggestion model for an in-house IDE that learns organization-specific code patterns.",
        "CCEval accuracy up 3.94%. Zeta Eval up 5.21%, with CCEval regression held to 0.91%."
      ],
      stack: "PyTorch, LLM fine-tuning, evaluation (CCEval, Zeta Eval)"
    },
    review: {
      meta: "Hostel Affairs Council, May to Jun 2026",
      title: "LLM code review agent",
      points: [
        "RAG-based agent that indexes a codebase for context-aware retrieval of prior code patterns.",
        "Flags bugs and style violations in pull requests against project-specific conventions."
      ],
      stack: "RAG, agents, Python"
    },
    papers: {
      meta: "VLG, IIT Roorkee, May to Jun 2026",
      title: "Research paper summarizer and fact-checker",
      points: [
        "LangGraph pipeline using the Semantic Scholar API to collate recent, highly cited papers.",
        "Web-search and citation-lookup tools check the claims in each collated paper.",
        "Summaries of verified papers with key findings and trends, generated with the OpenAI API."
      ],
      stack: "LangGraph, Semantic Scholar API, OpenAI API"
    },
    campus: {
      meta: "VLG, IIT Roorkee, May to Jun 2026",
      title: "Smart campus syllabus and assignment assistant",
      points: [
        "Full-stack platform in React and FastAPI for courses, assignments and academic deadlines.",
        "LangChain agent with schedule and assignment context that plans study days.",
        "RAG over uploaded syllabi using ChromaDB and the OpenAI API."
      ],
      stack: "React, FastAPI, LangChain, ChromaDB, OpenAI API"
    },
    cyclist: {
      meta: "Accepted at WCTR 2026",
      title: "Cyclist lateral position detection",
      points: [
        "Real-time computer vision on monocular video to estimate a cyclist's lateral position.",
        "Four-stage pipeline: filtering, scanline edge detection, RANSAC fitting.",
        "Replaced costly LiDAR and GPS sensors with a low-height camera, cutting fit error 15 to 25%.",
        "Co-authored with Prof. Indrajit Ghosh."
      ],
      stack: "OpenCV, RANSAC, computer vision"
    },
    llmscope: {
      meta: "Google Developer Students Club, Jun to Jul 2026",
      title: "llmscope",
      points: [
        "C++14 telemetry tool that hooks into a local model's forward pass without changing the model.",
        "Shows tensor shapes, activations and per-layer latency in an interactive terminal UI."
      ],
      stack: "C++14, profiling, terminal UI"
    },
    swiggy: {
      meta: "SocBiz, IIT Roorkee, May to Jun 2026",
      title: "Swiggy Sense",
      points: [
        "GenAI food agent designed to cut the decision fatigue that traditional recommenders do not solve.",
        "Eight-stage agent pipeline (perceive, plan, guardrail, act, learn) that brings user decision time down to 30 seconds.",
        "Tiered revenue model from Rs. 746 cr to 2,385 cr with six risk mitigations, projecting 7.6x ROI at scale."
      ],
      stack: "Agent design, product modeling, GenAI"
    },
    lidar: {
      meta: "CED, IIT Roorkee, from Aug 2026",
      title: "Smart traffic enforcement with LiDAR",
      points: [
        "LiDAR-based perception system that detects tailgating violations at toll barriers in real traffic.",
        "Processes point-cloud data to track vehicle spacing and flag unsafe following distance.",
        "Aims at a low-cost alternative to camera systems, which struggle with occlusion and glare."
      ],
      stack: "LiDAR, point clouds, real-time perception"
    }
  };

  var pd = document.getElementById("project-dialog");
  var pdMeta = document.getElementById("pd-meta");
  var pdTitle = document.getElementById("pd-title");
  var pdPoints = document.getElementById("pd-points");
  var pdStack = document.getElementById("pd-stack");

  function openProject(key) {
    var p = projects[key];
    if (!p || !pd) return;
    pdMeta.textContent = p.meta;
    pdTitle.textContent = p.title;
    pdPoints.innerHTML = "";
    p.points.forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      pdPoints.appendChild(li);
    });
    pdStack.textContent = p.stack;
    pd.showModal();
  }
  document.querySelectorAll("[data-project]").forEach(function (el) {
    el.addEventListener("click", function () { openProject(el.getAttribute("data-project")); });
  });
  if (pd) {
    pd.querySelector("[data-close]").addEventListener("click", function () { pd.close(); });
    pd.addEventListener("click", function (e) { if (e.target === pd) pd.close(); });
  }

  // ---------------------------------------------------------------
  // Contact form: builds an email draft, nothing is sent from the page.
  // ---------------------------------------------------------------
  var form = document.getElementById("mail-form");
  var note = document.getElementById("form-note");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var from = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();
      if (!message) {
        note.textContent = "Write a short message first.";
        note.className = "form-note error";
        form.elements.message.focus();
        return;
      }
      var body = message + (name || from ? "\n\n" + [name, from].filter(Boolean).join(", ") : "");
      var subject = "Hello from " + (name || "your portfolio");
      note.textContent = "Opening your email app with a draft.";
      note.className = "form-note";
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  // ---------------------------------------------------------------
  // Timeline: place the five dots on the winding path.
  // ---------------------------------------------------------------
  var tl = document.getElementById("tl");
  var tlPath = document.getElementById("tl-line");
  function placeDots() {
    if (!tl || !tlPath) return;
    var dots = tl.querySelectorAll(".tl-dot");
    var total = tlPath.getTotalLength();
    dots.forEach(function (dot, i) {
      var targetX = 1000 * (0.1 + i * 0.2);
      var lo = 0, hi = total;
      for (var k = 0; k < 30; k++) {
        var mid = (lo + hi) / 2;
        if (tlPath.getPointAtLength(mid).x < targetX) lo = mid; else hi = mid;
      }
      var pt = tlPath.getPointAtLength((lo + hi) / 2);
      dot.style.left = (pt.x / 1000 * 100) + "%";
      dot.style.top = (pt.y / 120 * 100) + "%";
      dot.style.setProperty("--d", String(i));
    });
    tl.style.setProperty("--len", String(Math.ceil(total)));
  }
  placeDots();

  // ---------------------------------------------------------------
  // Footer bridge: a line drawing generated from a cable curve.
  // ---------------------------------------------------------------
  var bridge = document.getElementById("bridge");
  if (bridge) {
    var NS = "http://www.w3.org/2000/svg";
    var parts = [];
    function add(d) { parts.push('<path d="' + d + '"/>'); }
    var deck = 128, towerL = 300, towerR = 900, towerTop = 28;
    add("M0," + deck + " H1200");
    add("M0," + (deck + 8) + " H1200");
    [towerL, towerR].forEach(function (x) {
      add("M" + (x - 9) + "," + deck + " V" + towerTop);
      add("M" + (x + 9) + "," + deck + " V" + towerTop);
      add("M" + (x - 9) + "," + (towerTop + 22) + " H" + (x + 9));
      add("M" + (x - 9) + "," + (towerTop + 58) + " H" + (x + 9));
      add("M" + (x - 9) + "," + towerTop + " H" + (x + 9));
    });
    add("M0,104 L" + towerL + "," + (towerTop + 4));
    add("M" + towerR + "," + (towerTop + 4) + " L1200,104");
    add("M" + towerL + "," + (towerTop + 4) + " Q600,190 " + towerR + "," + (towerTop + 4));
    for (var x = towerL + 24; x < towerR; x += 24) {
      var t = (x - towerL) / (towerR - towerL);
      var y = (1 - t) * (1 - t) * (towerTop + 4) + 2 * (1 - t) * t * 190 + t * t * (towerTop + 4);
      add("M" + x + "," + y.toFixed(1) + " V" + deck);
    }
    for (var xb = 24; xb < towerL - 10; xb += 24) {
      var yb = 104 - (104 - (towerTop + 4)) * (xb / towerL);
      add("M" + xb + "," + yb.toFixed(1) + " V" + deck);
    }
    for (var xr = towerR + 24; xr < 1190; xr += 24) {
      var yr = (towerTop + 4) + (104 - (towerTop + 4)) * ((xr - towerR) / (1200 - towerR));
      add("M" + xr + "," + yr.toFixed(1) + " V" + deck);
    }
    add("M0,148 q 20,-6 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0 t 40,0");
    bridge.innerHTML = parts.join("");
    bridge.setAttribute("xmlns", NS);
  }

  // ---------------------------------------------------------------
  // Measured results count up once, when first seen.
  // The final values are already in the HTML.
  // ---------------------------------------------------------------
  var counters = document.querySelectorAll("[data-count]");
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / 1100, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // The watermark is the owner's own profile data, shown as faint JSON.
  var profileJson = [
    '{',
    '  "name": "Anant Shukla",',
    '  "role": "Applied ML & GenAI engineer",',
    '  "education": {',
    '    "degree": "B.Tech, Civil Engineering",',
    '    "university": "IIT Roorkee",',
    '    "graduating": 2027,',
    '    "cgpa": 7.405',
    '  },',
    '  "experience": [',
    '    { "role": "Gen AI Intern", "org": "AI Velocity", "year": 2026 },',
    '    { "role": "Summer Intern", "org": "VK Global Publications", "year": 2025 },',
    '    { "role": "ML Intern", "org": "Eazeplace", "year": 2025 },',
    '    { "role": "Co-Founder", "org": "Updesha Conxultancy" }',
    '  ],',
    '  "focus": ["LLM fine-tuning", "RAG", "Agents", "Computer vision"],',
    '  "projects": {',
    '    "NES": "7B LLM for next edit suggestion",',
    '    "review": "RAG over a codebase",',
    '    "papers": "LangGraph fact-checker",',
    '    "llmscope": "forward-pass tracing in C++14"',
    '  },',
    '  "skills": {',
    '    "languages": ["Python", "C++", "SQL"],',
    '    "ml": ["PyTorch", "scikit-learn", "XGBoost", "YOLO"],',
    '    "build": ["FastAPI", "React", "Git", "Power BI"]',
    '  },',
    '  "publication": "WCTR 2026, cyclist lateral position",',
    '  "email": "' + EMAIL + '",',
    '  "github": "github.com/mranantshukla",',
    '  "linkedin": "linkedin.com/in/anantastic"',
    '}'
  ];
  var glyph = document.getElementById("glyph-bg");

  // ---------------------------------------------------------------
  // Motion layer. Skipped entirely when the visitor asks for reduced
  // motion; the page is then a static document.
  // ---------------------------------------------------------------
  function splitLetters(el) {
    var label = el.textContent.replace(/\s+/g, " ").trim();
    if (/^(H1|H2|A)$/.test(el.tagName)) el.setAttribute("aria-label", label);
    var frag = document.createDocumentFragment();
    var index = 0;
    var word = null;
    function addLetter(content, isNode) {
      var win = document.createElement("span");
      win.className = "win";
      win.setAttribute("aria-hidden", "true");
      var ch = document.createElement("span");
      ch.className = "ch";
      ch.style.setProperty("--i", String(index++));
      if (isNode) ch.appendChild(content); else ch.textContent = content;
      win.appendChild(ch);
      if (!word) {
        word = document.createElement("span");
        word.className = "word";
        frag.appendChild(word);
      }
      word.appendChild(win);
    }
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        Array.from(node.textContent.replace(/\s+/g, " ")).forEach(function (c) {
          if (c === " ") {
            word = null;
            var sp = document.createElement("span");
            sp.className = "sp";
            sp.setAttribute("aria-hidden", "true");
            frag.appendChild(sp);
          } else {
            addLetter(c, false);
          }
        });
      } else if (node.nodeName === "BR") {
        word = null;
        frag.appendChild(document.createElement("br"));
      } else {
        addLetter(node.cloneNode(true), true);
      }
    });
    el.textContent = "";
    el.appendChild(frag);
  }

  var hero = document.getElementById("top");
  var flip = document.getElementById("portrait-flip");
  var cornerTag = document.getElementById("corner-tag");

  if (reduceMotion) {
    if (glyph) glyph.textContent = profileJson.join("\n");
    if (tl) tl.classList.add("in");
  } else {
    // 1. Wordmark letters flip on hover.
    var wordmark = document.querySelector(".wordmark");
    if (wordmark) splitLetters(wordmark);

    // 2. Icon buttons: glyph slides out, a twin slides in.
    document.querySelectorAll(".tool").forEach(function (btn) {
      var svg = btn.querySelector("svg");
      if (!svg) return;
      var wrap = document.createElement("span");
      wrap.className = "wave-icon";
      wrap.setAttribute("aria-hidden", "true");
      var track = document.createElement("span");
      track.className = "wave-track";
      btn.replaceChild(wrap, svg);
      track.appendChild(svg);
      track.appendChild(svg.cloneNode(true));
      wrap.appendChild(track);
    });

    // 3. Letter-by-letter reveals.
    var revealLetters = [];
    var heroName = document.querySelector(".name");
    if (heroName) {
      splitLetters(heroName);
      heroName.classList.add("letters");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { heroName.classList.add("in"); });
      });
    }
    document.querySelectorAll(".display, .closing").forEach(function (el) {
      splitLetters(el);
      el.classList.add("letters");
      revealLetters.push(el);
    });

    // 4. Menu links rise letter by letter each time the menu opens.
    var menuLinks = document.querySelectorAll(".nav-links a");
    menuLinks.forEach(function (a, n) {
      splitLetters(a);
      a.style.setProperty("--base", String(n));
      a.classList.add("letters");
    });
    if (navDialog && menuBtn) {
      menuBtn.addEventListener("click", function () {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { menuLinks.forEach(function (a) { a.classList.add("in"); }); });
        });
      });
      navDialog.addEventListener("close", function () {
        menuLinks.forEach(function (a) { a.classList.remove("in"); });
      });
    }

    // 5. Blocks fade up as they scroll into view, staggered in groups.
    var groups = [
      ".folders > li", ".also-list > li", ".tl-list > li", ".tag-col", ".metrics > div",
      ".about-copy", ".current", ".contact-copy > p", ".contact-copy .link-row", ".mail-form",
      ".sec-head .hint", ".f-col"
    ];
    var blocks = [];
    groups.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (item, n) {
        item.style.setProperty("--n", String(Math.min(n, 7)));
        item.classList.add("will-reveal");
        blocks.push(item);
      });
    });
    if (tl) tl.classList.add("js-tl");

    var observed = revealLetters.concat(blocks);
    if (tl) observed.push(tl);
    if ("IntersectionObserver" in window) {
      var revealer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: "0px 0px -6% 0px" });
      observed.forEach(function (el) { revealer.observe(el); });

      if (counters.length) {
        var counterObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              countUp(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { counterObserver.observe(el); });
      }
    } else {
      observed.forEach(function (el) { el.classList.add("in"); });
    }

    // 6. Hero watermark types in, then the corner tag types its label.
    if (glyph) {
      var lineNo = 0;
      glyph.classList.add("typing");
      var typer = setInterval(function () {
        if (lineNo >= profileJson.length) {
          clearInterval(typer);
          glyph.classList.remove("typing");
          return;
        }
        glyph.textContent += (lineNo ? "\n" : "") + profileJson[lineNo];
        lineNo += 1;
      }, 90);
    }
    if (cornerTag) {
      var full = cornerTag.textContent;
      cornerTag.textContent = "";
      cornerTag.classList.add("typing");
      var pos = 0;
      setTimeout(function () {
        var tagTimer = setInterval(function () {
          pos += 1;
          cornerTag.textContent = full.slice(0, pos);
          if (pos >= full.length) {
            clearInterval(tagTimer);
            setTimeout(function () { cornerTag.classList.remove("typing"); }, 1400);
          }
        }, 55);
      }, 900);
    }

    // 7. Scroll-linked: portrait flips to colour, watermark drifts slower than the page.
    var ticking = false;
    function updateScroll() {
      ticking = false;
      var y = window.scrollY;
      var span = hero ? hero.offsetHeight * 0.7 : 1;
      var p = Math.min(Math.max(y / span, 0), 1);
      if (flip) {
        flip.style.setProperty("--ry", (p * 180).toFixed(1) + "deg");
        flip.style.setProperty("--p", p.toFixed(3));
      }
      if (glyph && hero && y < hero.offsetHeight * 1.4) {
        glyph.style.transform = "translateY(" + (y * 0.18).toFixed(1) + "px)";
      }
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
    }, { passive: true });
    updateScroll();
  }

  // Pill shrink works with or without motion (only the width changes).
  function onPillScroll() {
    if (pill) pill.classList.toggle("compact", window.scrollY > 80);
  }
  window.addEventListener("scroll", onPillScroll, { passive: true });
  onPillScroll();
})();
