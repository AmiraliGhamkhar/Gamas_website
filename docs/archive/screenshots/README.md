# Screenshot and Lighthouse artifacts

The PNG and JSON files in this directory are **archived results from an earlier version of the page**, before the October 2026 privacy, copy, tracking, image, responsive and CSS changes. They are not evidence for the current working tree. In particular, `lighthouse-prod.json` contains requests to the retired `/api/lead.php` endpoint and must not be used as a current Lighthouse score.

The current optional Playwright harnesses write fresh results under `docs/screenshots/current/` (ignored by Git). They have not been run for this version: no browser executable was present in the workspace, and the attempted Chromium download failed with `ECONNRESET` from the Playwright CDN. Do not cite the archived screenshots as a substitute for a fresh browser run.

> **Handle note (2026-10-10):** the archived snippets were captured with the earlier `@GamasBot` placeholder destination. Their Telegram URLs have been normalized to the current handle (`@Gamas_jozveh_bot`) so no stale bot reference remains, but the files are still historical measurement artifacts — normalizing a string does not make them current evidence for the present implementation.
