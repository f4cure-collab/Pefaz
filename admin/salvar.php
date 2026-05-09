<?php
require_once __DIR__ . '/_auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method not allowed');
}

csrf_check();

$action = $_POST['action'] ?? '';
$data = load_credenciados();
$flash = '';

if ($action === 'add') {
    $data[] = collect_fields($_POST);
    $flash = 'add';
} elseif ($action === 'edit') {
    $idx = (int)($_POST['idx'] ?? -1);
    if ($idx >= 0 && $idx < count($data)) {
        $data[$idx] = collect_fields($_POST);
        $flash = 'edit';
    }
} elseif ($action === 'delete') {
    $idx = (int)($_POST['idx'] ?? -1);
    if ($idx >= 0 && $idx < count($data)) {
        array_splice($data, $idx, 1);
        $flash = 'del';
    }
} else {
    http_response_code(400);
    die('Ação inválida.');
}

save_credenciados($data);

header('Location: index.php?ok=' . urlencode($flash));
exit;

function collect_fields(array $post): array {
    return [
        'nome'          => trim($post['nome'] ?? ''),
        'registro'      => trim($post['registro'] ?? ''),
        'estado'        => trim($post['estado'] ?? ''),
        'cidade'        => trim($post['cidade'] ?? ''),
        'especialidade' => trim($post['especialidade'] ?? ''),
        'email'         => trim($post['email'] ?? ''),
        'whatsapp'      => preg_replace('/\D/', '', $post['whatsapp'] ?? ''),
        'instagram'     => trim($post['instagram'] ?? ''),
        'site'          => trim($post['site'] ?? ''),
    ];
}
