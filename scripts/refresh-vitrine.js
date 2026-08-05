#!/usr/bin/env node
/*
 * refresh-vitrine.js
 * Rebaixa o snapshot da vitrine do sistema Allaser e grava em
 * assets/cursos-snapshot.json. Roda no CI antes do deploy pra
 * garantir snapshot sempre atualizado — e serve de fallback caso
 * a API caia em runtime no navegador do visitante.
 *
 * REGRAS (todas exigidas pelo agente do sistema):
 *   1. So grava se resposta vier ok:true E count > 0
 *   2. Qualquer outra coisa (erro, timeout, lista vazia) MANTEM
 *      o snapshot anterior. Vitrine vazia e o unico desfecho
 *      inaceitavel.
 *   3. Grava updated_at pra debug de idade
 *   4. Se manteve snapshot anterior (API fora), imprime AVISO
 *      no log do deploy. Sem isso, API pode ficar dias fora e
 *      site continua publicando bonito, escondendo o problema.
 *
 * Uso local:   node scripts/refresh-vitrine.js
 * Uso no CI:   step chamado no .github/workflows/main.yml antes do FTP
 *
 * Saidas de log padronizadas:
 *   [vitrine] OK  - snapshot regenerado (X cursos)
 *   [vitrine] WARN - API falhou, mantendo snapshot anterior
 *   [vitrine] ERRO - nunca gera exit code != 0 (nao trava o deploy;
 *                    a versao antiga funciona)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_URL = 'https://admin.allaser.com.br/api/site-courses.php?slug=allaser';
const OUT = path.join(__dirname, '..', 'assets', 'cursos-snapshot.json');
const TIMEOUT_MS = 15000;

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: TIMEOUT_MS, headers: {
      'User-Agent': 'allaser-vitrine-refresh/1.0',
      'Accept': 'application/json',
    }}, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        } catch (e) { reject(new Error('resposta nao e JSON valido')); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`timeout ${TIMEOUT_MS}ms`)); });
  });
}

function ageDays(filepath) {
  try {
    const stat = fs.statSync(filepath);
    return ((Date.now() - stat.mtimeMs) / 86400000).toFixed(1);
  } catch { return '?'; }
}

(async () => {
  try {
    const data = await fetchJson(API_URL);

    // Regra 1: so grava se ok:true e count > 0
    if (!data || data.ok !== true) {
      throw new Error(`API respondeu ok:${data && data.ok}`);
    }
    if (!Array.isArray(data.courses) || data.courses.length === 0) {
      throw new Error(`lista vazia (count=${data.count})`);
    }
    if (!Array.isArray(data.categorias) || data.categorias.length === 0) {
      throw new Error('sem categorias');
    }

    // Regra 3: grava updated_at
    data.updated_at = new Date().toISOString();
    data.source = API_URL;

    fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
    console.log(`[vitrine] OK - snapshot regenerado: ${data.count} cursos, ${data.categorias.length} categorias`);
    console.log(`[vitrine]     updated_at: ${data.updated_at}`);
    process.exit(0);
  } catch (err) {
    // Regra 2: mantem snapshot anterior
    // Regra 4: AVISO bem visivel no log
    const idade = ageDays(OUT);
    const existe = fs.existsSync(OUT);
    console.warn('');
    console.warn('═══════════════════════════════════════════════════════════');
    console.warn(`[vitrine] WARN - API FALHOU: ${err.message}`);
    if (existe) {
      console.warn(`[vitrine]     mantendo snapshot anterior (${idade} dias de idade)`);
      console.warn(`[vitrine]     site vai continuar publicando a versao antiga`);
      console.warn(`[vitrine]     >>> INVESTIGAR se a API ficar fora repetidas vezes <<<`);
    } else {
      console.warn(`[vitrine]     NAO EXISTE snapshot anterior — home vai renderizar vazia`);
      console.warn(`[vitrine]     >>> URGENTE: verificar API antes do proximo deploy <<<`);
    }
    console.warn('═══════════════════════════════════════════════════════════');
    console.warn('');
    // Nao trava o deploy — versao antiga funciona.
    process.exit(0);
  }
})();
