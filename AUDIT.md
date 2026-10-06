# Gamas website engineering audit — 2026-10-06

**Verdict: RUNTIME VERIFICATION REQUIRED — do not call this production-ready yet.** The source review and local static-build work pass, but there is no verified browser, PHP/API, Apache/cPanel, deployment, or live Telegram evidence for this checkout.

## Scope and summary

The audit preserves React + Vite + `vite-react-ssg`, prerendered static HTML, plain CSS, the small PHP API, SQLite/NDJSON storage, and Apache/cPanel deployment. No framework, hosting, database, analytics vendor, or product-scope migration was made.

This pass centralizes product/privacy/SEO facts; aligns Telegram deep-link and anonymous click event names; labels the demo as a simulation; makes bot identity uncertainty visible; tightens generated CSP without `unsafe-inline`; improves mobile drawer focus behavior and source links; and extends postbuild checks across metadata, local assets, crawler output, CSP hashes, and root/subfolder paths. Dependency, lint, unit, root-build and subfolder-build checks pass. Runtime and production verification remain open.

## Findings and changes

| Area / priority | Finding | Minimum change and current evidence |
|---|---|---|
| Product truth / P1 | Public bot source does not prove the live bot’s identity, availability, provider settings, or retention practices. The default `GamasBot` destination was not externally verified. | `src/lib/product.js` pins copy to the reviewed bot commit. An unverified-identity note is rendered beside the hero CTA. `VITE_BOT_USERNAME` is only a build override; only an explicit `VITE_BOT_IDENTITY_VERIFIED=true` operator attestation can add the Telegram `sameAs` edge to JSON-LD. Generated `llms.txt` derives the handle/attestation from prerendered HTML. This is not a live check. |
| Product claims / P1 | Formats, limits, outputs, privacy, and demo behavior must match source, not marketing assumptions. | Shared facts drive the UI, FAQ/JSON-LD, metadata, and `llms.txt`. Reviewed bot source supports the stated audio/video/PowerPoint examples; default 2,000,000,000-byte limit; TXT transcript; conditional DOCX notes; and raw-transcript fallback. ODP/OTP, PDF, images and ZIP are not advertised as supported. The demo is explicitly simulated. No price, testimonial, accuracy rate, or usage claim was introduced. |
| Privacy / P1 | Website tracking, host logs, bot-side data, and provider processing are distinct systems. | The site copy separates click analytics/host access logs from bot processing and storage, identifies the source revision, describes temporary-media cleanup and possible persistent transcripts/notes, and avoids a fixed deletion promise. No email form is present. Live provider/account settings and historical hosting backups remain unverified. |
| API and storage / P1 | The browser-facing endpoint must avoid unnecessary identifiers and fail safely when storage/rate limiting fails. | Existing `POST /api/track.php` source was reviewed and retained: click records store section/time, not raw IP/user-agent; a keyed IP pseudonym is used only for short-window rate-limit files; exact origins are checked; no public read route exists; limiter/storage failures are distinct from 429. SQLite is optional with NDJSON fallback. PHP execution and migration behavior were not tested here. |
| Security / P1 | A permissive inline CSP and untrusted forwarded-protocol headers weaken the static hosting boundary. | `.htaccess` now uses per-build SHA-256 allowlists for the exact inline SSG/JSON-LD scripts, `style-src 'self'`, and `style-src-attr 'none'`; progress/wave visuals use data attributes/classes instead of inline styles. Postbuild verifies hash equality and rejects inline style/event-handler attributes. HTTPS redirects use Apache TLS state, not arbitrary `X-Forwarded-Proto`; Cloudflare Flexible mode is documented as incompatible with that origin-side redirect. Apache behavior is unverified. |
| Routing / P0 | Missing extensionless assets or API routes must not be answered with the SPA shell; internal source/config must not be exposed. | Rewrite rules preserve `/api/` and native asset directories, deny source/private/config paths (including API bootstrap/config helpers), limit AutoSSL bypass to its challenge paths, and retain the SPA fallback for intended page deep links. Static rules were inspected; real 404/403 responses were not tested. |
| Subfolder / P0 | Root-relative paths and deployment-base drift can break fonts, metadata, API links, crawlers, and deep links below the domain root. | Vite loads build variables consistently from process env or `.env`; postbuild derives base/origin from the rendered canonical URL, adjusts `RewriteBase`, rewrites/checks font URLs, and verifies generated references. Root and `/gamas/` builds pass. No live Apache subfolder was tested; a subfolder `robots.txt` is not a substitute for the domain-root robots file. |
| Accessibility / P2 | Skip navigation, responsive navigation, touch targets, motion, mixed direction, and progress semantics need code-level support and rendered verification. | The main landmark is programmatically focusable; the mobile drawer traps Tab, returns focus on Escape/close, and moves focus to desktop navigation when resized across the breakpoint. Source links have 44px targets; demo progress has accessible state; reduced-motion and bidi handling remain. No browser, screen reader, or rendered WCAG audit was available. |
| Performance / SEO/GEO / P2 | First-render HTML, local assets, truthful metadata, and machine-readable facts should work without a server framework. | Static HTML, self-hosted fonts/images, responsive illustrations, canonical/OG/Twitter metadata, shared Schema.org WebSite/WebPage/SoftwareApplication/FAQ data, and base-aware crawler files are retained. `sameAs` is gated on explicit attestation. Postbuild checks local references and exact CSP hashes. Bundle sizes are build outputs, not Web Vitals or field performance. |
| Dependencies / P2 | Lockfile dependency audit. | `npm audit fix` advanced the locked `source-map-js` patch to 1.2.2; clean install and full audit report zero vulnerabilities. No runtime dependency was added. |

## Source-backed product facts

The public `AmiraliGhamkhar/Gamas_bot` repository was inspected read-only at **`838184907bc828286d4f4782151c3c4fc3b8fc9d`** (reviewed 2026-10-06). It supports audio, video and PowerPoint processing; can return a TXT transcript and, if note generation succeeds, a DOCX study guide; and retains the raw transcript when note generation fails. Its default application upload limit is 2,000,000,000 bytes, while provider/hosting limits can differ. The reviewed bot database can contain Telegram identifiers, usernames, file metadata, transcripts and notes; no automatic transcript/note expiry was found in that source. External speech/language providers are configuration-dependent.

These code findings do **not** verify a live bot, the `GamasBot` username, current provider/account settings, or third-party retention terms. A build-time username is not proof. `VITE_BOT_IDENTITY_VERIFIED=true` is an operator assertion and must only be set after a separate identity check.

## Validation evidence

| Check | Result |
|---|---|
| `npm ci` | Passed from lockfile; installed 244 packages; npm reported 0 vulnerabilities. |
| `npm audit --audit-level=low` | Passed; 0 vulnerabilities. |
| `npm run lint` | Passed with zero warnings/errors. |
| `npm test` | Passed: 3 dependency-free tests for username validation, CTA/deep-link event parity, and core product facts. |
| JavaScript syntax | `node --check` passed for Vite config, postbuild script, and product/constants modules. |
| Root production build | Passed. Vite 6.4.3 emitted one prerendered page; postbuild validated crawler output, local HTML/CSS assets, RTL/metadata, `.htaccess`, and 3 exact inline-script CSP hashes. Main JS 196.74 kB (61.78 kB gzip), CSS 42.07 kB (9.14 kB gzip), prerendered HTML 42.84 KiB. These are artifact sizes, not load-time measurements. |
| `/gamas/` production build | Passed with temporary `.env.production.local` values; verified `/gamas/` canonical/assets/fonts/crawler URLs and `RewriteBase`, plus handle/attestation parity across rendered CTA, JSON-LD and `llms.txt`. The temporary test file was removed; its fake handle was not a live identity check. |
| Vite preview host smoke | Local preview returned HTTP 200; an `.e2b.app`-style Host returned 200 and an arbitrary Host returned 403. This confirms Vite preview host allowlisting only—not browser rendering, Apache, or deployed headers. |
| Browser / responsive / accessibility | **Not run.** No browser binary was available; the existing optional Playwright scripts are not dependencies and no current browser results exist. No visual, screen-reader, or Web Vitals claim is made. |
| PHP / API / SQLite / NDJSON | **Not runtime-tested.** No PHP executable was available; status/method/origin/rate-limit/storage/migration and permissions behavior still need staging checks. |
| Apache / cPanel / redirects / headers | **Not tested on Apache or staging.** No `apachectl`/live account was available. Module availability, `AllowOverride`, proxy/TLS behavior, real 404s, headers, permissions, and subfolder routing remain open. |
| Telegram bot | **Not live-verified.** The direct Telegram fetch failed and no live handle/provider settings were established. |
| Historical Lighthouse/screenshot files | Archived only; they describe an earlier implementation and are not evidence for this source. |

## Readiness score estimate

Scores are source/build-review estimates, not Lighthouse, user-study, compliance, or production metrics. The previous repository audit recorded **71/100**. This pass estimates **77/100**: the build/configuration/content controls improved, but the remaining live/runtime gaps cap the score.

| Area | Previous | Current | Why it is not higher |
|---|---:|---:|---|
| Architecture and static deployment | 80 | 85 | Root/subfolder build checks pass; Apache/cPanel is unverified. |
| Security and privacy | 75 | 80 | Hash-based CSP and identity disclosure improve source posture; PHP, Apache, backups, providers and runtime settings remain untested. |
| Responsive layout | 65 | 70 | Layout/source checks improved; no real browser viewport/overflow run. |
| Accessibility | 70 | 75 | Focus handling, note link targets and status semantics improved; no screen reader/rendered audit. |
| Performance engineering | 75 | 80 | Self-hosted assets and output checks remain small; no current Lighthouse/Web Vitals. |
| SEO and truthful content | 85 | 90 | Shared source facts, crawler outputs and identity-gated schema are checked; indexing and live bot identity are not. |
| Validation coverage | 50 | 60 | Lint, unit tests, dependency audit and both builds pass; browser/PHP/Apache/staging checks are absent. |
| **Overall (unweighted mean)** | **71** | **77** | **Strong implementation base; deployment verification required.** |

Under the requested readiness bands, **77/100 is not a deployment sign-off**. Production readiness must not be claimed until the release checks below pass on the intended account and the Telegram destination is confirmed.

## Required before release

1. Configure `VITE_BOT_USERNAME`; verify ownership/availability of the exact Telegram destination. Only then may the release operator set `VITE_BOT_IDENTITY_VERIFIED=true`. Review the rendered notice/links and keep the verification date with release notes.
2. Run Chromium browser checks (and a mobile browser) at 320, 360, 375, 414, tablet and desktop widths. Check overflow, focus order/return/Escape, reduced motion, contrast/focus states, assets/fonts, console/network and actual CTA destination.
3. Run `php -l` and exercise allowed/blocked origins, methods, malformed payloads, rate limits, storage failures, SQLite and NDJSON paths, 410, file permissions and legacy migration on the target PHP version.
4. Deploy to staging and verify Apache modules/`AllowOverride`, HTTPS/proxy mode (not Cloudflare Flexible with the origin redirect), fixed-host redirects, CSP/security/cache headers, genuine missing-asset 404s, deep links, API routing, root/subfolder assets and `GAMAS_DATA_DIR` permissions.
5. Inspect every legacy data directory, host snapshot and backup for retired email records; the application migration cannot erase copies it cannot access.
6. Confirm live bot settings and external-provider data terms with the product owner. Generate new Lighthouse/Web Vitals results only after the target deploy is available; do not reuse archived artifacts.
