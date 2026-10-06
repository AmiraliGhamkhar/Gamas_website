<?php

/**
 * Retired endpoint. The website no longer collects email addresses.
 * Keep a JSON 410 response so stale bookmarks or cached clients do not fail
 * with an ambiguous 404, and never create new lead records here.
 */

declare(strict_types=1);

@error_log('gamas lead tombstone hit');
http_response_code(410);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, private');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header_remove('X-Powered-By');

echo json_encode(
    ['error' => 'endpoint_retired', 'message' => 'فرم دریافت ایمیل در این وب‌سایت حذف شده است.'],
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);
