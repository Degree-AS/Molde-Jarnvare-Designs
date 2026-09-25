/**
 * Site header — oppførsel for skissene (§15.1)
 *
 * Gjør headeren klikkbar i de statiske sidene, likt frontend-dev:
 *   ☰            åpner/lukker mobilmenyen (skuff fra venstre)
 *   › i skuffen  bytter til undermeny-panelet, «‹» går tilbake
 *   🔍 (mobil)   viser/skjuler søkefeltet under headeren
 *   Nav-trigger  åpner/lukker megameny-panelet (desktop)
 *   Esc / klikk på bakgrunn lukker det som er åpent.
 *
 * Ingen avhengigheter. Lastes med <script src="…/scripts/site-header.js" defer>.
 */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var drawer = header.querySelector('.site-header__drawer');
  var drawerBackdrop = document.querySelector('.site-header__drawer-backdrop');
  var hamburger = header.querySelector('[aria-controls="' + (drawer && drawer.id) + '"]');
  var megaBackdrop = document.querySelector('.megamenu-backdrop');
  var triggers = header.querySelectorAll('.site-header__nav-trigger');

  /* ── Mobilmeny ─────────────────────────────────────────────────────── */
  function showPanel(id) {
    drawer.querySelectorAll('.site-header__drawer-panel').forEach(function (p) {
      p.hidden = p.id !== id;
    });
  }

  function setDrawer(open) {
    if (!drawer) return;
    drawer.setAttribute('data-open', open);
    if (drawerBackdrop) drawerBackdrop.setAttribute('data-open', open);
    if (hamburger) hamburger.setAttribute('aria-expanded', open);
    if (open) {
      showPanel(drawer.querySelector('.site-header__drawer-panel').id);
      var close = drawer.querySelector('.site-header__drawer-close');
      if (close) close.focus();
    } else if (hamburger) {
      hamburger.focus();
    }
  }

  if (drawer) {
    if (hamburger) hamburger.addEventListener('click', function () { setDrawer(true); });
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', function () { setDrawer(false); });
    drawer.addEventListener('click', function (e) {
      var target = e.target.closest('[data-drawer-close], [data-drawer-panel]');
      if (!target) return;
      if (target.hasAttribute('data-drawer-close')) return setDrawer(false);
      showPanel(target.getAttribute('data-drawer-panel'));
      var first = drawer.querySelector('.site-header__drawer-panel:not([hidden]) button, .site-header__drawer-panel:not([hidden]) a');
      if (first) first.focus();
    });
  }

  /* ── Mobilsøk ──────────────────────────────────────────────────────── */
  var searchBtn = header.querySelector('.site-header__action--search');
  var searchPanel = searchBtn && document.getElementById(searchBtn.getAttribute('aria-controls'));
  if (searchPanel) {
    searchBtn.addEventListener('click', function () {
      var open = searchPanel.hidden;
      searchPanel.hidden = !open;
      searchBtn.setAttribute('aria-expanded', open);
      if (open) {
        var input = searchPanel.querySelector('input');
        if (input) input.focus();
      }
    });
  }

  /* ── Megameny ──────────────────────────────────────────────────────── */
  function closeMega() {
    triggers.forEach(function (t) {
      t.setAttribute('aria-expanded', 'false');
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.removeAttribute('data-open');
    });
    if (megaBackdrop) megaBackdrop.removeAttribute('data-open');
  }

  triggers.forEach(function (t) {
    t.addEventListener('click', function () {
      var wasOpen = t.getAttribute('aria-expanded') === 'true';
      closeMega();
      if (wasOpen) return;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.setAttribute('data-open', 'true');
      t.setAttribute('aria-expanded', 'true');
      if (megaBackdrop) megaBackdrop.setAttribute('data-open', 'true');
    });
  });
  if (megaBackdrop) megaBackdrop.addEventListener('click', closeMega);

  /* ── Esc lukker alt ────────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeMega();
    if (drawer && drawer.getAttribute('data-open') === 'true') setDrawer(false);
  });
})();
