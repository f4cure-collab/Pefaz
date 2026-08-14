/* Google Ads gtag — base + conversao de Lead.
   Instalado em todas as paginas do site (via components.js) e em todas as
   LPs (inline no <head>). Substituiu o Google Tag Manager (decisao de
   simplificar: menos uma camada, config fica no repo).

   Dois modos de uso:

   1) Automatico — em qualquer form de lead conhecido (id=leadForm,
      id=lead-form, id=hdrSignupForm, ou data-lead-form), a conversao
      dispara no submit. Usa captura pra rodar ANTES de handlers que
      chamam preventDefault. gtag usa sendBeacon internamente, entao
      sobrevive a navigation.

   2) Manual — funcao window.gtag_report_conversion(url) para botoes
      ou links que precisam disparar conversao E redirecionar. Ela
      chama o gtag com event_callback: quando a conversao e' confirmada
      pelo servidor do Google, a URL de destino carrega. Se dar timeout
      em 1s, redireciona mesmo assim (nao trava o user). */
(function () {
  var AW_ID     = 'AW-17799924563';
  var CONV_LEAD = 'AW-17799924563/1pQVCPC3ruEcENOW1adC';

  // Injeta o script base do gtag
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + AW_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', AW_ID);
  window.gtag = gtag;

  /** Dispara conversao de Lead. Sem argumento, so' dispara.
      Com url, dispara + redireciona quando confirmado (ou depois de 1s
      fallback se demorar). Retorna false pra facilitar uso inline em <a>. */
  window.gtag_report_conversion = function (url) {
    var redirected = false;
    var go = function () {
      if (redirected) return;
      redirected = true;
      if (typeof url !== 'undefined') window.location = url;
    };
    try {
      gtag('event', 'conversion', {
        send_to: CONV_LEAD,
        event_callback: go
      });
    } catch (_) { go(); }
    // Fallback: se callback nao vier em 1s (rede lenta), redireciona igual
    if (typeof url !== 'undefined') setTimeout(go, 1000);
    return false;
  };

  // Alias curto
  window.trackAdsConversion = window.gtag_report_conversion;

  // Auto-track em forms de lead conhecidos.
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.tagName !== 'FORM') return;
    var id = f.id || '';
    var isLead = id === 'leadForm' || id === 'lead-form' || id === 'hdrSignupForm'
              || f.hasAttribute('data-lead-form');
    if (isLead) window.gtag_report_conversion();
  }, true);
})();
