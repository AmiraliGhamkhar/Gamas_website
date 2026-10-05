<?php

/**
 * Gamas — /api/track.php
 * ---------------------------------------------------------------------------
 * Anonymous CTA click counter. Stores only the clicked section and timestamp;
 * no raw IP address or user-agent is included in event records.
 *
 * POST only. There is no public read endpoint. The API is restricted to exact
 * allowed origins and uses short-window rate limiting for abuse control.
 *
 * Minimum PHP syntax target: 7.4. pdo_sqlite is optional (NDJSON fallback).
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

gamas_require_same_origin();
gamas_require_method(['POST']);

$minuteLimit = gamas_rate_limit('track_minute', 30, 60);
if ($minuteLimit === null) {
    gamas_json(['error' => 'storage_unavailable'], 503);
}
if ($minuteLimit === false) {
    gamas_json(['error' => 'rate_limited'], 429, ['Retry-After' => '60']);
}

$hourLimit = gamas_rate_limit('track_hour', 200, 3600);
if ($hourLimit === null) {
    gamas_json(['error' => 'storage_unavailable'], 503);
}
if ($hourLimit === false) {
    gamas_json(['error' => 'rate_limited'], 429, ['Retry-After' => '3600']);
}

// Purge the retired waitlist file; SQLite legacy rows are dropped by the
// version-3 migration in gamas_db(). Do not continue if the old file is stuck.
if (!gamas_purge_legacy_leads()) {
    gamas_json(['error' => 'storage_unavailable'], 503);
}

$input = gamas_input(2048);
$section = strtolower(gamas_field($input, 'section', 64));
if ($section === '') {
    $section = strtolower(gamas_field($_POST, 'section', 64));
}

if ($section === '' || preg_match('/^[a-z0-9_-]{1,64}$/', $section) !== 1) {
    gamas_json(['error' => 'invalid_section', 'message' => 'بخش نامعتبر'], 400);
}

$record = [
    'section' => $section,
    'created' => gmdate('c'),
];

try {
    $pdo = gamas_db();
    $stored = false;

    if ($pdo instanceof PDO) {
        try {
            $stmt = $pdo->prepare('INSERT INTO clicks (section) VALUES (:s)');
            $stmt->execute([':s' => $section]);
            $stored = true;
        } catch (PDOException $e) {
            gamas_log('track insert failed: ' . $e->getMessage());
        }

        // Best-effort retention: remove click events older than 90 days
        // during an occasional request; no aggregate/read API exists.
        if ($stored && mt_rand(1, 100) === 1) {
            try {
                $pdo->exec("DELETE FROM clicks WHERE created_at < datetime('now', '-90 days')");
            } catch (PDOException $e) {
                gamas_log('track cleanup failed: ' . $e->getMessage());
            }
        }
    } else {
        $stored = gamas_append_record('clicks', $record);
    }

    if (!$stored) {
        gamas_json(['error' => 'storage_unavailable'], 503);
    }
    gamas_json(['ok' => true, 'section' => $section]);
} catch (Throwable $e) {
    gamas_log('track endpoint error: ' . $e->getMessage());
    gamas_json(['error' => 'server_error'], 500);
}
