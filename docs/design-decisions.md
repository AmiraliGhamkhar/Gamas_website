# Design and engineering decisions — 2026-10-06

This is the current decision record for the Gamas landing page. Historical redesign notes and screenshots are archived; the current audit, score estimates and release checklist live in [`AUDIT.md`](../AUDIT.md).

## Scope kept intact

- Keep React 18, Vite 6, `vite-react-ssg`, prerendered static HTML, plain CSS, the PHP API, SQLite/NDJSON storage, Apache/cPanel delivery and the Persian RTL interface.
- Node is a build-time dependency only; cPanel receives `dist/` and `api/`, not the development server.
- Do not add an email service, analytics vendor, framework migration or new runtime dependency.

## Product and content

- The hero describes the bot’s reviewed task and links to Telegram; the demo is labeled a simulation and never presented as a live response.
- Product file/output/privacy/SEO facts are centralized in `src/lib/product.js` and checked against public bot source at `838184907bc828286d4f4782151c3c4fc3b8fc9d`.
- Audio/video/PowerPoint examples, the default 2,000,000,000-byte app limit, TXT transcript, conditional DOCX notes and raw-transcript fallback are qualified. ODP/OTP, PDF, images and ZIP are not advertised as supported. No price, testimonial, usage figure, accuracy rate or performance promise is asserted.
- Privacy copy distinguishes website click tracking and host access logs from bot-side data and external processing. Temporary media cleanup is not described as transcript/note deletion; the reviewed bot code defines no automatic expiry for those texts.
- The default `Gamas_jozveh_bot` Telegram destination is **not** live-verified. The hero shows a warning unless the operator configures a handle and explicitly attests verification. `VITE_BOT_USERNAME` alone is not evidence; `VITE_BOT_IDENTITY_VERIFIED=true` gates the JSON-LD `sameAs` edge and is an operator assertion, not an automated check.

## Privacy, API and storage

- Keep the retired email form removed. `api/lead.php` remains an explicit JSON `410 Gone` response for stale clients.
- The site calls `POST /api/track.php` on CTA clicks only. Event names in Telegram `start` parameters match the tracked `landing_*` names; failures do not block navigation.
- Click records contain section/time, not raw IP/user-agent. Short-window rate-limit buckets use a keyed HMAC pseudonym in private storage; cPanel/provider access logs are outside that statement.
- Keep exact scheme + host + port origin checks, fixed trusted redirects, fail-closed analytics storage/rate limiting, private data directories, optional SQLite and the NDJSON fallback. Legacy data removal from provider backups remains an operator task.

## Visual, mobile and accessibility

- Keep Persian RTL with self-hosted Vazirmatn/Lalezar. Fix constrained layouts rather than hiding overflow on `body`; retain local clipping only for artwork/bounded UI.
- Preserve the 640/834/1068 px breakpoints and ≤360 px CTA stacking. Source links use 44px minimum block targets; responsive illustration `sizes` values match the layout tracks more closely.
- Preserve skip navigation and landmarks, keyboard-trapped mobile drawer, Escape/focus return and focus handoff to desktop navigation at the breakpoint; keep native privacy disclosure, FAQ state, demo progress semantics, reduced-motion handling and bidi isolation.
- Demo visuals use CSS classes/data attributes. No inline style attributes are allowed because the shipped CSP prohibits them. The progress visual is CSS-driven and its state is exposed to assistive technology.
- Sampled contrast calculations from CSS tokens are estimates, not a rendered WCAG audit. See [`AUDIT.md`](../AUDIT.md).

## Static deployment, CSP and SEO/GEO

- Keep prerendered HTML and canonical metadata for the configured origin. `vite.config.js` loads `VITE_*` consistently from `.env` files or process environment; postbuild derives the public origin/base from the emitted canonical URL.
- `scripts/postbuild.mjs` strips SSG manifests, checks sensitive-file exclusions, generates base-aware `robots.txt`/`sitemap.xml`/`llms.txt`, updates `RewriteBase`, validates local HTML/CSS references and generates exact SHA-256 CSP allowlists from final inline SSG/JSON-LD scripts.
- CSP allows same-origin external scripts/styles and those exact script hashes; it prohibits inline script attributes and inline style attributes. Do not upload the unprocessed `public/.htaccess`; use `dist/.htaccess` from a passing build.
- Apache fallback preserves `/api/`, native assets and missing-file 404s; it should serve the app shell only for intended page routes. AutoSSL exceptions are restricted to challenge paths.
- HTTPS redirects trust Apache’s TLS state rather than arbitrary `X-Forwarded-Proto`. If Cloudflare is used, origin-side HTTPS redirect requires Full/Strict; Flexible mode can loop. Validate the actual proxy and host configuration.
- JSON-LD keeps Organization/WebSite/WebPage/SoftwareApplication/FAQ entities aligned with visible content; Telegram `sameAs` is omitted absent explicit operator attestation. A subfolder `robots.txt` is not discoverable in place of the domain-root file.

## SEO, GEO and LLM discovery

- Persian copy uses correct orthography (ZWNJ, Persian ی/ک); no duplicate pages or spellings are created for search variants, and meta keywords are treated as decorative because Google ignores them.
- Titles/descriptions are keyword-forward but honest; `robots` allows full snippets; a self-referencing `fa-IR` hreflang plus `x-default` is kept for locale clarity even though Google infers language from content.
- Structured data uses ordinary Schema.org types that match visible content (`Organization` with a 512×512 logo, `WebSite`, `WebPage` with dates, `SoftwareApplication` with `featureList`, and a real `HowTo`). No "AI schema", no invented ratings, offers or statistics; Telegram `sameAs` stays gated on the explicit operator attestation.
- `robots.txt`, `sitemap.xml` (image namespace) and a Persian `llms.txt` are generated at build time. The AI-crawler allow policy is explicit and `/api/` stays disallowed in every group; `llms.txt` is documented as an optional convention, not a ranking lever. Full rationale and sources: [`seo-geo.md`](seo-geo.md).
- Postbuild fails if the snippets policy, keyword meta, `fa-IR` alternate, product JSON-LD entities, AI-crawler groups or image sitemap go missing.

## Validation record

| Check | Result |
|---|---|
| `npm ci` | Passed; 244 packages installed, 0 vulnerabilities reported. |
| `npm audit --audit-level=low` | Passed; 0 vulnerabilities. |
| `npm run lint` | Passed with zero warnings/errors. |
| `npm test` | Passed; 3 dependency-free product/CTA tests. |
| `npm run build` | Root build passed; postbuild checks and exact inline CSP hashes passed. JS 196.74 kB (61.78 kB gzip); CSS 42.07 kB (9.14 kB gzip); HTML 42.84 KiB. |
| `/gamas/` build using temporary `.env.production.local` | Passed; base-aware canonical/assets/fonts/crawler output/RewriteBase and build-time identity propagation checked. The fake handle was test-only and was removed with the temporary file; no live identity was asserted. |
| Vite preview host smoke | Local and `.e2b.app`-style Host requests returned 200; an arbitrary Host returned 403. This is host-allowlist evidence, not a browser or Apache test. |
| Browser/PHP/Apache/cPanel | Not verified in this environment. No current browser interaction/render test, PHP runtime, live API, Apache response/header, staging, backup migration, or Telegram identity test is claimed. |

The local builds prove generated-file invariants only. They do not prove live bot settings, cPanel permissions, proxy redirects, Apache module behavior, browser accessibility, rendered overflow or Web Vitals. Follow the release checklist in [`AUDIT.md`](../AUDIT.md) and the account-specific steps in [`DEPLOY.md`](../DEPLOY.md).
