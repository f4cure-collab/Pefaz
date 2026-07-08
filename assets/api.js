/* ═══════════════════════════════════════════════════════
   ALLASER — Cliente da API do sistema
   Contrato v3 (2026-07-06) — backend em https://cursos.allaser.com.br

   Escopo do front:
   - Catalogo (precos oficiais) + Carrinho
   - Popup de pre-cadastro (nome/email/tel) -> lead + carrinho + checkout
   - Login no site + marcar cursos ja comprados ('owned')

   NAO faz: checkout/pagamento/cadastro/CPF/cartao/dispatch de Pixel.
═══════════════════════════════════════════════════════ */
(function () {
  var API = 'https://cursos.allaser.com.br/api';
  var BASE = 'https://cursos.allaser.com.br';

  var state = {
    csrf: '',
    logged: false,
    student: null,
    cartCount: 0,
    catalog: null,    // Map<slug, product>
    owned: [],        // v3: cursos ja comprados pelo aluno logado
    ownedBySlug: {},  // Map<slug, owned_item>
    precad: null      // v3: prefill do popup
  };

  function absUrl(u) {
    if (!u) return '';
    if (/^https?:\/\//i.test(u)) return u;
    if (u.charAt(0) === '/') return BASE + u;
    return u;
  }

  function get(path) {
    return fetch(API + path, { credentials: 'include' })
      .then(function (r) { return r.json().catch(function () { return {}; }); });
  }
  function post(path, body) {
    return fetch(API + path, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF': state.csrf
      },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.json().catch(function () { return {}; }); });
  }

  function me() {
    return get('/me.php').then(function (r) {
      if (r && r.ok) {
        state.csrf      = r.csrf || '';
        state.logged    = !!r.logged;
        state.student   = r.student || null;
        state.cartCount = r.cart_count || 0;
        state.owned     = Array.isArray(r.owned) ? r.owned : [];
        state.ownedBySlug = {};
        state.owned.forEach(function (o) { if (o && o.slug) state.ownedBySlug[o.slug] = o; });
        state.precad    = r.precad || null;
      }
      return r || {};
    });
  }
  function storeLead(payload) {
    // v3 Ponte 1: cria lead + salva prefill do checkout + adiciona ao carrinho
    return post('/store-lead.php', payload).then(function (r) {
      if (r && r.ok && r.cart) state.cartCount = r.cart.count || 0;
      track('lead_submit', {
        product_slug: (payload && payload.product_slug) || null,
        email: (payload && payload.email) || null,
        has_phone: !!(payload && payload.phone)
      });
      if (r && r.ok) track('checkout_start', { via: 'lead_form', product_slug: (payload && payload.product_slug) || null });
      return r || {};
    });
  }
  function login(payload) {
    return post('/login.php', payload).then(function (r) {
      if (r && r.ok) {
        state.csrf = r.csrf || state.csrf;
        state.logged = true;
        state.student = r.student || null;
        state.cartCount = r.cart_count || 0;
        track('login_success', { email: (payload && payload.email) || null });
      } else {
        track('login_fail', { email: (payload && payload.email) || null, error: (r && r.error) || 'unknown' });
      }
      return r || {};
    });
  }
  function logout() {
    return post('/logout.php', {}).then(function (r) {
      state.logged = false;
      state.student = null;
      state.owned = [];
      state.ownedBySlug = {};
      track('logout');
      return r || {};
    });
  }
  function catalog() {
    return get('/catalog.php').then(function (r) {
      if (r && r.ok && Array.isArray(r.products)) {
        var m = {};
        r.products.forEach(function (p) { m[p.slug] = p; });
        state.catalog = m;
      }
      return r || {};
    });
  }
  function cartList() {
    return get('/cart-list.php').then(function (r) {
      if (r && r.ok) state.cartCount = r.count || 0;
      return r || {};
    });
  }
  function cartAdd(payload) {
    return post('/cart-add.php', payload).then(function (r) {
      if (r && r.ok && r.cart) state.cartCount = r.cart.count || 0;
      track('cart_add', { product_slug: (payload && payload.product_slug) || null, qty: (payload && payload.qty) || 1 });
      return r || {};
    });
  }
  function cartUpdate(payload) {
    return post('/cart-update.php', payload).then(function (r) {
      if (r && r.ok && r.cart) state.cartCount = r.cart.count || 0;
      track('cart_update', payload || {});
      return r || {};
    });
  }
  function cartRemove(payload) {
    return post('/cart-remove.php', payload).then(function (r) {
      if (r && r.ok && r.cart) state.cartCount = r.cart.count || 0;
      track('cart_remove', payload || {});
      return r || {};
    });
  }

  /* ═══ Tracking da jornada do lead/cliente ═══
     Envia eventos pro backend registrar no historico do CRM.
     - Cookie de sessao acompanha via credentials:'include', backend
       identifica o lead/aluno pelo session
     - Fire-and-forget com keepalive: funciona ate no beforeunload
     - Falha silenciosa se endpoint /api/track.php nao existir ainda
     - Deduplicacao/aggregacao e responsabilidade do backend
  */
  var sessionStart = ('' + Math.random()).slice(2, 12) + '' + (new Date()).getTime();
  function track(event, data) {
    if (!event) return;
    try {
      var body = JSON.stringify({
        event: event,
        ts: new Date().toISOString(),
        path: location.pathname + location.search,
        referrer: document.referrer || null,
        title: document.title || null,
        session: sessionStart,
        data: data || {}
      });
      // sendBeacon quando disponivel (mais seguro em unload/close)
      if (navigator.sendBeacon && event !== 'page_view') {
        var blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(API + '/track.php', blob);
        return;
      }
      fetch(API + '/track.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRF': state.csrf },
        body: body,
        keepalive: true
      }).catch(function () {});
    } catch (_) {}
  }

  // Tempo na pagina: dispara ao sair
  var pageEnter = Date.now();
  window.addEventListener('beforeunload', function () {
    track('page_leave', { seconds: Math.round((Date.now() - pageEnter) / 1000) });
  });

  // Sync de precos + cover nos cards: qualquer [data-product-slug]
  // com um filho .course-price recebe o preco formatado do catalog.
  function syncPrices() {
    if (!state.catalog) return;
    document.querySelectorAll('[data-product-slug]').forEach(function (el) {
      var p = state.catalog[el.dataset.productSlug];
      var priceEl = el.querySelector('.course-price');
      if (!priceEl) return;
      if (p && typeof p.price === 'number') {
        priceEl.textContent = Number(p.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        priceEl.classList.remove('is-hidden');
      } else {
        priceEl.classList.add('is-hidden');
      }
    });
  }

  // v3 Ponte 3: marca cards com [data-product-slug] cujo slug esta em state.owned.
  // Adiciona classe 'is-owned' e dispara evento 'catalog:owned-marked' para cada
  // pagina customizar o botao (ex: trocar 'Comprar' por 'Acessar curso').
  function markOwned() {
    document.querySelectorAll('[data-product-slug]').forEach(function (el) {
      var slug = el.dataset.productSlug;
      var o = state.ownedBySlug[slug];
      if (o) {
        el.classList.add('is-owned');
        el.dataset.membersUrl = o.members_url || '';
      } else {
        el.classList.remove('is-owned');
        delete el.dataset.membersUrl;
      }
    });
    document.dispatchEvent(new CustomEvent('catalog:owned-marked', { detail: { owned: state.owned } }));
  }

  window.Api = {
    // URLs base (pra header linkar pra area do aluno / login / checkout do backend)
    URLS: {
      login:        BASE + '/aluno/login.php',
      logout:       BASE + '/aluno/logout.php',
      account:      BASE + '/aluno/',
      myOrders:     BASE + '/aluno/meus-pedidos.php',
      checkout:     BASE + '/checkout'
    },

    me: me,
    catalog: catalog,
    storeLead: storeLead,
    login: login,
    logout: logout,
    cartList: cartList,
    cartAdd: cartAdd,
    cartUpdate: cartUpdate,
    cartRemove: cartRemove,

    track: track,
    syncPrices: syncPrices,
    markOwned: markOwned,
    absUrl: absUrl,

    getState: function () { return { logged: state.logged, student: state.student, cartCount: state.cartCount, owned: state.owned, precad: state.precad }; },

    // Boot: carrega me + catalog em paralelo, sincroniza precos e marca comprados.
    boot: function () {
      // Dispara page_view assim que boot roda (uma vez por pagina)
      track('page_view', { logged: state.logged });
      return Promise.all([me(), catalog()]).then(function () {
        syncPrices();
        markOwned();
        return { logged: state.logged, student: state.student, cartCount: state.cartCount, owned: state.owned };
      });
    }
  };

  window.emitCartChanged = function (cart) {
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: cart }));
  };

  window.showToast = function (msg, type) {
    var t = document.createElement('div');
    t.className = 'allaser-toast' + (type === 'error' ? ' allaser-toast--error' : '');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('is-visible'); }, 10);
    setTimeout(function () { t.classList.remove('is-visible'); }, 2400);
    setTimeout(function () { t.remove(); }, 2800);
  };
})();
