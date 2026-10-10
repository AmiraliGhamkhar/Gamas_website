# Gamas website — cPanel deployment guide

This repository builds a pre-rendered React/Vite site for static Apache hosting. The small PHP API only records CTA clicks; the email-capture endpoint is retired. The Telegram bot is a separate service/repository and is not run by this website’s cPanel deployment.

> **Do not claim a deployment is verified just because the local build passes.** PHP, Apache, cPanel permissions, redirects, headers, and the bot’s live settings must be checked on the target account after upload.

## 1. Deployment assumptions

| Setting | Default |
|---|---|
| Canonical site origin | `https://gamadesk.ir` |
| Canonical host | `gamadesk.ir` (non-www) |
| Telegram bot | `https://t.me/Gamas_jozveh_bot` (source default; live identity is an operator check) |
| Deploy path | root of `public_html/` (`VITE_BASE=/`) |
| Build | Node 20.19+, 22.13+, or 24+ on a local machine/CI |
| Server runtime | Apache 2.4 and PHP 8.2+ (see `api/bootstrap.php` version guard) |
| Data storage | Private account-home directory; SQLite for clicks if `pdo_sqlite` exists, otherwise NDJSON |
| Email collection | None on the current website; `api/lead.php` returns HTTP 410 |

The PHP API’s default exact-origin allowlist is `https://gamadesk.ir`. If the deployed site has another origin, set `GAMAS_ALLOWED_ORIGINS` in cPanel to a comma-separated list of full origins (scheme + host + optional port), such as `https://staging.example.com`. The code does not add `HTTP_HOST` to the allowlist.

## 2. Build locally or in CI

```bash
npm ci
npm run lint
npm test
npm run build
node scripts/images.mjs
```

No build variables are required for the production target: the source defaults are `VITE_SITE_URL=https://gamadesk.ir`, `VITE_BASE=/` and `VITE_BOT_USERNAME=Gamas_jozveh_bot`. [`.env.example`](.env.example) lists the overrides; copy it to an untracked `.env.local` or pass the variables inline. Do not commit `.env`/`.env.local`.

CI (`.github/workflows/ci.yml`) runs lint, tests, build, the image
inventory, and all three Playwright verify harnesses against a preview
server. Keep the last two release zips for rollback; the zip itself is
built by CI and is git-ignored (`gamadesk-cpanel.zip` must never be hand-edited).

The build runs `vite-react-ssg` and `scripts/postbuild.mjs`. Postbuild removes SSG manifests; emits base-aware `robots.txt` (which explicitly allows classic search and AI answer crawlers such as `OAI-SearchBot`, `PerplexityBot` and `Claude-SearchBot` while keeping `/api/` disallowed for every group), `sitemap.xml` (with the image namespace) and a Persian `llms.txt`; hashes the exact prerendered inline scripts into the Apache CSP; and checks snippets/keyword/hreflang metadata, the product JSON-LD entities, local HTML/CSS assets, `.htaccess`, deployment base and sensitive-file exclusions. It fails on unresolved placeholders or inline style/event-handler attributes. See [`docs/seo-geo.md`](docs/seo-geo.md) for the SEO/GEO rationale and its evidence limits.

For a subfolder deployment such as `https://gamadesk.ir/gamas/`:

```bash
VITE_BASE=/gamas/ VITE_SITE_URL=https://gamadesk.ir npm run build
```

Upload the **contents** of `dist/` to `public_html/gamas/` and upload `api/` to `public_html/gamas/api/`. The same origin remains `https://gamadesk.ir`; the base path does not belong in `GAMAS_ALLOWED_ORIGINS`.

`VITE_BASE` must begin and end with `/` and match the public path exactly. `VITE_SITE_URL` is an origin only (no path/query/hash). Do not build for a subfolder and upload at the domain root, or vice versa.

Configure the Telegram destination deliberately (the default is already `Gamas_jozveh_bot` → `https://t.me/Gamas_jozveh_bot`):

```bash
VITE_BOT_USERNAME=Gamas_jozveh_bot npm run build
```

The code falls back to `Gamas_jozveh_bot` when no valid username is supplied; that fallback has **not** been live-verified. A build-time username override also does not prove ownership or availability. After the responsible operator has checked the destination, `VITE_BOT_IDENTITY_VERIFIED=true` may be set alongside `VITE_BOT_USERNAME`; only then does structured data assert the Telegram `sameAs` relationship. This flag is an operator attestation, not an automated check. Never set it merely to silence the disclosure in generated `llms.txt`.

## 3. Upload layout

Root deployment:

```text
dist/.htaccess       → public_html/.htaccess
dist/index.html      → public_html/index.html
dist/assets/         → public_html/assets/
dist/fonts/          → public_html/fonts/
dist/images/         → public_html/images/
dist/robots.txt      → public_html/robots.txt
dist/sitemap.xml     → public_html/sitemap.xml
dist/llms.txt        → public_html/llms.txt
dist/favicon.svg     → public_html/favicon.svg
dist/og-image.jpg    → public_html/og-image.jpg
api/                 → public_html/api/
```

For a subfolder build, put the same contents under `public_html/gamas/`, including `.htaccess`, and put the API files under `public_html/gamas/api/`.

**Show hidden files** in cPanel File Manager or your FTP client so `.htaccess` is uploaded. Without it, redirects, deny rules, cache headers and the deep-link fallback will not match the tested configuration.

Do not upload `src/`, `node_modules/`, `.git/`, `package*.json`, build configuration, secrets, database files, logs, or development artifacts. `dist/` should contain static public assets and no PHP source; PHP source is uploaded only from `api/`.

## 4. cPanel setup

1. Select PHP 8.2+ (PHP 7.4 is only a compatibility floor).
2. Enable `pdo_sqlite` if available. It is optional; click logging falls back to NDJSON. `json`, `hash` and `pcre` are core PHP extensions.
3. Set `GAMAS_DATA_DIR` to a private, writable directory **outside** all `public_html` trees if the account’s default derived location is unsuitable. Example: `/home/ACCOUNT/gamas_data`.
4. Set `GAMAS_ALLOWED_ORIGINS=https://gamadesk.ir` explicitly for production if your host supports environment variables. Add another complete origin only when the site is intentionally served from it.
5. Set `GAMAS_TRUST_CF_IP=1` only if Cloudflare is the trusted reverse proxy in front of the origin. Otherwise leave it unset; PHP then uses `REMOTE_ADDR`.
6. Upload `api/.user.ini` beside the PHP endpoints. cPanel may cache `.user.ini` values for several minutes.

Use restrictive permissions. The API attempts to create a private data directory as `0700` and data/key files as `0600`; do not use `chmod 777`. The fallback `public_html/data/` location is denied by `.htaccess`, but a private directory outside the web root is preferred.

The production `.htaccess` redirects only the configured `www.gamadesk.ir` and `gamadesk.ir` hosts to the fixed canonical URL. It does not reflect an arbitrary `Host` header into a redirect. Its HTTPS redirect uses Apache’s actual TLS state and deliberately ignores an arbitrary `X-Forwarded-Proto` header. If Cloudflare proxies the origin, use **Full (strict)** TLS; Flexible mode can loop. If another trusted proxy terminates TLS before Apache, configure HTTPS canonicalization at that trusted edge or add an explicit proxy-IP trust rule—do not trust forwarded headers from arbitrary clients. If you use a different domain, update the allowlisted host conditions in `public/.htaccess`, set `VITE_SITE_URL`, and set the exact PHP origin allowlist together.

## 5. What the website API stores

### Current click tracker

`POST /api/track.php` stores only a CTA section name and timestamp. It has no public read endpoint and does not put raw IP addresses or user-agent strings in click records. The API uses a keyed HMAC of `REMOTE_ADDR` (or the trusted Cloudflare address when explicitly enabled) to name private short-window rate-limit buckets. Those files contain timestamps and are removed opportunistically; this is not a guarantee that every bucket disappears at an exact one-hour deadline. The host’s own access logs may retain IP/user-agent data under the host’s policy.

SQLite click rows older than 90 days are deleted during an occasional tracking request, not by a guaranteed daily job. The NDJSON fallback is capped at 1 MiB and can be truncated when full. Do not treat these best-effort analytics as an audit archive or as a precise retention system.

### Retired email records

The current site no longer collects email. `api/lead.php` returns JSON with status **410 Gone** and does not include the tracking bootstrap. On the first accepted tracking request after deploying the new API:

- the SQLite schema migrates to version 3, drops the former `leads` table and attempts a WAL checkpoint/`VACUUM`;
- the former `leads.ndjson` file is removed from the configured data directory.

The migration cannot delete copies in cPanel backups, snapshots, a different historical data directory, or provider backups. Before rollout, identify and remove those copies according to your operational/legal requirements. If SQLite is unavailable or migration/cleanup fails, inspect the PHP error log and remove legacy data using an available SQLite tool or the host’s support procedure. **Do not assume old email records or their backups were removed until checked on the account.**

`api/lead.php` returning 410 is intentional; do not restore the old form unless its purpose, consent text, access policy and retention are verified first.

## 6. Post-upload verification

Run these against the live cPanel host after uploading both `dist/` and `api/`. Commands below assume the root deployment and canonical origin; adjust URLs for a subfolder.

```bash
# HTTPS and canonical host. Expect HTTP→HTTPS and www→apex redirects.
curl -sI http://gamadesk.ir/ | head -5
curl -sI https://www.gamadesk.ir/ | head -5

# Security headers and HTML revalidation.
curl -sI https://gamadesk.ir/ | grep -iE 'strict-transport|content-security|x-frame|x-content-type|referrer-policy|cache-control'

# Hashed Vite asset should be immutable; use an actual file from dist/assets.
ASSET=$(find dist/assets -maxdepth 1 -type f | head -1 | xargs basename)
curl -sI "https://gamadesk.ir/assets/$ASSET" | grep -i cache-control

# A missing asset must be a real 404, not index.html with status 200.
curl -s -o /dev/null -w '%{http_code}\n' https://gamadesk.ir/assets/not-a-real-file.js

# Hidden/config/source files and directory listings should be denied (usually 403).
for p in .env package.json data/ .git/ api/bootstrap.php; do
  printf '%-24s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "https://gamadesk.ir/$p")"
done

# The retired endpoint must return 410, not accept/store an email.
curl -s -i https://gamadesk.ir/api/lead.php | head -12

# AI/LLM discovery files must be live and base-correct.
curl -s https://gamadesk.ir/llms.txt | head -8
curl -s https://gamadesk.ir/robots.txt | grep -E 'OAI-SearchBot|PerplexityBot|GPTBot|Sitemap'
curl -s https://gamadesk.ir/sitemap.xml | grep -E '<loc>|image:loc'

# Valid CTA event. Expect 200 and {"ok":true,"section":"deploy_check"}.
curl -s -i -H 'Origin: https://gamadesk.ir' \
  -H 'Content-Type: application/json' \
  -d '{"section":"deploy_check"}' \
  https://gamadesk.ir/api/track.php

# Exact-origin checks: each should return 403 (scheme/port/host are significant).
for origin in 'http://gamadesk.ir' 'https://gamadesk.ir:8443' 'https://evil.example'; do
  printf '%-32s %s\n' "$origin" "$(curl -s -o /dev/null -w '%{http_code}' \
    -H "Origin: $origin" -H 'Content-Type: application/json' \
    -d '{"section":"origin_check"}' https://gamadesk.ir/api/track.php)"
done
```

Inspect storage after the valid tracking request:

```bash
ls -la ~/gamas_data
# If sqlite3 is installed:
sqlite3 ~/gamas_data/gamas.sqlite 'PRAGMA user_version;'
sqlite3 ~/gamas_data/gamas.sqlite "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

For the migrated database, `user_version` should be `3` and the legacy `leads` table should be absent. Confirm `leads.ndjson` is gone. On a non-SQLite host, the click fallback should contain only `section` and `created`, never email, raw IP or user-agent fields. If PHP or Apache rejects the request, review cPanel ▸ **Metrics ▸ Errors** and the private `gamas_data/logs/app.log` before changing permissions.

A raw `curl` request is not a browser test: after deployment, also open the page in a real browser, click a CTA, verify the Telegram destination and inspect the Network panel for a successful same-origin tracking request. Verify mobile widths and subfolder asset/font requests in a browser before announcing the deployment.

## 7. Origin, redirects and subfolder notes

- The PHP check compares normalized **scheme + host + effective port**. The default is `https://gamadesk.ir`, not “whatever `HTTP_HOST` says.”
- `Origin` or `Referer` must be present and match the allowlist. A missing header is rejected. The front end sends the event only after a user activates a CTA.
- The `.htaccess` redirects use the fixed canonical hostname, not `%{HTTP_HOST}` as a destination. For custom domains, change the allowlisted host expressions intentionally; do not replace them with an arbitrary host reflection.
- Subfolder URLs use `VITE_BASE` in JavaScript, HTML metadata, API links, crawler output and CSS font URLs. `scripts/postbuild.mjs` updates `RewriteBase`; still verify the emitted font URLs and actual deployed `.woff2` requests.
- Search crawlers request `robots.txt` at the **domain root**. A copy emitted inside `/gamas/` is not a substitute for `https://gamadesk.ir/robots.txt`; if deploying only to a subfolder, coordinate the root robots file and sitemap URL with the domain owner.
- The API directory must sit under the same host and subfolder as the page. `/api/` is excluded from the static-page fallback.

## 8. Content Security Policy

The build-generated policy allows same-origin scripts plus SHA-256 hashes of the exact inline scripts present in the prerendered HTML (SSG bootstrap and JSON-LD), plus SHA-256 hashes of the exact inlined critical-CSS `<style>` blocks emitted by `beasties`. It uses `style-src-attr 'none'`; React UI state is represented with CSS classes/data attributes, not inline style attributes. Violation reports go to same-origin `/api/csp-report.php` via `report-uri` (see `nginx.sample.conf` for the Nginx mirror). Fonts, images, API connections and media are self-hosted/same-origin. If you add an inline script or the inlined CSS changes, the postbuild hash allowlist updates automatically; still review its source. If you add an external service, update CSP only for the exact required origin and verify it in a browser console; do not add broad wildcards. Do not upload `public/.htaccess` directly: deploy the generated `dist/.htaccess` so its hash placeholders have been replaced.

The demo shown on the page is an interactive simulation. It is not connected to a live bot response. Product file handling, external providers and bot-side retention are described in the website privacy section and the public bot repository; confirm live bot configuration separately.

## 9. Rollback and operations

Keep a copy of the previous **static build and API code** before an upload. Re-uploading them can roll back page code, but it does not reverse a database schema migration, restore deleted lead data, or purge old copies from backups. Keep private backups protected and apply the same retention policy to them.

Rollback drill (keep the last two dated release zips, e.g. `gamas-2026-10-07.zip`):

```bash
# build the release
npm ci && npm run lint && npm test && npm run build
# pack dist/ + api/ (never the repo root, never gamas_data/)
zip -r gamas-$(date +%F).zip dist api
# to roll back: re-upload the previous zip's dist/ contents to public_html/
# and its api/ over public_html/api/, then re-run the §6 smoke checks
```

Monitoring: put one uptime check on `https://gamadesk.ir/` (expect 200 + `lang="fa"`)
and one on `https://gamadesk.ir/api/track.php` via OPTIONS (expect 204). Alert on
any non-2xx or on a missing `content-security-policy` response header.

Backups: copy `~/gamas_data/gamas.sqlite` weekly to private backup storage
(`sqlite3 ~/gamas_data/gamas.sqlite ".backup ~/backups/gamas-$(date +%F).sqlite"`),
retain 4 copies, and restore-test one copy per quarter. Apply the 90-day click
retention to backups as well.

Secrets: set `GAMAS_HMAC_KEY` (64+ hex chars, e.g. from
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
in cPanel → Environment Variables so the rate-limit key does not live next to
the data it pseudonymizes. Rotate by replacing the value; old buckets expire
within an hour.

To opt out of CTA analytics in a browser: enable Do Not Track, or run
`localStorage.setItem('gamas_no_track','1')` on the site origin.

For storage failures, the static page still renders; click tracking may fail. Since tracking is analytics only, it must not block the Telegram link. The browser-facing call is fire-and-forget and does not use `localhost`.

If the domain is behind Cloudflare, only trust `CF-Connecting-IP` after confirming the origin cannot be reached through an untrusted proxy path. Otherwise leave `GAMAS_TRUST_CF_IP` unset. The cPanel access log can continue to hold visitor IPs regardless of what the application database records.
