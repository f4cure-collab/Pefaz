#!/usr/bin/env node
/**
 * generate-blog.js
 * Gera páginas estáticas do blog a partir da API WordPress da Allaser.
 *
 * Uso:
 *   node scripts/generate-blog.js          → protótipo (5 posts)
 *   node scripts/generate-blog.js --all    → todos os posts
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const API_BASE = 'https://allaser.com.br/wp-json/wp/v2';
const ROOT     = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const IS_ALL   = process.argv.includes('--all');
const PER_PAGE = IS_ALL ? 100 : 5;

/* ─── helpers ────────────────────────────────────────── */
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'allaser-blog-generator/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error on ${url}: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

function getFeaturedImage(post) {
  try { return post._embedded['wp:featuredmedia'][0].source_url; }
  catch { return null; }
}

function hasImage(post) {
  return !!getFeaturedImage(post);
}

function getCats(post, catMap) {
  return (post.categories || []).map(id => catMap[id]).filter(Boolean);
}

// Remove 'outros' de posts que já têm outras categorias
function getEffectiveCats(post, catMap) {
  const cats = getCats(post, catMap);
  if (cats.length > 1) return cats.filter(c => c.slug !== 'outros');
  return cats;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').trim();
}

/* ─── posts relacionados ─────────────────────────────── */
function getRelated(post, allPosts, catMap, count = 4) {
  const catIds = new Set(post.categories);
  return allPosts
    .filter(p => p.id !== post.id && hasImage(p) && p.categories.some(c => catIds.has(c)))
    .slice(0, count)
    .map(p => ({
      slug:    p.slug,
      title:   p.title.rendered,
      img:     getFeaturedImage(p),
      date:    formatDate(p.date),
      cats:    getCats(p, catMap).map(c => c.name),
    }));
}

/* ─── sidebar HTML ───────────────────────────────────── */
const SIDEBAR_HTML = `
<aside class="blog-sidebar">
  <div class="sidebar-cta">
    <a href="/cursos.html" class="sidebar-cta__banner-link">
      <img src="/assets/images/curso-start-laser.png" alt="Start Laser — Allaser" class="sidebar-cta__banner">
    </a>
    <a href="/cursos.html" class="sidebar-cta__btn">
      Ver todos os cursos
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </a>
  </div>
  <div class="sidebar-social">
    <div class="sidebar-social__title">Siga a Allaser</div>
    <div class="sidebar-social__links">
      <a href="https://www.instagram.com/allasercursos/" class="sidebar-social__link" target="_blank" aria-label="Instagram">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        Instagram
      </a>
      <a href="https://www.facebook.com/allasercursos/" class="sidebar-social__link" target="_blank" aria-label="Facebook">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        Facebook
      </a>
      <a href="https://www.youtube.com/channel/UCi2XzOh-qyQVbvzp-dhlXwQ" class="sidebar-social__link" target="_blank" aria-label="YouTube">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/></svg>
        YouTube
      </a>
      <a href="https://t.me/joinchat/RyIIC3EHIik_JZIA" class="sidebar-social__link" target="_blank" aria-label="Telegram">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
        Telegram
      </a>
    </div>
  </div>
</aside>`;

/* ─── templates ──────────────────────────────────────── */
const GTM_HEAD = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KTHL2SP9');</script>
<!-- End Google Tag Manager -->`;

const GTM_BODY = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KTHL2SP9"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

const PIXEL = `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '885615589651085');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=885615589651085&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel Code -->`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`;

/* ─── Post page ──────────────────────────────────────── */
function generatePostPage(post, catMap, allPosts) {
  const title     = post.title.rendered;
  const content   = post.content.rendered;
  const excerpt   = stripHtml(post.excerpt.rendered).substring(0, 160);
  const img       = getFeaturedImage(post);
  const cats      = getEffectiveCats(post, catMap);
  const date      = formatDate(post.date);
  const catBadges = cats.map(c => `<span class="post-cat">${c.name}</span>`).join('');
  const related   = getRelated(post, allPosts, catMap, 4);

  const relatedHTML = related.length ? `
<section class="related-posts">
  <div class="related-wrap">
    <h2 class="related-title">Conteúdos relacionados</h2>
    <div class="related-grid">
      ${related.map(r => `
      <a href="/blog/${r.slug}.html" class="related-card">
        <div class="related-card__img-wrap">
          <img src="${r.img}" class="related-card__img-bg" aria-hidden="true" loading="lazy">
          <img src="${r.img}" alt="${r.title}" class="related-card__img" loading="lazy">
        </div>
        <div class="related-card__body">
          ${r.cats.length ? `<span class="related-card__cat">${r.cats[0]}</span>` : ''}
          <h3 class="related-card__title">${r.title}</h3>
          <span class="related-card__date">${r.date}</span>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>` : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} · Blog Allaser</title>
<meta name="description" content="${excerpt}">
${FONTS}
<link rel="stylesheet" href="/assets/shared.css">
<style>
.post-hero {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 64px 0 48px;
}
.post-hero__inner {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 32px;
}
.post-hero__cats { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.post-cat {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 99px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(154,170,26,0.10);
  color: #9aaa1a;
  border: 1px solid rgba(154,170,26,0.25);
}
.post-hero__title {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(26px, 4vw, 44px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #1a1a1a;
  margin-bottom: 16px;
}
.post-hero__meta { font-size: 0.82rem; color: #8e8e8e; }
.post-featured-wrap {
  width: 100%;
  background: #f0f0ec;
  display: flex;
  justify-content: center;
}
.post-featured-img {
  display: block;
  width: 100%;
  max-width: 900px;
  height: auto;
}
.post-body {
  max-width: 760px;
  margin: 0 auto;
  padding: 52px 32px 96px;
}
.post-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #7a8f1c;
  margin-bottom: 44px;
  text-decoration: none;
  transition: gap 0.2s;
}
.post-back:hover { gap: 12px; }
.post-back svg { width: 16px; height: 16px; }
.post-content { font-size: 1rem; line-height: 1.85; color: #2a2a2a; }
.post-content h2 { font-size: 1.5rem; font-weight: 700; margin: 44px 0 16px; line-height: 1.25; color: #111; }
.post-content h3 { font-size: 1.2rem; font-weight: 700; margin: 36px 0 12px; line-height: 1.3; color: #111; }
.post-content h4 { font-size: 1rem; font-weight: 700; margin: 28px 0 10px; color: #111; }
.post-content p { margin-bottom: 20px; }
.post-content ul, .post-content ol { margin: 0 0 20px 24px; }
.post-content li { margin-bottom: 8px; }
.post-content img { max-width: 100%; border-radius: 10px; margin: 28px auto; display: block; }
.post-content blockquote {
  border-left: 3px solid #aebf3c;
  padding: 8px 0 8px 24px;
  margin: 28px 0;
  color: #555;
  font-style: italic;
}
.post-content a { color: #7a8f1c; }
.post-content a:hover { text-decoration: underline; }
.post-content figure { margin: 28px 0; }
.post-content figcaption { font-size: 0.8rem; color: #999; text-align: center; margin-top: 8px; }
.post-content [class*="wp-block"] { all: unset; display: revert; }
.post-content .wp-block-image { display: block; margin: 28px 0; }
.post-content .wp-block-image img { max-width: 100%; border-radius: 10px; }

/* ── Posts relacionados ──────────────────────── */
.related-posts {
  background: #f5f5f3;
  border-top: 1px solid #e8e8e8;
  padding: 64px 0 80px;
}
.related-wrap { max-width: 1100px; margin: 0 auto; padding: 0 32px; }
.related-title {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.02em;
  margin-bottom: 32px;
}
.related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.related-card { display: flex; flex-direction: column; text-decoration: none; border-radius: 12px; overflow: hidden; background: #fff; border: 1px solid #ebebeb; transition: box-shadow 0.2s, transform 0.2s; }
.related-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
.related-card__img-wrap { position: relative; overflow: hidden; aspect-ratio: 1 / 1; background: #e8e8e4; }
.related-card__img-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: blur(16px); transform: scale(1.15); }
.related-card__img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: contain; display: block; transition: transform 0.3s; }
.related-card:hover .related-card__img { transform: scale(1.03); }
.related-card__body { padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.related-card__cat {
  font-family: 'Outfit', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9aaa1a;
}
.related-card__title { font-size: 0.88rem; font-weight: 700; color: #1a1a1a; line-height: 1.35; }
.related-card__date { font-size: 0.72rem; color: #aaa; margin-top: auto; }

@media (max-width: 960px) { .related-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) {
  .post-hero { padding: 60px 0 40px; }
  .post-hero__inner, .post-body { padding-left: 20px; padding-right: 20px; }
  .related-wrap { padding: 0 20px; }
  .related-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .related-posts { padding: 48px 0 60px; }
}
</style>
${GTM_HEAD}
${PIXEL}
</head>
<body>
${GTM_BODY}
<div id="site-header"></div>
<main id="main-content">
  <div class="post-hero">
    <div class="post-hero__inner">
      ${cats.length ? `<div class="post-hero__cats">${catBadges}</div>` : ''}
      <h1 class="post-hero__title">${title}</h1>
      <div class="post-hero__meta">${date}</div>
    </div>
  </div>
  ${img ? `<div class="post-featured-wrap"><img class="post-featured-img" src="${img}" alt="${title}" loading="lazy"></div>` : ''}
  <div class="post-body">
    <a href="/blog.html" class="post-back">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      Voltar ao Blog
    </a>
    <div class="post-content">${content}</div>
  </div>
</main>
${relatedHTML}
<div id="site-footer"></div>
<script src="/assets/components.js"></script>
<script src="/assets/shared.js"></script>
<script>setActiveNav('blog');</script>
</body>
</html>`;
}

/* ─── Blog index ─────────────────────────────────────── */
function generateBlogIndex(posts, catMap) {
  const usedCatIds = [...new Set(posts.flatMap(p => getEffectiveCats(p, catMap).map(c => c.id)))];
  const CAT_ORDER  = { 'laserterapia': 0 };
  const usedCats   = usedCatIds.map(id => catMap[id]).filter(Boolean)
    .sort((a, b) => {
      if (a.slug === 'outros') return 1;
      if (b.slug === 'outros') return -1;
      const pa = CAT_ORDER[a.slug] ?? 99;
      const pb = CAT_ORDER[b.slug] ?? 99;
      if (pa !== pb) return pa - pb;
      return a.name.localeCompare(b.name, 'pt-BR');
    });

  const catFilters = [
    `<button class="blog-filter active" data-cat="all">Todos</button>`,
    ...usedCats.map(c => `<button class="blog-filter" data-cat="${c.id}">${c.name}</button>`)
  ].join('\n    ');

  const cards = posts.map(post => {
    const img       = getFeaturedImage(post);
    const cats      = getEffectiveCats(post, catMap);
    const date      = formatDate(post.date);
    const excerpt   = stripHtml(post.excerpt.rendered).substring(0, 150);
    const catIds    = cats.map(c => String(c.id)).join(',');
    const catBadges = cats.map(c => `<span class="blog-card__cat">${c.name}</span>`).join('');

    return `
  <article class="blog-card" data-cats="${catIds}">
    <a href="/blog/${post.slug}.html" class="blog-card__img-wrap">
      <img src="${img}" class="blog-card__img-bg" aria-hidden="true" loading="lazy">
      <img src="${img}" alt="${post.title.rendered}" class="blog-card__img" loading="lazy">
    </a>
    <div class="blog-card__body">
      ${cats.length ? `<div class="blog-card__cats">${catBadges}</div>` : ''}
      <h2 class="blog-card__title"><a href="/blog/${post.slug}.html">${post.title.rendered}</a></h2>
      <p class="blog-card__excerpt">${excerpt}…</p>
      <div class="blog-card__foot">
        <span class="blog-card__date">${date}</span>
        <a href="/blog/${post.slug}.html" class="blog-card__read">Ler mais →</a>
      </div>
    </div>
  </article>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog — Allaser</title>
<meta name="description" content="Artigos sobre laserterapia, fotobiomodulação e aplicações clínicas para profissionais de saúde.">
${FONTS}
<link rel="stylesheet" href="/assets/shared.css">
<style>
/* ── Blog hero ───────────────────────────────── */
.blog-hero {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 72px 24px 56px;
  text-align: center;
}
.blog-hero__inner { max-width: 640px; margin: 0 auto; }
.blog-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9aaa1a;
  margin-bottom: 20px;
}
.blog-hero__eyebrow::before,
.blog-hero__eyebrow::after {
  content: '';
  display: block;
  width: 28px;
  height: 1.5px;
  background: #9aaa1a;
  opacity: 0.4;
  border-radius: 1px;
}
.blog-hero__title {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.08;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}
.blog-hero__title span { background: linear-gradient(135deg, #9aaa1a, #c9dc44); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.blog-hero__sub { font-size: 1rem; color: #8e8e8e; line-height: 1.6; max-width: 520px; margin: 0 auto; }

/* ── Blog layout ─────────────────────────────── */
.blog-main { padding: 64px 0 100px; background: #f8f8f6; }
.blog-wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
.blog-layout { display: grid; grid-template-columns: 1fr 300px; gap: 48px; align-items: start; }

/* ── Filters ─────────────────────────────────── */
.blog-filters { display: grid; grid-template-columns: repeat(5, max-content); gap: 10px; margin-bottom: 36px; }
.blog-filter {
  padding: 8px 20px;
  border-radius: 99px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  background: white;
  border: 1.5px solid #e0e0dc;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}
.blog-filter:hover, .blog-filter.active {
  background: #c9dc44;
  border-color: #c9dc44;
  color: #1a1a1a;
}

/* ── Cards ───────────────────────────────────── */
.blog-grid-wrap {
  max-height: 900px;
  overflow-y: auto;
  padding-right: 8px;
  scrollbar-width: thin;
  scrollbar-color: #c9dc44 #f0f0ec;
}
.blog-grid-wrap::-webkit-scrollbar { width: 5px; }
.blog-grid-wrap::-webkit-scrollbar-track { background: #f0f0ec; border-radius: 4px; }
.blog-grid-wrap::-webkit-scrollbar-thumb { background: #c9dc44; border-radius: 4px; }
.blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding-bottom: 4px; }
.blog-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #ebebeb;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
}
.blog-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.09); transform: translateY(-2px); }
.blog-card.hidden { display: none; }
.blog-card__img-wrap { position: relative; display: block; overflow: hidden; background: #e8e8e4; aspect-ratio: 1 / 1; }
.blog-card__img-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: blur(16px); transform: scale(1.15); }
.blog-card__img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: contain; display: block; transition: transform 0.35s; }
.blog-card__img-wrap:hover .blog-card__img { transform: scale(1.02); }
.blog-card__body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.blog-card__cats { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.blog-card__cat {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7a8f1c;
  background: rgba(154,170,26,0.10);
  padding: 3px 10px;
  border-radius: 99px;
}
.blog-card__title { font-size: 0.95rem; font-weight: 700; line-height: 1.35; margin-bottom: 10px; }
.blog-card__title a { color: #1a1a1a; text-decoration: none; }
.blog-card__title a:hover { color: #7a8f1c; }
.blog-card__excerpt { font-size: 0.82rem; color: #666; line-height: 1.65; margin-bottom: 16px; flex: 1; }
.blog-card__foot { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.blog-card__date { font-size: 0.74rem; color: #aaa; }
.blog-card__read { font-size: 0.80rem; font-weight: 600; color: #9aaa1a; text-decoration: none; }
.blog-card__read:hover { text-decoration: underline; }

/* ── Sidebar ─────────────────────────────────── */
.blog-sidebar { position: sticky; top: 84px; display: flex; flex-direction: column; gap: 24px; }

.sidebar-cta {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.sidebar-cta__banner-link { display: block; }
.sidebar-cta__banner {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s;
}
.sidebar-cta__banner-link:hover .sidebar-cta__banner { transform: scale(1.02); }
.sidebar-cta__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px;
  padding: 12px 20px;
  background: #c9dc44;
  color: #1a1a1a;
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  border-radius: 99px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}
.sidebar-cta__btn:hover { background: #d8ec5a; transform: translateY(-1px); }
.sidebar-cta__btn svg { width: 15px; height: 15px; }

.sidebar-social {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  padding: 20px 24px;
}
.sidebar-social__title {
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 14px;
}
.sidebar-social__links { display: flex; flex-direction: column; gap: 8px; }
.sidebar-social__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.sidebar-social__link:hover { background: #f5f5f3; color: #1a1a1a; }
.sidebar-social__link svg { width: 17px; height: 17px; flex-shrink: 0; }

@media (max-width: 1024px) {
  .blog-layout { grid-template-columns: 1fr; }
  .blog-sidebar { position: static; flex-direction: row; flex-wrap: wrap; }
  .sidebar-cta { flex: 1; min-width: 260px; }
  .sidebar-social { flex: 0 0 auto; }
  .blog-grid { grid-template-columns: repeat(2, 1fr); }
  .blog-grid-wrap { max-height: 800px; }
}
@media (max-width: 600px) {
  .blog-grid { grid-template-columns: 1fr; }
  .blog-grid-wrap { max-height: 700px; padding-right: 4px; }
  .blog-wrap { padding: 0 20px; }
  .blog-hero { padding: 60px 0 40px; }
  .blog-main { padding: 48px 0 72px; }
  .blog-sidebar { flex-direction: column; }
}
</style>
${GTM_HEAD}
${PIXEL}
</head>
<body>
${GTM_BODY}
<div id="site-header"></div>
<main id="main-content">
  <div class="blog-hero">
    <div class="blog-hero__inner">
      <div class="blog-hero__eyebrow">Blog</div>
      <h1 class="blog-hero__title">Conhecimento em <span>Laserterapia</span></h1>
      <p class="blog-hero__sub">Artigos científicos e práticos sobre fotobiomodulação, laserterapia e suas aplicações clínicas.</p>
    </div>
  </div>
  <section class="blog-main">
    <div class="blog-wrap">
      <div class="blog-filters">
    ${catFilters}
      </div>
      <div class="blog-layout">
        <div>
          <div class="blog-grid-wrap" id="blogGridWrap">
            <div class="blog-grid" id="blogGrid">
${cards}
            </div>
          </div>
        </div>
        ${SIDEBAR_HTML}
      </div>
    </div>
  </section>
</main>
<div id="site-footer"></div>
<script src="/assets/components.js"></script>
<script src="/assets/shared.js"></script>
<script>
setActiveNav('blog');
document.querySelectorAll('.blog-filter').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.blog-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    var cat = btn.dataset.cat;
    document.querySelectorAll('.blog-card').forEach(function(card) {
      if (cat === 'all') {
        card.classList.remove('hidden');
      } else {
        var cats = card.dataset.cats.split(',');
        card.classList.toggle('hidden', !cats.includes(cat));
      }
    });
  });
});
</script>
</body>
</html>`;
}

/* ─── main ───────────────────────────────────────────── */
async function main() {
  console.log(`\n🔍 Buscando categorias...`);
  const categories = await fetchJSON(`${API_BASE}/categories?per_page=100`);
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = { id: c.id, name: c.name, slug: c.slug }; });
  console.log(`   ${categories.length} categorias encontradas`);

  console.log(`\n🔍 Buscando posts (per_page=${PER_PAGE})...`);
  const allPosts = await fetchJSON(`${API_BASE}/posts?per_page=${PER_PAGE}&_embed=true`);
  console.log(`   ${allPosts.length} posts encontrados`);

  // Filtra apenas posts com imagem
  const posts = allPosts.filter(hasImage);
  console.log(`   ${posts.length} posts com imagem (${allPosts.length - posts.length} sem imagem ignorados)`);

  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

  console.log(`\n📝 Gerando páginas individuais...`);
  for (const post of posts) {
    const html = generatePostPage(post, catMap, posts);
    const outPath = path.join(BLOG_DIR, `${post.slug}.html`);
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`   ✓ blog/${post.slug}.html`);
  }

  console.log(`\n📋 Gerando blog.html (índice)...`);
  const indexHtml = generateBlogIndex(posts, catMap);
  fs.writeFileSync(path.join(ROOT, 'blog.html'), indexHtml, 'utf8');
  console.log(`   ✓ blog.html`);

  console.log(`\n✅ Concluído! ${posts.length} posts + blog.html gerados.\n`);
  if (!IS_ALL) {
    console.log(`   Para gerar TODOS os posts: node scripts/generate-blog.js --all\n`);
  }
}

main().catch(err => { console.error('Erro:', err.message); process.exit(1); });
