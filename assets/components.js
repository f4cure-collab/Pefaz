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
    <a href="/index.html" class="logo">
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
        <a href="/sobre.html" class="nav__link" data-page="sobre">Quem Somos</a>
      </div>
      <div class="nav__item">
        <a href="/sobre-o-laser.html" class="nav__link" data-page="sobre-laser">Sobre o Laser</a>
      </div>
      <div class="nav__item">
        <a href="/blog.html" class="nav__link" data-page="blog">Blog</a>
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
        <a href="/sobre.html" class="mnav__link" data-page="sobre">Quem Somos</a>
      </div>
      <div class="mnav__item">
        <a href="/sobre-o-laser.html" class="mnav__link" data-page="sobre-laser">Sobre o Laser</a>
      </div>
      <div class="mnav__item">
        <a href="/blog.html" class="mnav__link" data-page="blog">Blog</a>
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
          <li><a href="/sobre.html" class="footer__link">Quem Somos</a></li>
          <li><a href="/cursos.html" class="footer__link">Cursos</a></li>
          <li><a href="/blog.html" class="footer__link">Blog</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer__col-title">Áreas da Saúde</h4>
        <ul class="footer__links">
          <li><a href="/blog.html?cat=odontologia" class="footer__link">Odontologia</a></li>
          <li><a href="/blog.html?cat=medicina" class="footer__link">Medicina</a></li>
          <li><a href="/blog.html?cat=enfermagem" class="footer__link">Enfermagem</a></li>
          <li><a href="/blog.html?cat=veterinaria" class="footer__link">Veterinária</a></li>
          <li><a href="/blog.html?cat=oncologia" class="footer__link">Oncologia</a></li>
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
        <a href="/politica-de-privacidade.html">Privacidade</a>
        <a href="/termos-e-condicoes.html">Termos</a>
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

  /* ═══════════════════════════════════════════════════════
     WIDGET DE CARRINHO + USER — injetado dinamicamente
     Depende de window.Api (assets/api.js) carregado antes
  ═══════════════════════════════════════════════════════ */
  var WIDGET_CSS = `
  .hdr-widget { display: inline-flex; align-items: center; gap: 8px; margin-right: 8px; }
  .hdr-btn-cart {
    position: relative; display: inline-flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid var(--gray-200);
    background: #fff; color: var(--dark-700); cursor: pointer;
    transition: all 0.18s ease;
  }
  .hdr-btn-cart:hover { border-color: var(--lime-dark); color: var(--lime-dark); background: var(--lime-subtle); }
  .hdr-btn-cart svg { width: 18px; height: 18px; }
  .hdr-cart-badge {
    position: absolute; top: -4px; right: -4px;
    min-width: 18px; height: 18px; padding: 0 5px;
    background: var(--lime); color: var(--dark-900);
    font-family: 'Outfit', sans-serif; font-size: 0.68rem; font-weight: 800;
    border-radius: 999px; display: none;
    align-items: center; justify-content: center;
    border: 2px solid #fff;
  }
  .hdr-cart-badge.is-visible { display: inline-flex; }
  .hdr-user { position: relative; }
  .hdr-user-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 12px; border-radius: 999px; border: 1.5px solid var(--gray-200);
    background: #fff; color: var(--dark-700); cursor: pointer;
    font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 600;
    transition: all 0.18s ease; white-space: nowrap;
  }
  .hdr-user-btn:hover { border-color: var(--lime-dark); color: var(--lime-dark); background: var(--lime-subtle); }
  .hdr-user-btn svg { width: 15px; height: 15px; }
  .hdr-user-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--lime); color: var(--dark-900);
    display: inline-flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif; font-size: 0.78rem; font-weight: 800;
    text-transform: uppercase;
  }
  .hdr-user-menu {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: #fff; border: 1px solid var(--gray-100);
    border-radius: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.12);
    padding: 8px; min-width: 200px; z-index: 100;
    display: none;
  }
  .hdr-user-menu.is-open { display: block; }
  .hdr-user-menu__item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px;
    font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 600;
    color: var(--dark-700); text-decoration: none; cursor: pointer;
    background: none; border: none; width: 100%; text-align: left;
    transition: background 0.15s;
  }
  .hdr-user-menu__item:hover { background: var(--gray-50); color: var(--lime-dark); }
  .hdr-user-menu__item svg { width: 15px; height: 15px; flex-shrink: 0; }
  .hdr-user-menu__divider { height: 1px; background: var(--gray-100); margin: 6px 0; }
  .hdr-user-menu__label {
    padding: 8px 12px; font-size: 0.7rem;
    color: var(--gray-400); font-weight: 500;
    display: flex; flex-direction: column; gap: 2px;
  }
  .hdr-user-menu__label strong { color: var(--dark-800); font-weight: 700; }

  @media (max-width: 900px) {
    .hdr-user-btn-label { display: none; }
    .hdr-user-btn { padding: 6px; border-radius: 50%; width: 40px; height: 40px; justify-content: center; }
  }

  /* Botao 'add ao carrinho' nos posteres de curso */
  .card-cart-btn {
    position: absolute; top: 10px; right: 10px; z-index: 2;
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(255,255,255,0.95); backdrop-filter: blur(4px);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--dark-700);
    transition: all 0.2s ease;
    opacity: 0; transform: scale(0.85);
    box-shadow: 0 4px 12px rgba(0,0,0,0.18);
  }
  .course-card:hover .card-cart-btn,
  .home-curso-card:hover .card-cart-btn { opacity: 1; transform: scale(1); }
  .card-cart-btn:hover { background: var(--lime); color: var(--dark-900); transform: scale(1.08) !important; }
  .card-cart-btn svg { width: 16px; height: 16px; }
  @media (max-width: 640px) {
    .card-cart-btn { opacity: 1; transform: scale(1); width: 30px; height: 30px; top: 8px; right: 8px; }
    .card-cart-btn svg { width: 14px; height: 14px; }
  }

  /* Toast */
  .allaser-toast {
    position: fixed; bottom: 96px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: var(--dark-900); color: #fff;
    padding: 12px 20px; border-radius: 999px;
    font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 600;
    box-shadow: 0 12px 40px rgba(0,0,0,0.32);
    opacity: 0; transition: all 0.28s ease;
    z-index: 9999; pointer-events: none;
    max-width: calc(100vw - 40px); text-align: center;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .allaser-toast.is-visible { opacity: 1; transform: translateX(-50%) translateY(0); }
  .allaser-toast--error { background: #b83a3a; }
  `;

  var WIDGET_HTML = `
  <div class="hdr-widget">
    <button class="hdr-btn-cart" id="hdrBtnCart" aria-label="Carrinho">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      <span class="hdr-cart-badge" id="hdrCartBadge">0</span>
    </button>
    <div class="hdr-user" id="hdrUser"></div>
  </div>
  `;

  function updateCartBadge(count) {
    var badge = document.getElementById('hdrCartBadge');
    if (!badge) return;
    if (count > 0) { badge.textContent = count > 99 ? '99+' : count; badge.classList.add('is-visible'); }
    else { badge.classList.remove('is-visible'); }
  }

  function renderUserArea(state) {
    var el = document.getElementById('hdrUser');
    if (!el) return;
    var URLS = (window.Api && Api.URLS) || {};
    if (state.logged && state.student) {
      var initial = (state.student.name || 'A').trim().charAt(0);
      el.innerHTML = ''
        + '<button class="hdr-user-btn" id="hdrUserBtn" aria-haspopup="true" aria-expanded="false">'
        +   '<span class="hdr-user-avatar">' + escapeHtml(initial) + '</span>'
        +   '<span class="hdr-user-btn-label">' + escapeHtml(firstName(state.student.name)) + '</span>'
        + '</button>'
        + '<div class="hdr-user-menu" id="hdrUserMenu" role="menu">'
        +   '<div class="hdr-user-menu__label">Logado como <strong>' + escapeHtml(state.student.email) + '</strong></div>'
        +   '<div class="hdr-user-menu__divider"></div>'
        +   '<a class="hdr-user-menu__item" href="' + escapeHtml(URLS.account || '#') + '">'
        +     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>'
        +     'Área do aluno'
        +   '</a>'
        +   '<a class="hdr-user-menu__item" href="' + escapeHtml(URLS.myOrders || '#') + '">'
        +     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'
        +     'Minhas compras'
        +   '</a>'
        +   '<a class="hdr-user-menu__item" href="/carrinho.html">'
        +     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'
        +     'Meu carrinho'
        +   '</a>'
        +   '<div class="hdr-user-menu__divider"></div>'
        +   '<a class="hdr-user-menu__item" href="' + escapeHtml(URLS.logout || '#') + '">'
        +     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'
        +     'Sair'
        +   '</a>'
        + '</div>';
      var btn = document.getElementById('hdrUserBtn');
      var menu = document.getElementById('hdrUserMenu');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = menu.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
          menu.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    } else {
      el.innerHTML = ''
        + '<a href="' + escapeHtml(URLS.login || '#') + '" class="hdr-user-btn">'
        +   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
        +   '<span class="hdr-user-btn-label">Entrar</span>'
        + '</a>';
    }
  }

  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function firstName(full) { return (full || '').trim().split(/\s+/)[0] || ''; }

  function ensureApi(cb) {
    if (window.Api) return cb();
    var s = document.createElement('script');
    s.src = '/assets/api.js?v=20260702';
    s.onload = cb;
    s.onerror = cb; // segue mesmo sem api (fallback deslogado)
    document.head.appendChild(s);
  }

  function injectWidget() {
    if (document.getElementById('hdrBtnCart')) return;
    var style = document.createElement('style');
    style.textContent = WIDGET_CSS;
    document.head.appendChild(style);

    var slot = document.querySelector('.header__actions');
    if (!slot) return;
    // Insere ANTES do primeiro filho (fica antes do 'Ver Cursos' e WhatsApp)
    slot.insertAdjacentHTML('afterbegin', WIDGET_HTML);

    // Botao carrinho -> /carrinho.html
    document.getElementById('hdrBtnCart').addEventListener('click', function () {
      window.location.href = '/carrinho.html';
    });

    ensureApi(function () {
      if (window.Api) {
        Api.boot()
          .then(function (state) {
            renderUserArea({ logged: state.logged, student: state.student });
            updateCartBadge(state.cartCount || 0);
          })
          .catch(function () { renderUserArea({ logged: false }); });
      } else {
        renderUserArea({ logged: false });
      }
    });
  }

  // Re-sincroniza precos + marca cursos comprados sempre que o catalogo do
  // site termina de renderizar (index.html e cursos.html fazem grid via JS
  // depois do DOM ready).
  window.reSyncCatalog = function () {
    if (!window.Api) return;
    if (typeof Api.syncPrices === 'function') Api.syncPrices();
    if (typeof Api.markOwned === 'function') Api.markOwned();
  };

  document.addEventListener('cart:changed', function (e) {
    var cart = e.detail || {};
    updateCartBadge(cart.count || 0);
  });

  // v3: Tracking global de clicks relevantes (card_click e wa_click)
  document.addEventListener('click', function (e) {
    if (!window.Api || !Api.track) return;
    // Card de curso clicado (vai pra LP generica)
    var card = e.target.closest && e.target.closest('[data-product-slug]');
    if (card && !e.target.closest('.card-cart-btn')) {
      Api.track('card_click', {
        product_slug: card.dataset.productSlug,
        from_page: location.pathname,
        is_owned: card.classList.contains('is-owned')
      });
    }
    // Clique em botao WhatsApp em qualquer lugar do site
    var wa = e.target.closest && e.target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
    if (wa) {
      Api.track('wa_click', {
        from_page: location.pathname,
        href: wa.getAttribute('href')
      });
    }
  }, true);

  // Delegation global: qualquer .card-cart-btn adiciona ao carrinho
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.card-cart-btn');
    if (!btn || !window.Api) return;
    e.preventDefault();
    e.stopPropagation();
    var slug = btn.dataset.slug;
    if (!slug) return;
    btn.disabled = true;
    Api.cartAdd({ product_slug: slug, qty: 1 })
      .then(function (res) {
        if (res && res.ok) {
          window.showToast('Adicionado ao carrinho');
          if (res.cart) {
            window.emitCartChanged(res.cart);
            updateCartBadge(res.cart.count || 0);
          }
        } else {
          window.showToast((res && res.error) || 'Erro ao adicionar', 'error');
        }
      })
      .catch(function () { window.showToast('Erro de rede', 'error'); })
      .finally(function () { btn.disabled = false; });
  });

  injectWidget();

})();
