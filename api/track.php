<?php
declare(strict_types=1);

// Gamas — /api/track.php
// CTA click counter — same-origin CORS, rate-limit, no CSRF (beacon), SQLite
// PHP 8, no framework

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? ($_SERVER['SERVER_NAME'] ?? '');
$referer = $_SERVER['HTTP_REFERER'] ?? '';

// ---------- Same-origin CORS ----------
$hostNoPort = explode(':', $host)[0];
if ($origin !== '') {
    $oHost = parse_url($origin, PHP_URL_HOST);
    $oHost = is_string($oHost) ? explode(':', $oHost)[0] : '';
    if ($oHost !== $hostNoPort) {
        http_response_code(403);
        echo json_encode(['error' => 'origin_not_allowed'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
} elseif ($referer !== '') {
    $rHost = parse_url($referer, PHP_URL_HOST);
    $rHost = is_string($rHost) ? explode(':', $rHost)[0] : '';
    if ($rHost !== $hostNoPort) {
        http_response_code(403);
        echo json_encode(['error' => 'origin_not_allowed'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Allow GET for reading counts (optional) and POST for increment
if (!in_array($method, ['POST', 'GET'], true)) {
    http_response_code(405);
    header('Allow: GET, POST, OPTIONS');
    echo json_encode(['error' => 'method_not_allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

// ---------- Read input ----------
$raw = file_get_contents('php://input');
$json = null;
if ($raw !== false && $raw !== '') {
    $decoded = json_decode($raw, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        $json = $decoded;
    }
}
$input = $json ?? $_POST;
$section = '';
if (isset($input['section'])) $section = trim((string)$input['section']);
elseif (isset($_GET['section'])) $section = trim((string)$_GET['section']);

// For GET without section, return all counts (optional)
$isReadOnly = ($method === 'GET' && $section === '');

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
    $pdo->exec("PRAGMA journal_mode=WAL;");
    $pdo->exec("PRAGMA busy_timeout=5000;");
    $pdo->exec("CREATE TABLE IF NOT EXISTS clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section TEXT NOT NULL,
        ip TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_clicks_section ON clicks(section)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_clicks_ip_created ON clicks(ip, created_at)");

    if ($isReadOnly) {
        // Return aggregated counts per section
        $stmt = $pdo->query("SELECT section, COUNT(*) as cnt FROM clicks GROUP BY section");
        $rows = $stmt->fetchAll();
        $out = [];
        foreach ($rows as $r) {
            $out[$r['section']] = (int)$r['cnt'];
        }
        echo json_encode(['ok' => true, 'counts' => $out], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Validate section for POST (and GET with section)
    // Allow landing_*, plus known sections
    if ($section === '' || strlen($section) > 64 || !preg_match('/^[a-z0-9_\-]+$/', $section)) {
        http_response_code(400);
        echo json_encode(['error' => 'invalid_section', 'message' => 'بخش نامعتبر'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    // Normalize: allow both "hero" and "landing_hero"
    $section = strtolower($section);

    // Rate limit: 30 per minute per IP, 100 per hour
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    if (!filter_var($ip, FILTER_VALIDATE_IP)) $ip = '0.0.0.0';

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM clicks WHERE ip = :ip AND created_at > datetime('now', '-1 minute')");
    $stmt->execute([':ip' => $ip]);
    if ((int)$stmt->fetchColumn() >= 30) {
        http_response_code(429);
        header('Retry-After: 60');
        echo json_encode(['error' => 'rate_limited'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM clicks WHERE ip = :ip AND created_at > datetime('now', '-1 hour')");
    $stmt->execute([':ip' => $ip]);
    if ((int)$stmt->fetchColumn() >= 200) {
        http_response_code(429);
        header('Retry-After: 3600');
        echo json_encode(['error' => 'rate_limited'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 512);

    if ($method === 'POST') {
        $stmt = $pdo->prepare("INSERT INTO clicks (section, ip, user_agent) VALUES (:section, :ip, :ua)");
        $stmt->execute([':section' => $section, ':ip' => $ip, ':ua' => $ua]);
    }

    // Return total for this section
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM clicks WHERE section = :section");
    $stmt->execute([':section' => $section]);
    $total = (int)$stmt->fetchColumn();

    echo json_encode(['ok' => true, 'section' => $section, 'total' => $total], JSON_UNESCAPED_UNICODE);
    exit;
} catch (Throwable $e) {
    error_log('track.php error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'server_error'], JSON_UNESCAPED_UNICODE);
    exit;
}
