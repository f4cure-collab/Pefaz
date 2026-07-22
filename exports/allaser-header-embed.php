<?php
/* ═══════════════════════════════════════════════════════════════════════════
   ALLASER — Header embed autocontido
   Cole este arquivo em cursos.allaser.com.br e inclua-o no topo do <body>
   das paginas de checkout (ex: include __DIR__ . '/allaser-header-embed.php';).

   • Nao depende de nenhum CSS/JS externo do site novo.allaser.com.br
   • Todas as classes tem prefixo .al- pra nao colidir com o CSS existente
   • Todos os assets (logo, fontes) usam URL absoluta apontando pra
     https://novo.allaser.com.br — funciona em qualquer dominio
   • Cookies com Domain=.allaser.com.br sao compartilhados entre novo.allaser
     e cursos.allaser — o mesmo login vale nos dois

   COMO PREENCHER O ESTADO DO USUARIO LOGADO
   -----------------------------------------
   Se o checkout ja souber quem esta logado (via sessao PHP), preencha
   as variaveis abaixo. Caso contrario deixe null — o header mostra
   botao "Entrar" apontando pra pagina de login do site principal.

   $al_user_name  = 'Facure';      // primeiro nome (aparece ao lado do avatar)
   $al_user_email = 'x@y.com';     // aparece no menu suspenso
   $al_cart_count = 3;             // numero no badge do carrinho
═══════════════════════════════════════════════════════════════════════════ */

$al_user_name  = $al_user_name  ?? null;
$al_user_email = $al_user_email ?? null;
$al_cart_count = $al_cart_count ?? 0;
$al_site       = 'https://novo.allaser.com.br';

$al_initial = $al_user_name ? mb_strtoupper(mb_substr(trim($al_user_name), 0, 1)) : '';
?>
<!-- ══════════════════ ALLASER HEADER — inicio ══════════════════ -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">

<style>
/* Reset defensivo — protege o header do CSS da pagina hospedeira */
.al-header-wrap, .al-header-wrap *,
.al-header-wrap *::before, .al-header-wrap *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.al-header-wrap a { text-decoration: none; color: inherit; }
.al-header-wrap ul { list-style: none; }
.al-header-wrap button { border: none; background: none; cursor: pointer; font-family: inherit; }
.al-header-wrap svg { display: inline-block; vertical-align: middle; }

/* Tokens */
.al-header-wrap {
  --al-lime:        #c9dc44;
  --al-lime-light:  #d8ec5a;
  --al-lime-dark:   #9aaa1a;
  --al-lime-subtle: rgba(201,220,68,0.09);
  --al-dark-900: #111111;
  --al-dark-800: #1A1A1A;
  --al-dark-700: #222222;
  --al-dark-600: #2D2D2D;
  --al-gray-500: #6B6B6B;
  --al-gray-400: #8E8E8E;
  --al-gray-300: #AAA;
  --al-gray-200: #D0D0D0;
  --al-gray-100: #E8E8E8;
  --al-gray-50:  #F5F5F5;
  --al-white:    #FFF;
  --al-ease:     cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --al-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --al-radius-xs: 6px;
  --al-radius-sm: 8px;
  --al-radius-md: 12px;
  --al-radius-full: 999px;
}

/* Topbar preto */
.al-topbar { background: var(--al-dark-900); border-bottom: 1px solid rgba(255,255,255,0.04); }
.al-topbar__inner { max-width: 1260px; margin: 0 auto; padding: 0 32px; height: 38px; display: flex; justify-content: space-between; align-items: center; }
.al-topbar__left { display: flex; align-items: center; gap: 28px; }
.al-topbar__item { display: inline-flex; align-items: center; gap: 7px; font-size: 0.76rem; font-weight: 500; color: rgba(255,255,255,0.45); transition: color 0.2s; }
.al-topbar__item:hover { color: var(--al-lime); }
.al-topbar__item svg { width: 12px; height: 12px; }
.al-topbar__right { display: flex; align-items: center; gap: 2px; }
.al-topbar__social { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: var(--al-radius-xs); color: rgba(255,255,255,0.3); transition: all 0.2s; }
.al-topbar__social:hover { color: var(--al-lime); background: rgba(255,255,255,0.05); }
.al-topbar__social svg { width: 13px; height: 13px; }

/* Header branco sticky */
.al-header {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  position: sticky; top: 0; z-index: 1000;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  transition: box-shadow 0.3s var(--al-ease), border-color 0.3s var(--al-ease);
}
.al-header.al-scrolled { box-shadow: 0 1px 20px rgba(0,0,0,0.08); border-bottom-color: transparent; }
.al-header__inner { max-width: 1260px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 68px; }

.al-logo { display: flex; align-items: center; flex-shrink: 0; }
.al-logo__img { height: 42px; width: auto; object-fit: contain; display: block; }

.al-nav { display: flex; align-items: center; gap: 1px; }
.al-nav__link {
  display: inline-flex; align-items: center;
  padding: 8px 15px; font-size: 0.86rem; font-weight: 500;
  color: var(--al-gray-500); border-radius: var(--al-radius-sm);
  transition: all 0.2s var(--al-ease); white-space: nowrap; cursor: pointer;
  position: relative;
}
.al-nav__link:hover { color: var(--al-dark-600); background: var(--al-gray-50); }
.al-nav__link--active { color: var(--al-dark-900); font-weight: 600; }
.al-nav__link--active::after {
  content: ''; position: absolute; bottom: -1px; left: 15px; right: 15px;
  height: 2px; background: var(--al-lime); border-radius: 2px;
}

/* Acoes: carrinho + user + WhatsApp */
.al-header__actions { display: flex; align-items: center; gap: 10px; }

.al-btn-cart {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid var(--al-gray-200);
  background: #fff; color: var(--al-dark-700); cursor: pointer;
  transition: all 0.18s ease; text-decoration: none;
}
.al-btn-cart:hover { border-color: var(--al-lime-dark); color: var(--al-lime-dark); background: var(--al-lime-subtle); }
.al-btn-cart svg { width: 18px; height: 18px; }
.al-cart-badge {
  position: absolute; top: -4px; right: -4px;
  min-width: 18px; height: 18px; padding: 0 5px;
  background: var(--al-lime); color: var(--al-dark-900);
  font-family: 'Outfit', sans-serif; font-size: 0.68rem; font-weight: 800;
  border-radius: 999px; display: none;
  align-items: center; justify-content: center;
  border: 2px solid #fff; line-height: 1;
}
.al-cart-badge.al-visible { display: inline-flex; }

.al-user { position: relative; }
.al-user-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 12px; border-radius: 999px; border: 1.5px solid var(--al-gray-200);
  background: #fff; color: var(--al-dark-700); cursor: pointer;
  font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 600;
  transition: all 0.18s ease; white-space: nowrap;
}
.al-user-btn:hover { border-color: var(--al-lime-dark); color: var(--al-lime-dark); background: var(--al-lime-subtle); }
.al-user-btn svg { width: 15px; height: 15px; }
.al-user-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--al-lime); color: var(--al-dark-900);
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'Outfit', sans-serif; font-size: 0.78rem; font-weight: 800;
  text-transform: uppercase;
}
.al-user-menu {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: #fff; border: 1px solid var(--al-gray-100);
  border-radius: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  padding: 8px; min-width: 220px; z-index: 1100;
  display: none;
}
.al-user-menu.al-open { display: block; }
.al-user-menu__item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 8px;
  font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 600;
  color: var(--al-dark-700); text-decoration: none;
  transition: background 0.15s;
}
.al-user-menu__item:hover { background: var(--al-gray-50); color: var(--al-lime-dark); }
.al-user-menu__item svg { width: 15px; height: 15px; flex-shrink: 0; }
.al-user-menu__divider { height: 1px; background: var(--al-gray-100); margin: 6px 0; }
.al-user-menu__label {
  padding: 8px 12px; font-size: 0.7rem;
  color: var(--al-gray-400); font-weight: 500;
  display: flex; flex-direction: column; gap: 2px;
}
.al-user-menu__label strong { color: var(--al-dark-800); font-weight: 700; word-break: break-all; }

.al-btn-wa {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 20px; font-size: 0.82rem; font-weight: 600;
  background: #25D366; color: #fff; border-radius: var(--al-radius-full);
  box-shadow: 0 2px 12px rgba(37,211,102,0.25);
  transition: all 0.25s var(--al-ease); white-space: nowrap; text-decoration: none;
}
.al-btn-wa:hover { background: #1fbe5b; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(37,211,102,0.35); }
.al-btn-wa svg { width: 16px; height: 16px; }

/* Hamburger */
.al-hamburger { display: none; width: 44px; height: 44px; flex-direction: column; align-items: center; justify-content: center; gap: 5px; border-radius: var(--al-radius-sm); z-index: 1100; }
.al-hamburger:active { background: var(--al-gray-50); }
.al-hamburger__line { width: 21px; height: 2px; background: var(--al-dark-700); border-radius: 99px; transition: all 0.4s cubic-bezier(0.68,-0.6,0.32,1.6); transform-origin: center; }
.al-hamburger.al-open .al-hamburger__line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.al-hamburger.al-open .al-hamburger__line:nth-child(2) { opacity: 0; transform: scaleX(0); }
.al-hamburger.al-open .al-hamburger__line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile overlay */
.al-mobile-overlay { position: fixed; inset: 0; z-index: 1050; pointer-events: none; }
.al-mobile-overlay.al-open { pointer-events: auto; }
.al-mobile-overlay__bg { position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); opacity: 0; transition: opacity 0.35s; }
.al-mobile-overlay.al-open .al-mobile-overlay__bg { opacity: 1; }
.al-mobile-panel { position: absolute; top: 0; right: 0; width: min(400px, 92vw); height: 100%; background: #fff; box-shadow: -8px 0 40px rgba(0,0,0,0.15); transform: translateX(100%); transition: transform 0.5s var(--al-ease-out); display: flex; flex-direction: column; }
.al-mobile-overlay.al-open .al-mobile-panel { transform: translateX(0); }
.al-mobile-panel__head { padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--al-gray-100); flex-shrink: 0; }
.al-mobile-panel__logo { height: 34px; width: auto; display: block; }
.al-mobile-panel__close { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: var(--al-radius-sm); color: var(--al-gray-400); transition: all 0.2s; }
.al-mobile-panel__close:hover { background: var(--al-gray-50); color: var(--al-dark-600); }
.al-mobile-panel__close svg { width: 20px; height: 20px; }
.al-mobile-panel__body { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 12px 16px; }
.al-mnav__link { display: flex; align-items: center; padding: 14px 14px; font-size: 0.94rem; font-weight: 600; color: var(--al-dark-700); border-radius: var(--al-radius-sm); transition: all 0.15s; text-decoration: none; }
.al-mnav__link:hover { background: var(--al-lime-subtle); color: var(--al-lime-dark); }
.al-mobile-panel__foot { padding: 18px 22px; border-top: 1px solid var(--al-gray-100); flex-shrink: 0; display: flex; flex-direction: column; gap: 10px; }
.al-mobile-cta { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px; border-radius: var(--al-radius-md); font-size: 0.88rem; font-weight: 600; transition: all 0.2s; text-decoration: none; background: #25D366; color: #fff; }
.al-mobile-cta:hover { background: #1fbe5b; }
.al-mobile-cta svg { width: 18px; height: 18px; }
.al-mobile-panel__meta { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; }
.al-mobile-panel__address { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--al-gray-400); }
.al-mobile-panel__address svg { width: 12px; height: 12px; flex-shrink: 0; }
.al-mobile-panel__socials { display: flex; gap: 6px; }
.al-mobile-panel__social { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: var(--al-radius-sm); background: var(--al-gray-50); color: var(--al-gray-400); transition: all 0.2s; }
.al-mobile-panel__social:hover { background: var(--al-lime-subtle); color: var(--al-lime-dark); }
.al-mobile-panel__social svg { width: 14px; height: 14px; }

/* Responsivo */
@media (max-width: 1080px) {
  .al-nav { display: none; }
  .al-hamburger { display: flex; }
}
@media (max-width: 900px) {
  .al-user-btn-label { display: none; }
  .al-user-btn { padding: 6px; border-radius: 50%; width: 40px; height: 40px; justify-content: center; }
}
@media (max-width: 640px) {
  .al-topbar { display: none; }
  .al-header__inner { height: 60px; padding: 0 18px; }
  .al-logo__img { height: 34px; }
  .al-btn-wa { display: none; }
}
@media (max-width: 400px) {
  .al-mobile-panel { width: 100vw; }
}
</style>

<div class="al-header-wrap">

  <div class="al-topbar">
    <div class="al-topbar__inner">
      <div class="al-topbar__left">
        <a href="https://api.whatsapp.com/send?phone=5519984231452" class="al-topbar__item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>(19) 98423-1452</span>
        </a>
        <a href="https://g.page/allasercursos?share" class="al-topbar__item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Cambuí, Campinas - SP</span>
        </a>
      </div>
      <div class="al-topbar__right">
        <a href="https://www.facebook.com/allasercursos/" class="al-topbar__social" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
        <a href="https://www.instagram.com/allasercursos/" class="al-topbar__social" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
        <a href="https://www.youtube.com/channel/UCi2XzOh-qyQVbvzp-dhlXwQ" class="al-topbar__social" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/></svg></a>
        <a href="https://t.me/joinchat/RyIIC3EHIik_JZIA" class="al-topbar__social" aria-label="Telegram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>
      </div>
    </div>
  </div>

  <header class="al-header" id="alHeader">
    <div class="al-header__inner">
      <a href="<?= $al_site ?>/index.html" class="al-logo">
        <img src="<?= $al_site ?>/assets/images/logo-allaser.webp" alt="Allaser" class="al-logo__img">
      </a>

      <nav class="al-nav" aria-label="Navegação principal">
        <a href="<?= $al_site ?>/index.html"           class="al-nav__link">Home</a>
        <a href="<?= $al_site ?>/sobre.html"           class="al-nav__link">Quem Somos</a>
        <a href="<?= $al_site ?>/sobre-o-laser.html"   class="al-nav__link">Sobre o Laser</a>
        <a href="<?= $al_site ?>/blog.html"            class="al-nav__link">Blog</a>
        <a href="<?= $al_site ?>/encontre.html"        class="al-nav__link">Encontre um Profissional</a>
      </nav>

      <div class="al-header__actions">

        <!-- Carrinho -->
        <a href="<?= $al_site ?>/carrinho.html" class="al-btn-cart" aria-label="Carrinho">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span class="al-cart-badge <?= $al_cart_count > 0 ? 'al-visible' : '' ?>" id="alCartBadge"><?= $al_cart_count > 99 ? '99+' : (int)$al_cart_count ?></span>
        </a>

        <!-- Usuario -->
        <div class="al-user" id="alUser">
        <?php if ($al_user_name): ?>
          <button type="button" class="al-user-btn" id="alUserBtn" aria-haspopup="true" aria-expanded="false">
            <span class="al-user-avatar"><?= htmlspecialchars($al_initial, ENT_QUOTES, 'UTF-8') ?></span>
            <span class="al-user-btn-label"><?= htmlspecialchars(explode(' ', trim($al_user_name))[0], ENT_QUOTES, 'UTF-8') ?></span>
          </button>
          <div class="al-user-menu" id="alUserMenu" role="menu">
            <div class="al-user-menu__label">Logado como <strong><?= htmlspecialchars((string)$al_user_email, ENT_QUOTES, 'UTF-8') ?></strong></div>
            <div class="al-user-menu__divider"></div>
            <a class="al-user-menu__item" href="https://cursos.allaser.com.br/account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Área do aluno
            </a>
            <a class="al-user-menu__item" href="https://cursos.allaser.com.br/my/orders">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Minhas compras
            </a>
            <a class="al-user-menu__item" href="<?= $al_site ?>/carrinho.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Meu carrinho
            </a>
            <div class="al-user-menu__divider"></div>
            <a class="al-user-menu__item" href="https://cursos.allaser.com.br/web/session/logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sair
            </a>
          </div>
        <?php else: ?>
          <a class="al-user-btn" href="<?= $al_site ?>/index.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span class="al-user-btn-label">Entrar</span>
          </a>
        <?php endif; ?>
        </div>

        <!-- WhatsApp -->
        <a href="https://api.whatsapp.com/send?phone=5519984231452&text=Ol%C3%A1,%20estou%20em%20seu%20site%20e%20gostaria%20de%20tirar%20uma%20duvida!!" class="al-btn-wa">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          <span>WhatsApp</span>
        </a>

        <button class="al-hamburger" id="alHamburger" aria-label="Abrir menu" aria-expanded="false">
          <span class="al-hamburger__line"></span>
          <span class="al-hamburger__line"></span>
          <span class="al-hamburger__line"></span>
        </button>
      </div>
    </div>
  </header>

  <div class="al-mobile-overlay" id="alMobileOverlay" role="dialog" aria-modal="true">
    <div class="al-mobile-overlay__bg" id="alOverlayBg"></div>
    <div class="al-mobile-panel">
      <div class="al-mobile-panel__head">
        <img src="<?= $al_site ?>/assets/images/logo-allaser.webp" alt="Allaser" class="al-mobile-panel__logo">
        <button class="al-mobile-panel__close" id="alMobileClose" aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="al-mobile-panel__body">
        <a href="<?= $al_site ?>/index.html"         class="al-mnav__link">Home</a>
        <a href="<?= $al_site ?>/sobre.html"         class="al-mnav__link">Quem Somos</a>
        <a href="<?= $al_site ?>/sobre-o-laser.html" class="al-mnav__link">Sobre o Laser</a>
        <a href="<?= $al_site ?>/blog.html"          class="al-mnav__link">Blog</a>
        <a href="<?= $al_site ?>/encontre.html"      class="al-mnav__link">Encontre um Profissional</a>
      </div>
      <div class="al-mobile-panel__foot">
        <a href="https://api.whatsapp.com/send?phone=5519984231452" class="al-mobile-cta">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          Fale pelo WhatsApp
        </a>
        <div class="al-mobile-panel__meta">
          <span class="al-mobile-panel__address">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Cambuí, Campinas - SP
          </span>
          <div class="al-mobile-panel__socials">
            <a href="https://www.facebook.com/allasercursos/" class="al-mobile-panel__social" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="https://www.instagram.com/allasercursos/" class="al-mobile-panel__social" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            <a href="https://www.youtube.com/channel/UCi2XzOh-qyQVbvzp-dhlXwQ" class="al-mobile-panel__social" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/></svg></a>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>

<script>
(function(){
  /* Sombra ao rolar */
  var h = document.getElementById('alHeader');
  if (h) window.addEventListener('scroll', function(){
    h.classList.toggle('al-scrolled', window.scrollY > 20);
  }, { passive: true });

  /* Menu mobile */
  var ham = document.getElementById('alHamburger');
  var ov  = document.getElementById('alMobileOverlay');
  var bg  = document.getElementById('alOverlayBg');
  var cls = document.getElementById('alMobileClose');
  function open(){ ham.classList.add('al-open'); ov.classList.add('al-open'); ham.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; }
  function close(){ ham.classList.remove('al-open'); ov.classList.remove('al-open'); ham.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
  if (ham) ham.addEventListener('click', open);
  if (cls) cls.addEventListener('click', close);
  if (bg)  bg.addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if (e.key==='Escape' && ov && ov.classList.contains('al-open')) close(); });

  /* Dropdown do usuario */
  var ubtn = document.getElementById('alUserBtn');
  var umenu = document.getElementById('alUserMenu');
  if (ubtn && umenu) {
    ubtn.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = umenu.classList.toggle('al-open');
      ubtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', function(e){
      if (!umenu.contains(e.target) && !ubtn.contains(e.target)) {
        umenu.classList.remove('al-open');
        ubtn.setAttribute('aria-expanded','false');
      }
    });
  }
})();
</script>
<!-- ══════════════════ ALLASER HEADER — fim ══════════════════ -->
