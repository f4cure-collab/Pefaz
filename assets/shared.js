/* ═══════════════════════════════════════════════════════
   ALLASER — Comportamentos compartilhados
   Depende de components.js (que já injetou o HTML)
═══════════════════════════════════════════════════════ */

(function () {

  /* ─── Header scroll ─── */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ─── Mobile menu ─── */
  const hamburger  = document.getElementById('hamburger');
  const overlay    = document.getElementById('mobileOverlay');
  const overlayBg  = document.getElementById('overlayBg');
  const mobileClose = document.getElementById('mobileClose');

  function openMenu() {
    if (!hamburger || !overlay) return;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Fechar menu de navegação');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstLink = overlay.querySelector('.mnav__link');
    if (firstLink) setTimeout(function () { firstLink.focus(); }, 420);
  }

  function closeMenu() {
    if (!hamburger || !overlay) return;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  if (hamburger)   hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (overlayBg)   overlayBg.addEventListener('click', closeMenu);

  /* Link de navegacao fecha o painel. Importante para ancoras como
     /#cursos-home: clicada ja estando na home, ela nao recarrega a pagina,
     entao sem isto o menu ficaria aberto por cima do conteudo — e com o
     scroll do body travado. */
  document.querySelectorAll('.mnav__link[href]').forEach(function (link) {
    if (link.hasAttribute('data-toggle')) return;
    link.addEventListener('click', function () { closeMenu(); });
  });

  /* ─── Submenus mobile ─── */
  document.querySelectorAll('.mnav__link[data-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.dataset.toggle;
      const sub = document.getElementById(targetId);
      if (!sub) return;
      const isOpen = sub.classList.contains('open');
      // fechar todos antes de abrir o clicado
      document.querySelectorAll('.msub').forEach(function (s) { s.classList.remove('open'); });
      document.querySelectorAll('.mnav__link[data-toggle]').forEach(function (b) { b.classList.remove('expanded'); });
      if (!isOpen) {
        sub.classList.add('open');
        btn.classList.add('expanded');
      }
    });
  });

  /* ─── ESC fecha modal ou menu ─── */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    const modal = document.getElementById('funnelModal');
    if (modal && modal.classList.contains('open')) {
      if (typeof closeModal === 'function') closeModal();
    } else if (overlay && overlay.classList.contains('open')) {
      closeMenu();
    }
  });

  /* ─── FAQ accordion — exposto globalmente ─── */
  window.toggleFaq = function (btn) {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function (i) {
      i.classList.remove('open');
      const q = i.querySelector('.faq-question');
      if (q) q.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  };

})();
