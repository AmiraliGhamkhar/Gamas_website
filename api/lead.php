<?php

/**
 * Gamas — /api/lead.php
 * ---------------------------------------------------------------------------
 *   GET   → issues a CSRF token for the signup form (the only non-POST verb)
 *   POST  → stores an email address
 *
 * Minimum PHP: 7.4.  Requires only pdo_sqlite (falls back to flat files).
 *
 * Layers, in order:
 *   same-origin  →  method  →  honeypot  →  rate limit  →  CSRF
 *   →  timing check  →  validation  →  storage
 *
 * Every response is JSON (UTF-8), carries a correct status code, and never
 * contains a filesystem path or stack trace.
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

// ---------------------------------------------------------------------------
// 1. Same-origin. Strict for POST (browsers always send Origin there),
//    lenient for the token GET (browsers do NOT send Origin on same-origin
//    GET, and the token is useless without the matching cookie).
// ---------------------------------------------------------------------------
$method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));

gamas_require_same_origin($method !== 'GET');

// ---------------------------------------------------------------------------
// 2. GET — hand out a CSRF token
// ---------------------------------------------------------------------------
if ($method === 'GET') {
    // Generous limit: a form can be reloaded, and several forms share a page
    if (!gamas_rate_limit('lead_token', 60, 3600)) {
        gamas_json(
            ['error' => 'rate_limited', 'message' => 'تعداد درخواست‌ها زیاد است. کمی بعد تلاش کنید.'],
            429,
            ['Retry-After' => '3600']
        );
    }
    gamas_json(['ok' => true, 'csrf_token' => gamas_csrf_issue()]);
}

// ---------------------------------------------------------------------------
// 3. Everything else must be POST (OPTIONS → 204 for preflight)
// ---------------------------------------------------------------------------
gamas_require_method(['POST']);

$input = gamas_input();

// ---------------------------------------------------------------------------
// 4. Honeypot — a field real users cannot see or reach.
//    Bots get a 200 "success" so they never learn they were caught.
// ---------------------------------------------------------------------------
$honeypot = gamas_field($input, 'website', 128);
if ($honeypot === '') {
    $honeypot = gamas_field($input, 'company', 128);
}
if ($honeypot === '') {
    $honeypot = gamas_field($input, 'url', 128);
}
if (trim($honeypot) !== '') {
    gamas_log('honeypot tripped');
    gamas_json(['ok' => true, 'message' => 'ایمیل با موفقیت ثبت شد. به‌زودی خبر می‌دهیم.']);
}

// ---------------------------------------------------------------------------
// 5. Rate limiting — file based, per IP
// ---------------------------------------------------------------------------
if (!gamas_rate_limit('lead_hour', 5, 3600)) {
    gamas_json(
        ['error' => 'rate_limited', 'message' => 'تعداد درخواست‌ها زیاد است. لطفاً یک ساعت بعد تلاش کنید.'],
        429,
        ['Retry-After' => '3600']
    );
}
if (!gamas_rate_limit('lead_minute', 3, 60)) {
    gamas_json(
        ['error' => 'rate_limited', 'message' => 'کمی صبر کنید و دوباره تلاش کنید.'],
        429,
        ['Retry-After' => '60']
    );
}

// ---------------------------------------------------------------------------
// 6. CSRF — token from the header, falling back to the JSON body
// ---------------------------------------------------------------------------
$token = gamas_header('X-CSRF-Token');
if ($token === null || $token === '') {
    $token = gamas_header('X-CSRFTOKEN');
}
if ($token === null || $token === '') {
    $token = gamas_field($input, 'csrf_token', 255);
}

$csrf = gamas_csrf_verify($token);
if (!$csrf['ok']) {
    gamas_log('csrf rejected');
    gamas_json(
        ['error' => 'csrf_invalid', 'message' => 'توکن امنیتی نامعتبر است. صفحه را رفرش کنید.'],
        403
    );
}

// ---------------------------------------------------------------------------
// 7. Timing check — a form submitted in under GAMAS_MIN_FILL_SECONDS was
//    not filled in by a human. Pretend success so the bot learns nothing.
//
//    Deliberately lenient (1s): this returns a FAKE success, so a false
//    positive silently loses a real lead. The honeypot, CSRF, rate limit
//    and origin checks are the primary anti-spam layers; this is a backstop.
// ---------------------------------------------------------------------------
if ($csrf['age'] >= 0 && $csrf['age'] < GAMAS_MIN_FILL_SECONDS) {
    gamas_log('timing check tripped (age ' . $csrf['age'] . 's)');
    gamas_json(['ok' => true, 'message' => 'ایمیل با موفقیت ثبت شد. به‌زودی خبر می‌دهیم.']);
}

// ---------------------------------------------------------------------------
// 8. Validate the email
// ---------------------------------------------------------------------------
$email = gamas_normalise_email(gamas_field($input, 'email', 254));
if ($email === '') {
    gamas_json(['error' => 'invalid_email', 'message' => 'ایمیل نامعتبر است.'], 400);
}

$source = preg_replace('/[^a-z0-9_-]/i', '', gamas_field($input, 'source', 64)) ?? '';
if ($source === '') {
    $source = 'unknown';
}

$ua = preg_replace('/[\x00-\x1F\x7F]/', '', substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 512)) ?? '';

// ---------------------------------------------------------------------------
// 9. Persist — SQLite when available, NDJSON otherwise
// ---------------------------------------------------------------------------
$record = [
    'email'   => $email,
    'source'  => $source,
    'ip'      => gamas_client_ip(),
    'ua'      => $ua,
    'created' => gmdate('c'),
];

try {
    $pdo = gamas_db();

    if ($pdo instanceof PDO) {
        try {
            $stmt = $pdo->prepare(
                'INSERT INTO leads (email, source, ip, user_agent) VALUES (:e, :s, :ip, :ua)'
            );
            $stmt->execute([
                ':e'  => $email,
                ':s'  => $source,
                ':ip' => $record['ip'],
                ':ua' => $ua,
            ]);
            gamas_log('lead stored (source=' . $source . ')');
            gamas_json(['ok' => true, 'message' => 'ایمیل با موفقیت ثبت شد. به‌زودی خبر می‌دهیم.']);
        } catch (PDOException $e) {
            // UNIQUE violation → already registered. Say so without leaking
            // anything about who is or is not in the list.
            if ((string)$e->getCode() === '23000') {
                gamas_json(['ok' => true, 'message' => 'این ایمیل قبلاً ثبت شده است.']);
            }
            // Any other SQLite failure (disk full, corrupt DB, permissions)
            // falls through to the flat-file store rather than losing the
            // lead. Losing a signup is worse than a duplicate row.
            gamas_log('lead insert failed, falling back to ndjson: ' . $e->getMessage());
        }
    }

    // Flat-file fallback (no pdo_sqlite, or the DB refused to open)
    if (gamas_append_record('leads', $record)) {
        gamas_log('lead stored to ndjson (source=' . $source . ')');
        gamas_json(['ok' => true, 'message' => 'ایمیل با موفقیت ثبت شد. به‌زودی خبر می‌دهیم.']);
    }

    gamas_log('lead storage unavailable');
    gamas_json(['error' => 'server_error', 'message' => 'خطای سرور. لطفاً بعداً تلاش کنید.'], 500);
} catch (Throwable $e) {
    // Log the detail, return nothing useful
    gamas_log('lead endpoint error: ' . $e->getMessage());
    gamas_json(['error' => 'server_error', 'message' => 'خطای سرور. لطفاً بعداً تلاش کنید.'], 500);
}
