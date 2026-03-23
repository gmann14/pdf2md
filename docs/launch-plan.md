# pdf2md — Launch & Growth Plan

*2026-03-23*

---

## The Playbook

The incumbent (pdf2md.morethan.io) got to #1 accidentally — a side project that accumulated backlinks over 9 years with zero strategy. We do it intentionally in 6-12 months.

**Three growth channels, in order of priority:**

1. **GitHub/npm ecosystem** — stars, downloads, mentions → backlinks → SEO authority
2. **Content marketing** — blog posts, guides, comparisons → long-tail traffic → links
3. **Community launches** — Product Hunt, HN, Reddit → burst traffic → backlinks + stars

---

## Pre-Launch (Before Going Public)

### GitHub Repo Setup

The repo IS the marketing. Treat it like a landing page.

- [ ] **README as sales page:**
  - Hero: "Convert PDF to Markdown — in the browser, on the CLI, or in your code"
  - Badges: npm version, downloads, license, build status
  - Quick start: 3 lines to install + convert
  - GIF/screenshot of the web tool in action
  - Feature table with checkmarks
  - "Try it online" link to pdf2md.dev
  - Comparison table vs alternatives (pdf2md.morethan.io, marker, etc.)
  - "How it works" section (brief, links to docs)
  - Contributing guide link

- [ ] **GitHub topics:** `pdf` `markdown` `pdf-to-markdown` `converter` `typescript` `pdf-parser` `cli` `npm-package`

- [ ] **GitHub repo description:** "Convert PDF to Markdown — browser, CLI, and library. Free, fast, private."

- [ ] **Repo metadata:** Website URL → pdf2md.dev. License → MIT.

- [ ] **Releases:** Use GitHub Releases with changelogs. Each release is an event that shows up in people's feeds.

### npm Package

- [ ] Publish `@pdf2md/core` (or `pdf2md` if available)
- [ ] Keywords in package.json: `pdf`, `markdown`, `converter`, `pdf-to-markdown`, `parser`, `text-extraction`
- [ ] Clean API docs in README
- [ ] TypeScript types included (attracts TS developers)

### Domain & Site

- [ ] Buy domain (pdf2md.dev preferred)
- [ ] Deploy to Vercel
- [ ] Google Search Console verified from day 1
- [ ] Plausible analytics installed
- [ ] Sitemap.xml submitted

---

## Launch Week

### Day 1: Product Hunt

**Timing:** Tuesday or Wednesday, 12:01 AM PT (PH resets daily)

- [ ] **Tagline:** "Convert PDF to Markdown — free, fast, private"
- [ ] **Description:** Focus on: client-side (privacy), open-source, no signup, works with AI tools
- [ ] **First comment:** Post a maker comment explaining why you built it ("I needed to convert PDFs for my AI workflows and every tool was either paid, ugly, or produced garbage output")
- [ ] **Screenshots:** Clean UI shots, before/after comparison
- [ ] **Maker profile:** Link to GitHub, Twitter

**Goal:** Top 5 of the day → featured on PH daily email → 200-500 visits → 50-100 GitHub stars

### Day 2: Hacker News — "Show HN"

**Title:** "Show HN: pdf2md — Convert PDF to Markdown in the browser (open source)"

- [ ] **Post format:** Brief description + what makes it different + link
- [ ] **Key angles for HN audience:**
  - Client-side only (privacy)
  - Open source (MIT)
  - No AI hype — just solid text extraction with heuristics
  - Usable as npm library + CLI, not just a website
  - Comparison with marker/Docling (honest about limitations)
- [ ] **Be in the comments:** Answer questions, be honest about limitations, share technical details
- [ ] **Timing:** ~11 AM ET weekday (HN peak)

**Goal:** Front page → 5,000-20,000 visits → 100-500 stars. HN posts also become permanent backlinks.

### Day 3-5: Reddit

Post to multiple subreddits (one per day, not spam):

- [ ] **r/webdev** — "I built a free PDF-to-Markdown converter that runs entirely in your browser"
- [ ] **r/programming** — Technical angle: "Open-source PDF-to-Markdown converter — how PDF.js text extraction actually works"
- [ ] **r/ChatGPT** or **r/LocalLLaMA** — "Free tool to convert PDFs to Markdown for AI/LLM workflows — no upload needed"
- [ ] **r/markdown** — Straightforward utility announcement
- [ ] **r/SideProject** — Builder story angle

**Rules:** Don't be spammy. Each post should provide value (technical insight, honest comparison, free tool). Link to the website OR the GitHub repo, not both.

### Day 5-7: Dev Blogs

- [ ] **Dev.to:** "Building a PDF-to-Markdown Converter That Runs in Your Browser" — technical deep dive on PDF.js, font heuristics, the pipeline. Include code snippets. Link to repo + tool.
- [ ] **Hashnode:** Same article cross-posted (or a different angle)
- [ ] **Personal blog / Medium:** "Why I built yet another PDF converter" — problem-focused narrative

---

## Ongoing Growth (Month 1-3)

### GitHub Star Accumulation

Stars compound. Each star puts the repo in someone's feed, which leads to more stars.

**Submit to "awesome" lists (free backlinks + discovery):**
- [ ] [awesome-markdown](https://github.com/BubuAnab662/awesome-markdown) — PR to add under "Tools"
- [ ] [awesome-pdf](https://github.com/nicferrier/awesome-pdf) — if it exists / similar lists
- [ ] [awesome-typescript](https://github.com/dzharii/awesome-typescript) — under "Libraries"
- [ ] [awesome-react](https://github.com/enaqx/awesome-react) — if web component is notable
- [ ] Any "awesome-ai-tools" or "awesome-llm" lists — the AI/RAG angle

**Answer questions on GitHub/StackOverflow:**
- [ ] Search GitHub issues across LangChain, LlamaIndex, Haystack for "pdf to markdown"
- [ ] Search StackOverflow for "convert pdf to markdown javascript" / "pdf to markdown npm"
- [ ] Post helpful answers with a mention of the library (not spammy — actually solve their problem)

**Get mentioned in other repos:**
- [ ] LangChain docs/community — if they list PDF loaders, get pdf2md added
- [ ] LlamaIndex — same
- [ ] Any RAG framework that lists document converters

### SEO Content (one post per week)

Each blog post targets a long-tail keyword and links back to the tool.

| Week | Post | Target Keyword |
|------|------|---------------|
| 1 | "How to Convert PDF to Markdown" (on-site guide) | pdf to markdown |
| 2 | "Best PDF to Markdown Converters in 2026" (comparison) | best pdf to markdown converter |
| 3 | "PDF to Markdown for AI Workflows" | pdf to markdown ai |
| 4 | "Convert PDF Tables to Markdown" (when Phase 2 ships) | pdf table to markdown |
| 5 | "PDF to Markdown API" (when Phase 4 ships) | pdf to markdown api |
| 6 | "PDF to Markdown with Python vs JavaScript" | pdf to markdown python |
| 7 | "How PDF Text Extraction Actually Works" (technical) | pdf text extraction |
| 8 | "Building an npm Package from a Side Project" | (developer audience) |

**Where to publish:**
- On-site blog (best for SEO) — if we add a `/blog` to the Next.js site
- Dev.to (good reach, follows canonical back to our site)
- Medium (moderate reach, weak SEO passthrough)

### Backlink Building

**High-value, low-effort backlinks:**
- [ ] GitHub repo (automatic — high DA)
- [ ] npm registry (automatic — high DA)
- [ ] Product Hunt page (automatic)
- [ ] Dev.to articles (canonical to our site)
- [ ] Awesome lists (PRs)

**Medium-effort backlinks:**
- [ ] StackOverflow answers
- [ ] Developer tool directories (submit to: devresources.info, free-for.dev, etc.)
- [ ] "Alternatives to X" sites (alternativeto.net — submit pdf2md as alternative to pdf2md.morethan.io)

**Higher-effort backlinks:**
- [ ] Guest posts on developer blogs
- [ ] Get reviewed by dev YouTubers / newsletter authors
- [ ] Integrate with popular frameworks and get listed in their docs

---

## Metrics to Track

### Weekly Check

| Metric | Tool | Goal (Month 3) | Goal (Month 6) |
|--------|------|----------------|----------------|
| GitHub stars | GitHub | 200+ | 500+ |
| npm weekly downloads | npm | 100+ | 500+ |
| Google ranking for "pdf to markdown" | Search Console | Top 10 | Top 3 |
| Monthly site visitors | Plausible | 5,000+ | 20,000+ |
| Conversions per week | Custom analytics | 1,000+ | 5,000+ |
| Referring domains | Search Console | 30+ | 100+ |

### Signals That It's Working

- Organic search traffic growing week over week
- People starring the repo without being prompted
- Issues/PRs from external contributors
- Mentions in blog posts / newsletters you didn't write
- npm download count growing

### Signals to Pivot

- No search traffic growth after 3 months of content
- GitHub stars plateau under 100
- Users consistently complain about quality (signal to accelerate Phase 4 backend)
- A well-funded competitor launches and dominates (unlikely for this niche)

---

## Budget

| Item | Cost | When |
|------|------|------|
| Domain | $12/year | Pre-launch |
| Plausible analytics | $0-9/mo | Launch |
| Product Hunt (free to submit) | $0 | Launch week |
| Dev.to / Reddit / HN (free to post) | $0 | Launch week |
| Time: 1-2 hours/week for content + community | - | Ongoing |
| **Total cash cost** | **$12-120/year** | |

This is essentially a zero-cost marketing plan. The investment is time, not money.

---

## Timeline Summary

```
Week 1-2:   Build MVP + deploy
Week 2-3:   Phase 1.5 — extract npm package, polish README
Week 3-4:   Phase 2 — tables, tagged PDFs, mobile
Week 4:     Launch week — PH, HN, Reddit, Dev.to
Week 5-8:   Weekly blog posts, awesome list submissions, SO answers
Month 3:    Evaluate — are we in top 10 for "pdf to markdown"?
Month 4-6:  Continue content, consider Phase 4 backend if quality complaints
Month 6-12: Push for #1, consider API monetization
```
