/* Captura UTM + URL da pagina de chegada em sessionStorage.
   Preserva o "primeiro touch": se ja existe registro na sessao, nao sobrescreve.
   Motivo: usuario pode chegar pela LP, navegar (Home, /sobre, etc) e voltar
   pra preencher o form. Sem isso, o second-hit sem UTM perderia a origem.

   Uso no submit:
     var payload = Object.assign({ name, email, ... }, getUtm());

   Retorna sempre um objeto com as 6 chaves. Valores nao presentes = string vazia. */
(function () {
  var KEY = 'allaser_utm_v1';
  var FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  function read() {
    try {
      var raw = sessionStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }
  function write(obj) {
    try { sessionStorage.setItem(KEY, JSON.stringify(obj)); } catch (_) {}
  }

  // Chegada: captura da URL atual so se ainda nao houver registro na sessao
  if (!read()) {
    var params = new URLSearchParams(location.search);
    var data = { pagina: location.href };
    var hasUtm = false;
    FIELDS.forEach(function (k) {
      var v = params.get(k);
      if (v) { data[k] = v; hasUtm = true; } else { data[k] = ''; }
    });
    // So persiste se veio pelo menos 1 UTM OU se e primeira visita da sessao
    // (para sempre ter 'pagina' de landing preservada)
    if (hasUtm || !sessionStorage.getItem(KEY + '_seen')) {
      write(data);
      try { sessionStorage.setItem(KEY + '_seen', '1'); } catch (_) {}
    }
  }

  window.getUtm = function () {
    var stored = read() || {};
    var out = { pagina: stored.pagina || location.href };
    FIELDS.forEach(function (k) { out[k] = stored[k] || ''; });
    return out;
  };
})();
