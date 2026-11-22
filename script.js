(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header shadow once the page scrolls
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Theme toggle (remembers choice when storage is available)
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");
  function applyTheme(mode) {
    root.setAttribute("data-theme", mode);
    if (themeBtn) themeBtn.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
  }
  try {
    var saved = localStorage.getItem("site-theme");
    if (saved === "light" || saved === "dark") applyTheme(saved);
  } catch (e) { /* storage unavailable: keep default */ }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("site-theme", next); } catch (e) { /* ignore */ }
    });
  }

  // Navigation dialog
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
    navDialog.querySelectorAll(".nav-close, .nav-links a").forEach(function (el) {
      el.addEventListener("click", function () { navDialog.close(); });
    });
    // Click on the backdrop closes the dialog
    navDialog.addEventListener("click", function (e) {
      if (e.target === navDialog) navDialog.close();
    });
  }

  // Project details dialog
  var projects = {
    nes: {
      meta: "AI Velocity · May–Jul 2026",
      title: "Next Edit Suggestion model",
      points: [
        "Fine-tuned 7B LLMs across all three post-training stages on a proprietary codebase.",
        "Built a Next Edit Suggestion model for an in-house IDE, internalizing organization-specific code patterns.",
        "CCEval accuracy +3.94%; Zeta Eval +5.21% with CCEval regression limited to 0.91%."
      ],
      tags: ["PyTorch", "LLM", "Fine-tuning"]
    },
    review: {
      meta: "Hostel Affairs Council · May–Jun 2026",
      title: "LLM code review agent",
      points: [
        "RAG-based agent that indexes a codebase for context-aware retrieval of prior code patterns.",
        "Flags bugs and style violations in pull requests against project-specific conventions."
      ],
      tags: ["RAG", "Agents", "Python"]
    },
    papers: {
      meta: "VLG, IIT Roorkee · May–Jun 2026",
      title: "Research paper summarizer & fact-checker",
      points: [
        "LangGraph pipeline using the Semantic Scholar API to collate recent, highly cited papers.",
        "Web-search and citation-lookup tools fact-check the claims in each paper.",
        "Summaries of verified papers with key findings and trends, generated via the OpenAI API."
      ],
      tags: ["LangGraph", "OpenAI API", "Semantic Scholar"]
    },
    campus: {
      meta: "VLG, IIT Roorkee · May–Jun 2026",
      title: "Smart campus syllabus & assignment assistant",
      points: [
        "Full-stack platform in React and FastAPI for courses, assignments and deadlines.",
        "LangChain agent with schedule and assignment context to plan study days.",
        "RAG over uploaded syllabi using ChromaDB and the OpenAI API."
      ],
      tags: ["React", "FastAPI", "LangChain", "ChromaDB"]
    },
    cyclist: {
      meta: "Accepted at WCTR 2026",
      title: "Cyclist lateral position detection",
      points: [
        "Real-time computer vision on monocular video to estimate a cyclist's lateral position.",
        "Four-stage pipeline: filtering, scanline edge detection, RANSAC fitting.",
        "Replaced costly LiDAR/GPS sensors with a low-height camera, cutting fit error 15–25%."
      ],
      tags: ["OpenCV", "RANSAC", "Computer vision"]
    },
    llmscope: {
      meta: "Google Developer Students Club · Jun–Jul 2026",
      title: "llmscope",
      points: [
        "C++14 telemetry tool that hooks into a local model's forward pass without modifying the model.",
        "Captures tensor shapes, activations and per-layer latency in an interactive terminal UI."
      ],
      tags: ["C++14", "Profiling", "TUI"]
    }
  };

  var pd = document.getElementById("project-dialog");
  var pdMeta = document.getElementById("pd-meta");
  var pdTitle = document.getElementById("pd-title");
  var pdPoints = document.getElementById("pd-points");
  var pdTags = document.getElementById("pd-tags");

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
    pdTags.innerHTML = "";
    p.tags.forEach(function (tag) {
      var span = document.createElement("span");
      span.textContent = tag;
      pdTags.appendChild(span);
    });
    pd.showModal();
  }

  document.querySelectorAll(".project-card[data-project]").forEach(function (card) {
    card.addEventListener("click", function () { openProject(card.getAttribute("data-project")); });
  });
  if (pd) {
    pd.querySelector("[data-close]").addEventListener("click", function () { pd.close(); });
    pd.addEventListener("click", function (e) { if (e.target === pd) pd.close(); });
  }

  // Reveal sections as they scroll into view (skipped if IntersectionObserver is missing)
  var revealTargets = document.querySelectorAll(".section, .hero");
  if ("IntersectionObserver" in window) {
    revealTargets.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  }
})();
