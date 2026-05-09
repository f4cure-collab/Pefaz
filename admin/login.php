<?php
require_once __DIR__ . '/_auth.php';

if (isset($_SESSION['admin_user'])) {
    header('Location: index.php');
    exit;
}

$error = '';
$msg = $_GET['msg'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    $users = load_users();
    $user = null;
    foreach ($users as $u) {
        if (($u['username'] ?? '') === $username) {
            $user = $u;
            break;
        }
    }

    if ($user && password_verify($password, $user['password_hash'] ?? '')) {
        // Login OK — regenera sessão pra evitar fixation
        session_regenerate_id(true);
        $_SESSION['admin_user'] = $user['username'];
        $_SESSION['admin_name'] = $user['name'] ?? $user['username'];
        $_SESSION['last_activity'] = time();
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        header('Location: index.php');
        exit;
    } else {
        $error = 'Usuário ou senha inválidos.';
        sleep(1); // pequena espera contra brute force
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login — Allaser Admin</title>
<link rel="stylesheet" href="admin.css">
</head>
<body class="auth-body">
<main class="auth-card">
  <div class="auth-logo">⚡ Allaser Admin</div>
  <h1>Entrar</h1>

  <?php if ($msg === 'timeout'): ?>
    <div class="auth-info">Sua sessão expirou por inatividade. Entre novamente.</div>
  <?php elseif ($msg === 'logout'): ?>
    <div class="auth-info">Você saiu com segurança.</div>
  <?php endif; ?>

  <?php if ($error): ?>
    <div class="auth-error"><?= h($error) ?></div>
  <?php endif; ?>

  <form method="post" autocomplete="off">
    <label>Usuário
      <input name="username" type="text" required autofocus value="<?= h($_POST['username'] ?? '') ?>">
    </label>
    <label>Senha
      <input name="password" type="password" required>
    </label>
    <button type="submit" class="auth-btn">Entrar</button>
  </form>
</main>
</body>
</html>
