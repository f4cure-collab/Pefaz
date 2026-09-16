/* ═══════════════════════════════════════════════════════════════
   ALLASER NEWS — cadastro para receber a revista

   Integra o formulario de /allasernews/ com o sistema em
   cursos.allaser.com.br. O layout ja existia (inscricao.css); aqui
   entra so o comportamento.

   Contrato enviado ao backend — POST /api/news-subscribe.php
   (JSON, credentials:'include', header X-CSRF):

     name            string   nome completo, obrigatorio
     email           string   obrigatorio
     phone           string   opcional. BR: so digitos "19991768411".
                              Fora do BR: E.164 "+351912000000".
     consent         boolean  sempre true (o form exige o aceite)
     source          string   "allasernews"
     latest_edition  string   slug da edicao em destaque no momento
                              do cadastro (ex: "setembro2026")
     pagina          string   URL de chegada na sessao
     utm_source | utm_medium | utm_campaign | utm_content | utm_term
     ind             string   codigo do divulgador, quando houver

   Resposta esperada: { ok: true } ou { ok: false, error: "mensagem" }.

   ENQUANTO O ENDPOINT NAO EXISTIR (hoje ele responde 404), nenhum
   cadastro se perde: Api.newsSubscribe sempre grava o evento
   'news_subscribe' no track.php com os mesmos campos. Por isso 404 e
   tratado como sucesso aqui — mostrar erro para quem se cadastrou
   seria mentira, o dado chegou. Assim que o backend publicar o
   endpoint, o caminho normal assume sozinho, sem mexer no front.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var form = document.getElementById('allaser-news-subscribe');
  if (!form) return;

  var btn       = form.querySelector('.news-subscribe__submit');
  var pending   = document.getElementById('news-subscribe-pending');
  var feedback  = document.getElementById('news-subscribe-feedback');
  var nameEl    = document.getElementById('news-name');
  var emailEl   = document.getElementById('news-email');
  var phoneEl   = document.getElementById('news-phone');
  var consentEl = document.getElementById('news-consent');

  var BTN_LABEL = btn ? btn.innerHTML : 'Quero receber a revista';

  /** Slug da edicao em destaque: primeiro cartao da lista. Lido do DOM pra
      nao precisar editar este arquivo a cada mes. */
  function latestEdition() {
    var card = document.querySelector('.news-edition-card[href]');
    if (!card) return '';
    var m = card.getAttribute('href').match(/\/allasernews\/([^/?#]+)/);
    return m ? m[1] : '';
  }

  function showFeedback(msg, state) {
    if (!feedback) return;
    feedback.textContent = msg;
    if (state) feedback.setAttribute('data-state', state);
    else feedback.removeAttribute('data-state');
    feedback.hidden = false;
  }
  function clearFeedback() {
    if (!feedback) return;
    feedback.hidden = true;
    feedback.removeAttribute('data-state');
    feedback.textContent = '';
  }
  function setLoading(on) {
    if (!btn) return;
    btn.disabled = on;
    btn.innerHTML = on ? 'Enviando…' : BTN_LABEL;
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ── Telefone: mesmo seletor de pais dos modais do header ──
     Campo opcional, entao a falta do phone-country.js nao pode travar o
     cadastro — sem ele o input segue como texto livre. */
  function attachPhoneCountry() {
    if (!phoneEl) return;
    if (window.PhoneCountry) return window.PhoneCountry.attach(phoneEl);
    var s = document.createElement('script');
    s.src = '/assets/phone-country.js?v=20260913';
    s.onload = function () {
      if (window.PhoneCountry) window.PhoneCountry.attach(phoneEl);
    };
    document.head.appendChild(s);
  }

  /** '' = vazio (campo e opcional), null = preenchido e invalido. */
  function phoneValue() {
    if (!phoneEl) return '';
    var raw = (phoneEl.value || '').trim();
    if (!raw) return '';
    if (window.PhoneCountry && phoneEl.dataset.pcAttached === '1') {
      if (!window.PhoneCountry.validate(phoneEl)) return null;
      return window.PhoneCountry.getE164(phoneEl);
    }
    return raw.replace(/[^\d+]/g, '');
  }

  function phoneError() {
    if (window.PhoneCountry && phoneEl && phoneEl.dataset.pcAttached === '1') {
      return window.PhoneCountry.errorMsg(phoneEl);
    }
    return 'Informe um número de telefone válido ou deixe o campo em branco.';
  }

  function onSuccess(email) {
    var card = form.parentNode;
    var intro = card ? card.querySelector('.news-subscribe__card-intro') : null;
    form.hidden = true;
    if (intro) intro.hidden = true;

    var ok = document.createElement('div');
    ok.className = 'news-subscribe__done';
    ok.setAttribute('role', 'status');
    ok.innerHTML =
        '<span class="news-subscribe__done-icon" aria-hidden="true">'
      + '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
      + '</span>'
      + '<h4>Cadastro confirmado.</h4>'
      + '<p>Vamos avisar <strong>' + escapeHtml(email) + '</strong> assim que a próxima edição sair.</p>'
      + '<a class="news-subscribe__done-link" href="#edicoes">Enquanto isso, leia a edição atual <span aria-hidden="true">↓</span></a>';
    card.appendChild(ok);

    // Pixels de conversao: mesma convencao dos outros formularios do site.
    if (typeof window.gtag_report_conversion === 'function') {
      try { window.gtag_report_conversion(); } catch (_) {}
    }
    if (typeof window.fbq === 'function') {
      try {
        fbq('track', 'Lead', {
          content_name: 'Allaser News — assinatura da revista',
          content_category: 'newsletter'
        });
      } catch (_) {}
    }
  }

  function submit(e) {
    e.preventDefault();
    clearFeedback();

    var name  = (nameEl && nameEl.value || '').trim();
    var email = (emailEl && emailEl.value || '').trim().toLowerCase();

    if (name.length < 2) {
      showFeedback('Informe seu nome completo.', 'error');
      if (nameEl) nameEl.focus();
      return;
    }
    if (!validEmail(email)) {
      showFeedback('Informe um e-mail válido.', 'error');
      if (emailEl) emailEl.focus();
      return;
    }
    var phone = phoneValue();
    if (phone === null) {
      showFeedback(phoneError(), 'error');
      phoneEl.focus();
      return;
    }
    if (consentEl && !consentEl.checked) {
      showFeedback('É preciso aceitar receber as edições para concluir.', 'error');
      consentEl.focus();
      return;
    }
    if (!window.Api || typeof Api.newsSubscribe !== 'function') {
      showFeedback('Erro de conexão com o sistema. Recarregue a página e tente de novo.', 'error');
      return;
    }

    setLoading(true);

    var utm = (typeof window.getUtm === 'function') ? window.getUtm() : {};
    var ind = (typeof window.getInd === 'function') ? window.getInd() : '';
    var payload = Object.assign({
      name: name,
      email: email,
      phone: phone,
      consent: true,
      source: 'allasernews',
      latest_edition: latestEdition(),
      ind: ind || ''
    }, utm);

    // me() antes do POST garante o X-CSRF em sessao nova (o boot do
    // components.js ja costuma ter feito isso, mas o form nao depende dele).
    Api.me()
      .then(function () { return Api.newsSubscribe(payload); })
      .then(function (r) {
        r = r || {};
        // 404 = endpoint ainda nao publicado. O track.php ja registrou o
        // cadastro, entao para quem preencheu isto e sucesso de verdade.
        if (r.ok || r.status === 404) return onSuccess(email);
        throw new Error(r.error || 'Não foi possível concluir agora. Tente novamente em instantes.');
      })
      .catch(function (err) {
        setLoading(false);
        showFeedback(err.message || 'Não foi possível concluir agora. Tente novamente em instantes.', 'error');
      });
  }

  /* ── Ativacao ──
     O HTML nasce com o botao desabilitado e o aviso "Inscrições disponíveis
     em breve" para nunca prometer um envio que nao acontece caso este script
     falhe em carregar. Estando aqui, o cadastro funciona: libera os dois. */
  form.removeAttribute('onsubmit');
  form.removeAttribute('data-integration');
  form.removeAttribute('aria-describedby');
  if (btn) {
    btn.disabled = false;
    btn.removeAttribute('aria-describedby');
  }
  if (pending) pending.remove();

  attachPhoneCountry();
  form.addEventListener('submit', submit);
})();
