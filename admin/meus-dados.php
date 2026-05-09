<?php
require_once __DIR__ . '/_auth.php';

$me = find_user(current_user_username() ?? '');
if (!$me) {
    header('Location: logout.php');
    exit;
}
$flash = consume_flash();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Meus dados — Allaser Admin</title>
<link rel="stylesheet" href="admin.css">
</head>
<body>

<header class="adm-header">
  <div class="adm-header-inner">
    <div class="adm-brand">⚡ Allaser Admin</div>
    <nav class="adm-nav">
      <a href="index.php" class="adm-nav-link">Credenciados</a>
      <span class="adm-nav-link is-disabled" title="Em breve">Professores</span>
      <a href="usuarios.php" class="adm-nav-link">Usuários</a>
    </nav>
    <div class="adm-userbox">
      <a href="meus-dados.php" class="adm-username is-active" title="Meus dados">👤 <?= h(current_user_name()) ?></a>
      <a href="logout.php" class="adm-logout">Sair</a>
    </div>
  </div>
</header>

<main class="adm-main">

  <div class="adm-page-head">
    <div>
      <h1>Meus dados</h1>
      <p class="muted">Logado como <strong><?= h($me['username'] ?? '') ?></strong></p>
    </div>
  </div>

  <?php if ($flash): ?>
    <div class="adm-flash adm-flash--<?= h($flash['type']) ?>"><?= h($flash['msg']) ?></div>
  <?php endif; ?>

  <form method="post" action="usuario-salvar.php" class="adm-form" autocomplete="off">
    <input type="hidden" name="_csrf" value="<?= h(csrf_token()) ?>">
    <input type="hidden" name="action" value="self_name">
    <h2 style="font-family:'Outfit',sans-serif;font-size:1.1rem;margin-bottom:14px;color:var(--dark-800)">Nome de exibição</h2>
    <div class="adm-form-grid">
      <label class="adm-form-row adm-form-row--full">
        <span>Nome</span>
        <input name="name" type="text" required value="<?= h($me['name'] ?? '') ?>">
      </label>
    </div>
    <div class="adm-form-actions">
      <button type="submit" class="adm-btn adm-btn--primary">Salvar nome</button>
    </div>
  </form>

  <form method="post" action="usuario-salvar.php" class="adm-form" style="margin-top:24px" autocomplete="off">
    <input type="hidden" name="_csrf" value="<?= h(csrf_token()) ?>">
    <input type="hidden" name="action" value="self_password">
    <h2 style="font-family:'Outfit',sans-serif;font-size:1.1rem;margin-bottom:14px;color:var(--dark-800)">Trocar senha</h2>
    <div class="adm-form-grid">
      <label class="adm-form-row adm-form-row--full">
        <span>Senha atual</span>
        <input name="current_password" type="password" required>
      </label>
      <label class="adm-form-row">
        <span>Nova senha <span class="muted">(mín. 8 caracteres)</span></span>
        <input name="new_password" type="password" required minlength="8">
      </label>
      <label class="adm-form-row">
        <span>Confirmar nova senha</span>
        <input name="new_password_confirm" type="password" required minlength="8">
      </label>
    </div>
    <div class="adm-form-actions">
      <button type="submit" class="adm-btn adm-btn--primary">Trocar senha</button>
    </div>
  </form>

</main>

</body>
</html>
