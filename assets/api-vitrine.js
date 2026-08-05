/* ═══════════════════════════════════════════════════════════════════
   ALLASER — Loader da vitrine de cursos

   Fonte da verdade: https://admin.allaser.com.br/api/site-courses.php

   Estrategia com 3 camadas de fallback (Opcao C acordada):
     1. Tenta a API. Se ok:true e count > 0, usa e cacheia em localStorage.
     2. Se API falhar, tenta localStorage (ultima resposta OK do proprio
        visitante). Nunca fica velho por mais de 24h.
     3. Se localStorage tambem nao servir, cai pro snapshot estatico em
        /assets/cursos-snapshot.json (atualizado no build/deploy).

   Nunca renderiza vitrine vazia — se as 3 camadas falharem, dispara
   evento vitrine:error e a pagina que estiver escutando decide como
   se comportar (mostrar mensagem de manutencao, etc).

   Expoe:
     window.VITRINE = { categorias, courses, source, updated_at }
     evento 'vitrine:ready'  (com detail = VITRINE)
     evento 'vitrine:error'  (com detail = { error })
═══════════════════════════════════════════════════════════════════ */

(function () {
  var API_URL = 'https://admin.allaser.com.br/api/site-courses.php?slug=allaser';
  var SNAPSHOT_URL = '/assets/cursos-snapshot.json';
  var CACHE_KEY = 'allaser:vitrine:v1';
  var CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24h
  var THUMB_PREFIX = 'https://admin.allaser.com.br';

  function isValid(data) {
    return data && data.ok === true
        && Array.isArray(data.courses) && data.courses.length > 0
        && Array.isArray(data.categorias) && data.categorias.length > 0;
  }

  function normalize(data, source) {
    // Prefixa thumb com host do admin (regra da integracao)
    var courses = data.courses.map(function (c) {
      var out = Object.assign({}, c);
      if (out.thumb && !/^https?:\/\//i.test(out.thumb)) {
        out.thumb = THUMB_PREFIX + out.thumb;
      }
      return out;
    });
    return {
      ok: true,
      count: courses.length,
      categorias: data.categorias,
      courses: courses,
      source: source,
      updated_at: data.updated_at || new Date().toISOString(),
    };
  }

  function saveCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: data,
        cached_at: Date.now(),
      }));
    } catch (_) { /* quota exceeded / privado */ }
  }

  function loadCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var wrap = JSON.parse(raw);
      if (!wrap || !wrap.data || !wrap.cached_at) return null;
      if (Date.now() - wrap.cached_at > CACHE_MAX_AGE_MS) return null;
      return isValid(wrap.data) ? wrap.data : null;
    } catch (_) { return null; }
  }

  function fetchApi() {
    return fetch(API_URL, { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); })
      .then(function (d) {
        if (!isValid(d)) throw new Error('resposta invalida');
        return d;
      });
  }

  function fetchSnapshot() {
    return fetch(SNAPSHOT_URL, { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); })
      .then(function (d) {
        if (!isValid(d)) throw new Error('snapshot invalido');
        return d;
      });
  }

  function publish(data) {
    window.VITRINE = data;
    document.dispatchEvent(new CustomEvent('vitrine:ready', { detail: data }));
  }

  function fail(err) {
    console.warn('[vitrine] todas as fontes falharam:', err && err.message);
    document.dispatchEvent(new CustomEvent('vitrine:error', { detail: { error: err } }));
  }

  // 1) tenta API
  fetchApi()
    .then(function (d) {
      var norm = normalize(d, 'api');
      saveCache(norm);
      publish(norm);
    })
    .catch(function (apiErr) {
      // 2) cache local
      var cached = loadCache();
      if (cached) {
        console.warn('[vitrine] API falhou, usando cache localStorage. Motivo:', apiErr.message);
        publish(cached); // cache ja esta normalizado
        return;
      }
      // 3) snapshot estatico
      fetchSnapshot()
        .then(function (d) {
          console.warn('[vitrine] API + cache falharam, usando snapshot estatico. Motivo:', apiErr.message);
          publish(normalize(d, 'snapshot'));
        })
        .catch(function (snapErr) {
          fail(new Error('API: ' + apiErr.message + ' | snapshot: ' + snapErr.message));
        });
    });
})();
