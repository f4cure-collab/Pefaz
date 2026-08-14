#!/usr/bin/env node
/**
 * generate-lp-schema.js
 *
 * Gera <script type="application/ld+json"> com Product + Offer nas LPs de
 * curso, com os 5 campos que o Google Search Console pediu (2026-08-14):
 *   1. offers.priceSpecification.validFrom
 *   2. offers.shippingDetails
 *   3. offers.validFrom
 *   4. brand / sku / productID (identificador global — GTIN nao existe pra
 *      curso online, entao usamos brand + productID que o Google aceita)
 *   5. offers.hasMerchantReturnPolicy
 *
 * O bloco fica entre marcadores <!-- schema:start --> ... <!-- schema:end -->
 * pra ser IDEMPOTENTE: rodar de novo substitui, nao empilha. Se os marcadores
 * nao existirem na LP, sao inseridos antes de </head>.
 *
 * Preco vem do backend Allaser em https://cursos.allaser.com.br/api/catalog.php
 * (mesmo canal que o Api.syncPrices() usa em runtime).
 *
 * Uso:
 *   node scripts/generate-lp-schema.js
 *
 * Rodado 1x/dia por .github/workflows/refresh-schema.yml pra manter preco
 * sincronizado se mudar no backend.
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const ROOT       = path.join(__dirname, '..');
const CATALOG    = 'https://cursos.allaser.com.br/api/catalog.php';
const SITE       = 'https://allaser.com.br';
const MARK_START = '<!-- schema:start (gerado por generate-lp-schema.js — nao editar) -->';
const MARK_END   = '<!-- schema:end -->';
const TODAY      = new Date().toISOString().slice(0, 10);
const NEXT_YEAR  = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

/**
 * Mapa LP → slug canonico do produto no catalog.php.
 * Os data-produto das LPs usam aliases descritivos que o backend resolve, mas
 * catalog.php usa o slug canonico. Este mapa faz a ponte.
 * LPs sem produto vendavel (ex: masterclasses/laserterapia-na-pratica) ficam
 * de fora — nao geram Product/Offer.
 */
const LP_PRODUTO = {
  'lps/cursos/start-laser.html':                       'start-laser',
  'lps/cursos/start-laser-poa.html':                   'curso-presencial-de-laserterapia-para-profissionais-da-saude-starlaser-18-e-19-de-setembro-porto-alegre-rs',
  'lps/cursos/ilib.html':                              'ilib',
  'lps/cursos/fotoneuromodulacao.html':                'fotoneuromodulacao',
  'lps/cursos/fotobiomodulacao-na-oncologia.html':     'curso-area-especifica-fotobiomodulacao-na-oncologia',
  'lps/cursos/feridas.html':                           'feridas',
  'lps/cursos/fisioterapia.html':                      'fisioterapia',
  'lps/cursos/pos-parto.html':                         'pos-parto-pediatria',
  'lps/cursos/especialidades-medicas.html':            'combo-start-medicas',
  'lps/cursos/saude-da-mulher.html':                   'mini-saude-mulher',
  'lps/cursos/fbm-estetica-facial.html':               'curso-area-especifica-fotobiomodulacao-na-estetica-facial',
  'lps/cursos/hands-on-dosimetria-01-08-2026.html':    'hands-on-dosimetria',
  'lps/masterclasses/bronquiolite.html':               'mc-bronquiolite',
  'lps/masterclasses/rinite.html':                     'mc-rinite',
  'lps/masterclasses/fotobiomodulacao-oncologia.html': 'masterclass-fotobiomodulacao-na-oncologia',
};

/* ─── fetch UTF-8 seguro ─────────────────────────────── */
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'allaser-schema-gen/1.0' } }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
        catch (e) { reject(new Error(`JSON parse ${url}: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

/* ─── helpers ────────────────────────────────────────── */
function attr(html, name) {
  const m = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'));
  return m ? m[1] : null;
}
function ogAttr(html, prop) {
  const m = html.match(new RegExp(`<meta[^>]*property=["']${prop}["'][^>]*content=["']([^"']*)["']`, 'i'));
  return m ? m[1] : null;
}
function titleTag(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? m[1].trim() : null;
}
function firstImgSrc(html) {
  // Pega uma imagem representativa do curso. Ordem de preferencia:
  //  1) Imagem hero (em /lps/assets/ ou com "hero"/"capa"/"cover" no path)
  //  2) Qualquer imagem que nao seja logo/favicon/icon
  //  3) Fallback: primeira imagem raster qualquer
  const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1])
    .filter(s => /\.(png|jpe?g|webp)$/i.test(s));
  const excluded = /(logo|favicon|icon|selo)/i;
  const preferred = imgs.find(s => /\/lps\/(assets|images)|hero|capa|cover/i.test(s) && !excluded.test(s));
  if (preferred) return preferred;
  const nonLogo = imgs.find(s => !excluded.test(s));
  return nonLogo || imgs[0] || null;
}
function absolute(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/'))    return SITE + url;
  return SITE + '/' + url;
}

/* ─── monta o JSON-LD ────────────────────────────────── */
function buildSchema({ lpPath, produto, html }) {
  // Prefere o nome canonico do produto (sem sufixos "| Allaser") ao <title>.
  const nome        = produto.name || titleTag(html);
  const descricao   = attr(html, 'description') || nome;
  const imagem      = absolute(ogAttr(html, 'og:image') || firstImgSrc(html) || produto.cover);
  const urlCanonica = SITE + '/' + lpPath.replace(/\.html$/, '').replace(/\\/g, '/');
  const priceStr    = String(produto.price);

  return {
    '@context': 'https://schema.org',
    '@type':    'Product',
    name:       nome,
    description: descricao,
    image:      imagem,
    brand:      { '@type': 'Brand', name: 'Allaser' },
    sku:        String(produto.product_id),
    productID:  produto.slug,
    offers: {
      '@type':          'Offer',
      url:              urlCanonica,
      priceCurrency:    'BRL',
      price:            priceStr,
      priceValidUntil:  NEXT_YEAR,
      validFrom:        TODAY,
      availability:     'https://schema.org/InStock',
      itemCondition:    'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Allaser Cursos' },
      priceSpecification: {
        '@type':        'UnitPriceSpecification',
        priceCurrency:  'BRL',
        price:          priceStr,
        validFrom:      TODAY,
      },
      // Curso online — sem envio fisico. Google exige shippingDetails mesmo
      // pra digital: usa MonetaryAmount 0 + handling/transit 0 dias.
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'BRL' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'BR' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
          transitTime:  { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
        },
      },
      // Politica de reembolso: art. 49 CDC (7 dias corridos), ja documentada
      // em /termos-e-condicoes secao 6.
      hasMerchantReturnPolicy: {
        '@type':                 'MerchantReturnPolicy',
        applicableCountry:       'BR',
        returnPolicyCategory:    'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays:      7,
        returnMethod:            'https://schema.org/ReturnByMail',
        returnFees:              'https://schema.org/FreeReturn',
      },
    },
  };
}

/* ─── injeta no HTML entre os marcadores ─────────────── */
function inject(html, blockHtml) {
  const startIdx = html.indexOf(MARK_START);
  const endIdx   = html.indexOf(MARK_END);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    // Substitui bloco existente
    return html.slice(0, startIdx) + blockHtml + html.slice(endIdx + MARK_END.length);
  }
  // Insere antes de </head>
  const headClose = html.match(/<\/head>/i);
  if (!headClose) throw new Error('sem </head>');
  const idx = headClose.index;
  return html.slice(0, idx) + blockHtml + '\n' + html.slice(idx);
}

/* ─── main ───────────────────────────────────────────── */
async function main() {
  console.log(`\n🔍 Buscando catalogo de ${CATALOG}...`);
  const catResp = await fetchJSON(CATALOG);
  if (!catResp.ok) throw new Error(`catalog.php retornou ok=false`);
  const bySlug = {};
  catResp.products.forEach(p => { bySlug[p.slug] = p; });
  console.log(`   ${catResp.products.length} produtos no catalogo.`);

  const entries = Object.entries(LP_PRODUTO);
  console.log(`\n📝 Gerando schema em ${entries.length} LPs...\n`);

  let okCount = 0, missing = [];
  for (const [lpPath, slug] of entries) {
    const produto = bySlug[slug];
    if (!produto) {
      console.log(`   ⚠  ${lpPath}: produto '${slug}' nao esta no catalogo — pulei.`);
      missing.push({ lpPath, slug });
      continue;
    }
    const full = path.join(ROOT, lpPath);
    if (!fs.existsSync(full)) {
      console.log(`   ⚠  ${lpPath}: LP nao existe — pulei.`);
      continue;
    }
    const html = fs.readFileSync(full, 'utf8');
    const schema = buildSchema({ lpPath, produto, html });
    const blockHtml =
      MARK_START + '\n' +
      '<script type="application/ld+json">\n' +
      JSON.stringify(schema, null, 2) + '\n' +
      '</script>\n' +
      MARK_END;
    fs.writeFileSync(full, inject(html, blockHtml), 'utf8');
    console.log(`   ✓ ${lpPath}  ·  ${produto.name.slice(0, 50)}  ·  R$ ${produto.price}`);
    okCount++;
  }

  console.log(`\n✅ ${okCount} LPs com schema atualizado.`);
  if (missing.length) {
    console.log(`\n⚠  ${missing.length} LPs sem produto correspondente no catalogo:`);
    missing.forEach(m => console.log(`     ${m.lpPath}  (procurava '${m.slug}')`));
    console.log(`   Atualize o mapa LP_PRODUTO no topo do script se o slug mudou.`);
  }
  console.log('');
}

main().catch(err => { console.error('Erro:', err.message); process.exit(1); });
