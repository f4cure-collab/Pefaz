<?php
// Proxy seguro para criação de leads na Kommo
// Usado pelas LPs de cursos — status "Entrada LandingPages"
// Chamado via POST pelo formulário da LP

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://novo.allaser.com.br');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ── Configuração ─────────────────────────────────────
define('KOMMO_TOKEN',       'SEU_TOKEN_AQUI'); // preencher manualmente no servidor via cPanel
define('KOMMO_SUBDOMAIN',   'allasercursos');
define('KOMMO_PIPELINE_ID', 13501624);         // pipeline ROBO — fixo
define('KOMMO_STATUS_ID',   104239700);        // Entrada LandingPages (cursos)
define('KOMMO_USER_ID',     14365171);         // responsável padrão
// ─────────────────────────────────────────────────────

$body = json_decode(file_get_contents('php://input'), true);

$nome     = trim($body['nome']     ?? '');
$email    = trim($body['email']    ?? '');
$telefone = trim($body['telefone'] ?? '');
$lp_nome  = trim($body['lp_nome']  ?? '');

if (!$nome || !$email || !$telefone) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Campos obrigatórios ausentes']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'E-mail inválido']);
    exit;
}

$digits = preg_replace('/\D/', '', $telefone);
if (strlen($digits) === 11) {
    $telefone_fmt = '+55' . $digits;
} elseif (strlen($digits) === 13 && substr($digits, 0, 2) === '55') {
    $telefone_fmt = '+' . $digits;
} else {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Telefone inválido']);
    exit;
}

// Tag combinada: "Curso — Nome do Curso" (ou só "Curso" se lp_nome não chegar)
$tag_nome = $lp_nome ? 'Curso — ' . $lp_nome : 'Curso';
$tags = [['name' => $tag_nome]];

$payload = [[
    'name'        => $nome,
    'pipeline_id' => KOMMO_PIPELINE_ID,
    'status_id'   => KOMMO_STATUS_ID,
    'responsible_user_id' => KOMMO_USER_ID,
    '_embedded'   => [
        'tags'     => $tags,
        'contacts' => [[
            'name' => $nome,
            'custom_fields_values' => [
                [
                    'field_code' => 'PHONE',
                    'values'     => [['value' => $telefone_fmt, 'enum_code' => 'WORK']],
                ],
                [
                    'field_code' => 'EMAIL',
                    'values'     => [['value' => $email, 'enum_code' => 'WORK']],
                ],
            ],
        ]],
    ],
]];

$ch = curl_init('https://' . KOMMO_SUBDOMAIN . '.kommo.com/api/v4/leads/complex');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . KOMMO_TOKEN,
        'Content-Type: application/json',
    ],
]);

$response  = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200 || $http_code === 201) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Erro ao criar lead', 'detail' => $response]);
}
