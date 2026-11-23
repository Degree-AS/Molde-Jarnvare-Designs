/*
 * Menyforslag (docs/explorations/meny-forslag.html): tre forslag til produktmeny, tegnet fra det ekte
 * kategoritreet i meny-forslag-data.js. Ren JS uten avhengigheter.
 *
 *   A  Avdelingsmeny  - kategorirail + panel med nivå 2 og 3 (desktop), trinnvis meny (mobil)
 *   B  Katalog        - hovedkategoriene samlet i fire «verdener» (desktop og mobil)
 *   C  Finn           - søk-først-meny som filtrerer alle 585 kategorier og kjenner igjen
 *                       standard, dimensjon og varenummer (desktop og mobil)
 */
(function () {
  "use strict";

  var MENU = window.MJ_MENU || [];

  /* ── Tekst ─────────────────────────────────────────────────────────────── */

  // BC-navnene er i store bokstaver. Menyen viser dem med stor forbokstav; forkortelser beholdes.
  var KEEP = ["DIN", "ISO", "HSS", "SDS", "TIG", "MIG/MAG", "MMA", "PTFE", "LOTO", "MIG", "MAG"];
  function nice(label) {
    var s = String(label).toLowerCase();
    s = s.charAt(0).toUpperCase() + s.slice(1);
    KEEP.forEach(function (k) {
      s = s.replace(new RegExp("(^|[^\\wæøå])" + k.toLowerCase().replace("/", "\\/") + "(?=$|[^\\wæøå])", "gi"), function (m, pre) {
        return pre + k;
      });
    });
    return s.replace(/\benerpac\b/gi, "Enerpac");
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var nf = new Intl.NumberFormat("nb-NO");
  function count(n) {
    return nf.format(n);
  }

  /* ── Ikoner per hovedkategori (strek, 24×24, samme stil som headeren) ───── */

  var ICONS = {
    "/festemidler": '<path d="M9 3h6l2 3-2 3H9L7 6z"/><path d="M10 9v10l2 2 2-2V9"/><path d="M10 12.5h4M10 15.5h4"/>',
    "/bekledning-og-verneutstyr": '<path d="M4 16a8 8 0 0 1 16 0"/><path d="M2.5 16h19v2.5h-19z"/><path d="M12 8V5.5"/><path d="M9 9.5 8 6.8M15 9.5l1-2.7"/>',
    "/olje-og-kjemikalier": '<path d="M12 3s6 6.6 6 10.8a6 6 0 0 1-12 0C6 9.6 12 3 12 3z"/><path d="M9.5 14.5a2.6 2.6 0 0 0 2.5 2.4"/>',
    "/transport-og-innredning": '<path d="M5 3v18M19 3v18M5 8h14M5 13.5h14M5 19h14"/>',
    "/rekvisita": '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M20 12h2"/>',
    "/verktoy-og-redskap": '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5l3 3 5.8-5.8a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.4-.6-.6-2.4z"/>',
    "/elektroverktoy-og-maskiner": '<path d="M3 7.5h11v6H3z"/><path d="M14 9.5h4.5M18.5 8.5v3"/><path d="M7 13.5 6 20.5h4.5l1-7"/>',
    "/kapp-og-slipeutstyr": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.2"/><path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21"/>',
    "/skjaerende-verktoy": '<path d="M12 2v4"/><path d="M9 6h6l-1 11.5-2 4-2-4z"/><path d="M9.6 10.2 14.4 8M9.8 14l4.4-2.2"/>',
    "/loft-og-lastsikring": '<circle cx="12" cy="4" r="2"/><path d="M12 6v8a4 4 0 1 1-4-4h1"/>',
    "/hydraulikk-og-slanger": '<circle cx="12" cy="13" r="8"/><path d="m12 13 4-3"/><path d="M9.5 3h5"/><path d="M8 17h8"/>',
    "/gass-og-gasstilbehor": '<rect x="7.5" y="6.5" width="9" height="14.5" rx="3"/><path d="M10 6.5V3h4v3.5"/><path d="M14 4.5h3"/>',
    "/pakninger-og-tetninger": '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/>',
    "/lager-og-transmisjon": '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="6.3" r="1.1"/><circle cx="12" cy="17.7" r="1.1"/><circle cx="6.3" cy="12" r="1.1"/><circle cx="17.7" cy="12" r="1.1"/>',
    "/sveis-og-sveisemateriell": '<path d="M12 3c2.3 3 5.2 5.2 5.2 9.2a5.2 5.2 0 0 1-10.4 0c0-2 1-3.3 2-4.2 0 2 .9 3.2 2.1 3.2 0-3.2-1-5.2 1.1-8.2z"/>',
    "#mine": '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4v4h4"/><path d="M12 7.5V12l3 2"/>',
  };
  function icon(url, cls) {
    return '<svg class="' + (cls || "mp-ico") + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[url] || '<circle cx="12" cy="12" r="8"/>') + "</svg>";
  }
  var CHEV = '<svg class="mp-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
  var BACK = '<svg class="mp-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>';
  var SEARCH = '<svg class="mp-ico mp-ico--sm" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>';

  function byUrl(url) {
    return MENU.find(function (n) {
      return n.url === url;
    });
  }

  /* «Dine kategorier» i A: kundens faste kategorier, regnet ut hver natt fra ordrene i BC (siste 24 måneder).
     Rangert etter hvor ofte og hvor nylig; «ordrer» teller ordrer med varer fra kategorien, ikke antall varer.
     Eksempelkunde: et mekanisk verksted. */
  var MINE_URL = "#mine";
  // Merknadene i demoen følger språket på siden (meny-forslag-en.html er for utviklerne); teksten i selve menyen er alltid norsk.
  var DOT_NOTE = '<span class="mp-dot" aria-hidden="true"></span>';
  var NOTE = document.documentElement.lang === "en"
    ? {
        mine: "Ranked by how often and how recently the customer bought, last 24 months. Computed nightly from the BC orders. Subcategories the customer bought from are marked " + DOT_NOTE + " in every department. Example customer.",
        mineAside: "The campaign is picked from those in the CMS, based on the customer's categories.",
        promo: "Example content - managed in the CMS per main category.",
      }
    : {
        mine: "Rangert etter hvor ofte og hvor nylig dere har kjøpt, siste 24 måneder. Regnes ut hver natt fra ordrene i BC. Underkategorier dere har kjøpt fra, er merket " + DOT_NOTE + " i alle avdelingene. Eksempelkunde.",
        mineAside: "Kampanjen velges blant dem som ligger i CMS, ut fra kundens kategorier.",
        promo: "Eksempelinnhold - styres i CMS per hovedkategori.",
      };
  var MINE_A = [
    { l1: "/festemidler", l2: "SKRUER OG BOLTER", l3: "SEKSKANTSKRUER", orders: 23, last: "14.11" },
    { l1: "/festemidler", l2: "MUTTERE", l3: "SEKSKANTMUTTERE", orders: 19, last: "14.11" },
    { l1: "/kapp-og-slipeutstyr", l2: "KAPPE- OG SLIPESKIVER", l3: "KAPPE-, SLIPE- OG FIBERSKIVER", orders: 14, last: "12.11" },
    { l1: "/festemidler", l2: "SKIVER, LÅSERINGER OG SPLINTER", l3: "UNDERLAGSSKIVER", orders: 13, last: "06.11" },
    { l1: "/bekledning-og-verneutstyr", l2: "HANSKER", l3: "ARBEIDS- OG MONTERINGSHANSKER", orders: 11, last: "30.10" },
    { l1: "/hydraulikk-og-slanger", l2: "SLANGER", l3: "HYDRAULIKK- OG GUMMISLANGER", orders: 8, last: "22.10" },
    { l1: "/skjaerende-verktoy", l2: "BOR", l3: "SPIRALBOR (HSS)", orders: 6, last: "02.10" },
    { l1: "/sveis-og-sveisemateriell", l2: "SVEISETILSETT", l3: "SVEISETRÅD", orders: 5, last: "18.09" },
  ];
  var MINE_KEYS = {};
  MINE_A.forEach(function (m) {
    MINE_KEYS[m.l1 + "|" + m.l3] = true;
    MINE_KEYS[m.l1 + "|" + m.l2 + "|*"] = true;
  });
  // Innlogget eller ikke: anonyme får menyen uten «Dine kategorier». Byttes med knappene over A.
  var loggedIn = false;
  var onViewer = [];
  function isMine(l1, label) { return loggedIn && !!MINE_KEYS[l1 + "|" + label]; }
  function holdsMine(l1, l2) { return loggedIn && !!MINE_KEYS[l1 + "|" + l2 + "|*"]; }
  var DOT = '<span class="mp-dot" aria-hidden="true"></span><span class="mp-sr"> (kjøpt før)</span>';

  function renderMinePanel() {
    return (
      '<div class="mp-dept__head"><h3>' + icon(MINE_URL) + 'Dine kategorier</h3><a class="mp-dept__all" href="#">Kjøp igjen fra tidligere ordrer ' + CHEV + "</a></div>" +
      '<div class="mp-dept__body"><div><div class="mp-mine-grid">' +
      MINE_A.map(function (m) {
        var path = nice(byUrl(m.l1).label) + " › " + nice(m.l2);
        return (
          '<a class="mp-mine-card" href="#"><span class="mp-mine-card__path" title="' + esc(path) + '">' + icon(m.l1) + "<span>" + esc(path) + "</span></span>" +
          "<b>" + esc(nice(m.l3)) + '</b><span class="mp-mine-card__meta">' + m.orders + " ordrer · sist " + m.last + "</span></a>"
        );
      }).join("") +
      "</div>" +
      '<p class="mp-note">' + NOTE.mine + "</p></div>" +
      renderMineAside() + "</div>"
    );
  }

  // Innholdsfeltet her viser kampanjer i kundens egne kategorier: samme kampanjer som i CMS, valgt ut fra «Dine kategorier».
  function renderMineAside() {
    var hit = MINE_A.map(function (m) { return PROMO[m.l1] && PROMO[m.l1].campaign ? { url: m.l1, c: PROMO[m.l1].campaign } : null; }).filter(Boolean)[0];
    return (
      '<aside class="mp-dept__aside">' +
      (hit
        ? '<a class="mp-promo" href="#"><span class="mp-promo__img" aria-hidden="true">' + icon(hit.url, "mp-promo__ico") + "</span>" +
          '<span class="mp-tag">I dine kategorier</span><b>' + esc(hit.c.title) + "</b><span>" + esc(hit.c.text) + '</span><span class="mp-promo__cta">' + hit.c.cta + " " + CHEV + "</span></a>"
        : "") +
      '<a class="mp-promo-link" href="#"><span class="mp-overline">Konto</span><b>Tidligere ordrer</b><span>Finn en ordre og legg hele eller deler av den i handlekurven.</span></a>' +
      '<p class="mp-note">' + NOTE.mineAside + "</p></aside>"
    );
  }

  /* Innholdsfeltet til høyre i panelet: styres i CMS per hovedkategori (eksempelinnhold her).
     Kampanje først når det finnes en, deretter tjenester og forsyningsløsninger som hører til kategorien. */
  var PROMO = {
    "/festemidler": {
      campaign: { tag: "Kampanje", title: "Sekskantskruer DIN 933, elforsinket", text: "Nettpris på hele serien M6-M16 ut desember.", cta: "Se kampanjen" },
      links: [
        { tag: "Forsyningsløsning", title: "2BOX", text: "Aldri tom for festemidler - to kasser, vi fyller på." },
        { tag: "Forsyningsløsning", title: "Scan2order", text: "Skann hylla, bestillingen går rett inn." },
      ],
    },
    "/hydraulikk-og-slanger": {
      campaign: null,
      links: [
        { tag: "Tjeneste", title: "Slangeverksted", text: "Hydraulikkslanger laget på mål." },
        { tag: "Tjeneste", title: "Parker Store", text: "Parker-deler og fittings." },
      ],
    },
    "/bekledning-og-verneutstyr": {
      campaign: { tag: "Nyhet", title: "Vinterkolleksjonen er her", text: "Jakker, bukser og ull for kalde arbeidsdager.", cta: "Se nyhetene" },
      links: [{ tag: "Tjeneste", title: "Profiltøy", text: "Arbeidstøy med firmalogo." }],
    },
    "/verktoy-og-redskap": {
      campaign: null,
      links: [
        { tag: "Tjeneste", title: "Analyse og kalibrering", text: "Kalibrering av momentverktøy og måleutstyr." },
        { tag: "Tjeneste", title: "Serviceverksted", text: "Reparasjon og service av verktøy." },
      ],
    },
  };
  var PROMO_DEFAULT = {
    campaign: { tag: "Kampanje", title: "Kampanjeplass", text: "Redaktøren velger kampanje, nyhet eller tjeneste for kategorien i CMS.", cta: "Les mer" },
    links: [{ tag: "Kontakt", title: "Spør en produktansvarlig", text: "Vi hjelper deg å finne riktig vare." }],
  };

  function renderPromo(node) {
    var promo = PROMO[node.url] || PROMO_DEFAULT;
    var c = promo.campaign;
    return (
      '<aside class="mp-dept__aside">' +
      (c
        ? '<a class="mp-promo" href="#"><span class="mp-promo__img" aria-hidden="true">' + icon(node.url, "mp-promo__ico") + "</span>" +
          '<span class="mp-tag">' + c.tag + "</span><b>" + esc(c.title) + "</b><span>" + esc(c.text) + '</span><span class="mp-promo__cta">' + c.cta + " " + CHEV + "</span></a>"
        : "") +
      promo.links.map(function (l) {
        return '<a class="mp-promo-link" href="#"><span class="mp-overline">' + l.tag + "</span><b>" + esc(l.title) + "</b><span>" + esc(l.text) + "</span></a>";
      }).join("") +
      '<p class="mp-note">' + NOTE.promo + "</p></aside>"
    );
  }

  /* ── A  Avdelingsmeny, desktop ────────────────────────────────────────── */

  // Alle underkategoriene vises, ingen «+ N til»: det som er gjemt, blir ikke funnet.
  function renderDeptPanel(node) {
    // Over 90 lenker (Verktøy og redskap har 113): gruppene får hele bredden, innholdsfeltet legger seg under.
    var links = (node.children || []).reduce(function (n, l2) { return n + 1 + (l2.children || []).length; }, 0);
    var wide = links > 90;
    var bought = 0;
    var groups = (node.children || [])
      .map(function (l2) {
        var l3 = l2.children || [];
        return (
          '<section class="mp-dept__group">' +
          '<a class="mp-dept__l2" href="#">' + esc(nice(l2.label)) + "</a>" +
          (l3.length
            ? "<ul>" + l3.map(function (c) {
                if (!isMine(node.url, c.label)) return '<li><a href="#">' + esc(nice(c.label)) + "</a></li>";
                bought++;
                return '<li><a class="mp-is-mine" href="#">' + esc(nice(c.label)) + DOT + "</a></li>";
              }).join("") + "</ul>"
            : "") +
          "</section>"
        );
      })
      .join("");

    return (
      '<div class="mp-dept__head"><h3>' + icon(node.url) + esc(nice(node.label)) + "</h3>" +
      (bought ? '<span class="mp-dept__legend"><span class="mp-dot" aria-hidden="true"></span>Dere har kjøpt fra ' + bought + " av disse</span>" : "") +
      '<a class="mp-dept__all" href="#">Se alle ' + count(node.count) + " produkter " + CHEV + "</a></div>" +
      '<div class="mp-dept__body' + (wide ? " mp-dept__body--wide" : "") + '"><div class="mp-dept__groups">' + groups + "</div>" + renderPromo(node) + "</div>"
    );
  }

  function mountDeptDesktop(root) {
    var rail = root.querySelector("[data-rail]");
    var panel = root.querySelector("[data-panel]");
    var current = null;
    var timer = null;

    function renderRail() {
      // Innlogget: «Dine kategorier» øverst og åpen som standard. Anonym: bare hovedkategoriene.
      rail.innerHTML =
        (loggedIn
          ? '<li><button type="button" class="mp-rail__item mp-rail__item--mine" data-url="' + MINE_URL + '">' + icon(MINE_URL) +
            '<span class="mp-rail__label">Dine kategorier</span><span class="mp-rail__count">' + MINE_A.length + "</span>" + CHEV +
            '</button></li><li class="mp-rail__sep" role="presentation"></li>'
          : "") +
        MENU.map(function (n) {
          return (
            '<li><button type="button" class="mp-rail__item" data-url="' + n.url + '">' + icon(n.url) +
            '<span class="mp-rail__label">' + esc(nice(n.label)) + '</span><span class="mp-rail__count">' + count(n.count) + "</span>" + CHEV + "</button></li>"
          );
        }).join("");
    }

    function show(url) {
      if (url === current) return;
      current = url;
      rail.querySelectorAll(".mp-rail__item").forEach(function (b) {
        b.setAttribute("aria-current", b.dataset.url === url ? "true" : "false");
      });
      panel.innerHTML = url === MINE_URL ? renderMinePanel() : renderDeptPanel(byUrl(url));
    }

    function reset() {
      current = null;
      renderRail();
      show(loggedIn ? MINE_URL : "/festemidler");
    }
    onViewer.push(reset);

    rail.addEventListener("mouseover", function (e) {
      var b = e.target.closest(".mp-rail__item");
      if (!b) return;
      clearTimeout(timer);
      // 300 ms før kategorien byttes (Baymard/NN/g): musa kan gå på skrå over til panelet uten å bytte.
      timer = setTimeout(function () { show(b.dataset.url); }, 300);
    });
    rail.addEventListener("mouseleave", function () { clearTimeout(timer); });
    rail.addEventListener("click", function (e) {
      var b = e.target.closest(".mp-rail__item");
      if (b) show(b.dataset.url);
    });
    rail.addEventListener("focusin", function (e) {
      var b = e.target.closest(".mp-rail__item");
      if (b) show(b.dataset.url);
    });
    rail.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      var items = Array.prototype.slice.call(rail.querySelectorAll(".mp-rail__item"));
      var i = items.indexOf(document.activeElement);
      var next = items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length];
      if (next) { e.preventDefault(); next.focus(); }
    });

    reset();
  }

  /* ── A  Trinnvis meny, mobil ──────────────────────────────────────────── */

  function mountDrill(root) {
    var stack = [];
    var view = root.querySelector("[data-drill]");

    function render(dir) {
      var top = stack[stack.length - 1];
      var html;
      if (!top) {
        html =
          '<div class="mp-m__search">' + SEARCH + "<span>Søk i 30 000+ artikler</span></div>" +
          (loggedIn
            ? '<p class="mp-m__overline">Dine kategorier</p><div class="mp-m__mine">' +
              MINE_A.map(function (m) { return '<a class="mp-chip" href="#">' + esc(nice(m.l3)) + "</a>"; }).join("") +
              "</div>"
            : "") +
          '<p class="mp-m__overline">Produkter</p><ul class="mp-m__list">' +
          MENU.map(function (n, i) {
            return '<li><button type="button" data-go="' + i + '">' + icon(n.url) + '<span class="mp-m__label">' + esc(nice(n.label)) +
              '</span><span class="mp-m__count">' + count(n.count) + "</span>" + CHEV + "</button></li>";
          }).join("") +
          '</ul><ul class="mp-m__list mp-m__list--plain"><li><a href="#">Forsyningsløsninger' + CHEV + '</a></li><li><a href="#">Øvrige tjenester' + CHEV +
          '</a></li><li><a href="#">Kontakt</a></li></ul>';
      } else {
        var parentLabel = stack.length > 1 ? nice(stack[stack.length - 2].label) : "Alle produkter";
        html =
          '<button type="button" class="mp-m__back" data-back>' + BACK + esc(parentLabel) + "</button>" +
          '<h4 class="mp-m__title">' + (stack.length === 1 ? icon(top.url) : "") + esc(nice(top.label)) + "</h4>" +
          '<ul class="mp-m__list"><li><a class="mp-m__all" href="#">Se alle i ' + esc(nice(top.label)) +
          (top.count ? ' <span class="mp-m__count">' + count(top.count) + "</span>" : "") + "</a></li>" +
          (top.children || []).map(function (c, i) {
            // Prikken viser veien ned: på nivå 2 der kunden har kjøpt fra en underkategori, på nivå 3 selve kategorien.
            var l1 = stack[0].url;
            var dot = (c.children ? holdsMine(l1, c.label) : isMine(l1, c.label)) ? DOT : "";
            return c.children
              ? '<li><button type="button" data-go="' + i + '"><span class="mp-m__label">' + esc(nice(c.label)) + dot + '</span><span class="mp-m__count">' + c.children.length + "</span>" + CHEV + "</button></li>"
              : '<li><a href="#"><span class="mp-m__label">' + esc(nice(c.label)) + dot + "</span></a></li>";
          }).join("") +
          "</ul>";
      }
      view.innerHTML = '<div class="mp-m__pane mp-m__pane--' + (dir || "none") + '">' + html + "</div>";
      view.scrollTop = 0;
    }

    view.addEventListener("click", function (e) {
      var go = e.target.closest("[data-go]");
      var back = e.target.closest("[data-back]");
      if (go) {
        var list = stack.length ? stack[stack.length - 1].children : MENU;
        stack.push(list[Number(go.dataset.go)]);
        render("in");
      } else if (back) {
        stack.pop();
        render("out");
      } else if (e.target.closest("a")) {
        e.preventDefault();
      }
    });
    onViewer.push(function () { stack = []; render(); });
    render();
  }

  /* ── B  Katalog i fire verdener ───────────────────────────────────────── */

  var WORLDS = [
    { name: "Festing og montering", hint: "Skruer, muttere, ankere, pakninger, lager", urls: ["/festemidler", "/pakninger-og-tetninger", "/lager-og-transmisjon"] },
    { name: "Verktøy og maskiner", hint: "Håndverktøy, elektroverktøy, slip, bor, sveis", urls: ["/verktoy-og-redskap", "/elektroverktoy-og-maskiner", "/kapp-og-slipeutstyr", "/skjaerende-verktoy", "/sveis-og-sveisemateriell"] },
    { name: "Industri og hydraulikk", hint: "Hydraulikk, løft, gass, olje og kjemi", urls: ["/hydraulikk-og-slanger", "/loft-og-lastsikring", "/gass-og-gasstilbehor", "/olje-og-kjemikalier"] },
    { name: "HMS og drift", hint: "Verneutstyr, rekvisita, lager og innredning", urls: ["/bekledning-og-verneutstyr", "/rekvisita", "/transport-og-innredning"] },
  ];

  function mountCatalogDesktop(root) {
    var tabs = root.querySelector("[data-tabs]");
    var body = root.querySelector("[data-body]");
    tabs.innerHTML = WORLDS.map(function (w, i) {
      var total = w.urls.reduce(function (s, u) { return s + (byUrl(u) || { count: 0 }).count; }, 0);
      return '<button type="button" role="tab" class="mp-cat__tab" data-i="' + i + '"><span class="mp-cat__tabname">' + w.name +
        '</span><span class="mp-cat__tabhint">' + w.hint + " · " + count(total) + "</span></button>";
    }).join("");

    function show(i) {
      tabs.querySelectorAll(".mp-cat__tab").forEach(function (t) { t.setAttribute("aria-selected", String(Number(t.dataset.i) === i)); });
      body.innerHTML = WORLDS[i].urls.map(function (u) {
        var n = byUrl(u);
        return '<section class="mp-cat__col"><a class="mp-cat__l1" href="#">' + icon(u) + "<span>" + esc(nice(n.label)) + '</span><small>' + count(n.count) + "</small></a><ul>" +
          (n.children || []).map(function (c) {
            return '<li><a href="#">' + esc(nice(c.label)) + "</a></li>";
          }).join("") + "</ul></section>";
      }).join("");
    }
    tabs.addEventListener("click", function (e) {
      var t = e.target.closest(".mp-cat__tab");
      if (t) show(Number(t.dataset.i));
    });
    tabs.addEventListener("mouseover", function (e) {
      var t = e.target.closest(".mp-cat__tab");
      if (t) show(Number(t.dataset.i));
    });
    show(0);
  }

  function mountCatalogMobile(root) {
    var chips = root.querySelector("[data-chips]");
    var list = root.querySelector("[data-list]");
    chips.innerHTML = WORLDS.map(function (w, i) {
      return '<button type="button" class="mp-chip mp-chip--tab" data-i="' + i + '">' + w.name + "</button>";
    }).join("");
    function show(i) {
      chips.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(Number(b.dataset.i) === i)); });
      list.innerHTML = WORLDS[i].urls.map(function (u) {
        var n = byUrl(u);
        return '<details class="mp-acc"><summary>' + icon(u) + '<span class="mp-m__label">' + esc(nice(n.label)) + '</span><span class="mp-m__count">' + count(n.count) +
          '</span></summary><ul><li><a class="mp-m__all" href="#">Se alle i ' + esc(nice(n.label)) + "</a></li>" +
          (n.children || []).map(function (c) { return '<li><a href="#">' + esc(nice(c.label)) + "</a></li>"; }).join("") + "</ul></details>";
      }).join("");
      var first = list.querySelector("details");
      if (first) first.open = true;
    }
    chips.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (b) show(Number(b.dataset.i));
    });
    list.addEventListener("click", function (e) { if (e.target.closest("a")) e.preventDefault(); });
    show(0);
  }

  /* ── C  Finn: søk-først-meny ──────────────────────────────────────────── */

  var FLAT = [];
  MENU.forEach(function (l1) {
    FLAT.push({ label: nice(l1.label), path: [], l1: l1.url, depth: 1, count: l1.count });
    (l1.children || []).forEach(function (l2) {
      FLAT.push({ label: nice(l2.label), path: [nice(l1.label)], l1: l1.url, depth: 2 });
      (l2.children || []).forEach(function (l3) {
        FLAT.push({ label: nice(l3.label), path: [nice(l1.label), nice(l2.label)], l1: l1.url, depth: 3 });
      });
    });
  });

  var STANDARDS = {
    "933": "Sekskantskruer", "931": "Sekskantskruer", "4017": "Sekskantskruer", "4014": "Sekskantskruer",
    "912": "Innvendig sekskantskruer", "4762": "Innvendig sekskantskruer", "7380": "Innvendig sekskantskruer",
    "934": "Sekskantmuttere", "4032": "Sekskantmuttere", "985": "Låsemuttere", "125": "Underlagsskiver",
    "127": "Låse- og sikringsskiver", "7985": "Maskinskruer", "975": "Gjengestenger",
  };
  var MINE = ["Sekskantskruer", "Arbeids- og monteringshansker", "Kappe-, slipe- og fiberskiver", "Spiralbor (HSS)", "Hydraulikk- og gummislanger", "Strips og festebånd"];

  function fold(s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function mark(label, words) {
    var out = esc(label);
    words.forEach(function (w) {
      if (!w) return;
      out = out.replace(new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
    });
    return out;
  }

  function recognise(q) {
    var hits = [];
    var std = q.match(/\b(din|iso|en)\s*-?\s*(\d{2,5})\b/i);
    if (std) {
      var target = STANDARDS[std[2]];
      hits.push({
        kind: "Standard",
        target: target,
        title: std[1].toUpperCase() + " " + std[2],
        sub: target ? "Gå til " + target + ", filtrert på " + std[1].toUpperCase() + " " + std[2] : "Søk etter produkter etter standarden",
      });
    }
    var dim = q.match(/\bm\s?(\d{1,2})(?:\s*[x×]\s*(\d{1,3}))?\b/i);
    if (dim) {
      hits.push({ kind: "Dimensjon", title: "M" + dim[1] + (dim[2] ? " × " + dim[2] : ""), sub: "Alle festemidler i M" + dim[1] + (dim[2] ? ", lengde " + dim[2] + " mm" : "") });
    }
    var no = q.match(/\b\d{5,9}\b/);
    if (no) hits.push({ kind: "Varenummer", title: no[0], sub: "Gå rett til produktet" });
    return hits;
  }

  function mountFind(root, compact) {
    var input = root.querySelector("[data-find]");
    var out = root.querySelector("[data-results]");
    var active = -1;

    function idle() {
      return (
        '<p class="mp-overline">Dine mest kjøpte kategorier</p><div class="mp-chips">' +
        MINE.map(function (m) { return '<a class="mp-chip" href="#">' + m + "</a>"; }).join("") +
        '</div><p class="mp-overline">Alle kategorier</p><ul class="mp-find__grid">' +
        MENU.map(function (n) {
          return '<li><a href="#">' + icon(n.url) + "<span>" + esc(nice(n.label)) + "</span>" + (compact ? "" : "<small>" + count(n.count) + "</small>") + "</a></li>";
        }).join("") +
        "</ul>" +
        '<p class="mp-tryit">Prøv: <button type="button" data-try="DIN 933">DIN 933</button><button type="button" data-try="m8">M8</button><button type="button" data-try="hansker">hansker</button><button type="button" data-try="slange">slange</button><button type="button" data-try="129385">129385</button></p>'
      );
    }

    function results(q) {
      var specs = recognise(q);
      // Standard, dimensjon og varenummer er gjenkjent for seg; resten av ordene finner kategorien.
      var rest = q.replace(/\b(din|iso|en)\s*-?\s*\d{2,5}\b/gi, " ").replace(/\bm\s?\d{1,2}(\s*[x×]\s*\d{1,3})?\b/gi, " ").replace(/\b\d{5,9}\b/g, " ");
      var words = fold(rest).split(/\s+/).filter(Boolean);
      var dim = specs.filter(function (s) { return s.kind === "Dimensjon"; })[0];
      var std = specs.filter(function (s) { return s.kind === "Standard" && s.target; })[0];
      if (std && !words.length) words = fold(std.target).split(/\s+/);
      var matches = !words.length ? [] : FLAT.filter(function (c) {
        var hay = fold(c.label + " " + c.path.join(" "));
        return words.every(function (w) { return hay.indexOf(w) >= 0; });
      }).sort(function (a, b) {
        // Standardens egen kategori først; med dimensjon eller standard går festemidler foran resten.
        var exact = std ? (b.label === std.target) - (a.label === std.target) : 0;
        var fixing = dim || std ? (b.l1 === "/festemidler") - (a.l1 === "/festemidler") : 0;
        var aa = fold(a.label).indexOf(words[0]) >= 0 ? 0 : 1;
        var bb = fold(b.label).indexOf(words[0]) >= 0 ? 0 : 1;
        return exact || fixing || aa - bb || a.depth - b.depth;
      });
      var html = "";
      if (specs.length) {
        html += '<p class="mp-overline">Gjenkjent</p><ul class="mp-find__specs">' + specs.map(function (s) {
          return '<li><a href="#" class="mp-find__row"><span class="mp-tag">' + s.kind + "</span><b>" + esc(s.title) + "</b><span>" + esc(s.sub) + "</span></a></li>";
        }).join("") + "</ul>";
      }
      if (matches.length) {
        html += '<p class="mp-overline">Kategorier <span>' + matches.length + "</span></p><ul class=\"mp-find__list\">" +
          matches.slice(0, compact ? 8 : 10).map(function (m) {
            var narrowed = m.l1 === "/festemidler" ? [dim && dim.title, std && std.title].filter(Boolean).join(", ") : "";
            return '<li><a href="#" class="mp-find__row">' + icon(m.l1, "mp-ico mp-ico--sm") + "<b>" + mark(m.label, rest.split(/\s+/)) +
              (narrowed ? " <em>i " + esc(narrowed) + "</em>" : "") + "</b><span>" +
              esc(m.path.join(" › ") || "Hovedkategori") + "</span></a></li>";
          }).join("") + "</ul>";
      }
      html += '<a href="#" class="mp-find__row mp-find__search">' + SEARCH + "<b>Søk etter «" + esc(q) + "» i alle produkter</b><span>Enter</span></a>";
      return html;
    }

    function update() {
      var q = input.value.trim();
      out.innerHTML = q ? results(q) : idle();
      active = -1;
    }

    function rows() {
      return Array.prototype.slice.call(out.querySelectorAll(".mp-find__row"));
    }

    input.addEventListener("input", update);
    input.addEventListener("keydown", function (e) {
      var r = rows();
      if (!r.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + r.length) % r.length;
        r.forEach(function (x, i) { x.classList.toggle("is-active", i === active); });
        r[active].scrollIntoView({ block: "nearest" });
      }
    });
    out.addEventListener("click", function (e) {
      var t = e.target.closest("[data-try]");
      if (t) { input.value = t.dataset.try; update(); input.focus(); return; }
      if (e.target.closest("a")) e.preventDefault();
    });
    update();
  }

  /* ── Oppstart ─────────────────────────────────────────────────────────── */

  document.querySelectorAll('[data-proposal="dept"]').forEach(mountDeptDesktop);
  document.querySelectorAll('[data-proposal="drill"]').forEach(mountDrill);
  document.querySelectorAll('[data-proposal="catalog"]').forEach(mountCatalogDesktop);
  document.querySelectorAll('[data-proposal="catalog-m"]').forEach(mountCatalogMobile);
  document.querySelectorAll('[data-proposal="find"]').forEach(function (r) { mountFind(r, false); });
  document.querySelectorAll('[data-proposal="find-m"]').forEach(function (r) { mountFind(r, true); });

  document.querySelectorAll("[data-viewer]").forEach(function (b) {
    b.addEventListener("click", function () {
      loggedIn = b.dataset.viewer === "in";
      document.querySelectorAll("[data-viewer]").forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      onViewer.forEach(function (f) { f(); });
    });
  });

  document.querySelectorAll("[data-demo] a").forEach(function (a) {
    a.addEventListener("click", function (e) { if (a.getAttribute("href") === "#") e.preventDefault(); });
  });
})();
