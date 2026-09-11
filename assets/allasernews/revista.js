(() => {
  'use strict';
  const root = document.querySelector('[data-edition]');
  if (!root) return;
  const $ = id => document.getElementById(id);
  const slug = root.dataset.edition;
  const assets = `/assets/images/allasernews/${slug}/`;
  const imagePath = (index, thumb = false) => `${assets}${thumb ? 'miniatura' : 'pagina'}-${String(index + 1).padStart(2, '0')}.webp`;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Page turning is an explicitly requested interaction, independently switchable.
  let animateTurns = true;
  try { animateTurns = localStorage.getItem('allaser-news-motion') !== 'off'; } catch {}
  const cover = $('cover-stage');
  const reader = $('reader');
  const stage = $('book-stage');
  const book = $('flipbook');
  let edition, flip, current = 0, isOpen = false, resizeTimer, zoomPage = 0, zoomLevel = 1;
  const viewportScale = () => window.visualViewport?.scale || 1;
  const gestures = window.AllaserNewsGestures.install(book, {
    onSwipe: direction => turn(direction),
    getScale: viewportScale,
    enabled: () => isOpen && reader.dataset.turning !== 'true'
  });
  function syncViewportZoom() {
    root.classList.toggle('news-native-zoom', viewportScale() > 1.025);
  }
  window.visualViewport?.addEventListener('resize', syncViewportZoom, { passive: true });
  syncViewportZoom();
  const ready = fetch(`/assets/allasernews/${slug}.json`).then(r => {
    if (!r.ok) throw new Error('Conteúdo indisponível');
    return r.json();
  }).then(data => { edition = data; buildPages(); return data; });

  function safeURL(url) {
    try { const parsed = new URL(url); return ['https:', 'http:', 'tel:', 'mailto:'].includes(parsed.protocol) ? parsed.href : ''; }
    catch { return ''; }
  }
  function buildPages() {
    const pages = document.createDocumentFragment();
    const thumbs = document.createDocumentFragment();
    edition.pages.forEach((page, index) => {
      const element = document.createElement('div');
      element.className = 'news-page';
      element.dataset.page = index;
      element.dataset.density = index === 0 || index === edition.pages.length - 1 ? 'hard' : 'soft';
      element.setAttribute('aria-label', `Página ${index + 1}: ${page.title}`);
      const img = document.createElement('img');
      img.src = imagePath(index, index > 0);
      img.alt = `${index + 1} — ${page.title}. Use Ampliar para ver a página em detalhe.`;
      img.width = 1414; img.height = 2000; img.draggable = false; img.decoding = 'async';
      if (index === 0) img.dataset.full = 'true';
      element.append(img);
      page.hotspots.forEach(hotspot => {
        const url = safeURL(hotspot.url); if (!url) return;
        const link = document.createElement('a');
        link.className = 'news-hotspot'; link.href = url;
        link.target = '_blank'; link.rel = 'noopener noreferrer';
        link.title = hotspot.label; link.setAttribute('aria-label', `${hotspot.label} (nova aba)`);
        Object.assign(link.style, {left:`${hotspot.left}%`, top:`${hotspot.top}%`, width:`${hotspot.width}%`, height:`${hotspot.height}%`});
        element.append(link);
      });
      element.addEventListener('dblclick', e => { if (!e.target.closest('a')) openZoom(index); });
      pages.append(element);
      const thumb = document.createElement('button');
      thumb.className = 'news-thumbnail'; thumb.dataset.page = index;
      thumb.setAttribute('aria-label', `Ir para página ${index + 1}: ${page.title}`);
      const preview = document.createElement('img');
      preview.src = imagePath(index, true); preview.alt = ''; preview.width = 260; preview.height = 368; preview.loading = 'lazy';
      const number = document.createElement('small'); number.textContent = String(index + 1).padStart(2, '0');
      const name = document.createElement('span'); name.textContent = page.title;
      thumb.append(preview, number, name);
      thumb.addEventListener('click', () => { closeDialog($('index-dialog')); goTo(index); });
      thumbs.append(thumb);
      const option = document.createElement('option'); option.value = index; option.textContent = `Página ${index + 1}`; $('zoom-page').append(option);
    });
    book.append(pages); $('page-thumbnails').append(thumbs);
    $('page-progress').max = edition.pages.length;
    loadNearby(0);
  }
  function loadNearby(index) {
    for (let i = Math.max(0, index - 2); i <= Math.min(edition.pages.length - 1, index + 4); i++) {
      book.querySelectorAll(`.news-page[data-page="${i}"] > img`).forEach(img => {
        if (!img.dataset.full) {
          img.dataset.full = 'loading';
          const full = new Image();
          full.onload = () => book.querySelectorAll(`.news-page[data-page="${i}"] > img`).forEach(target => { target.src = full.src; target.dataset.full = 'true'; });
          full.onerror = () => { delete img.dataset.full; };
          full.src = imagePath(i);
        }
      });
    }
  }
  function sizeBook() {
    if (!isOpen || (book.style.height && (viewportScale() > 1.025 || gestures.isActive()))) return;
    const single = !flip || stage.clientWidth < 840;
    const maxHeight = Math.max(330, Math.min(780, window.innerHeight - (single ? 235 : 250)));
    const width = Math.min(stage.clientWidth, single ? 600 : 1120);
    const height = Math.min(maxHeight, width / (single ? 1 : 2) * 2000 / 1414);
    stage.style.height = `${height + 22}px`;
    book.style.width = `${width}px`; book.style.height = `${height}px`; book.style.minWidth = '0';
    if (flip) flip.getUI().update();
  }
  function initFlip() {
    if (flip) return;
    if (!window.St?.PageFlip) {
      book.classList.add('news-book-static');
      reader.dataset.turning = 'false';
      return;
    }
    sizeBook();
    flip = new St.PageFlip(book, {
      width: 500, height: 500 * 2000 / 1414,
      size: 'stretch', minWidth: 420, maxWidth: 560, minHeight: 200, maxHeight: 800,
      autoSize: false, showCover: true, usePortrait: true,
      drawShadow: animateTurns, maxShadowOpacity: .35, flippingTime: 1050,
      mobileScrollSupport: true, clickEventForward: true,
      showPageCorners: animateTurns && !reduced.matches, disableFlipByClick: false,
      useMouseEvents: true, startZIndex: 5
    });
    flip.on('flip', event => { current = event.data; update(); });
    flip.on('changeOrientation', () => { if (edition) update(); });
    flip.on('changeState', event => { reader.dataset.turning = event.data === 'read' ? 'false' : 'true'; });
    flip.loadFromHTML(book.querySelectorAll('.news-page'));
    sizeBook();
  }
  async function openReader(page = 1) {
    try {
      await ready;
      isOpen = true; cover.hidden = true; reader.hidden = false;
      document.body.classList.add('news-reading');
      initFlip();
      sizeBook();
      goTo(0, false);
      if (page > 0) {
        loadNearby(page);
        if (flip && animateTurns && page === 1) requestAnimationFrame(() => flip.flipNext('bottom'));
        else goTo(page, false);
      }
      update();
      reader.scrollIntoView({block:'start', behavior:reduced.matches ? 'instant' : 'smooth'});
      $('close-reader').focus({preventScroll:true});
    } catch (error) {
      isOpen = false; cover.hidden = false; reader.hidden = true; document.body.classList.remove('news-reading');
      const message = document.createElement('p');
      message.className = 'news-load-error';
      message.textContent = 'Não foi possível abrir a revista agora. Recarregue a página e tente novamente.';
      if (!cover.querySelector('.news-load-error')) cover.append(message);
    }
  }
  function goTo(index, animate = true) {
    index = Math.max(0, Math.min(edition.pages.length - 1, Number(index) || 0));
    loadNearby(index);
    if (!flip) { current = index; update(); }
    else if (animate && animateTurns) flip.flip(index, 'bottom');
    else { flip.turnToPage(index); current = flip.getCurrentPageIndex(); update(); }
  }
  function visibleIndices() {
    const spread = flip && flip.getOrientation() === 'landscape' && current > 0;
    return spread && current < edition.pages.length - 1 ? [current, current + 1] : [current];
  }
  function update() {
    if (!edition || !isOpen) return;
    const indices = visibleIndices();
    loadNearby(current);
    $('page-count').textContent = `${indices.length > 1 ? 'Páginas' : 'Página'} ${indices.map(i => i + 1).join('–')} de ${edition.pages.length}`;
    $('page-progress').value = current + 1;
    $('page-progress').setAttribute('aria-valuetext', `Página ${current + 1}: ${edition.pages[current].title}`);
    $('previous-page').disabled = current === 0;
    $('next-page').disabled = indices.at(-1) >= edition.pages.length - 1;
    $('reading-tip').textContent = window.matchMedia('(pointer: coarse)').matches ? 'Deslize para folhear · Afaste dois dedos para ampliar.' : (flip ? 'Clique ou arraste o canto para virar a folha.' : 'Use as setas para folhear ou Ampliar para ver os detalhes.');
    $('animation-toggle').hidden = !flip;
    $('animation-toggle').setAttribute('aria-pressed', String(animateTurns));
    $('animation-toggle').setAttribute('aria-label', animateTurns ? 'Desativar efeito de virada' : 'Ativar efeito de virada');
    $('animation-toggle').textContent = animateTurns ? 'Efeito de virada: ativado' : 'Efeito de virada: desativado';
    document.querySelectorAll('.news-thumbnail').forEach(t => t.setAttribute('aria-current', String(indices.includes(Number(t.dataset.page)))));
    book.querySelectorAll('.news-page').forEach(el => {
      const visible = indices.includes(Number(el.dataset.page));
      if (!flip) el.hidden = !visible;
      el.setAttribute('aria-hidden', String(!visible));
      el.querySelectorAll('a').forEach(a => a.tabIndex = visible ? 0 : -1);
    });
    const links = $('page-links'); links.replaceChildren();
    const seen = new Set();
    for (const i of indices) for (const item of edition.pages[i].links) {
      const url = safeURL(item.url); if (!url || seen.has(url)) continue;
      seen.add(url); const link = document.createElement('a');
      link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.textContent = `${item.label} ↗`; links.append(link);
    }
    history.replaceState(null, '', `#pagina-${current + 1}`);
  }
  function showDialog(dialog) { dialog.showModal(); document.body.classList.add('news-dialog-open'); }
  function closeDialog(dialog) { dialog.close(); document.body.classList.remove('news-dialog-open'); }
  function openZoom(index) {
    zoomPage = index; zoomLevel = 1;
    const img = $('zoom-image'); img.src = imagePath(index); img.alt = `Página ${index + 1}: ${edition.pages[index].title}`;
    $('zoom-title').textContent = `Página ${index + 1} de ${edition.pages.length}`;
    img.style.width = ''; $('zoom-reset').textContent = 'Ajustar'; $('zoom-page').value = index;
    if (!$('zoom-dialog').open) showDialog($('zoom-dialog'));
    const scroll = img.parentElement; scroll.scrollTop = 0; scroll.scrollLeft = 0;
  }
  function changeZoom(delta) {
    zoomLevel = Math.min(4, Math.max(1, zoomLevel + delta));
    const img = $('zoom-image');
    img.style.width = `${Math.min(img.parentElement.clientWidth - 24, 900) * zoomLevel}px`;
    $('zoom-reset').textContent = zoomLevel === 1 ? 'Ajustar' : `${Math.round(zoomLevel * 100)}%`;
  }
  function turn(direction) {
    if (!isOpen || reader.dataset.turning === 'true') return;
    if (!animateTurns || !flip) goTo(current + (direction > 0 ? visibleIndices().length : (flip?.getOrientation() === 'landscape' && current > 1 ? 2 : 1)) * direction, false);
    else direction > 0 ? flip.flipNext('bottom') : flip.flipPrev('bottom');
  }
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openReader()));
  $('close-reader').addEventListener('click', () => {
    isOpen = false; reader.hidden = true; cover.hidden = false;
    document.body.classList.remove('news-reading'); history.replaceState(null, '', location.pathname + location.search);
    root.scrollIntoView({block:'start'}); cover.querySelector('[data-open]').focus({preventScroll:true});
  });
  $('previous-page').addEventListener('click', () => turn(-1));
  $('next-page').addEventListener('click', () => turn(1));
  $('animation-toggle').addEventListener('click', () => {
    if (reader.dataset.turning === 'true') flip?.getRender().finishAnimation();
    animateTurns = !animateTurns;
    try { localStorage.setItem('allaser-news-motion', animateTurns ? 'on' : 'off'); } catch {}
    if (flip) {
      flip.getSettings().drawShadow = animateTurns;
      flip.getSettings().showPageCorners = animateTurns && !reduced.matches;
    }
    update();
  });
  for (const type of ['mousedown', 'mousemove']) book.addEventListener(type, event => {
    if (!animateTurns) event.stopPropagation();
  }, { capture: true });
  book.addEventListener('click', event => {
    if ((flip && animateTurns) || gestures.suppressMouse() || event.target.closest('a')) return;
    const page = event.target.closest('.news-page'); if (!page) return;
    const bounds = page.getBoundingClientRect();
    turn(event.clientX < bounds.left + bounds.width / 2 ? -1 : 1);
  });
  $('page-progress').addEventListener('change', e => goTo(Number(e.target.value) - 1));
  $('index-button').addEventListener('click', () => showDialog($('index-dialog')));
  $('zoom-button').addEventListener('click', () => openZoom(current));
  $('zoom-in').addEventListener('click', () => changeZoom(.5));
  $('zoom-page').addEventListener('change', e => openZoom(Number(e.target.value)));
  $('zoom-out').addEventListener('click', () => changeZoom(-.5));
  $('zoom-reset').addEventListener('click', () => { zoomLevel = 1; $('zoom-image').style.width = ''; $('zoom-reset').textContent = 'Ajustar'; });
  document.querySelectorAll('.news-dialog').forEach(dialog => {
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('close', () => document.body.classList.remove('news-dialog-open'));
    dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(dialog); });
  });
  document.addEventListener('keydown', e => {
    if (!isOpen || document.querySelector('dialog[open]') || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); turn(e.key === 'ArrowRight' ? 1 : -1); }
  });
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(sizeBook, 130); });
  window.addEventListener('hashchange', () => { const match = location.hash.match(/^#pagina-(\d+)$/); if (match) isOpen ? goTo(Number(match[1]) - 1, false) : openReader(Number(match[1]) - 1); });
  ready.then(() => { const match = location.hash.match(/^#pagina-(\d+)$/); if (match) openReader(Number(match[1]) - 1); }).catch(() => {});
})();
