<?php
require_once __DIR__ . '/_auth.php';

$error = '';
$success = false;

// Setup já feito? bloqueia.
$existing = load_users();
if (count($existing) > 0) {
    http_response_code(403);
    die('<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;max-width:600px;margin:auto"><h1>Setup já foi executado</h1><p>Para entrar, vai em <a href="login.php">login.php</a>.</p><p>Para adicionar mais usuários, abra <code>users.json</code> e adicione manualmente, ou peça pra eu construir a tela de gerenciamento de usuários.</p></body></html>');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $name     = trim($_POST['name'] ?? '');

    if (strlen($username) < 3) {
        $error = 'Usuário precisa ter ao menos 3 caracteres.';
    } elseif (!preg_match('/^[a-zA-Z0-9_-]+$/', $username)) {
        $error = 'Usuário só pode ter letras, números, _ e -.';
    } elseif (strlen($password) < 8) {
        $error = 'Senha precisa ter ao menos 8 caracteres.';
    } else {
        $hash = password_hash($password, PASSWORD_BCRYPT);
        save_users([[
            'username'      => $username,
            'password_hash' => $hash,
            'name'          => $name ?: $username,
            'role'          => 'admin',
            'created_at'    => date('Y-m-d H:i:s'),
        ]]);
        $success = true;
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Setup inicial — Allaser Admin</title>
<link rel="stylesheet" href="admin.css">
</head>
<body class="auth-body">
<main class="auth-card">
  <div class="auth-logo">⚡ Allaser Admin</div>

  <?php if ($success): ?>
    <div class="auth-success-icon">✓</div>
    <h1>Pronto!</h1>
    <p class="muted">Conta de administrador criada com sucesso.</p>
    <p class="muted" style="margin-top:14px;font-size:0.85rem">
      <strong>Importante</strong>: por segurança, <strong>delete o arquivo <code>setup.php</code></strong> do servidor agora.
      Enquanto ele existir e <code>users.json</code> também existir, o setup já está bloqueado, mas removê-lo é uma camada a mais de proteção.
    </p>
    <a href="login.php" class="auth-btn">Ir para o login →</a>
  <?php else: ?>
    <h1>Bem-vindo!</h1>
    <p class="muted">Esta é a primeira execução. Crie a conta principal de administrador. Depois de criar, esta página fica bloqueada.</p>

    <?php if ($error): ?>
      <div class="auth-error"><?= h($error) ?></div>
    <?php endif; ?>

    <form method="post" autocomplete="off">
      <label>Usuário (3+ caracteres, sem espaço)
        <input name="username" type="text" required minlength="3" pattern="[a-zA-Z0-9_-]+" value="<?= h($_POST['username'] ?? '') ?>" autofocus>
      </label>
      <label>Nome de exibição (opcional)
        <input name="name" type="text" value="<?= h($_POST['name'] ?? '') ?>" placeholder="Ex: Facure">
      </label>
      <label>Senha (mínimo 8 caracteres)
        <input name="password" type="password" required minlength="8">
      </label>
      <button type="submit" class="auth-btn">Criar admin</button>
    </form>
  <?php endif; ?>
</main>
</body>
</html>
