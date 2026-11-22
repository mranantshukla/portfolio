# Portfolio Site: Design

**Owner:** Anant Shukla
**Status:** Draft, awaiting approval

## Intent

A one-page personal site that gets recruiters and hiring managers in Applied ML / GenAI / data roles to contact Anant. Primary action: "Hire me" (email), secondary: resume download and GitHub.

Audience: recruiters and engineering managers, usually skimming on a phone for under a minute.

## Goals

- Show, within the first screen, who he is and what he builds (Applied ML and GenAI, IIT Roorkee, graduating 2027).
- Lead with six strong projects, each with a concrete measured result.
- Make contact effortless: email button, resume PDF, GitHub, LinkedIn.
- Load fast, work at phone width, no build step.

## Non-goals

- No blog, CMS, backend, or contact form server. Contact is a `mailto:` link.
- No analytics or third-party scripts in v1.
- No Instagram or phone number published (not on the site unless he asks).

## Constraints

- Hosted on GitHub Pages from the `portfolio` repo, so the site must be static files (HTML/CSS/JS, no framework build).
- Content comes only from the two resumes. No invented metrics or titles.

## Approaches considered

1. **Plain HTML/CSS/JS (chosen).** Zero build, works on GitHub Pages directly, easy to edit. Trade-off: no component reuse, fine at this size.
2. **React/Next.js.** Richer, but needs a build step and config for Pages; overkill for one page.
3. **Template theme (Jekyll/Hugo).** Quick start, but generic look, which works against standing out.

## Design

**Visual (updated):** modeled on the structure and feel of a single-page dark portfolio the owner shared as a reference (dark default with a light toggle, large name hero, project cards with detail dialogs, timeline experience, "Let's talk" contact). Content and styling are original; no text, images or code are copied from the reference. Interactions: header social icons with hover tooltips, "Learn more" links with moving arrows, project cards with a subtle tilt on hover, a 3D-lift primary button, smooth scrolling with a back-to-top link, pressed states, reduced-motion support. Single column on phone, two or three columns on desktop.

**Sections, top to bottom:**

1. **Hero:** headshot, "Anant Shukla", one-line positioning ("Applied ML & GenAI engineer · B.Tech Civil Engineering, IIT Roorkee · Class of 2027"), buttons: Hire me (mailto), Resume (PDF), GitHub, LinkedIn.
2. **Experience:** AI Velocity (Gen AI Intern), VK Global Publications (Summer Intern), Eazeplace (ML Intern), Updesha Conxultancy (Co-founder).
3. **Featured projects (6):**
   - Next Edit Suggestion model, AI Velocity: fine-tuned 7B LLMs across three post-training stages, +3.94% CCEval, +5.21% Zeta Eval, 0.91% regression.
   - LLM Code Review Agent with RAG over codebase, Hostel Affairs Council.
   - Automated Research Paper Summarizer & Fact-Checker, LangGraph + Semantic Scholar + OpenAI, IITR VLG.
   - Smart Campus Syllabus & Assignment Assistant, React + FastAPI + LangChain + ChromaDB RAG, IITR VLG.
   - Real-Time Cyclist Lateral Position Detection, accepted at WCTR 2026, monocular CV with RANSAC.
   - llmscope, C++14 LLM forward-pass tracing and replay tool, GDSC.
4. **More projects:** compact list (Swiggy Sense, LiDAR tailgating detection, vehicle detection YOLOv11n at 93% mAP50, customer intelligence pipeline, credit-risk modeling, yield curve modeling, flight delay prediction, others).
5. **Skills:** Python, C++, SQL; PyTorch, scikit-learn, XGBoost; RAG, LangChain, vector DBs, LLM APIs; FastAPI, React, Power BI, Git.
6. **Achievements:** WCTR 2026 paper, Top 3 at Bring Your Own Projects 2026, IITR Heritage Excellence Award '24, Policython Challenge '24 1st rank, Chess.com 1533 (Rapid).
7. **Leadership (short):** Hostel Affairs Council (Overall Coordinator), Unnat Bharat Abhiyan (Finance Coordinator), NSS (Joint Secretary).
8. **Contact footer:** "Hire me" email button, resume, GitHub, LinkedIn.

## Calls I made (not yet confirmed by you)

- Projects: the six above, chosen for applied-ML relevance and measurable results.
- Phone number and Instagram left off the site.
- Graduation shown as 2027, per your message.
- Headshot copied into the repo under `assets/`.
- Resume PDF added to the repo as a downloadable file.
- Hosting: GitHub Pages at `mranantshukla.github.io/portfolio` (custom domain later).
- Nothing is committed or pushed until you say so.

## Left to the builder

- Exact color palette, font, and spacing.
- Copy wording beyond the facts above.
- Mobile breakpoints.
