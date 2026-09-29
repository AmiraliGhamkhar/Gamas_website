<?php

/**
 * Gamas — /api/track.php
 * ---------------------------------------------------------------------------
 * Anonymous CTA click counter.
 *
 *   POST  { "section": "hero" }   →  records the click
 *
 * POST only. There is deliberately no GET/read endpoint: exposing aggregate
 * counts publicly is a small information leak for no benefit, since nothing
 * in the UI reads them.
 *
 * No CSRF token is required. This endpoint records a number, not a state
 * change the visitor would care about, and it is called through
 * navigator.sendBeacon() — which cannot set custom headers. It is protected
 * by the same-origin check and per-IP rate limiting instead.
 *
 * Minimum PHP: 7.4.  Requires only pdo_sqlite (falls back to flat files).
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

// ---------------------------------------------------------------------------
// 1. Same-origin only
// ---------------------------------------------------------------------------
gamas_require_same_origin();

// ---------------------------------------------------------------------------
// 2. POST only (OPTIONS → 204)
// ---------------------------------------------------------------------------
gamas_require_method(['POST']);

// ---------------------------------------------------------------------------
// 3. Rate limit before doing any work
// ---------------------------------------------------------------------------
if (!gamas_rate_limit('track_minute', 30, 60)) {
    gamas_json(['error' => 'rate_limited'], 429, ['Retry-After' => '60']);
}
if (!gamas_rate_limit('track_hour', 200, 3600)) {
    gamas_json(['error' => 'rate_limited'], 429, ['Retry-After' => '3600']);
}

// ---------------------------------------------------------------------------
// 4. Read + validate the section
// ---------------------------------------------------------------------------
$input = gamas_input(2048);

$section = gamas_field($input, 'section', 64);
if ($section === '') {
    // sendBeacon with a Blob can arrive without the JSON being parsed; also
    // accept a plain form field.
    $section = gamas_field($_POST, 'section', 64);
}
$section = strtolower($section);

// Whitelist-shaped: lowercase ascii, digits, underscore, hyphen only.
// This is what keeps the value safe in SQL, in the NDJSON file, and in logs.
if ($section === '' || preg_match('/^[a-z0-9_-]{1,64}$/', $section) !== 1) {
    gamas_json(['error' => 'invalid_section', 'message' => 'بخش نامعتبر'], 400);
}

// Keep only non-identifying event metadata. The limiter still uses a hashed
// client IP in private short-lived buckets; analytics never needs raw IP/UA.
$record = [
    'section' => $section,
    'created' => gmdate('c'),
];

try {
    $pdo = gamas_db();

    if ($pdo instanceof PDO) {
        try {
            $stmt = $pdo->prepare('INSERT INTO clicks (section) VALUES (:s)');
            $stmt->execute([':s' => $section]);

            // Keep the shared-host database bounded without a server cron.
            // A periodic sweep is enough; click events older than 90 days are
            // not used by the UI or exposed through a read endpoint.
            if (mt_rand(1, 100) === 1) {
                $pdo->exec("DELETE FROM clicks WHERE created_at < datetime('now', '-90 days')");
            }
        } catch (PDOException $e) {
            // A failed insert here must never surface as an error to the
            // visitor — they clicked a link and should see nothing.
            gamas_log('track insert failed: ' . $e->getMessage());
        }
    } else {
        gamas_append_record('clicks', $record);
    }

    // Do not return aggregate counters: the front end never consumes them.
    gamas_json(['ok' => true, 'section' => $section]);
} catch (Throwable $e) {
    gamas_log('track endpoint error: ' . $e->getMessage());
    gamas_json(['error' => 'server_error'], 500);
}
