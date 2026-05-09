<?php
require_once __DIR__ . '/_auth.php';

$credenciados = load_credenciados();
$total = count($credenciados);
$flash = $_GET['ok'] ?? '';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Credenciados — Allaser Admin</title>
<link rel="stylesheet" href="admin.css">
</head>
<body>

<header class="adm-header">
  <div class="adm-header-inner">
    <div class="adm-brand">⚡ Allaser Admin</div>
    <nav class="adm-nav">
      <a href="index.php" class="adm-nav-link is-active">Credenciados</a>
      <span class="adm-nav-link is-disabled" title="Em breve">Professores</span>
      <a href="usuarios.php" class="adm-nav-link">Usuários</a>
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
      <h1>Credenciados</h1>
      <p class="muted"><?= $total ?> <?= $total === 1 ? 'profissional cadastrado' : 'profissionais cadastrados' ?></p>
    </div>
    <a href="editar.php" class="adm-btn adm-btn--primary">+ Novo credenciado</a>
  </div>

  <?php if ($flash === 'add'): ?>
    <div class="adm-flash">✓ Credenciado adicionado.</div>
  <?php elseif ($flash === 'edit'): ?>
    <div class="adm-flash">✓ Alterações salvas.</div>
  <?php elseif ($flash === 'del'): ?>
    <div class="adm-flash">✓ Credenciado removido.</div>
  <?php endif; ?>

  <div class="adm-toolbar">
    <input type="search" id="searchBox" placeholder="🔍 Buscar por nome, cidade, estado, especialidade..." class="adm-search">
  </div>

  <div class="adm-table-wrap">
    <table class="adm-table" id="credTable">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Registro</th>
          <th>UF</th>
          <th>Cidade</th>
          <th>Especialidade</th>
          <th>Contato</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($credenciados)): ?>
          <tr><td colspan="7" class="adm-empty">Nenhum credenciado cadastrado ainda. <a href="editar.php">Adicionar o primeiro</a>.</td></tr>
        <?php else: ?>
          <?php foreach ($credenciados as $i => $c): ?>
            <tr>
              <td class="adm-cell-name"><?= h($c['nome'] ?? '') ?></td>
              <td class="muted"><?= h($c['registro'] ?? '') ?></td>
              <td><?= h($c['estado'] ?? '') ?></td>
              <td><?= h($c['cidade'] ?? '') ?></td>
              <td>
                <?php if (!empty($c['especialidade'])): ?>
                  <span class="adm-tag"><?= h($c['especialidade']) ?></span>
                <?php endif; ?>
              </td>
              <td class="adm-contact-cell">
                <?php if (!empty($c['email'])): ?><a href="mailto:<?= h($c['email']) ?>" title="Email">✉</a><?php endif; ?>
                <?php if (!empty($c['whatsapp'])): ?><a href="https://wa.me/<?= h($c['whatsapp']) ?>" target="_blank" title="WhatsApp">📱</a><?php endif; ?>
                <?php if (!empty($c['instagram'])): ?><a href="<?= h($c['instagram']) ?>" target="_blank" title="Instagram">📷</a><?php endif; ?>
              </td>
              <td class="adm-actions">
                <a href="editar.php?idx=<?= $i ?>" class="adm-action-edit">Editar</a>
                <form method="post" action="salvar.php" onsubmit="return confirm('Remover <?= h($c['nome'] ?? '') ?>?');" style="display:inline">
                  <input type="hidden" name="_csrf" value="<?= h(csrf_token()) ?>">
                  <input type="hidden" name="action" value="delete">
                  <input type="hidden" name="idx" value="<?= $i ?>">
                  <button type="submit" class="adm-action-del">Remover</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>

</main>

<script>
// Filtro client-side
(function() {
  var search = document.getElementById('searchBox');
  var rows = document.querySelectorAll('#credTable tbody tr');
  if (!search) return;
  search.addEventListener('input', function() {
    var q = this.value.toLowerCase().trim();
    rows.forEach(function(r) {
      r.style.display = (r.textContent.toLowerCase().indexOf(q) === -1) ? 'none' : '';
    });
  });
})();
</script>

</body>
</html>
