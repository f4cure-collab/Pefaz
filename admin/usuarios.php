<?php
require_once __DIR__ . '/_auth.php';

$users = load_users();
$me = current_user_username();
$flash = consume_flash();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Usuários — Allaser Admin</title>
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
      <h1>Usuários</h1>
      <p class="muted"><?= count($users) ?> <?= count($users) === 1 ? 'pessoa com acesso ao admin' : 'pessoas com acesso ao admin' ?></p>
    </div>
    <a href="usuario-novo.php" class="adm-btn adm-btn--primary">+ Novo usuário</a>
  </div>

  <?php if ($flash): ?>
    <div class="adm-flash adm-flash--<?= h($flash['type']) ?>"><?= h($flash['msg']) ?></div>
  <?php endif; ?>

  <div class="adm-table-wrap">
    <table class="adm-table">
      <thead>
        <tr>
          <th>Usuário</th>
          <th>Nome</th>
          <th>Função</th>
          <th>Criado em</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($users as $u): ?>
          <?php $is_me = ($u['username'] ?? '') === $me; ?>
          <tr>
            <td class="adm-cell-name">
              <?= h($u['username'] ?? '') ?>
              <?php if ($is_me): ?> <span class="adm-tag" style="margin-left:6px">Você</span><?php endif; ?>
            </td>
            <td><?= h($u['name'] ?? '') ?></td>
            <td><span class="adm-tag"><?= h($u['role'] ?? 'admin') ?></span></td>
            <td class="muted"><?= h($u['created_at'] ?? '—') ?></td>
            <td class="adm-actions">
              <?php if ($is_me): ?>
                <a href="meus-dados.php" class="adm-action-edit">Trocar minha senha</a>
              <?php elseif (count($users) <= 1): ?>
                <span class="muted" style="font-size:0.78rem">único usuário</span>
              <?php else: ?>
                <form method="post" action="usuario-salvar.php" onsubmit="return confirm('Remover acesso de <?= h($u['username'] ?? '') ?>?');" style="display:inline">
                  <input type="hidden" name="_csrf" value="<?= h(csrf_token()) ?>">
                  <input type="hidden" name="action" value="delete">
                  <input type="hidden" name="username" value="<?= h($u['username'] ?? '') ?>">
                  <button type="submit" class="adm-action-del">Remover</button>
                </form>
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>

</main>

</body>
</html>
