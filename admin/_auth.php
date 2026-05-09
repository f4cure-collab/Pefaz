<?php
// Helpers de autenticação. Inclua no topo de toda página protegida.

// Hardening de cookie de sessão (chamado antes de session_start)
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_samesite', 'Lax');

session_start();

const SESSION_TIMEOUT = 3600; // 1 hora de inatividade
const USERS_FILE = __DIR__ . '/users.json';
const DATA_FILE = __DIR__ . '/../assets/data/credenciados.json';
const BACKUPS_DIR = __DIR__ . '/backups';

// Setup nunca rodou? força ele primeiro.
if (!file_exists(USERS_FILE)) {
    if (basename($_SERVER['SCRIPT_NAME']) !== 'setup.php') {
        header('Location: setup.php');
        exit;
    }
    return;
}

// Timeout de sessão
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > SESSION_TIMEOUT)) {
    session_unset();
    session_destroy();
    header('Location: login.php?msg=timeout');
    exit;
}

// Não autenticado? manda pro login (exceto se já está em login/setup)
$script = basename($_SERVER['SCRIPT_NAME']);
if (!isset($_SESSION['admin_user']) && !in_array($script, ['login.php', 'setup.php'], true)) {
    header('Location: login.php');
    exit;
}

// Renova atividade
$_SESSION['last_activity'] = time();

// Token CSRF para formulários
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

// Helpers globais
function csrf_token(): string {
    return $_SESSION['csrf'] ?? '';
}

function csrf_check(): void {
    $token = $_POST['_csrf'] ?? '';
    if (!isset($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $token)) {
        http_response_code(403);
        die('CSRF token inválido. Volta e tenta de novo.');
    }
}

function load_users(): array {
    if (!file_exists(USERS_FILE)) return [];
    $raw = file_get_contents(USERS_FILE);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function save_users(array $users): void {
    $tmp = USERS_FILE . '.tmp';
    file_put_contents($tmp, json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    rename($tmp, USERS_FILE);
    @chmod(USERS_FILE, 0600);
}

function load_credenciados(): array {
    if (!file_exists(DATA_FILE)) return [];
    $raw = file_get_contents(DATA_FILE);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function save_credenciados(array $data): void {
    if (!is_dir(BACKUPS_DIR)) {
        mkdir(BACKUPS_DIR, 0755, true);
    }

    // Backup do estado atual ANTES de sobrescrever
    if (file_exists(DATA_FILE)) {
        $stamp = date('Ymd-His');
        copy(DATA_FILE, BACKUPS_DIR . '/credenciados-' . $stamp . '.json');
    }

    // Mantém apenas os 10 backups mais recentes
    $backups = glob(BACKUPS_DIR . '/credenciados-*.json') ?: [];
    sort($backups);
    while (count($backups) > 10) {
        @unlink(array_shift($backups));
    }

    // Escrita atômica: grava em tmp e faz rename
    $tmp = DATA_FILE . '.tmp';
    file_put_contents($tmp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    rename($tmp, DATA_FILE);
}

function h(?string $s): string {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function current_user_name(): string {
    return $_SESSION['admin_name'] ?? ($_SESSION['admin_user'] ?? '');
}

function current_user_username(): ?string {
    return $_SESSION['admin_user'] ?? null;
}

function find_user(string $username): ?array {
    foreach (load_users() as $u) {
        if (($u['username'] ?? '') === $username) return $u;
    }
    return null;
}

function set_flash(string $type, string $msg): void {
    $_SESSION['flash'] = ['type' => $type, 'msg' => $msg];
}

function consume_flash(): ?array {
    $f = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return $f;
}
