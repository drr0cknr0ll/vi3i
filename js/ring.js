// public/js/ring.js
export function initRing(handlers = {}) {
  const ring = document.getElementById('ringMenu');
  const veil = document.getElementById('ringVeil');

  if (!ring) {
    console.error('[ring] #ringMenu not found');
    return { open: () => {}, close: () => {} };
  }

  const setOpen = (open) => {
    ring.classList.toggle('active', open);
    ring.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (veil) {
      veil.classList.toggle('active', open);
      veil.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    document.body.classList.toggle('ring-open', open);

    // Если открываем кольцо — закрываем радиальное меню
    if (open) {
      const radialMenu = document.getElementById('radialMenu');
      const radialToggle = document.getElementById('radialToggle');
      if (radialMenu && !radialMenu.classList.contains('hidden')) {
        radialMenu.classList.add('hidden');
        document.body.classList.remove('menu-open');
      }
    }
  };

  const isOpen = () => ring.classList.contains('active');
  const close = () => setOpen(false);
  const open = () => setOpen(true);
  const toggle = () => setOpen(!isOpen());

  if (veil) {
    veil.addEventListener('click', close);
  }

  const items = ring.querySelectorAll('.ringItem');
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = item.getAttribute('data-action');
      switch (action) {
        case 'atrium': handlers.onAtrium?.(); break;
        case 'services': handlers.onServices?.(); break;
        case 'projects': handlers.onProjects?.(); break;
        case 'subscribe': handlers.onSubscribe?.(); break;
        case 'lang': handlers.onLang?.(); break;
        case 'info': handlers.onInfo?.(); break;
        case 'back': handlers.onBack?.(); break;
        case 'close': handlers.onClose?.(); break;
        default: break;
      }
      close();
    });
  });

  document.addEventListener('keydown', (e) => {
    const tag = e.target?.tagName?.toLowerCase?.() || '';
    const isTyping = tag === 'input' || tag === 'textarea' || e.target?.isContentEditable;
    if (e.key === 'Tab' && !isTyping) {
      e.preventDefault();
      toggle();
      return;
    }
    if (e.key === 'Escape') {
      close();
    }
  });

  // Глобальная функция для закрытия извне (например, из радиального меню)
  window.closeRing = close;

  return { open, close };
}

export function showTabHintIfNeeded() {
  const hintEl = document.getElementById('tabHint');
  if (!hintEl) return;
  const key = 'vizion_tab_hint_seen';
  if (localStorage.getItem(key)) return;
  hintEl.style.opacity = '1';
  localStorage.setItem(key, '1');
  setTimeout(() => { hintEl.style.opacity = '0'; }, 5500);
}