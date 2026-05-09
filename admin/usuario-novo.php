<?php
require_once __DIR__ . '/_auth.php';

$flash = consume_flash();
$prev = $_SESSION['form_prev'] ?? [];
unset($_SESSION['form_prev']);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Novo usuário — Allaser Admin</title>
<link rel="stylesheet" href="admin.css">
</head>
<body>

<header class="adm-header">
  <div class="adm-header-inner">
    <div class="adm-brand">⚡ Allaser Admin</div>
    <nav class="adm-nav">
      <a href="index.php" class="adm-nav-link">Credenciados</a>
      <span class="adm-nav-link is-disabled" title="Em breve">Professores</span>
      <a href="usuarios.php" class="adm-nav-link is-active">Usuários</a>
    </nav>
    <div class="adm-userbox">
      <a href="meus-dados.php" class="adm-username" title="Meus dados">👤 <?= h(current_user_name()) ?></a>
      <a href="logout.php" class="adm-logout">Sair</a>
    </div>
  </div>
</header>

<main class="adm-main">

  <div class="adm-page-head">
    <div>
      <h1>Novo usuário</h1>
      <p class="muted"><a href="usuarios.php">← Voltar para usuários</a></p>
    </div>
  </div>

  <?php if ($flash): ?>
    <div class="adm-flash adm-flash--<?= h($flash['type']) ?>"><?= h($flash['msg']) ?></div>
  <?php endif; ?>

  <form method="post" action="usuario-salvar.php" class="adm-form" autocomplete="off">
    <input type="hidden" name="_csrf" value="<?= h(csrf_token()) ?>">
    <input type="hidden" name="action" value="add">

    <div class="adm-form-grid">
      <label class="adm-form-row">
        <span>Usuário <span class="muted">(letras, números, _ e -)</span></span>
        <input name="username" type="text" required minlength="3" pattern="[a-zA-Z0-9_-]+" value="<?= h($prev['username'] ?? '') ?>" autofocus>
      </label>
      <label class="adm-form-row">
        <span>Nome de exibição</span>
        <input name="name" type="text" value="<?= h($prev['name'] ?? '') ?>" placeholder="Ex: Rodrigo">
      </label>
      <label class="adm-form-row">
        <span>Senha provisória <span class="muted">(mín. 8 caracteres)</span></span>
        <input name="password" type="password" required minlength="8">
      </label>
      <label class="adm-form-row">
        <span>Confirmar senha</span>
        <input name="password_confirm" type="password" required minlength="8">
      </label>
    </div>

    <p class="muted" style="margin-top:18px;font-size:0.82rem">
      💡 <strong>Dica</strong>: cria com uma senha provisória, manda pra essa pessoa, e peça pra ela trocar em "Meus dados" no primeiro login.
    </p>

    <div class="adm-form-actions">
      <a href="usuarios.php" class="adm-btn adm-btn--ghost">Cancelar</a>
      <button type="submit" class="adm-btn adm-btn--primary">Criar usuário</button>
    </div>
  </form>
</main>

</body>
</html>
