(function () {
  "use strict";

  var root = document.documentElement;

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme: follow the system by default, let the visitor switch, remember the choice.
  var themeBtn = document.getElementById("theme-toggle");
  function setTheme(mode) {
    root.setAttribute("data-theme", mode);
    if (themeBtn) themeBtn.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
  }
  try {
    var saved = localStorage.getItem("site-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
  } catch (e) { /* storage or matchMedia unavailable: keep light */ }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
      try { localStorage.setItem("site-theme", next); } catch (e) { /* ignore */ }
    });
  }

  // Menu dialog (small screens)
  var navDialog = document.getElementById("nav-dialog");
  var menuBtn = document.getElementById("menu-toggle");
  if (navDialog && menuBtn) {
    menuBtn.addEventListener("click", function () {
      navDialog.showModal();
      menuBtn.setAttribute("aria-expanded", "true");
    });
    navDialog.addEventListener("close", function () {
      menuBtn.setAttribute("aria-expanded", "false");
    });
    navDialog.querySelectorAll("[data-close-nav], .nav-links a").forEach(function (el) {
      el.addEventListener("click", function () { navDialog.close(); });
    });
    navDialog.addEventListener("click", function (e) {
      if (e.target === navDialog) navDialog.close();
    });
  }

  // Project details
  var projects = {
    nes: {
      meta: "AI Velocity · May–Jul 2026",
      title: "Next Edit Suggestion model",
      points: [
        "Fine-tuned 7B LLMs across all three post-training stages on a proprietary codebase.",
        "Built a Next Edit Suggestion model for an in-house IDE that learns organization-specific code patterns.",
        "CCEval accuracy up 3.94%. Zeta Eval up 5.21%, with CCEval regression held to 0.91%."
      ],
      stack: "PyTorch · LLM fine-tuning · Evaluation (CCEval, Zeta Eval)"
    },
    review: {
      meta: "Hostel Affairs Council · May–Jun 2026",
      title: "LLM code review agent",
      points: [
        "RAG-based agent that indexes a codebase for context-aware retrieval of prior code patterns.",
        "Flags bugs and style violations in pull requests against project-specific conventions."
      ],
      stack: "RAG · Agents · Python"
    },
    papers: {
      meta: "VLG, IIT Roorkee · May–Jun 2026",
      title: "Research paper summarizer & fact-checker",
      points: [
        "LangGraph pipeline using the Semantic Scholar API to collate recent, highly cited papers.",
        "Web-search and citation-lookup tools check the claims in each collated paper.",
        "Summaries of verified papers with key findings and trends, generated with the OpenAI API."
      ],
      stack: "LangGraph · Semantic Scholar API · OpenAI API"
    },
    campus: {
      meta: "VLG, IIT Roorkee · May–Jun 2026",
      title: "Smart campus syllabus & assignment assistant",
      points: [
        "Full-stack platform in React and FastAPI for courses, assignments and academic deadlines.",
        "LangChain agent with schedule and assignment context that plans study days.",
        "RAG over uploaded syllabi using ChromaDB and the OpenAI API."
      ],
      stack: "React · FastAPI · LangChain · ChromaDB · OpenAI API"
    },
    cyclist: {
      meta: "Accepted at WCTR 2026",
      title: "Cyclist lateral position detection",
      points: [
        "Real-time computer vision on monocular video to estimate a cyclist's lateral position.",
        "Four-stage pipeline: filtering, scanline edge detection, RANSAC fitting.",
        "Replaced costly LiDAR and GPS sensors with a low-height camera, cutting fit error 15–25%.",
        "Co-authored with Prof. Indrajit Ghosh."
      ],
      stack: "OpenCV · RANSAC · Computer vision"
    },
    llmscope: {
      meta: "Google Developer Students Club · Jun–Jul 2026",
      title: "llmscope",
      points: [
        "C++14 telemetry tool that hooks into a local model's forward pass without changing the model.",
        "Shows tensor shapes, activations and per-layer latency in an interactive terminal UI."
      ],
      stack: "C++14 · Profiling · Terminal UI"
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

  document.querySelectorAll(".work-row[data-project]").forEach(function (row) {
    row.addEventListener("click", function () { openProject(row.getAttribute("data-project")); });
  });
  if (pd) {
    pd.querySelector("[data-close]").addEventListener("click", function () { pd.close(); });
    pd.addEventListener("click", function (e) { if (e.target === pd) pd.close(); });
  }

  // Measured results count up once, when they first scroll into view.
  // Final values are already in the HTML, so the page reads correctly without JS.
  var counters = document.querySelectorAll("[data-count]");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null;
    var duration = 1100;
    function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (!reduceMotion && "IntersectionObserver" in window && counters.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  }
})();
