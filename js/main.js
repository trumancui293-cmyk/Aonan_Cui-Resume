(function () {
  'use strict';

  const DEFAULT_PANEL = 'home';

  const panels = Array.from(document.querySelectorAll('.panel'));
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const gotoButtons = Array.from(document.querySelectorAll('[data-goto]'));
  const mobileNav = document.getElementById('mobileNav');
  const mobileToggle = document.getElementById('mobileToggle');

  let currentPanel = null;
  let bubbleTimer = null;
  let entranceTimer = null;
  let hintPopupShowTimer = null;
  let hintPopupHideTimer = null;

  const HINT_GUIDE_TEXT = '请点击每个项目模块右上角的+哦！';

  const REVEAL_SELECTOR = [
    '.panel__header',
    '.hero',
    '.stats .stat',
    '.home-bottom',
    '.group-label',
    '.fold',
    '.campus-carousel--panel',
    '.deco-row',
    '.contact-list .contact-card',
    '.panel-mascot-wrap--contact',
  ].join(', ');

  function resolvePanelId(id) {
    return document.getElementById(id) ? id : DEFAULT_PANEL;
  }

  function getPanelIdFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    return resolvePanelId(hash || DEFAULT_PANEL);
  }

  function updateHash(id) {
    const target = `#${id}`;
    if (window.location.hash === target) return;
    try {
      history.pushState({ panel: id }, '', target);
    } catch (error) {
      window.location.hash = id;
    }
  }

  function setActiveNav(id) {
    navLinks.forEach((link) => {
      const active = link.dataset.nav === id;
      link.classList.toggle('sidebar__link--active', active);
      link.classList.toggle('mobile-nav__link--active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('mobile-nav--open');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
  }

  function dismissHintPopup() {
    if (hintPopupShowTimer) {
      clearTimeout(hintPopupShowTimer);
      hintPopupShowTimer = null;
    }
    if (hintPopupHideTimer) {
      clearTimeout(hintPopupHideTimer);
      hintPopupHideTimer = null;
    }
    document.querySelectorAll('.panel__hint-popup').forEach((popup) => popup.remove());
  }

  function showHintGuide(hint) {
    dismissHintPopup();

    const popup = document.createElement('p');
    popup.className = 'panel__hint-popup';
    popup.setAttribute('role', 'status');
    popup.textContent = HINT_GUIDE_TEXT;
    hint.appendChild(popup);

    requestAnimationFrame(() => {
      popup.classList.add('is-visible');
    });

    hintPopupShowTimer = window.setTimeout(() => {
      popup.classList.remove('is-visible');
      hintPopupHideTimer = window.setTimeout(() => {
        popup.remove();
        hintPopupHideTimer = null;
      }, 280);
      hintPopupShowTimer = null;
    }, 2000);
  }

  function resetFolds(panel) {
    if (!panel) return;
    panel.querySelectorAll('details.fold[open]').forEach((fold) => {
      fold.open = false;
    });
  }

  function runBubbleTypewriter(panel) {
    if (!panel || panel.id === 'home') return;

    const textEl = panel.querySelector('.panel-mascot__text');
    if (!textEl) return;

    const fullText = textEl.dataset.bubbleText || '';
    if (bubbleTimer) {
      clearInterval(bubbleTimer);
      bubbleTimer = null;
    }

    textEl.classList.remove('is-typing');
    textEl.textContent = '';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      textEl.textContent = fullText;
      return;
    }

    textEl.classList.add('is-typing');
    let index = 0;

    bubbleTimer = window.setInterval(() => {
      index += 1;
      textEl.textContent = fullText.slice(0, index);
      if (index >= fullText.length) {
        clearInterval(bubbleTimer);
        bubbleTimer = null;
        textEl.classList.remove('is-typing');
      }
    }, 60);
  }

  function playPanelEntrance(panel) {
    if (!panel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (entranceTimer) {
      clearTimeout(entranceTimer);
      entranceTimer = null;
    }

    panel.classList.remove('panel--entering');
    panel.querySelectorAll('[data-reveal]').forEach((el) => {
      el.removeAttribute('data-reveal');
      el.style.removeProperty('--reveal-delay');
    });

    void panel.offsetWidth;
    panel.classList.add('panel--entering');

    const targets = panel.querySelectorAll(REVEAL_SELECTOR);
    targets.forEach((el, index) => {
      el.dataset.reveal = '';
      el.style.setProperty('--reveal-delay', `${0.05 + index * 0.065}s`);
    });

    entranceTimer = window.setTimeout(() => {
      panel.classList.remove('panel--entering');
      panel.querySelectorAll('[data-reveal]').forEach((el) => {
        el.removeAttribute('data-reveal');
        el.style.removeProperty('--reveal-delay');
      });
      entranceTimer = null;
    }, 1600);
  }

  function showPanel(id, options) {
    const opts = options || {};
    const panelId = resolvePanelId(id);
    if (panelId === currentPanel) return;

    const next = document.getElementById(panelId);
    if (!next) return;

    const prev = currentPanel ? document.getElementById(currentPanel) : null;
    if (prev) resetFolds(prev);
    dismissHintPopup();

    panels.forEach((panel) => panel.classList.remove('panel--active'));
    void next.offsetWidth;
    next.classList.add('panel--active');

    currentPanel = panelId;
    setActiveNav(panelId);
    document.title = `${next.dataset.title || '崔奡楠'} · 个人主页`;

    if (opts.updateHash) updateHash(panelId);
    window.scrollTo(0, 0);
    playPanelEntrance(next);
    runBubbleTypewriter(next);
  }

  function navigateTo(id) {
    showPanel(id, { updateHash: true });
    closeMobileNav();
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigateTo(link.dataset.nav);
    });
  });

  gotoButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      navigateTo(button.dataset.goto);
    });
  });

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = mobileNav.classList.toggle('mobile-nav--open');
      mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', (event) => {
      if (mobileNav.contains(event.target) || mobileToggle.contains(event.target)) return;
      closeMobileNav();
    });
  }

  window.addEventListener('popstate', () => {
    showPanel(getPanelIdFromHash(), { updateHash: false });
  });

  window.addEventListener('hashchange', () => {
    showPanel(getPanelIdFromHash(), { updateHash: false });
  });

  /* 手风琴：同一 panel 内只展开一个（可选，提升互动感） */
  document.querySelectorAll('.fold-list--accordion').forEach((list) => {
    list.addEventListener('toggle', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLDetailsElement) || !target.open) return;
      list.querySelectorAll('details.fold[open]').forEach((fold) => {
        if (fold !== target) fold.open = false;
      });
    });
  });

  document.querySelectorAll('.panel__hint').forEach((hint) => {
    hint.setAttribute('role', 'button');
    hint.setAttribute('tabindex', '0');
    hint.setAttribute('aria-label', '查看展开操作提示');

    hint.addEventListener('click', (event) => {
      event.stopPropagation();
      showHintGuide(hint);
    });

    hint.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      showHintGuide(hint);
    });
  });

  const initialPanel = getPanelIdFromHash();
  if (!window.location.hash) {
    try {
      history.replaceState({ panel: initialPanel }, '', `#${initialPanel}`);
    } catch (error) {
      window.location.hash = initialPanel;
    }
  }

  showPanel(initialPanel, { updateHash: false });
})();
