<?php
// Phase 5 - stub for Phase 1 SSG build (will be fully implemented in Phase 5)
// Ensures file exists for sitemap / preview checks
header('Content-Type: application/json; charset=utf-8');
http_response_code(501);
echo json_encode(['error' => 'not_implemented', 'phase' => 5], JSON_UNESCAPED_UNICODE);
