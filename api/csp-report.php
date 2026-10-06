<?php

/**
 * Gamas — /api/csp-report.php
 * ---------------------------------------------------------------------------
 * Minimal CSP violation report sink. Accepts small same-origin JSON reports,
 * logs a one-line summary via the shared logger, and answers 204.
 *
 * POST only. Minimum PHP syntax target: 8.2.
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

gamas_require_same_origin();
gamas_require_method(['POST']);

$input = gamas_input(4096);
$blocked = gamas_field($input, 'blocked-uri', 255);
if ($blocked === '' && isset($input['csp-report']) && is_array($input['csp-report'])) {
    $blocked = gamas_field($input['csp-report'], 'blocked-uri', 255);
}
gamas_log('csp report: ' . ($blocked !== '' ? $blocked : 'no blocked-uri'));

http_response_code(204);
exit;
