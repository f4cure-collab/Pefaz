/* ═══════════════════════════════════════════════════════
   ALLASER — Componentes compartilhados
   Injeta topbar, header, mobile overlay, footer e WPP float
   em todas as páginas via placeholders #site-header / #site-footer
═══════════════════════════════════════════════════════ */

(function () {

  /* ─── HTML do cabeçalho ─── */
  const HEADER_HTML = `
<div class="topbar">
  <div class="topbar__inner">
    <div class="topbar__left">
      <a href="https://api.whatsapp.com/send?phone=5519984231452" class="topbar__item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span>(19) 98423-1452</span>
      </a>
      <a href="https://g.page/allasercursos?share" class="topbar__item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Cambuí, Campinas - SP</span>
      </a>
    </div>
    <div class="topbar__right">
      <a href="https://www.facebook.com/allasercursos/" class="topbar__social" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
      <a href="https://www.instagram.com/allasercursos/" class="topbar__social" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
      <a href="https://www.youtube.com/channel/UCi2XzOh-qyQVbvzp-dhlXwQ" class="topbar__social" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/></svg></a>
      <a href="https://t.me/joinchat/RyIIC3EHIik_JZIA" class="topbar__social" aria-label="Telegram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>
    </div>
  </div>
</div>

<header class="header" id="header">
  <div class="header__inner">
    <a href="https://allaser.com.br" class="logo">
      <img src="/assets/images/logo-allaser.webp" alt="Allaser" class="logo__img">
    </a>
    <nav class="nav" aria-label="Navegação principal">
      <div class="nav__item">
        <a href="/index.html" class="nav__link" data-page="home">Home</a>
      </div>
      <div class="nav__item">
        <a href="/cursos.html" class="nav__link" data-page="cursos">Cursos</a>
      </div>
      <div class="nav__item">
        <a href="/encontre.html" class="nav__link" data-page="encontre">Encontre um Profissional</a>
      </div>
    </nav>
    <div class="header__actions">
      <a href="/cursos.html" class="btn btn--sm btn--courses">Ver Cursos</a>
      <a href="https://api.whatsapp.com/send?phone=5519984231452&text=Ol%C3%A1,%20estou%20em%20seu%20site%20e%20gostaria%20de%20tirar%20uma%20duvida!!" class="btn btn--sm btn--whatsapp">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
        <span>WhatsApp</span>
      </a>
      <button class="hamburger" id="hamburger" aria-label="Abrir menu de navegação" aria-expanded="false" aria-controls="mobilePanel">
        <span class="hamburger__line"></span>
        <span class="hamburger__line"></span>
        <span class="hamburger__line"></span>
      </button>
    </div>
  </div>
</header>

<div class="mobile-overlay" id="mobileOverlay" role="dialog" aria-modal="true" aria-label="Menu de navegação">
  <div class="mobile-overlay__bg" id="overlayBg"></div>
  <div class="mobile-panel" id="mobilePanel">
    <div class="mobile-panel__head">
      <img src="/assets/images/logo-allaser.webp" alt="Allaser" class="mobile-panel__logo">
      <button class="mobile-panel__close" id="mobileClose">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="mobile-panel__body">
      <div class="mnav__item">
        <a href="/index.html" class="mnav__link" data-page="home">Home</a>
      </div>
      <div class="mnav__item">
        <a href="/cursos.html" class="mnav__link" data-page="cursos">Cursos</a>
      </div>
      <div class="mnav__item">
        <a href="/encontre.html" class="mnav__link" data-page="encontre">Encontre um Profissional</a>
      </div>
    </div>
    <div class="mobile-panel__foot">
      <a href="/cursos.html" class="mobile-cta mobile-cta--primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        Ver Todos os Cursos
      </a>
      <a href="https://api.whatsapp.com/send?phone=5519984231452&text=Ol%C3%A1,%20estou%20em%20seu%20site%20e%20gostaria%20de%20tirar%20uma%20duvida!!" class="mobile-cta mobile-cta--wa">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
        Fale pelo WhatsApp
      </a>
      <div class="mobile-panel__meta">
        <span class="mobile-panel__address">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Cambuí, Campinas - SP
        </span>
        <div class="mobile-panel__socials">
          <a href="https://www.facebook.com/allasercursos/" class="mobile-panel__social" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="https://www.instagram.com/allasercursos/" class="mobile-panel__social" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          <a href="https://www.youtube.com/channel/UCi2XzOh-qyQVbvzp-dhlXwQ" class="mobile-panel__social" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/></svg></a>
        </div>
      </div>
    </div>
  </div>
</div>
`;

  /* ─── HTML do rodapé ─── */
  const FOOTER_HTML = `
<footer class="footer">
  <div class="footer__bg"></div>
  <div class="footer__glow"></div>
  <div class="footer__main">
    <div class="footer__grid">
      <div>
        <div class="footer__brand-logo">
          <img src="/assets/images/logo-allaser.webp" alt="Allaser">
        </div>
        <p class="footer__brand-text">Desde 2012 promovendo conhecimento em laserterapia para profissionais da saúde. Professores Doutores pela USP.</p>
        <div class="footer__brand-badge">
          <span class="footer__brand-badge-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>
          <div><div class="footer__brand-badge-text">4.9 estrelas no Google</div><div class="footer__brand-badge-sub">Avaliado por ex-alunos</div></div>
        </div>
        <div class="footer__socials">
          <a href="https://www.facebook.com/allasercursos/" class="footer__social" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="https://www.instagram.com/allasercursos/" class="footer__social" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          <a href="https://www.youtube.com/channel/UCi2XzOh-qyQVbvzp-dhlXwQ" class="footer__social" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/></svg></a>
          <a href="https://t.me/joinchat/RyIIC3EHIik_JZIA" class="footer__social" aria-label="Telegram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>
        </div>
      </div>
      <div>
        <h4 class="footer__col-title">Navegação</h4>
        <ul class="footer__links">
          <li><a href="/index.html" class="footer__link">Home</a></li>
          <li><a href="https://allaser.com.br/sobre/" class="footer__link">Quem Somos</a></li>
          <li><a href="/cursos.html" class="footer__link">Cursos</a></li>
          <li><a href="https://allaser.com.br/professores-allaser/" class="footer__link">Professores</a></li>
          <li><a href="https://allaser.com.br/?page_id=85" class="footer__link">Blog</a></li>
          <li><a href="https://allaser.com.br/podcast/" class="footer__link">Podcast</a></li>
          <li><a href="https://allaser.com.br/videos/" class="footer__link">Vídeos</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer__col-title">Áreas da Saúde</h4>
        <ul class="footer__links">
          <li><a href="https://allaser.com.br/category/odontologia/" class="footer__link">Odontologia</a></li>
          <li><a href="https://allaser.com.br/category/medicina/" class="footer__link">Medicina</a></li>
          <li><a href="https://allaser.com.br/category/enfermagem/" class="footer__link">Enfermagem</a></li>
          <li><a href="https://allaser.com.br/category/veterinaria/" class="footer__link">Veterinária</a></li>
          <li><a href="https://allaser.com.br/category/oncologia/" class="footer__link">Oncologia</a></li>
          <li><a href="/encontre.html" class="footer__link">Encontre um Profissional</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer__col-title">Contato</h4>
        <div class="footer__contact-block">
          <div class="footer__contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
          <div><div class="footer__contact-label">Endereço</div><a href="https://g.page/allasercursos?share" class="footer__contact-value">Av. João Mendes Júnior, 180<br>Sala 24 - Cambuí, Campinas - SP</a></div>
        </div>
        <div class="footer__contact-block">
          <div class="footer__contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
          <div><div class="footer__contact-label">WhatsApp</div><a href="https://api.whatsapp.com/send?phone=5519984231452" class="footer__contact-value">(19) 98423-1452</a></div>
        </div>
        <div class="footer__newsletter">
          <div class="footer__newsletter-title">Receba novidades por e-mail</div>
          <div class="footer__newsletter-form">
            <input type="email" class="footer__newsletter-input" placeholder="Seu melhor e-mail" aria-label="Seu e-mail para newsletter">
            <button class="footer__newsletter-btn">Inscrever</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="footer__bottom">
    <div class="footer__bottom-inner">
      <span class="footer__copy">© 2026 Allaser. Todos os direitos reservados.</span>
      <div class="footer__legal">
        <a href="https://allaser.com.br/politica-de-privacidade/">Privacidade</a>
        <a href="https://allaser.com.br/termos-e-condicoes/">Termos</a>
      </div>
      <span class="footer__credit">Desenvolvido por <a href="https://www.pefaz.com.br" target="_blank" rel="noopener">PEFAZ</a></span>
    </div>
  </div>
</footer>

<a href="https://api.whatsapp.com/send?phone=5519984231452" class="wpp-float" target="_blank" aria-label="Fale conosco pelo WhatsApp">
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
</a>
`;

  /* ─── Injeção ─── */
  const siteHeader = document.getElementById('site-header');
  const siteFooter = document.getElementById('site-footer');

  if (siteHeader) {
    // Skip link inserido antes do placeholder do header
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Pular para o conteúdo principal';
    siteHeader.parentNode.insertBefore(skipLink, siteHeader);

    siteHeader.innerHTML = HEADER_HTML;
  }

  if (siteFooter) {
    siteFooter.innerHTML = FOOTER_HTML;
  }

  /* ─── Nav ativa por página ─── */
  window.setActiveNav = function (pageKey) {
    // Desktop nav
    document.querySelectorAll('.nav__link[data-page]').forEach(function (link) {
      const isActive = link.dataset.page === pageKey;
      link.classList.toggle('nav__link--active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Mobile nav
    document.querySelectorAll('.mnav__link[data-page]').forEach(function (link) {
      const isActive = link.dataset.page === pageKey;
      link.classList.toggle('mnav__link--active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

})();
