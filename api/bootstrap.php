<?php

/**
 * Gamas — shared bootstrap for /api/*.php
 * ---------------------------------------------------------------------------
 * Minimum PHP syntax target: 8.2
 * No framework, no Composer, no external dependencies.
 *
 * Every directive below is PHP_INI_ALL (settable at runtime). The
 * PHP_INI_PERDIR ones live in api/.user.ini, because php_value/php_flag in
 * .htaccess would 500 on the CGI/FPM/LSAPI handlers cPanel uses.
 *
 * Deliberate design choices for shared hosting:
 *   - No visitor accounts, sessions or CSRF token endpoint; the only API
 *     records non-sensitive CTA clicks and is same-origin/rate limited.
 *   - Storage goes OUTSIDE public_html (/home/USER/gamas_data) by default,
 *     with an .htaccess-protected in-root fallback.
 *   - SQLite when pdo_sqlite exists, flat NDJSON files when it does not.
 *   - Rate-limit files contain a short-lived HMAC of the client IP, not the
 *     raw address. An unavailable limiter fails closed for analytics.
 */

declare(strict_types=1);

if (defined('GAMAS_BOOTSTRAP')) {
    return;
}
define('GAMAS_BOOTSTRAP', true);

// ---------------------------------------------------------------------------
// 1. Version guard — fail loudly but generically on unsupported PHP
// ---------------------------------------------------------------------------
if (PHP_VERSION_ID < 80200) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'server_error', 'message' => 'PHP 8.2+ required.']);
    exit;
}

// ---------------------------------------------------------------------------
// 2. Runtime hardening — no output of errors, paths, or stack traces, ever
// ---------------------------------------------------------------------------
@ini_set('display_errors', '0');
@ini_set('display_startup_errors', '0');
@ini_set('html_errors', '0');
@ini_set('log_errors', '1');
@ini_set('expose_php', '0');
@ini_set('max_execution_time', '20');
@ini_set('max_input_time', '10');
@ini_set('memory_limit', '64M');
@ini_set('default_charset', 'UTF-8');
@ini_set('date.timezone', 'UTC');
if (function_exists('mb_internal_encoding')) {
    mb_internal_encoding('UTF-8');
}
if (!ini_get('date.timezone')) {
    @date_default_timezone_set('UTC');
}

// ---------------------------------------------------------------------------
// 3. Safety net: any fatal/parse error still returns clean JSON
// ---------------------------------------------------------------------------
register_shutdown_function(static function (): void {
    $e = error_get_last();
    if ($e === null) {
        return;
    }
    $fatal = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR];
    if (!in_array((int)$e['type'], $fatal, true)) {
        return;
    }
    // basename() only — never leak the absolute path into a response
    error_log('gamas fatal: ' . $e['message'] . ' in ' . basename((string)$e['file'])
        . ':' . (int)$e['line']);
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, no-cache, must-revalidate, private');
        echo json_encode(
            ['error' => 'server_error', 'message' => 'خطای سرور. لطفاً بعداً تلاش کنید.'],
            JSON_UNESCAPED_UNICODE
        );
    }
});

set_exception_handler(static function (Throwable $t): void {
    error_log('gamas uncaught ' . get_class($t) . ': ' . $t->getMessage());
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, no-cache, must-revalidate, private');
        echo json_encode(
            ['error' => 'server_error', 'message' => 'خطای سرور. لطفاً بعداً تلاش کنید.'],
            JSON_UNESCAPED_UNICODE
        );
    }
    exit;
});


// ===========================================================================
//  Helpers
// ===========================================================================

/**
 * Emit a JSON response and stop. Always UTF-8, never cached, never pretty.
 *
 * @param array<string,string> $extraHeaders e.g. ['Allow' => 'GET, POST']
 */
function gamas_json(array $payload, int $status = 200, array $extraHeaders = []): void
{
    $json = json_encode(
        $payload,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE
    );
    if ($json === false) {
        $json = '{"error":"server_error"}';
    }

    if (headers_sent()) {
        echo $json;
        exit;
    }

    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, private');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('X-Frame-Options: DENY');
    header_remove('X-Powered-By');
    foreach ($extraHeaders as $name => $value) {
        header($name . ': ' . $value);
    }
    echo $json;
    exit;
}

/**
 * Best-effort logging: server error_log + our own app.log inside the private
 * data dir. Never throws, never breaks the response. One previous copy is
 * kept (app.log.1): on shared hosting an unbounded log eventually eats the
 * account quota, and there is no logrotate on shared hosting.
 */
function gamas_log(string $message): void
{
    $flat = preg_replace('/\s+/', ' ', $message);
    @error_log('gamas: ' . $flat);
    try {
        $dir = gamas_data_dir() . '/logs';
        if (gamas_ensure_dir($dir)) {
            $file = $dir . '/app.log';
            // Rotate before opening: >1 MiB → keep one previous copy.
            if (@filesize($file) > 1048576) {
                @rename($file, $dir . '/app.log.1');
            }
            $line = gmdate('c') . ' ' . $flat . "\n";
            $fp = @fopen($file, 'ab');
            if ($fp !== false) {
                if (flock($fp, LOCK_EX)) {
                    fwrite($fp, $line);
                    fflush($fp);
                    flock($fp, LOCK_UN);
                }
                fclose($fp);
                @chmod($file, 0600);
            }
        }
    } catch (Throwable $e) {
        // logging must never take the site down
    }
}

/**
 * Read a request header. $_SERVER['HTTP_*'] covers mod_php/php-fpm/CGI;
 * getallheaders() is the fallback for SAPIs that skip populating $_SERVER.
 */
function gamas_header(string $name): ?string
{
    $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    if (isset($_SERVER[$key]) && is_scalar($_SERVER[$key])) {
        return (string)$_SERVER[$key];
    }
    if (function_exists('getallheaders')) {
        $all = @getallheaders();
        if (is_array($all)) {
            $want = strtolower($name);
            foreach ($all as $k => $v) {
                if (strtolower((string)$k) === $want) {
                    return is_scalar($v) ? (string)$v : '';
                }
            }
        }
    }
    return null;
}

/**
 * Client IP. REMOTE_ADDR only by default.
 *
 * Set GAMAS_TRUST_CF_IP=1 ONLY if the site really sits behind Cloudflare —
 * trusting CF-Connecting-IP without the proxy lets anyone spoof a header and
 * walk straight through every rate limit.
 */
function gamas_client_ip(): string
{
    $ip = isset($_SERVER['REMOTE_ADDR']) ? trim((string)$_SERVER['REMOTE_ADDR']) : '';

    $trustCf = strtolower((string)(getenv('GAMAS_TRUST_CF_IP') ?: '0'));
    if ($trustCf === '1' || $trustCf === 'true' || $trustCf === 'yes') {
        $cf = gamas_header('CF-Connecting-IP');
        if ($cf !== null && filter_var($cf, FILTER_VALIDATE_IP)) {
            return $cf;
        }
    }

    if (!filter_var($ip, FILTER_VALIDATE_IP)) {
        $ip = '0.0.0.0';
    }
    return $ip;
}

/** Keyed, short-lived pseudonym for rate-limit filenames. */
function gamas_ip_key(): string
{
    return substr(hash_hmac('sha256', gamas_client_ip(), gamas_secret()), 0, 16);
}

// ---------------------------------------------------------------------------
//  Storage location
// ---------------------------------------------------------------------------

function gamas_ensure_dir(string $dir): bool
{
    if ($dir === '') {
        return false;
    }
    if (!@is_dir($dir)) {
        $old = @umask(0077);
        $made = @mkdir($dir, 0700, true);
        @umask($old);
        if (!$made && !@is_dir($dir)) {
            return false;
        }
    }
    if (!@is_dir($dir)) {
        return false;
    }
    // Existing data directories may have been created by an older release
    // with broader permissions. They hold personal data and secrets.
    @chmod($dir, 0700);
    return @is_writable($dir);
}

/** Absolute, real path of this site's Apache DocumentRoot. */
function gamas_doc_root(): string
{
    $dr = isset($_SERVER['DOCUMENT_ROOT']) ? (string)$_SERVER['DOCUMENT_ROOT'] : '';
    if ($dr !== '') {
        $real = @realpath($dr);
        if ($real !== false && @is_dir($real)) {
            return rtrim($real, '/');
        }
    }
    // /public_html/api → /public_html
    return rtrim((string)dirname(__DIR__), '/');
}

/** True when a path resolves under this site's or its cPanel public_html root. */
function gamas_path_is_public(string $path): bool
{
    $docRoot = gamas_doc_root();
    $publicRoots = [$docRoot];
    $normalizedDocRoot = str_replace('\\', '/', $docRoot);
    if (preg_match('#^(.*?)/public_html(?:/|$)#i', $normalizedDocRoot, $matches) === 1) {
        $publicHtmlRoot = rtrim($matches[1], '/') . '/public_html';
        $publicRoots[] = $publicHtmlRoot;
    }

    $realPath = @realpath($path);
    if ($realPath === false) {
        $realParent = @realpath(dirname($path));
        $realPath = $realParent !== false
            ? rtrim($realParent, '/') . '/' . basename($path)
            : $path;
    }
    $normalizedPath = rtrim(str_replace('\\', '/', $realPath), '/');

    foreach ($publicRoots as $root) {
        $realRoot = @realpath($root);
        $normalizedRoot = rtrim(str_replace('\\', '/', $realRoot !== false ? $realRoot : $root), '/');
        if ($normalizedRoot === '') {
            $normalizedRoot = '/';
        }
        if ($normalizedPath === $normalizedRoot || ($normalizedRoot === '/'
            ? strpos($normalizedPath, '/') === 0
            : strpos($normalizedPath, $normalizedRoot . '/') === 0)) {
            return true;
        }
    }
    return false;
}

/**
 * Private data directory, resolved once per request.
 *
 *   1. GAMAS_DATA_DIR env var (set it in cPanel → Environment Variables)
 *   2. The account home’s /gamas_data (derived from public_html or HOME),
 *      verified outside both the domain root and public_html.
 *   3. The app’s data/ directory → last resort; blocked by Apache rules and
 *      data/.htaccess, with restrictive filesystem permissions.
 *
 * Throws if none is usable: better a loud, logged 500 than silently writing
 * visitor data somewhere the web server can serve it.
 */
function gamas_data_dir(): string
{
    static $resolved = null;
    if ($resolved !== null) {
        return $resolved;
    }

    $privateCandidates = [];

    $env = getenv('GAMAS_DATA_DIR');
    if (is_string($env) && $env !== '') {
        $privateCandidates[] = $env;
    }

    $docRoot = gamas_doc_root();
    $normalizedDocRoot = str_replace('\\', '/', $docRoot);
    if (preg_match('#^(.*?)/public_html(?:/|$)#i', $normalizedDocRoot, $matches) === 1) {
        $accountHome = rtrim($matches[1], '/');
        $privateCandidates[] = ($accountHome === '' ? '' : $accountHome) . '/gamas_data';
    } else {
        $home = getenv('HOME');
        if (is_string($home) && $home !== '') {
            $privateCandidates[] = rtrim($home, '/') . '/gamas_data';
        }
    }
    $privateCandidates[] = dirname($docRoot) . '/gamas_data';

    foreach (array_unique($privateCandidates) as $candidate) {
        $candidate = rtrim((string)$candidate, '/');
        if ($candidate === '' || $candidate === '/' || $candidate === '.' || gamas_path_is_public($candidate)) {
            continue;
        }
        if (gamas_ensure_dir($candidate)) {
            $resolved = $candidate;
            return $resolved;
        }
    }

    // The in-root location is used only as a protected last resort.
    $fallback = dirname(__DIR__) . '/data';
    if (gamas_ensure_dir($fallback)) {
        $ht = $fallback . '/.htaccess';
        if (!@is_file($ht)) {
            @file_put_contents(
                $ht,
                "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n<IfModule mod_autoindex.c>\n  Options -Indexes\n</IfModule>\n",
                LOCK_EX
            );
            @chmod($ht, 0644);
        }
        $resolved = $fallback;
        return $resolved;
    }

    throw new RuntimeException('No writable private storage directory available.');
}

/**
 * HMAC key for short-lived IP rate-limit pseudonyms. Stored privately with
 * restrictive permissions and a lock so concurrent first requests agree.
 *
 * Prefer the GAMAS_HMAC_KEY environment variable (set it in cPanel →
 * Environment Variables) so the key does not live next to the data it
 * pseudonymizes. Falls back to the locked on-disk key for shared hosting
 * without env support.
 */
function gamas_secret(): string
{
    static $secret = null;
    if ($secret !== null) {
        return $secret;
    }

    $envKey = getenv('GAMAS_HMAC_KEY');
    if (is_string($envKey) && strlen($envKey) >= 64) {
        $secret = $envKey;
        return $secret;
    }

    $file = gamas_data_dir() . '/ip-rate.key';
    $lock = @fopen($file . '.lock', 'c+');
    if ($lock === false) {
        throw new RuntimeException('Cannot open rate-limit key lock.');
    }
    @chmod($file . '.lock', 0600);
    if (!flock($lock, LOCK_EX)) {
        fclose($lock);
        throw new RuntimeException('Cannot lock rate-limit key.');
    }

    try {
        $existing = @file_get_contents($file);
        if (is_string($existing) && strlen($existing) >= 64) {
            $secret = $existing;
            return $secret;
        }

        $fresh = bin2hex(random_bytes(32));
        $tmp = $file . '.' . bin2hex(random_bytes(6)) . '.tmp';
        $written = @file_put_contents($tmp, $fresh, LOCK_EX);
        if ($written !== strlen($fresh)) {
            @unlink($tmp);
            throw new RuntimeException('Cannot persist rate-limit key.');
        }
        @chmod($tmp, 0600);
        if (!@rename($tmp, $file)) {
            @unlink($tmp);
            throw new RuntimeException('Cannot persist rate-limit key.');
        }
        @chmod($file, 0600);

        $check = @file_get_contents($file);
        if (!is_string($check) || strlen($check) < 64) {
            throw new RuntimeException('Rate-limit key unreadable after write.');
        }
        $secret = $check;
        return $secret;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
        @chmod($file . '.lock', 0600);
    }
}

// ---------------------------------------------------------------------------
//  Database — SQLite when available, flat NDJSON files otherwise
// ---------------------------------------------------------------------------

/**
 * @return PDO|null  null means "no usable SQLite"; callers must fall back.
 */
function gamas_db(): ?PDO
{
    static $pdo = null;
    static $tried = false;

    if ($tried) {
        return $pdo;
    }
    $tried = true;
    $pdo = null;

    if (!class_exists('PDO') || !in_array('sqlite', PDO::getAvailableDrivers(), true)) {
        gamas_log('pdo_sqlite unavailable — using flat-file storage');
        return null;
    }

    try {
        $dbPath = gamas_data_dir() . '/gamas.sqlite';
        $db = new PDO('sqlite:' . $dbPath, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_TIMEOUT            => 5,
        ]);

        // WAL needs shared memory; it fails on some shared-host filesystems
        // (notably NFS-backed home dirs). Non-fatal — fall back to DELETE.
        try {
            $db->exec('PRAGMA journal_mode=WAL');
        } catch (Throwable $e) {
            try {
                $db->exec('PRAGMA journal_mode=DELETE');
            } catch (Throwable $e2) {
                // ignore — default journal mode is fine
            }
        }
        try {
            $db->exec('PRAGMA busy_timeout=5000');
            $db->exec('PRAGMA synchronous=NORMAL');
        } catch (Throwable $e) {
            // ignore
        }

        $schemaVersion = (int)$db->query('PRAGMA user_version')->fetchColumn();
        if ($schemaVersion < 2) {
            $db->exec('CREATE TABLE IF NOT EXISTS clicks (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                section    TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )');
            $db->exec('DROP INDEX IF EXISTS idx_clicks_section');

            // Earlier versions stored IP and user-agent with CTA events.
            // Rebuild clicks if legacy columns exist so no NOT NULL constraint
            // or personal-data column remains on disk.
            $columns = array_column($db->query('PRAGMA table_info(clicks)')->fetchAll(), 'name');
            if (in_array('ip', $columns, true) || in_array('user_agent', $columns, true)) {
                $db->beginTransaction();
                try {
                    $db->exec('CREATE TABLE clicks_v2 (
                        id         INTEGER PRIMARY KEY AUTOINCREMENT,
                        section    TEXT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )');
                    $db->exec('INSERT INTO clicks_v2 (id, section, created_at) SELECT id, section, created_at FROM clicks');
                    $db->exec('DROP TABLE clicks');
                    $db->exec('ALTER TABLE clicks_v2 RENAME TO clicks');
                    $db->commit();
                } catch (Throwable $e) {
                    if ($db->inTransaction()) {
                        $db->rollBack();
                    }
                    throw $e;
                }
            }

            $db->exec('CREATE INDEX IF NOT EXISTS idx_clicks_created ON clicks(created_at)');
            $db->exec('PRAGMA user_version=2');
        }

        // Version 3 retires the former email waitlist and its PII. Dropping
        // the legacy table removes it from queries; VACUUM attempts to reclaim
        // the deleted pages from the private SQLite file as well.
        if ($schemaVersion < 3) {
            $db->exec('DROP INDEX IF EXISTS idx_leads_ip_created');
            $db->exec('DROP TABLE IF EXISTS leads');
            $db->exec('PRAGMA user_version=3');
            try {
                $db->exec('PRAGMA wal_checkpoint(TRUNCATE)');
                $db->exec('VACUUM');
            } catch (Throwable $e) {
                gamas_log('legacy lead data vacuum incomplete: ' . $e->getMessage());
            }
        }

        // Do not rely on the hosting account's default umask for database
        // files, which contain click events and rate-limit metadata.
        foreach ([$dbPath, $dbPath . '-wal', $dbPath . '-shm'] as $privateFile) {
            if (is_file($privateFile)) {
                @chmod($privateFile, 0600);
            }
        }

        $pdo = $db;
    } catch (Throwable $e) {
        gamas_log('sqlite init failed (' . $e->getMessage() . ') — using flat-file storage');
        $pdo = null;
    }

    return $pdo;
}

/** Append one record as a line of NDJSON, guarded by an exclusive flock. */
function gamas_append_record(string $name, array $record): bool
{
    try {
        $safeName = preg_replace('/[^a-z0-9_-]/i', '', $name);
        $file = gamas_data_dir() . '/' . $safeName . '.ndjson';
    } catch (Throwable $e) {
        return false;
    }

    $line = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    if ($line === false) {
        return false;
    }

    $fp = @fopen($file, 'c+b');
    if ($fp === false) {
        return false;
    }
    $ok = false;
    if (flock($fp, LOCK_EX)) {
        // The click log is best-effort analytics, not an audit archive. Clear
        // legacy IP/UA-bearing rows once, then cap fallback storage so hosts
        // without SQLite cannot fill their quota.
        $ready = true;
        if ($safeName === 'clicks') {
            $migrationMarker = dirname($file) . '/.clicks-v2';
            if (!is_file($migrationMarker)) {
                if (!ftruncate($fp, 0) || !fflush($fp)) {
                    $ready = false;
                } elseif (@file_put_contents($migrationMarker, '1', LOCK_EX) !== 1) {
                    $ready = false;
                } else {
                    @chmod($migrationMarker, 0600);
                }
            }

            if ($ready) {
                $stats = fstat($fp);
                if (!is_array($stats)) {
                    $ready = false;
                } elseif ((int)($stats['size'] ?? 0) + strlen($line) + 1 > 1048576) {
                    $ready = ftruncate($fp, 0) && fflush($fp);
                }
            }
        }

        if ($ready && fseek($fp, 0, SEEK_END) === 0) {
            $contents = $line . "\n";
            $written = fwrite($fp, $contents);
            $ok = $written === strlen($contents) && fflush($fp);
        }
        flock($fp, LOCK_UN);
    }
    fclose($fp);
    @chmod($file, 0600);
    return $ok;
}

/** Remove the retired flat-file waitlist when the API is next used. */
function gamas_purge_legacy_leads(): bool
{
    try {
        $legacyFile = gamas_data_dir() . '/leads.ndjson';
    } catch (Throwable $e) {
        return false;
    }

    if (!is_file($legacyFile)) {
        return true;
    }
    if (@unlink($legacyFile) || !file_exists($legacyFile)) {
        gamas_log('retired NDJSON email list removed');
        return true;
    }

    gamas_log('retired NDJSON email list could not be removed');
    return false;
}

// ---------------------------------------------------------------------------
//  Rate limiting — file based, flock guarded, fail closed for analytics
// ---------------------------------------------------------------------------

/**
 * Sliding-window limiter keyed by a private HMAC pseudonym of client IP.
 *
 * @param string $namespace separate bucket, e.g. "track_minute"
 * @param int    $limit     max events
 * @param int    $window    seconds
 * @return bool|null true = allowed and counted; false = limit; null = storage failure
 */
function gamas_rate_limit(string $namespace, int $limit, int $window): ?bool
{
    $bucket = preg_replace('/[^a-z0-9_-]/i', '', $namespace) ?? '';
    if ($bucket === '' || $limit < 1 || $window < 1) {
        return null;
    }

    try {
        $dir = gamas_data_dir() . '/ratelimit';
        if (!gamas_ensure_dir($dir)) {
            return null;
        }
        $file = $dir . '/' . $bucket . '_' . gamas_ip_key() . '.txt';
    } catch (Throwable $e) {
        return null;
    }

    $fp = @fopen($file, 'c+');
    if ($fp === false) {
        return null;
    }
    @chmod($file, 0600);

    $result = null;
    $locked = false;
    try {
        $locked = flock($fp, LOCK_EX);
        if (!$locked || !rewind($fp)) {
            return null;
        }
        $raw = stream_get_contents($fp);
        if (!is_string($raw)) {
            return null;
        }

        $now = time();
        $hits = [];
        if ($raw !== '') {
            foreach (preg_split('/\s+/', trim($raw)) as $piece) {
                if (ctype_digit($piece)) {
                    $timestamp = (int)$piece;
                    if ($timestamp > $now - $window) {
                        $hits[] = $timestamp;
                    }
                }
            }
        }

        if (count($hits) >= $limit) {
            return false;
        }

        $hits[] = $now;
        $contents = implode(' ', $hits);
        if (!ftruncate($fp, 0) || !rewind($fp)) {
            return null;
        }
        $written = fwrite($fp, $contents);
        $result = $written === strlen($contents) && fflush($fp) ? true : null;
    } catch (Throwable $e) {
        $result = null;
    } finally {
        if ($locked) {
            flock($fp, LOCK_UN);
        }
        fclose($fp);
        @chmod($file, 0600);
    }

    // Sweep a bounded number of expired buckets occasionally.
    if ($result === true && mt_rand(1, 100) === 1) {
        gamas_gc_ratelimit($dir, max($window, 3600));
    }

    return $result;
}

/** Delete rate-limit files untouched for longer than $ttl seconds. */
function gamas_gc_ratelimit(string $dir, int $ttl): void
{
    $fh = @opendir($dir);
    if ($fh === false) {
        return;
    }
    $scanned = 0;
    $cutoff = time() - $ttl;
    while (($entry = readdir($fh)) !== false && $scanned < 300) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }
        $scanned++;
        $path = $dir . '/' . $entry;
        if (!is_file($path)) {
            continue;
        }
        $mtime = @filemtime($path);
        if ($mtime !== false && $mtime < $cutoff) {
            @unlink($path);
        }
    }
    closedir($fh);
}

// ---------------------------------------------------------------------------
//  Exact-origin validation
// ---------------------------------------------------------------------------

/** Normalize a URL to scheme + host + effective port, or '' if invalid. */
function gamas_origin_of_url(string $url): string
{
    $parts = @parse_url(trim($url));
    if (!is_array($parts) || !isset($parts['scheme'], $parts['host'])) {
        return '';
    }
    if (isset($parts['user']) || isset($parts['pass'])) {
        return '';
    }

    $scheme = strtolower((string)$parts['scheme']);
    if ($scheme !== 'http' && $scheme !== 'https') {
        return '';
    }

    $unbracketedHost = strtolower(trim((string)$parts['host'], '[]'));
    if (filter_var($unbracketedHost, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
        $host = '[' . $unbracketedHost . ']';
    } elseif (
        filter_var($unbracketedHost, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) === false
        && preg_match('/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?))*$/i', $unbracketedHost) !== 1
    ) {
        return '';
    } else {
        $host = $unbracketedHost;
    }

    $port = isset($parts['port']) ? (int)$parts['port'] : null;
    if ($port !== null && ($port < 1 || $port > 65535)) {
        return '';
    }
    if (($scheme === 'http' && $port === 80) || ($scheme === 'https' && $port === 443)) {
        $port = null;
    }

    return $scheme . '://' . $host . ($port !== null ? ':' . $port : '');
}

/**
 * Exact origins permitted to call this site's API. Host, scheme and port are
 * all significant; never trust HTTP_HOST as an implicit allowlist entry.
 * Set GAMAS_ALLOWED_ORIGINS to a comma-separated list of full origins only
 * when the deployed site uses another origin.
 *
 * @return string[]
 */
function gamas_allowed_origins(): array
{
    $env = getenv('GAMAS_ALLOWED_ORIGINS');
    if (is_string($env) && trim($env) !== '') {
        $origins = [];
        foreach (explode(',', $env) as $entry) {
            $origin = gamas_origin_of_url($entry);
            if ($origin !== '') {
                $origins[] = $origin;
            }
        }
        return array_values(array_unique($origins));
    }

    return ['https://gamas.bot'];
}

/** Require a browser-supplied Origin or Referer matching the exact allowlist. */
function gamas_require_same_origin(): void
{
    $allowed = gamas_allowed_origins();
    $origin = gamas_header('Origin');
    if ($origin !== null && trim($origin) !== '') {
        $normalized = gamas_origin_of_url($origin);
        if ($normalized === '' || !in_array($normalized, $allowed, true)) {
            gamas_log('blocked cross-origin request from ' . $origin);
            gamas_json(['error' => 'origin_not_allowed', 'message' => 'Origin مجاز نیست.'], 403);
        }
        header('Access-Control-Allow-Origin: ' . $normalized);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Max-Age: 600');
        return;
    }

    $referer = gamas_header('Referer');
    if ($referer !== null && trim($referer) !== '') {
        $normalized = gamas_origin_of_url($referer);
        if ($normalized === '' || !in_array($normalized, $allowed, true)) {
            gamas_log('blocked cross-origin referer from ' . $referer);
            gamas_json(['error' => 'origin_not_allowed', 'message' => 'Origin مجاز نیست.'], 403);
        }
        return;
    }

    // Analytics is browser-only; never infer trust from an attacker-controlled
    // Host header or from missing request metadata.
    gamas_log('blocked request with neither Origin nor Referer');
    gamas_json(['error' => 'origin_required', 'message' => 'Origin یا Referer الزامی است.'], 403);
}

/** 405 for anything that is not an allowed verb. */
function gamas_require_method(array $allowed, bool $isOptions = true): void
{
    $method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string)$_SERVER['REQUEST_METHOD']) : 'GET';
    if (in_array($method, $allowed, true)) {
        return;
    }
    if ($method === 'OPTIONS' && $isOptions) {
        http_response_code(204);
        exit;
    }
    gamas_json(['error' => 'method_not_allowed'], 405, ['Allow' => implode(', ', $allowed)]);
}

// ---------------------------------------------------------------------------
//  Input reading & sanitising
// ---------------------------------------------------------------------------

/**
 * Read a small JSON (or form-encoded) body.
 * Hard-capped at 8 KB so a hostile client cannot burn memory on a host with
 * a tight memory_limit.
 *
 * @return array<string,mixed>
 */
function gamas_input(int $maxBytes = 8192): array
{
    $declared = isset($_SERVER['CONTENT_LENGTH']) ? (int)$_SERVER['CONTENT_LENGTH'] : 0;
    if ($declared > $maxBytes) {
        gamas_json(['error' => 'payload_too_large'], 413);
    }

    $raw = @file_get_contents('php://input', false, null, 0, $maxBytes + 1);
    if (is_string($raw) && $raw !== '') {
        if (strlen($raw) > $maxBytes) {
            gamas_json(['error' => 'payload_too_large'], 413);
        }

        $decoded = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }
    }

    // fall back to form-encoded / multipart $_POST
    $out = [];
    foreach ($_POST as $k => $v) {
        $out[(string)$k] = $v;
    }
    return $out;
}

/**
 * Pull a scalar field out of the request.
 * Control characters are stripped and the value is validated as UTF-8 before
 * it is ever stored — Persian text included.
 */
function gamas_field(array $input, string $key, int $maxLen = 255): string
{
    if (!array_key_exists($key, $input)) {
        return '';
    }
    $value = $input[$key];
    if (is_array($value)) {
        return '';
    }
    $value = (string)$value;

    // strip NUL and control characters (header/CRLF injection defence)
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';

    if (function_exists('mb_substr')) {
        $value = mb_substr($value, 0, $maxLen, 'UTF-8');
    } else {
        $value = substr($value, 0, $maxLen);
    }
    return $value;
}
