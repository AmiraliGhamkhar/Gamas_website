<?php
declare(strict_types=1);

// Gamas — /api/lead.php
// Stores email → SQLite with honeypot, rate-limit, CSRF, same-origin CORS
// PHP 8, no framework

// Secure session cookie
$secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => $secure,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? ($_SERVER['SERVER_NAME'] ?? '');
$referer = $_SERVER['HTTP_REFERER'] ?? '';

// ---------- Same-origin CORS ----------
function isSameOrigin(string $origin, string $referer, string $host): bool
{
    if ($origin !== '') {
        $oHost = parse_url($origin, PHP_URL_HOST);
        $oHost = is_string($oHost) ? $oHost : '';
        // Allow exact host match (with or without port)
        // Strip port from host for comparison
        $hostNoPort = explode(':', $host)[0];
        $oHostNoPort = explode(':', $oHost)[0];
        return $oHostNoPort === $hostNoPort;
    }
    if ($referer !== '') {
        $rHost = parse_url($referer, PHP_URL_HOST);
        $rHost = is_string($rHost) ? $rHost : '';
        $hostNoPort = explode(':', $host)[0];
        $rHostNoPort = explode(':', $rHost)[0];
        return $rHostNoPort === $hostNoPort;
    }
    // No Origin/Referer — could be direct fetch with same-origin and no header,
    // or a non-browser client. For POST we require at least one to be present
    // to enforce same-origin; for GET token we allow.
    return false;
}

$requiresOriginCheck = ($method === 'POST');
if ($origin !== '') {
    $hostNoPort = explode(':', $host)[0];
    $oHost = parse_url($origin, PHP_URL_HOST);
    $oHost = is_string($oHost) ? explode(':', $oHost)[0] : '';
    if ($oHost !== $hostNoPort) {
        http_response_code(403);
        echo json_encode(['error' => 'origin_not_allowed', 'message' => 'Origin not allowed'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, X-Requested-With');
} elseif ($requiresOriginCheck && $referer !== '') {
    $hostNoPort = explode(':', $host)[0];
    $rHost = parse_url($referer, PHP_URL_HOST);
    $rHost = is_string($rHost) ? explode(':', $rHost)[0] : '';
    if ($rHost !== $hostNoPort) {
        http_response_code(403);
        echo json_encode(['error' => 'origin_not_allowed', 'message' => 'Referer not allowed'], JSON_UNESCAPED_UNICODE);
        exit;
    }
} elseif ($requiresOriginCheck && $origin === '' && $referer === '') {
    // No Origin and no Referer on POST — block to enforce same-origin
    // Allow if it's a same-origin fetch without Origin (some browsers) — but we already checked.
    // For strictness, we block.
    http_response_code(403);
    echo json_encode(['error' => 'origin_required', 'message' => 'Origin or Referer required'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------- CSRF ----------
if (empty($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['csrf_token'];

if ($method === 'GET') {
    // Token endpoint for frontend
    echo json_encode(['csrf_token' => $csrfToken, 'ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    header('Allow: GET, POST, OPTIONS');
    echo json_encode(['error' => 'method_not_allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

// ---------- Read input (support JSON and form) ----------
$contentType = $_SERVER['CONTENT_TYPE'] ?? ($_SERVER['HTTP_CONTENT_TYPE'] ?? '');
$raw = file_get_contents('php://input');
$json = null;
if ($raw !== false && $raw !== '') {
    $decoded = json_decode($raw, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        $json = $decoded;
    }
}
$input = $json ?? $_POST;

// ---------- CSRF validation ----------
$provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_SERVER['HTTP_X_CSRFTOKEN'] ?? '');
if (empty($provided)) {
    $provided = $input['csrf_token'] ?? $_POST['csrf_token'] ?? '';
}
if (empty($provided) || !is_string($provided) || !hash_equals($csrfToken, $provided)) {
    http_response_code(403);
    echo json_encode(['error' => 'csrf_invalid', 'message' => 'توکن امنیتی نامعتبر است. صفحه را رفرش کنید.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// ---------- Honeypot ----------
$honeypot = '';
if (isset($input['website'])) $honeypot = (string)$input['website'];
elseif (isset($input['company'])) $honeypot = (string)$input['company'];
elseif (isset($_POST['website'])) $honeypot = (string)$_POST['website'];
if (trim($honeypot) !== '') {
    // Silently pretend success to avoid revealing trap
    echo json_encode(['ok' => true, 'message' => 'درخواست دریافت شد.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// ---------- Rate limit + DB ----------
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
if (!filter_var($ip, FILTER_VALIDATE_IP)) {
    $ip = '0.0.0.0';
}
$ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 512);

try {
    $dbPath = __DIR__ . '/../data/gamas.sqlite';
    $dbDir = dirname($dbPath);
    if (!is_dir($dbDir)) {
        if (!mkdir($dbDir, 0755, true) && !is_dir($dbDir)) {
            throw new RuntimeException('Failed to create data dir');
        }
    }
    $pdo = new PDO('sqlite:' . $dbPath, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    // Ensure WAL for concurrency
    $pdo->exec("PRAGMA journal_mode=WAL;");
    $pdo->exec("PRAGMA busy_timeout=5000;");
    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        ip TEXT NOT NULL,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_leads_ip_created ON leads(ip, created_at)");

    // Rate limit: 5 per hour per IP
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM leads WHERE ip = :ip AND created_at > datetime('now', '-1 hour')");
    $stmt->execute([':ip' => $ip]);
    $count = (int)$stmt->fetchColumn();
    if ($count >= 5) {
        http_response_code(429);
        header('Retry-After: 3600');
        echo json_encode(['error' => 'rate_limited', 'message' => 'تعداد درخواست‌ها زیاد است. لطفاً یک ساعت بعد تلاش کنید.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // ---------- Email validation ----------
    $email = '';
    if (isset($input['email'])) $email = trim((string)$input['email']);
    elseif (isset($_POST['email'])) $email = trim((string)$_POST['email']);

    if ($email === '' || strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'invalid_email', 'message' => 'ایمیل نامعتبر است.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    // Normalize
    $email = strtolower($email);
    // Additional simple check: no newline injection
    if (preg_match('/[\r\n]/', $email)) {
        http_response_code(400);
        echo json_encode(['error' => 'invalid_email'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO leads (email, ip, user_agent) VALUES (:email, :ip, :ua)");
    $stmt->execute([':email' => $email, ':ip' => $ip, ':ua' => $ua]);

    echo json_encode(['ok' => true, 'message' => 'ایمیل با موفقیت ثبت شد. به‌زودی خبر می‌دهیم.'], JSON_UNESCAPED_UNICODE);
    exit;
} catch (PDOException $e) {
    // Duplicate email — treat as success to avoid enumeration
    if (stripos($e->getMessage(), 'UNIQUE') !== false || $e->getCode() === '23000') {
        echo json_encode(['ok' => true, 'message' => 'این ایمیل قبلاً ثبت شده است.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    error_log('lead.php PDO error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'server_error', 'message' => 'خطای سرور. لطفاً بعداً تلاش کنید.'], JSON_UNESCAPED_UNICODE);
    exit;
} catch (Throwable $e) {
    error_log('lead.php error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'server_error', 'message' => 'خطای سرور.'], JSON_UNESCAPED_UNICODE);
    exit;
}
