/* Native pinch zoom + a single-finger swipe, isolated from PageFlip's touch handlers. */
(function (scope) {
  'use strict';
  function createTracker({ onSwipe, getScale = () => 1, enabled = () => true, now = Date.now }) {
    let cycle = null;
    let lastTouch = -Infinity;
    let blockClickUntil = -Infinity;
    const zoomed = () => getScale() > 1.025;
    const touchById = (touches, id) => Array.from(touches).find(t => t.identifier === id);
    return {
      start(event, insideBook, interactive = false) {
        if (!cycle && !insideBook) return false;
        if (!cycle) {
          const touch = event.touches[0];
          if (!touch) return false;
          cycle = { id: touch.identifier, x: touch.clientX, y: touch.clientY, time: now(), interactive, aborted: !enabled() || zoomed() };
        }
        if (event.touches.length !== 1 || zoomed()) cycle.aborted = true;
        lastTouch = now();
        return true;
      },
      move(event) {
        if (!cycle) return false;
        if (event.touches.length !== 1 || zoomed()) cycle.aborted = true;
        lastTouch = now();
        return true;
      },
      end(event) {
        if (!cycle) return false;
        lastTouch = now();
        // A pinch stays cancelled until BOTH fingers have left, even if it ends at 1x.
        if (event.touches.length) { cycle.aborted = true; return true; }
        const finished = cycle;
        const touch = touchById(event.changedTouches, finished.id);
        cycle = null;
        if (finished.aborted || !touch || zoomed() || !enabled()) {
          blockClickUntil = now() + 800;
          return true;
        }
        const dx = touch.clientX - finished.x;
        const dy = touch.clientY - finished.y;
        if (finished.interactive) {
          if (Math.hypot(dx, dy) > 12) blockClickUntil = now() + 500;
          return true;
        }
        if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.5 && now() - finished.time < 1200) {
          blockClickUntil = now() + 800;
          onSwipe(dx < 0 ? 1 : -1);
        } else if (Math.hypot(dx, dy) > 12) {
          blockClickUntil = now() + 500;
        }
        return true;
      },
      cancel(event) {
        if (!cycle) return false;
        cycle.aborted = true;
        lastTouch = now(); blockClickUntil = now() + 800;
        if (!event.touches.length) cycle = null;
        return true;
      },
      isActive: () => cycle !== null,
      suppressMouse: () => cycle !== null || zoomed() || now() - lastTouch < 900,
      suppressClick: () => now() < blockClickUntil
    };
  }

  const installed = new WeakMap();
  function install(book, options) {
    if (installed.has(book)) return installed.get(book);
    const tracker = createTracker(options);
    const handlers = {
      touchstart: event => tracker.start(event, book.contains(event.target), !!event.target.closest?.('a,button,input,select,textarea')),
      touchmove: event => tracker.move(event),
      touchend: event => tracker.end(event),
      touchcancel: event => tracker.cancel(event)
    };
    // Capture on window intercepts the legacy touch listeners before they can schedule
    // a fold/preventDefault. Stopping propagation does NOT cancel the browser's zoom.
    for (const [type, handler] of Object.entries(handlers)) {
      window.addEventListener(type, event => {
        if (handler(event)) event.stopPropagation();
      }, { capture: true, passive: true });
    }
    for (const type of ['mousedown', 'mousemove', 'mouseup']) {
      window.addEventListener(type, event => {
        if (tracker.suppressMouse()) event.stopPropagation();
      }, { capture: true });
    }
    book.addEventListener('click', event => {
      if (tracker.suppressClick()) { event.stopPropagation(); event.preventDefault(); }
    }, { capture: true });
    installed.set(book, tracker);
    return tracker;
  }
  const api = { createTracker, install };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else scope.AllaserNewsGestures = api;
})(typeof window !== 'undefined' ? window : globalThis);
