<?php
require_once __DIR__ . '/_auth.php';

$idx = isset($_GET['idx']) ? (int)$_GET['idx'] : null;
$is_edit = $idx !== null;

$credenciados = load_credenciados();
$cred = $is_edit && isset($credenciados[$idx])
    ? $credenciados[$idx]
    : ['nome'=>'', 'registro'=>'', 'estado'=>'', 'cidade'=>'', 'especialidade'=>'', 'email'=>'', 'whatsapp'=>'', 'instagram'=>'', 'site'=>''];

if ($is_edit && !isset($credenciados[$idx])) {
    header('Location: index.php');
    exit;
}

$ufs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
$especialidades = ['Odontologia','Medicina','Fisioterapia','Enfermagem','Veterinária','Medicina Veterinária','Acupuntura','Nutrição','Psicologia','Fonoaudiologia','Biomedicina','Tricologia','Pós Parto','Medicina do Esporte','Medicina Integrativa/ILIB'];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= $is_edit ? 'Editar' : 'Novo' ?> credenciado — Allaser Admin</title>
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
      <h1><?= $is_edit ? 'Editar credenciado' : 'Novo credenciado' ?></h1>
      <p class="muted"><a href="index.php">← Voltar para a lista</a></p>
    </div>
  </div>

  <form method="post" action="salvar.php" class="adm-form">
    <input type="hidden" name="_csrf" value="<?= h(csrf_token()) ?>">
    <input type="hidden" name="action" value="<?= $is_edit ? 'edit' : 'add' ?>">
    <?php if ($is_edit): ?>
      <input type="hidden" name="idx" value="<?= $idx ?>">
    <?php endif; ?>

    <div class="adm-form-grid">
      <label class="adm-form-row adm-form-row--full">
        <span>Nome completo *</span>
        <input name="nome" type="text" required value="<?= h($cred['nome']) ?>" autofocus>
      </label>
      <label class="adm-form-row">
        <span>Registro profissional</span>
        <input name="registro" type="text" value="<?= h($cred['registro']) ?>" placeholder="Ex: CRO 12345">
      </label>
      <label class="adm-form-row">
        <span>Especialidade</span>
        <input name="especialidade" type="text" list="especOpts" value="<?= h($cred['especialidade']) ?>">
        <datalist id="especOpts">
          <?php foreach ($especialidades as $e): ?>
            <option value="<?= h($e) ?>">
          <?php endforeach; ?>
        </datalist>
      </label>
      <label class="adm-form-row">
        <span>Estado (UF)</span>
        <select name="estado">
          <option value="">—</option>
          <?php foreach ($ufs as $uf): ?>
            <option value="<?= $uf ?>" <?= $cred['estado'] === $uf ? 'selected' : '' ?>><?= $uf ?></option>
          <?php endforeach; ?>
        </select>
      </label>
      <label class="adm-form-row">
        <span>Cidade</span>
        <input name="cidade" type="text" value="<?= h($cred['cidade']) ?>">
      </label>
      <label class="adm-form-row">
        <span>Email</span>
        <input name="email" type="email" value="<?= h($cred['email']) ?>" placeholder="email@exemplo.com">
      </label>
      <label class="adm-form-row">
        <span>WhatsApp <span class="muted">(só números, com DDI 55)</span></span>
        <input name="whatsapp" type="text" value="<?= h($cred['whatsapp']) ?>" placeholder="5511999998888" pattern="[0-9]{12,13}">
      </label>
      <label class="adm-form-row adm-form-row--full">
        <span>Instagram</span>
        <input name="instagram" type="url" value="<?= h($cred['instagram']) ?>" placeholder="https://instagram.com/perfil">
      </label>
      <label class="adm-form-row adm-form-row--full">
        <span>Site</span>
        <input name="site" type="url" value="<?= h($cred['site']) ?>" placeholder="https://site.com.br">
      </label>
    </div>

    <div class="adm-form-actions">
      <a href="index.php" class="adm-btn adm-btn--ghost">Cancelar</a>
      <button type="submit" class="adm-btn adm-btn--primary"><?= $is_edit ? 'Salvar alterações' : 'Adicionar credenciado' ?></button>
    </div>
  </form>
</main>

</body>
</html>
