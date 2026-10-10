# SEO, GEO and LLM discovery — strategy and evidence (2026-10-10)

Scope: the Persian (fa / fa-IR) single-page landing site for the **گاماس / Gamas**
Telegram bot, deployed at `https://gamadesk.ir`. This note records what the
research actually supports, what was implemented, and what remains unproven.

> **Nothing here is a ranking or citation guarantee.** Vendor pages confirm how
> crawlers *may* be used, not how results are ranked or which page will be
> cited. Treat the changes below as a solid, low-risk foundation — not a promise.

## 1. What the research established

### Traditional SEO
- **Google is effectively the only search engine that matters for Iran.** The
  StatCounter snapshot for Iran shows Google ≈ 99.5% and Bing ≈ 0.4%; the older
  local engines (Parsijoo, Yooz, Salamooz) could not even be reached during
  research and are not a dependable channel. Rismoon still describes itself as a
  Persian engine, but no market evidence was found. Optimise for Google; treat
  local engines as a "if it appears in logs, look again" item.
  - https://gs.statcounter.com/search-engine-market-share/all/iran
- **`lang`/`hreflang` do not set the language for Google.** Google infers the
  language from visible content; the markup still matters for standards,
  screen readers and other agents. A single-language site does not *need*
  hreflang, so ours is a self-referencing locale hint (`fa-IR` + `x-default`).
  - https://developers.google.com/search/docs/specialty/international/localized-versions
- **Meta keywords are ignored by Google.** We keep a short, honest list anyway
  because it is free and legacy/local engines may read it — never as a lever.
  - https://developers.google.com/search/docs/crawling-indexing/special-tags
- **Persian orthography:** write correct Persian, including the ZWNJ / نیم‌فاصله
  (U+200C) and Persian `ی`/`ک`, rather than mixing script variants to chase
  tokenisation. No source confirms Google folds ZWNJ or Arabic/Persian lookalike
  letters, so we do **not** duplicate pages or spellings.
  - https://www.unicode.org/reports/tr15/

### GEO / LLM SEO
- **Cited sources are picked by each vendor's own system; the exact formula is
  not public.** The confirmed, controllable signals are eligibility: a public,
  crawlable, indexable page with important content in HTML and honest markup.
  - https://developers.google.com/search/docs/appearance/ai-features
  - https://developers.openai.com/api/docs/bots
  - https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- **`llms.txt` is an informal convention, not a requirement.** We could not
  confirm that OpenAI, Google, Perplexity or Microsoft read a *site's* `llms.txt`
  for selection/citation; Google states it neither helps nor hurts Search. We
  publish a correct, concise `llms.txt`/`llms-full`-style summary as a low-cost
  experiment, not as a ranking tactic.
  - https://llmstxt.org/ · https://developers.google.com/search/updates
- **There is no "AI schema".** Google explicitly says AI features need no special
  structured data and that markup must match visible content. We use ordinary,
  truthful Schema.org types only.
- **Retrieval-friendly content structure** (question headings, answer-first,
  lists/tables, dated facts, citations) is reasonable practice; the KDD 2024 GEO
  paper found measurable-but-not-universal gains from credible citations,
  quotations and statistics. We apply this to copy/FAQ, not as a guarantee.
  - https://arxiv.org/html/2311.09735
- **FAQ rich results were retired.** Google limited FAQ rich results in Aug 2023
  and its update log lists FAQ rich results as no longer appearing in Search
  (May 2026). `FAQPage` markup is kept solely because it accurately describes
  visible Q&A for other consumers — not for Google rich results.
  - https://developers.google.com/search/blog/2023/08/howto-faq-changes

### Telegram product markup / discoverability
- Telegram bots are **software products**, so `SoftwareApplication` is the honest
  type (not `WebApplication`, and Telegram is **not** an `operatingSystem`).
  `Organization.logo` should be ≥112×112 and crawlable; we declare a 512×512 vector.
  - https://schema.org/SoftwareApplication · https://developers.google.com/search/docs/appearance/structured-data/software-app
- A bot is found by its **@username** or a `t.me` link; deep links accept a
  `?start=` payload (≤64 chars, `A-Za-z0-9_-`) which we already use for CTA
  attribution. Third-party bot catalogs are an extra referral channel, not an
  official directory. Outbound `t.me` links are a conversion path, **not**
  backlinks to the site.
  - https://core.telegram.org/bots/features#deep-linking

## 2. What was implemented

| Area | Change | File |
|---|---|---|
| Title / description | Keyword-forward Persian title and description; brand kept; `@handle` included | `src/lib/product.js` |
| Keywords | Short honest list for the meta tag and docs (Google ignores it) | `src/lib/product.js`, `index.html` |
| Snippets | `robots: index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1` so engines may quote the page fully | `index.html` |
| Locale | `hreflang="fa-IR"` self-reference + `x-default`; `lang="fa" dir="rtl"` retained | `index.html` |
| llms.txt | Rewritten to the llmstxt.org shape (H1 + blockquote + H2 link lists), Persian, with capabilities, formats, FAQs, privacy and canonical anchors; `rel="describedby"` link added | `scripts/postbuild.mjs`, `index.html` |
| robots.txt | Explicit allow groups for classic search and AI search/user agents (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot/User, …); `/api/` stays disallowed in every group; training-only crawlers allowed with a documented opt-out | `scripts/postbuild.mjs`, `public/robots.txt` |
| sitemap.xml | Image namespace + image entries; kept base-aware and single-URL | `scripts/postbuild.mjs`, `public/sitemap.xml` |
| Structured data | `Organization` (512×512 logo), `WebSite`, `WebPage` with `datePublished`/`dateModified`, `SoftwareApplication` with `featureList`, plus a real `HowTo` for the 3-step flow; Telegram `sameAs` still gated on the operator attestation | `src/components/StructuredData.jsx` |
| FAQ | 15 visible Q&As covering the transcription, note-taking, PowerPoint, summary and Telegram intents | `src/lib/faq-data.js` |
| Build guards | Postbuild now fails if snippets policy, keyword meta, `fa-IR`, the product JSON-LD entities, the AI-crawler groups or the image sitemap are missing | `scripts/postbuild.mjs` |

## 3. Deliberately NOT done
- No keyword stuffing, hidden text or duplicate pages for ZWNJ/spelling variants.
- No invented `aggregateRating`, `offers`/price, review count or usage/accuracy
  statistics — those are unverified and would violate the honest-markup rule.
- No `DefinedTerm`/glossary container, no fake "AI schema", no `operatingSystem: Telegram`.
- No links purchased or exchanged; `sameAs` is only emitted after the operator
  sets `VITE_BOT_IDENTITY_VERIFIED=true` having checked the destination.

## 4. How to validate (do not skip)
1. Verify `https://gamadesk.ir` in **Google Search Console** and watch the
   Queries report for the real wording students use; the keyword list here is a
   hypothesis, not measured volume. (`fa` volumes are hard to verify externally.)
2. Validate the JSON-LD with the Schema Markup Validator; expect no errors.
   `WebSite` site-name markup will not appear in the Rich Results Test.
3. Confirm the deployed `robots.txt`, `sitemap.xml` and `llms.txt` at the live
   origin, then re-check after any change to `scripts/postbuild.mjs`.
4. Ask two or three Persian LLM/search tools a real query ("ربات تلگرام تبدیل
   ویس فارسی به متن") and note whether the site is cited. This is the only way
   to observe GEO behaviour; treat a single result as anecdotal.
5. Optionally list the bot in a Persian-facing Telegram bot catalog for referral
   traffic — independent of Google/LLM discovery.
