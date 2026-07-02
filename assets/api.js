/* ═══════════════════════════════════════════════════════
   ALLASER — Cliente da API do sistema (Pefaz)
   Contrato v1 travado com o backend em 2026-07-02.

   MOCK: enquanto o backend nao estiver no ar, salva sessao e
   carrinho no localStorage — todas as APIs respondem shapes
   iguais ao contrato pra front rodar 100% do fluxo local.
   Quando /api/health voltar 200 em cursos.allaser.com.br,
   vira false automaticamente.
═══════════════════════════════════════════════════════ */
(function () {
  var API_BASE = 'https://cursos.allaser.com.br';

  // Detecta se backend esta no ar; senao usa mock.
  var MOCK = true;
  try {
    // Chamada nao bloqueante — se responder OK, desliga o mock.
    fetch(API_BASE + '/api/health', {method:'GET', credentials:'include'})
      .then(function (r) { if (r.ok) MOCK = false; })
      .catch(function () {});
  } catch (_) {}

  // ── Mock storage ─────────────────────────────────────
  var LS = {
    session:  'allaser.session',    // { student: {id,name,email} } | null
    cart:     'allaser.cart',       // { items: [...], coupon: null }
    orders:   'allaser.orders'      // [ Order, ... ]
  };
  function lsGet(key, def)  { try { return JSON.parse(localStorage.getItem(key)) || def; } catch(_) { return def; } }
  function lsSet(key, val)  { localStorage.setItem(key, JSON.stringify(val)); }
  function lsDel(key)       { localStorage.removeItem(key); }
  function uid()            { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }

  // Preco fake ate o backend responder — a fonte de verdade
  // e sempre o backend. Isso e so pra UI do mock ter numeros.
  function mockPrice(slug) {
    var seed = 0; for (var i = 0; i < slug.length; i++) seed += slug.charCodeAt(i);
    return Math.round((197 + (seed % 800))) + 0.90;
  }
  function findCurso(slug) {
    if (!window.CURSOS_DATA) return null;
    return window.CURSOS_DATA.find(function (c) { return c.id === slug; }) || null;
  }
  function computeCart(raw) {
    var items = (raw.items || []).map(function (it) {
      var c = findCurso(it.product_slug);
      var name  = c ? c.nome : it.product_slug;
      var image = c ? c.thumb : '';
      var unit  = mockPrice(it.product_slug);
      var line  = unit * it.qty;
      return {
        item_id: it.item_id,
        product_slug: it.product_slug,
        product_name: name,
        product_image: image,
        offer_id: it.offer_id || null,
        offer_name: null,
        variant_id: it.variant_id || null,
        variant_name: null,
        qty: it.qty,
        unit_price: unit,
        line_total: line
      };
    });
    var subtotal = items.reduce(function (s, it) { return s + it.line_total; }, 0);
    var coupon   = raw.coupon || null;
    var discount = coupon ? Math.min(subtotal, coupon.value || 0) : 0;
    var total    = Math.max(0, subtotal - discount);
    var count    = items.reduce(function (s, it) { return s + it.qty; }, 0);
    return { items: items, subtotal: subtotal, coupon: coupon, discount: discount, total: total, count: count };
  }

  // ── HTTP wrapper ─────────────────────────────────────
  function http(method, path, body) {
    var opts = { method: method, credentials: 'include', headers: {} };
    if (body) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    return fetch(API_BASE + path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (!r.ok) throw Object.assign(new Error(data.error || 'http_error'), { status: r.status, data: data });
        return data;
      });
    });
  }

  // ── AUTH ─────────────────────────────────────────────
  function signup(payload) {
    if (!MOCK) return http('POST', '/api/auth/signup', payload);
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return reject(mkErr('invalid_email'));
        if (!payload.password || payload.password.length < 6) return reject(mkErr('weak_password'));
        var existing = lsGet('allaser.users', {});
        if (existing[payload.email.toLowerCase()]) return reject(mkErr('email_exists'));
        var student = { id: 1000 + Object.keys(existing).length, name: payload.name, email: payload.email };
        existing[payload.email.toLowerCase()] = { pass: payload.password, student: student };
        lsSet('allaser.users', existing);
        lsSet(LS.session, { student: student });
        var cart = computeCart(lsGet(LS.cart, { items: [], coupon: null }));
        resolve({ ok: true, student: student, cart: cart });
      }, 300);
    });
  }
  function login(payload) {
    if (!MOCK) return http('POST', '/api/auth/login', payload);
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        var existing = lsGet('allaser.users', {});
        var u = existing[(payload.email || '').toLowerCase()];
        if (!u || u.pass !== payload.password) return reject(mkErr('invalid_credentials'));
        lsSet(LS.session, { student: u.student });
        var cart = computeCart(lsGet(LS.cart, { items: [], coupon: null }));
        resolve({ ok: true, student: u.student, cart: cart });
      }, 300);
    });
  }
  function logout() {
    if (!MOCK) return http('POST', '/api/auth/logout');
    return new Promise(function (resolve) {
      lsDel(LS.session);
      setTimeout(function () { resolve({ ok: true }); }, 100);
    });
  }
  function forgot(payload) {
    if (!MOCK) return http('POST', '/api/auth/forgot', payload);
    return new Promise(function (resolve) { setTimeout(function () { resolve({ ok: true }); }, 300); });
  }
  function me() {
    if (!MOCK) return http('GET', '/api/me');
    return new Promise(function (resolve) {
      setTimeout(function () {
        var sess = lsGet(LS.session, null);
        var cart = computeCart(lsGet(LS.cart, { items: [], coupon: null }));
        resolve({ logged: !!sess, student: sess ? sess.student : undefined, cart_count: cart.count });
      }, 60);
    });
  }

  // ── CART ─────────────────────────────────────────────
  function cartList() {
    if (!MOCK) return http('GET', '/api/cart-list');
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve({ ok: true, cart: computeCart(lsGet(LS.cart, { items: [], coupon: null })) });
      }, 80);
    });
  }
  function cartAdd(payload) {
    if (!MOCK) return http('POST', '/api/cart-add', payload);
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        var c = findCurso(payload.product_slug);
        if (!c) return reject(mkErr('product_not_found'));
        var raw = lsGet(LS.cart, { items: [], coupon: null });
        var existing = raw.items.find(function (it) {
          return it.product_slug === payload.product_slug
              && (it.offer_id || null) === (payload.offer_id || null)
              && (it.variant_id || null) === (payload.variant_id || null);
        });
        if (existing) {
          existing.qty += (payload.qty || 1);
        } else {
          raw.items.push({
            item_id: uid(),
            product_slug: payload.product_slug,
            offer_id: payload.offer_id || null,
            variant_id: payload.variant_id || null,
            qty: payload.qty || 1
          });
        }
        lsSet(LS.cart, raw);
        resolve({ ok: true, cart: computeCart(raw) });
      }, 120);
    });
  }
  function cartUpdate(payload) {
    if (!MOCK) return http('POST', '/api/cart-update', payload);
    return new Promise(function (resolve) {
      setTimeout(function () {
        var raw = lsGet(LS.cart, { items: [], coupon: null });
        raw.items = raw.items.map(function (it) {
          if (it.item_id === payload.item_id) it.qty = Math.max(1, payload.qty);
          return it;
        });
        lsSet(LS.cart, raw);
        resolve({ ok: true, cart: computeCart(raw) });
      }, 80);
    });
  }
  function cartRemove(payload) {
    if (!MOCK) return http('POST', '/api/cart-remove', payload);
    return new Promise(function (resolve) {
      setTimeout(function () {
        var raw = lsGet(LS.cart, { items: [], coupon: null });
        raw.items = raw.items.filter(function (it) { return it.item_id !== payload.item_id; });
        lsSet(LS.cart, raw);
        resolve({ ok: true, cart: computeCart(raw) });
      }, 80);
    });
  }
  function cartApplyCoupon(payload) {
    if (!MOCK) return http('POST', '/api/cart-apply-coupon', payload);
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        var code = (payload.code || '').toUpperCase();
        if (!code) return reject(mkErr('invalid_coupon'));
        // Mock: qualquer cupom que comece com "OFF" da 50 reais
        if (code.indexOf('OFF') !== 0) return reject(mkErr('invalid_coupon'));
        var raw = lsGet(LS.cart, { items: [], coupon: null });
        raw.coupon = { code: code, label: 'R$ 50 off', value: 50 };
        lsSet(LS.cart, raw);
        resolve({ ok: true, cart: computeCart(raw) });
      }, 200);
    });
  }
  function cartRemoveCoupon() {
    if (!MOCK) return http('POST', '/api/cart-remove-coupon');
    return new Promise(function (resolve) {
      setTimeout(function () {
        var raw = lsGet(LS.cart, { items: [], coupon: null });
        raw.coupon = null;
        lsSet(LS.cart, raw);
        resolve({ ok: true, cart: computeCart(raw) });
      }, 80);
    });
  }

  // ── CHECKOUT ─────────────────────────────────────────
  function cartCheckout(payload) {
    if (!MOCK) return http('POST', '/api/cart-checkout', payload);
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        var raw  = lsGet(LS.cart, { items: [], coupon: null });
        var cart = computeCart(raw);
        if (!cart.items.length) return reject(mkErr('empty_cart'));
        var orderId = Math.floor(Math.random() * 900000) + 100000;
        var order = {
          id: orderId,
          created_at: new Date().toISOString(),
          status: 'pending',
          subtotal: cart.subtotal,
          discount: cart.discount,
          total: cart.total,
          coupon_code: cart.coupon ? cart.coupon.code : null,
          gateway: payload.gateway || 'mercadopago',
          paid_at: null,
          payment_url: 'https://novo.allaser.com.br/minhas-compras.html?order=' + orderId + '&mock=paid',
          items: cart.items.map(function (it) {
            return { product_slug: it.product_slug, product_name: it.product_name, product_image: it.product_image,
                     offer_name: it.offer_name, variant_name: it.variant_name, qty: it.qty,
                     unit_price: it.unit_price, line_total: it.line_total };
          })
        };
        var orders = lsGet(LS.orders, []);
        orders.unshift(order);
        lsSet(LS.orders, orders);
        lsSet(LS.cart, { items: [], coupon: null }); // esvazia
        resolve({ ok: true, order_id: order.id, payment_url: order.payment_url });
      }, 400);
    });
  }

  // ── ORDERS ───────────────────────────────────────────
  function myOrders() {
    if (!MOCK) return http('GET', '/api/my-orders');
    return new Promise(function (resolve) {
      setTimeout(function () { resolve({ ok: true, orders: lsGet(LS.orders, []) }); }, 100);
    });
  }
  function myOrder(id) {
    if (!MOCK) return http('GET', '/api/my-orders/' + id);
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        var order = (lsGet(LS.orders, [])).find(function (o) { return String(o.id) === String(id); });
        if (!order) return reject(mkErr('not_found'));
        resolve({ ok: true, order: order });
      }, 100);
    });
  }

  // Helper mock: marca pedido como pago (usado pelo retorno "?mock=paid")
  function mockMarkPaid(orderId) {
    if (!MOCK) return;
    var orders = lsGet(LS.orders, []);
    orders = orders.map(function (o) {
      if (String(o.id) === String(orderId) && o.status === 'pending') {
        o.status = 'paid';
        o.paid_at = new Date().toISOString();
        o.payment_url = null;
      }
      return o;
    });
    lsSet(LS.orders, orders);
  }

  function mkErr(code) { var e = new Error(code); e.data = { error: code }; return e; }

  // Expor
  window.Api = {
    signup: signup, login: login, logout: logout, forgot: forgot, me: me,
    cartList: cartList, cartAdd: cartAdd, cartUpdate: cartUpdate,
    cartRemove: cartRemove, cartApplyCoupon: cartApplyCoupon, cartRemoveCoupon: cartRemoveCoupon,
    cartCheckout: cartCheckout, myOrders: myOrders, myOrder: myOrder,
    _mockMarkPaid: mockMarkPaid,
    isMock: function () { return MOCK; }
  };

  // Toast utilitario global (usado por cardsExtender e paginas)
  window.showToast = function (msg, type) {
    var t = document.createElement('div');
    t.className = 'allaser-toast' + (type === 'error' ? ' allaser-toast--error' : '');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('is-visible'); }, 10);
    setTimeout(function () { t.classList.remove('is-visible'); }, 2400);
    setTimeout(function () { t.remove(); }, 2800);
  };

  // Evento global — outras partes ouvem "cart:changed" pra refazer o badge
  window.emitCartChanged = function (cart) {
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: cart }));
  };
})();
