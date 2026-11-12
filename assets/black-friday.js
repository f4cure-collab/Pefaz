/* ═══════════════════════════════════════════════════════════════════════
   ALLBLACK — chave do tema escuro de campanha

   Carregar SÍNCRONO no <head>, antes do CSS da página. Rodando antes do
   primeiro paint, o atributo data-bf já está no <html> quando o navegador
   pinta — sem piscar branco.

   COMO LIGAR PARA O PÚBLICO: trocar ATIVO para true, publicar. Fim.
   COMO DESLIGAR:             trocar ATIVO para false, publicar. Fim.

   COMO TESTAR SEM NINGUÉM VER:
     allaser.com.br/black-friday  → liga a pré-visualização neste navegador
     qualquer página + ?bf=on     → idem
     qualquer página + ?bf=off    → desliga

   A pré-visualização vive num cookie do navegador de quem ligou: ninguém
   mais vê o site escuro enquanto ATIVO for false.
═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ───────────────────────────────────────────────────────────────
     A CHAVE. Isto é a única linha que muda para a campanha entrar
     no ar para todo mundo.
     ─────────────────────────────────────────────────────────────── */
  var ATIVO = false;

  /* Texto da faixa do topo. */
  var FAIXA = 'ALLBLACK · A BLACK FRIDAY DA ALLASER CHEGOU';
  var FAIXA_LINK = '/index#cursos-home';
  var FAIXA_LINK_TXT = 'Ver cursos em oferta';

  /* A faixa de desconto dos cartões de curso NÃO é mais deste arquivo:
     vem do sistema, no campo "campanha" de cada curso, e é desenhada pela
     home (cardHtml em index.html) com ou sem o tema ligado. */

  var COOKIE = 'allaser_bf_preview';
  var html = document.documentElement;

  /* ── 1. Decidir o modo (roda no <head>, antes do paint) ────────── */

  function temCookie() {
    return document.cookie.indexOf(COOKIE + '=1') !== -1;
  }

  function gravaCookie(on) {
    // 30 dias ligado; data no passado apaga.
    var exp = on
      ? new Date(Date.now() + 2592000000).toUTCString()
      : 'Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = COOKIE + '=' + (on ? '1' : '') +
      ';expires=' + exp + ';path=/;SameSite=Lax';
  }

  var busca = window.location.search || '';
  if (/[?&]bf=on(&|$)/.test(busca)) { gravaCookie(true); }
  else if (/[?&]bf=off(&|$)/.test(busca)) { gravaCookie(false); }

  var modo = ATIVO ? 'live' : (temCookie() ? 'preview' : null);
  if (!modo) return;              // tema desligado: nada daqui pra baixo roda
  html.setAttribute('data-bf', modo);

  /* O CSS do tema so e pedido quando o tema esta LIGADO. As paginas nao tem
     <link> para ele: com o tema desligado, ninguem baixa o black-friday.css.
     document.write, vindo de um script sincrono no <head>, faz o navegador
     tratar a folha como qualquer <link> do HTML: ela bloqueia a pintura e a
     pagina ja aparece escura, sem piscar clara antes. Se este script um dia
     for carregado com async/defer, document.write apagaria a pagina — dai a
     checagem e o plano B por createElement. */
  if (!document.querySelector('link[href*="black-friday.css"]')) {
    var eu = document.currentScript;
    if (document.readyState === 'loading' && eu && !eu.async && !eu.defer) {
      document.write('<link rel="stylesheet" href="/assets/black-friday.css">');
    } else {
      var folha = document.createElement('link');
      folha.rel = 'stylesheet';
      folha.href = '/assets/black-friday.css';
      document.head.appendChild(folha);
    }
  }

  /* Barra do navegador no celular acompanha o tema. */
  var corTema = document.querySelector('meta[name="theme-color"]');
  if (!corTema) {
    corTema = document.createElement('meta');
    corTema.name = 'theme-color';
    document.head.appendChild(corTema);
  }
  corTema.content = '#000000';

  /* Na home, a hero ALLBLACK tem duas imagens que sao a primeira dobra.
     Pedi-las daqui, do <head>, evita esperar o parser chegar nelas.
     So acontece com o tema ligado: visitante do site claro nao baixa nada. */
  var NA_HOME = /^\/(index(\.html)?)?$/.test(window.location.pathname);
  if (NA_HOME) {
    var retrato = window.matchMedia && window.matchMedia('(max-width:760px)').matches;
    var pre = [
      '/assets/images/black-friday/allblack-daiane.webp',
      '/assets/images/black-friday/allblack-hero-bg' + (retrato ? '-mobile' : '') + '.webp'
    ];
    for (var k = 0; k < pre.length; k++) {
      var l = document.createElement('link');
      l.rel = 'preload'; l.as = 'image'; l.href = pre[k];
      document.head.appendChild(l);
    }
  }

  /* ── 2. Peças do DOM (precisam do body) ───────────────────────── */

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function faixaTopo() {
    if (document.querySelector('.bf-bar')) return;
    var barra = '<div class="bf-bar">' + esc(FAIXA) +
      (FAIXA_LINK ? ' &nbsp;<a href="' + esc(FAIXA_LINK) + '">' +
        esc(FAIXA_LINK_TXT) + '</a>' : '') + '</div>';

    // Primeiro elemento do <body>, FORA de #site-header: components.js faz
    // #site-header.innerHTML = HEADER_HTML e apagaria a faixa se ela
    // estivesse dentro do slot.
    if (!document.body) return;
    document.body.insertAdjacentHTML('afterbegin', barra);
    medeFaixa();
    var faixa = document.querySelector('.bf-bar');
    if (window.ResizeObserver) { new ResizeObserver(medeFaixa).observe(faixa); }
    else { window.addEventListener('resize', medeFaixa); }
  }

  /* A faixa fica presa no topo; o header gruda logo abaixo, na altura que
     ela tiver (--bf-bar-h, usado em black-friday.css). Arredonda para baixo:
     assim o header encosta na faixa sem deixar fresta entre os dois. */
  function medeFaixa() {
    var faixa = document.querySelector('.bf-bar');
    if (!faixa) return;
    var h = Math.floor(faixa.getBoundingClientRect().height);
    if (h > 0) { html.style.setProperty('--bf-bar-h', h + 'px'); }
  }

  /* A faixa entra assim que o <body> existe, antes da primeira pintura:
     se entrasse so no DOMContentLoaded, empurraria a pagina inteira para
     baixo depois de ja estar na tela. */
  if (document.body) { faixaTopo(); }
  else if (window.MutationObserver) {
    var esperaBody = new MutationObserver(function () {
      if (document.body) { esperaBody.disconnect(); faixaTopo(); }
    });
    esperaBody.observe(html, { childList: true });
  }

  function etiquetaPreview() {
    if (modo !== 'preview' || document.querySelector('.bf-flag')) return;
    var sep = window.location.search ? '&' : '?';
    document.body.insertAdjacentHTML('beforeend',
      '<div class="bf-flag"><b>PRÉVIA ALLBLACK</b>' +
      '<span>só você vê</span>' +
      '<a href="' + window.location.pathname + sep + 'bf=off">desligar</a></div>');
  }

  function monta() {
    // A foto da hero vem com loading="lazy" para nao pesar no site claro;
    // com o tema ligado ela e a primeira dobra.
    var foto = document.querySelector('.bf-hero__person');
    if (foto) { foto.loading = 'eager'; }
    faixaTopo();
    etiquetaPreview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', monta);
  } else {
    monta();
  }
})();
