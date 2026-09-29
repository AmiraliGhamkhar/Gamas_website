# Gamas — Deployment Guide (cPanel shared hosting, Apache + PHP)

Read this once end-to-end before the first upload. It is written for the
account that serves `https://gamas.bot` from `public_html/`.

---

## 0. Assumptions this guide is built on

| Thing | Value | Where it is set |
|---|---|---|
| Deploy path | **root** of `public_html` (not a subfolder) | `base: '/'` in `vite.config.js` |
| Canonical host | **non-www** `gamas.bot` | `public/.htaccess` §3 |
| PHP minimum | **7.4** (recommended 8.1+) | `api/bootstrap.php` version guard |
| PHP extensions | `pdo_sqlite` *(optional)*, `mbstring` *(optional)*, `json`, `hash` | see §4 |
| Node on the server | **not required** | build runs locally or in CI |
| Email | **not sent** — leads are stored only | see §12 |

If any of these differ, the sections noted in the right-hand column tell you
what to change.

---

## 1. Build (on your machine or in CI — **never** on the server)

```bash
npm ci
npm run build
```

That runs `vite-react-ssg build` and then `scripts/postbuild.mjs`, which:

- deletes build manifests from `dist/` (`.vite/`, `static-loader-data-manifest-*.json`)
  so they are never served publicly;
- fails the build if something sensitive (`node_modules/`, `.env`, `src/`,
  `package.json`, `*.map`, …) leaked into `dist/`;
- fails the build if `.htaccess` is missing from `dist/`.

Output:

```
dist/
├── .htaccess          ← from public/.htaccess, copied automatically
├── index.html         ← pre-rendered (SSG), ~70 KB
├── assets/            ← fingerprinted JS + CSS  → cached immutable, 1 year
├── fonts/             ← .woff2                  → cached immutable, 1 year
├── images/            ← hero-phone.{avif,webp,jpg}
├── favicon.svg
├── og-image.jpg
├── robots.txt
└── sitemap.xml
```

**Building for a subfolder instead** (only if the site moves to
`public_html/gamas/`):

```bash
VITE_BASE=/gamas/ npm run build
```

`VITE_BASE` **must** start and end with a slash and must match the public URL
path exactly. Then also change the two API calls in the frontend — they are
absolute and would keep pointing at the domain root:

- `src/lib/track.js` → `'/api/track.php'`
- `src/components/LeadForm.jsx` → `const LEAD_API = '/api/lead.php'`

---

## 2. Upload — what goes where

The site (`dist/`) and the backend (`api/`) are **siblings** in this repo, so
they are uploaded as two separate things.

### 2a. Frontend → `public_html/`

Upload **the contents of `dist/`**, not the `dist` folder itself:

```
dist/.htaccess       → public_html/.htaccess
dist/index.html      → public_html/index.html
dist/assets/         → public_html/assets/
dist/fonts/          → public_html/fonts/
dist/images/         → public_html/images/
dist/favicon.svg     → public_html/favicon.svg
dist/og-image.jpg    → public_html/og-image.jpg
dist/robots.txt      → public_html/robots.txt
dist/sitemap.xml     → public_html/sitemap.xml
```

> **`.htaccess` is a dotfile.** cPanel File Manager hides dotfiles by default
> (Settings ▸ Show Hidden Files), and most FTP clients hide them too. If the
> site loads but has no HTTPS redirect, no security headers, and deep links
> 404, this file is the thing that did not upload. Verify with:
> ```bash
> curl -sI https://gamas.bot/ | grep -i 'strict-transport\|content-security'
> ```

Recommended: upload as a **`.zip` and extract on the server**, which is far
faster and more reliable than FTP-ing hundreds of files. Make sure your zip
tool does not skip dotfiles (`zip -r dist.zip dist/` includes them; some GUI
tools exclude them — check afterwards).

### 2b. Backend → `public_html/api/`

```
api/lead.php         → public_html/api/lead.php
api/track.php        → public_html/api/track.php
api/bootstrap.php    → public_html/api/bootstrap.php
api/.htaccess        → public_html/api/.htaccess
api/.user.ini        → public_html/api/.user.ini
```

`bootstrap.php` is shared library code, not an endpoint. It is denied over
HTTP by `api/.htaccess`; PHP still loads it from disk via `require_once`.

### 2c. Optional fallback data dir → `public_html/data/`

Only upload `data/.htaccess` here. It is the last-resort storage location
(see §5); PHP creates the directory itself if it needs to.

---

## 3. What must **never** be inside `public_html`

```
node_modules/        src/            public/         scripts/
package.json         package-lock.json
vite.config.js       tailwind.config.js   postcss.config.js
.env  .env.local     any file with a token or API key
.git/                .github/
composer.json        composer.lock   vendor/
dist/.vite/          dist/static-loader-data-manifest-*.json
*.map                *.sql  *.sqlite  *.ndjson
*.log  error_log     *.bak  *.old  *.orig  *.swp
```

`public/.htaccess` denies all of these with `403` as a safety net — but they
should not be there in the first place.

**Secrets:** there are none in this codebase. No Telegram bot token, no API
key, no SMTP password lives in the repo or in the JS bundle. The bot is
reached by linking to `https://t.me/GamasBot`; there is no server-side
Telegram call, so there is no token to protect. The only secret is
`csrf.key`, generated at runtime inside the private data directory (§5).

---

## 4. Server configuration (one-time)

### 4a. PHP version

cPanel ▸ **MultiPHP Manager** ▸ set the domain to **PHP 8.1 or newer**.

- **Minimum 7.4.** `api/bootstrap.php` returns a clean JSON 500 below that.
- The code avoids all 8.x-only syntax (no `match`, no enums, no nullsafe
  operator, no `str_contains`), so it runs unchanged on 7.4 → 8.4.
- If you are stuck on 7.4, note that `setcookie()`'s array-options form is
  not available; `api/bootstrap.php` already has a 7.0–7.2 fallback branch.

### 4b. PHP extensions

cPanel ▸ **Select PHP Version** ▸ tick:

- **`pdo_sqlite`** — recommended. Without it the backend transparently
  switches to flat NDJSON files, which work but cannot be queried with SQL.
- **`mbstring`** — recommended for correct Persian text handling. Everything
  degrades gracefully without it.
- `json`, `hash`, `pcre`, `session` are core in every modern PHP.

Check what you actually have with:

```bash
php -m | grep -iE 'pdo_sqlite|mbstring|json'
```

### 4c. `.user.ini`

`api/.user.ini` sets the `PHP_INI_PERDIR` directives that **cannot** be set
from PHP code and **must not** be put in `.htaccess` (see §11). It is picked
up automatically under CGI/FPM/LSAPI.

cPanel caches `.user.ini` for 5 minutes (`user_ini.cache_ttl`). Wait before
concluding a change did not apply.

### 4d. File permissions

```bash
cd public_html
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chmod 644 .htaccess api/.htaccess api/.user.ini
chmod 755 api
```

Never `chmod 777` anything. PHP runs as your user on cPanel, so `644`/`755`
are sufficient — that is the point of the PHP-FPM/CGI handler.

### 4e. SSL

cPanel ▸ **SSL/TLS Status** ▸ run AutoSSL for `gamas.bot` **and**
`www.gamas.bot`, so the redirect in `.htaccess` never lands on a certificate
warning. `.well-known/` is explicitly exempted from the HTTPS redirect so
ACME renewal keeps working.

---

## 5. Where visitor data is stored

`api/bootstrap.php` resolves the storage directory in this order:

1. **`GAMAS_DATA_DIR`** environment variable, if set
   (cPanel ▸ **Environment Variables** or a `SetEnv` in `.htaccess`).
2. **`<parent of public_html>/gamas_data`** → normally
   `/home/USER/gamas_data`. **Outside the web root**, unreachable by HTTP.
   This is the default and it is what you want.
3. **`public_html/data`** — last resort, used only if 1 and 2 cannot be
   created. Protected by the `data` rule in `.htaccess` (403 to browsers,
   while PHP still reads and writes it directly).

Contents:

```
gamas_data/
├── gamas.sqlite      leads + clicks (when pdo_sqlite is present)
├── leads.ndjson      fallback lead log (append-only)
├── clicks.ndjson     fallback click log (append-only)
├── csrf.key          0600 — HMAC signing key for CSRF tokens
├── ratelimit/        per-IP sliding-window buckets
└── logs/app.log      application log
```

Verify after the first form submission:

```bash
ls -la ~/gamas_data
```

If you see `public_html/data` being used instead, `~/gamas_data` was not
writable — check ownership and open_basedir.

---

## 6. Verification after deploying

```bash
# 1. HTTPS + canonical host (expect one 301 to https://gamas.bot/…)
curl -sI http://gamas.bot/          | head -3
curl -sI http://www.gamas.bot/      | head -3

# 2. Security headers + caching on index.html
curl -sI https://gamas.bot/ | grep -iE 'strict-transport|content-security|x-frame|x-content-type|referrer-policy|cache-control'

# 3. Hashed assets are immutable
curl -sI https://gamas.bot/assets/$(ls dist/assets | head -1) | grep -i cache-control
#    expect: public, max-age=31536000, immutable

# 4. Denied files really are denied (expect 403)
for p in .env composer.json package.json data/ .git/ php.ini; do
  printf '%-18s -> %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' https://gamas.bot/$p)"
done

# 5. Directory listing disabled (expect 403, not a file list)
curl -s -o /dev/null -w '%{http_code}\n' https://gamas.bot/assets/

# 6. Missing asset still 404s (SPA fallback must not swallow it)
curl -s -o /dev/null -w '%{http_code}\n' https://gamas.bot/assets/nope.js

# 7. API: CSRF token round-trip
TOKEN=$(curl -s -c /tmp/cj -b /tmp/cj -H 'Referer: https://gamas.bot/' \
        https://gamas.bot/api/lead.php | python3 -c 'import sys,json;print(json.load(sys.stdin)["csrf_token"])')
echo "token: ${TOKEN:0:24}…"

# 8. API: submit a lead (sleep 2s first — sub-2s submissions are silently
#    dropped by the anti-spam timing check)
sleep 2
curl -s -c /tmp/cj -b /tmp/cj \
  -H 'Content-Type: application/json' -H 'Origin: https://gamas.bot' \
  -H "X-CSRF-Token: $TOKEN" \
  -d '{"email":"test@example.com","source":"deploy_check","website":""}' \
  -w '\nHTTP %{http_code}\n' https://gamas.bot/api/lead.php

# 9. API: cross-origin POST is rejected (expect 403 origin_not_allowed)
curl -s -H 'Origin: https://evil.example' -H 'Content-Type: application/json' \
  -d '{"email":"x@y.z"}' https://gamas.bot/api/lead.php -w '\nHTTP %{http_code}\n'

# 10. API: non-POST rejected (expect 405)
curl -s -X PUT https://gamas.bot/api/lead.php -w '\nHTTP %{http_code}\n'

# 11. Click tracking works
curl -s -H 'Origin: https://gamas.bot' -H 'Content-Type: application/json' \
  -d '{"section":"hero"}' https://gamas.bot/api/track.php -w '\nHTTP %{http_code}\n'
```

Then delete the test row:

```bash
# SQLite
sqlite3 ~/gamas_data/gamas.sqlite "DELETE FROM leads WHERE email='test@example.com';"
# or, with the flat-file store
grep -v 'test@example.com' ~/gamas_data/leads.ndjson > /tmp/l && mv /tmp/l ~/gamas_data/leads.ndjson
```

---

## 7. Switching the canonical host to `www`

Currently `www.gamas.bot` → `gamas.bot`. The redirect in `public/.htaccess`
§3 is split in two rules: **3a** (www → apex, any scheme) and **3b**
(http → https, skipped when the edge already terminated TLS). To flip the
canonical host, replace **rule 3a** with:

```apache
  RewriteCond %{HTTP_HOST} ^(?!www\.)(.+)$ [NC]
  RewriteRule ^ https://www.%1%{REQUEST_URI} [R=301,L,NE]
```

Leave **rule 3b** (the `X-Forwarded-Proto` / `%{HTTPS}` conditions) untouched —
it only deals with the scheme, and removing those conditions re-introduces the
Cloudflare Flexible redirect loop described in the file's comments.
Then update `index.html`:

- `<link rel="canonical" href="https://gamas.bot/">` → `https://www.gamas.bot/`
- `og:url` → `https://www.gamas.bot/`

…and `public/robots.txt` + `public/sitemap.xml`, then rebuild.

---

## 8. Content-Security-Policy notes

The shipped policy is:

```
default-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none';
frame-ancestors 'none'; script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';
connect-src 'self'; media-src 'self'; manifest-src 'self'; worker-src 'self';
upgrade-insecure-requests
```

Two `'unsafe-inline'` entries are **required**, and removing either one
breaks the site:

- **`script-src`** — `vite-react-ssg` injects one inline bootstrap script
  (`window.__VITE_REACT_SSG_HASH__`). It cannot be pinned with a CSP hash
  because its value changes on every build.
- **`style-src`** — GSAP animates by writing inline `element.style`
  properties, and React sets `style` props. Removing it silently kills every
  animation on the page.

Keep `font-src 'self'`: the fonts are self-hosted from `/fonts`, and the page
loads no third-party font.

If you later add analytics, a chat widget, or an embedded video, add that
origin to the matching directive — otherwise it fails silently and you will
only see it in the browser console.

---

## 9. Rollback

Keep the previous build so rollback is a directory swap, not a rebuild.

**Before each deploy:**

```bash
ssh user@gamas.bot 'mkdir -p ~/deploy-backups && \
  cp -a ~/public_html ~/deploy-backups/$(date +%Y%m%d-%H%M%S)'
```

**To roll back:**

```bash
ssh user@gamas.bot 'rm -rf ~/public_html && \
  cp -a ~/deploy-backups/20260928-120000 ~/public_html'
```

Keep the last 3 backups; delete older ones.

**Fast partial rollback without SSH** (site is broken, frontend only):
re-upload the previous `dist/` zip and extract over `public_html`.

**If only the backend is broken:** re-upload the previous `api/*.php`.
The frontend and backend are versioned together but deployed independently,
so you can roll one back without touching the other.

**If the data directory is the problem:** the site keeps working — storage
failures return a clean JSON 500 and the marketing page itself is static
HTML, so visitors browsing normally see no error at all.

---

## 10. Routine operations

Export leads:

```bash
sqlite3 -header -csv ~/gamas_data/gamas.sqlite "SELECT * FROM leads ORDER BY id DESC;" > leads.csv
```

Clear a rate limit that is blocking a real visitor:

```bash
IP=1.2.3.4
HASH=$(printf '%s' "$IP" | sha256sum | cut -c1-16)
rm -f ~/gamas_data/ratelimit/*_"${HASH}".txt
```

Watch the application log:

```bash
tail -f ~/gamas_data/logs/app.log
```

PHP errors also go to the server error log — find it in cPanel ▸ **Metrics
▸ Errors**, or `~/public_html/error_log`. `.htaccess` blocks HTTP access to
`error_log*`; it is never served.

---

## 11. Shared-hosting gotchas (things that work locally but break on cPanel)

1. **`php_value` / `php_flag` in `.htaccess` → instant 500.** cPanel runs PHP
   as CGI/FPM/LSAPI, where those directives are unknown. This config uses
   `api/.user.ini` (for `PHP_INI_PERDIR` settings) plus `ini_set()` at
   runtime (for `PHP_INI_ALL` settings). Never add `php_value` here.
2. **Apache 2.2 vs 2.4.** `Require all denied` is 2.4-only and 500s on 2.2.
   Every auth block in this repo is wrapped in
   `<IfModule mod_authz_core.c>` with an `Order allow,deny` fallback.
3. **Case-sensitive filesystem.** Every import and asset path in this project
   is lowercase and matches the file on disk (verified). Windows/macOS hide
   casing bugs; Linux does not. `git config core.ignorecase false` is worth
   setting on dev machines.
4. **SQLite WAL needs shared memory.** `PRAGMA journal_mode=WAL` fails on
   some NFS-backed home directories. The bootstrap catches that and falls
   back to `DELETE` mode instead of 500-ing.
5. **Sessions are usually the first thing to break on shared hosting** (unwritable
   `session.save_path`, or a session file per crawler hit eating your quota).
   This backend does not use sessions at all — CSRF is a signed
   double-submit cookie with no server-side state.
6. **`getallheaders()` is missing on some FPM builds.** `gamas_header()` reads
   `$_SERVER['HTTP_*']` first and only falls back to `getallheaders()`.
7. **`display_errors` can be `On` in the host's php.ini.** Every entry point
   forces `display_errors=0` before anything else runs, and a shutdown
   handler converts even a fatal error into clean JSON with no path or stack
   trace.
8. **cPanel writes `error_log` into `public_html` by default.** `.htaccess`
   denies `error_log*` over HTTP.
9. **post_max_size cannot be shrunk from PHP code** — it is `PHP_INI_PERDIR`,
   like `upload_max_filesize` and `max_input_vars`. They are set in
   `api/.user.ini` only.
10. **`.user.ini` is cached for 5 minutes.** Changes are not instant.
11. **Cloudflare / proxy in front.** `GAMAS_TRUST_CF_IP=1` makes the backend
    read `CF-Connecting-IP`. Only enable it if the site really is behind
    Cloudflare — otherwise anyone can spoof that header and walk through
    every rate limit. Without it, `REMOTE_ADDR` is used, which is always
    correct.
12. **Shared CPU.** `mod_deflate` is configured for text types only.
    `woff2`, `avif`, `webp` and `jpg` are already compressed; re-compressing
    them just burns CPU on a shared box.

---

## 12. Email (currently not used)

`lead.php` stores submissions; it does **not** send mail. No `mail()` call,
no SMTP, no PHPMailer. Nothing to configure, and no header-injection surface.

If you add notification mail later, do all of the following:

- **Send from an address on your own domain** — e.g. `no-reply@gamas.bot`,
  never from the visitor's address. Spoofing a Gmail/Yahoo `From` fails SPF
  and DMARC and gets the domain blocklisted.
- **Put the visitor's address in `Reply-To`**, not `From`.
- **Strip CRLF from every header value.** Any user-supplied value that
  reaches a header must have `\r` and `\n` removed first — otherwise it is a
  header-injection hole that turns your form into a spam relay.
  `gamas_field()` in `api/bootstrap.php` already does this for all input.
- **Prefer SMTP** (`PHPMailer` over `smtp.gmail.com` / your provider's relay)
  rather than PHP `mail()`. On shared hosting, `mail()` is frequently
  throttled, misconfigured, or silently dropped, and it usually fails SPF
  because the envelope sender does not match the sending server.
- **Keep credentials out of `public_html`** — a config file in
  `~/gamas_data/` or an environment variable, never in the repo, never in
  `public_html`.

## 13. Telegram

There is no server-side Telegram integration in this repo. The site links to
`https://t.me/GamasBot`; the bot itself lives in a separate project. No bot
token exists in this codebase, and none is present in the built JS bundle.

If a server-side Telegram call is ever added: the token stays server-side, in
a file outside `public_html` (or an environment variable), and the call must
use **cURL with an explicit connect and total timeout plus error handling** —
not `file_get_contents()`, because `allow_url_fopen` is commonly disabled on
shared hosting and has no timeout by default.
