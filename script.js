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

  // ---------------------------------------------------------------
  // Motion layer. Everything below is skipped when the visitor asks
  // for reduced motion; the page then reads as a static document.
  // ---------------------------------------------------------------

  // Split an element's text into letters, each inside a clipped window.
  function splitLetters(el) {
    var label = el.textContent.replace(/\s+/g, " ").trim();
    if (/^(H1|H2|A)$/.test(el.tagName)) el.setAttribute("aria-label", label);
    var frag = document.createDocumentFragment();
    var index = 0;
    function addLetter(content, isNode) {
      var win = document.createElement("span");
      win.className = "win";
      win.setAttribute("aria-hidden", "true");
      var ch = document.createElement("span");
      ch.className = "ch";
      ch.style.setProperty("--i", String(index++));
      if (isNode) ch.appendChild(content); else ch.textContent = content;
      win.appendChild(ch);
      frag.appendChild(win);
    }
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        Array.from(node.textContent.replace(/\s+/g, " ")).forEach(function (c) {
          if (c === " ") {
            var sp = document.createElement("span");
            sp.className = "sp";
            sp.setAttribute("aria-hidden", "true");
            frag.appendChild(sp);
          } else {
            addLetter(c, false);
          }
        });
      } else if (node.nodeName === "BR") {
        frag.appendChild(document.createElement("br"));
      } else {
        addLetter(node.cloneNode(true), true);
      }
    });
    el.textContent = "";
    el.appendChild(frag);
  }

  if (!reduceMotion) {
    // 1. Wordmark: letters flip on hover.
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
      var twin = svg.cloneNode(true);
      btn.replaceChild(wrap, svg);
      track.appendChild(svg);
      track.appendChild(twin);
      wrap.appendChild(track);
    });

    // 3. Letter-by-letter reveals: hero name, section headings, footer name.
    var revealLetters = [];
    var heroName = document.querySelector(".name");
    if (heroName) {
      splitLetters(heroName);
      heroName.classList.add("letters");
      // Let the browser paint the hidden state first, then play the entrance.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { heroName.classList.add("in"); });
      });
    }
    document.querySelectorAll(".sheet-head h2, .footer-name").forEach(function (el) {
      splitLetters(el);
      el.classList.add("letters");
      revealLetters.push(el);
    });

    // 4. Menu: links rise letter by letter each time it opens.
    var menuLinks = document.querySelectorAll(".nav-links a");
    menuLinks.forEach(function (a, n) {
      splitLetters(a);
      a.style.setProperty("--base", String(n));
      a.classList.add("letters");
    });
    if (navDialog && menuBtn) {
      menuBtn.addEventListener("click", function () {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            menuLinks.forEach(function (a) { a.classList.add("in"); });
          });
        });
      });
      navDialog.addEventListener("close", function () {
        menuLinks.forEach(function (a) { a.classList.remove("in"); });
      });
    }

    // 5. Scroll reveals for rows and blocks (staggered inside each group).
    var groups = [
      ".work-list > li", ".also-list > li", ".timeline > li",
      ".skills > div", ".plain li", ".metrics > div",
      ".sheet-head p", ".sheet-head .learn-more", ".contact-line", ".contact .actions"
    ];
    var blocks = [];
    groups.forEach(function (selector) {
      var items = document.querySelectorAll(selector);
      items.forEach(function (item, n) {
        item.style.setProperty("--n", String(Math.min(n, 6)));
        item.classList.add("will-reveal");
        blocks.push(item);
      });
    });

    if ("IntersectionObserver" in window) {
      var revealer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: "0px 0px -6% 0px" });
      revealLetters.concat(blocks).forEach(function (el) { revealer.observe(el); });
    } else {
      revealLetters.concat(blocks).forEach(function (el) { el.classList.add("in"); });
    }

    // 6. Hero code texture: typed in once, then drifts slower than the page.
    var glyph = document.getElementById("glyph-bg");
    if (glyph) {
      var codeLines = [
        "retriever = VectorStore.from_documents(chunks, embedder)",
        "for stage in post_training_stages:",
        "    model = finetune(model, data[stage], lr=schedule(stage))",
        "gain = evaluate(model, 'CCEval') - baseline",
        "",
        "frame = read_frame(video)",
        "edges = scanline_edges(denoise(frame))",
        "lane = ransac(edges, residual_threshold=2.0)",
        "detections = yolo.predict(frame, conf=0.25)",
        "",
        "graph = StateGraph(papers, claims, verdicts)",
        "graph.add_edge('search', 'fact_check')",
        "summary = llm.invoke(prompt, context=verified)",
        "",
        "def plan_day(schedule, assignments):",
        "    context = retrieve(syllabus_index, assignments)",
        "    return agent.run(schedule, context)",
        "",
        "yield_curve = cir_model.fit(maturities, rates)",
        "r2 = score(yield_curve.predict(r_3m), observed)",
        "",
        "trace = hook(model.forward, layers=all)",
        "print(trace.latency_per_layer)",
        "",
        "X, y = smote.fit_resample(features, default_flag)",
        "clf = XGBClassifier().fit(X, y)",
        "recall = recall_score(y_test, clf.predict(X_test))"
      ];
      var lineNo = 0;
      glyph.classList.add("typing");
      var typer = setInterval(function () {
        if (lineNo >= codeLines.length) {
          clearInterval(typer);
          glyph.classList.remove("typing");
          return;
        }
        glyph.textContent += (lineNo ? "\n" : "") + codeLines[lineNo];
        lineNo += 1;
      }, 110);
    }

    // 7. Scroll-linked: portrait flips to colour, code texture drifts.
    var hero = document.getElementById("top");
    var flip = document.getElementById("portrait-flip");
    var ticking = false;
    function updateScroll() {
      ticking = false;
      var y = window.scrollY;
      var span = hero ? hero.offsetHeight * 0.85 : 1;
      var p = Math.min(Math.max(y / span, 0), 1);
      if (flip) {
        flip.style.setProperty("--ry", (p * 180).toFixed(1) + "deg");
        flip.style.setProperty("--p", p.toFixed(3));
      }
      if (glyph && y < (hero ? hero.offsetHeight * 1.5 : 1200)) {
        glyph.style.transform = "translateY(" + (y * -0.14).toFixed(1) + "px)";
      }
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
    }, { passive: true });
    updateScroll();

    // 8. Theme switch fades colours instead of snapping.
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        root.classList.add("theming");
        setTimeout(function () { root.classList.remove("theming"); }, 500);
      });
    }
  } else {
    // Reduced motion: show the code texture as static text.
    var staticGlyph = document.getElementById("glyph-bg");
    if (staticGlyph) {
      staticGlyph.textContent = [
        "retriever = VectorStore.from_documents(chunks, embedder)",
        "model = finetune(model, data[stage], lr=schedule(stage))",
        "lane = ransac(edges, residual_threshold=2.0)",
        "graph = StateGraph(papers, claims, verdicts)"
      ].join("\n");
    }
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
