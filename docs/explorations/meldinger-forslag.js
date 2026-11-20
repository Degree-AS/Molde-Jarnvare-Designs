/* Toppbanner og infoboks — demo. Bygger forslagene fra temaene under og lar en prøve valgene. */
(function () {
  "use strict";

  var IMG = "../../src/assets/images/marketing/";

  var ICON = {
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/>',
    percent: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/>',
    alert: '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>'
  };
  function svg(name, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + "</svg>";
  }

  var BANNER = [
    { key: "info", name: "Informasjon", mod: "", icon: "clock", use: "Åpningstider, helligdager og praktisk info.",
      text: "Romjula: åpent 27.-30. desember kl. 07-16. Stengt nyttårsaften.", link: "Se åpningstider" },
    { key: "brand", name: "Merkevare", mod: "ms-topbar--brand", icon: "info", use: "Nyheter om Molde Jarnvare og nettbutikken.",
      text: "Ny nettbutikk: logg inn for å se dine priser og hele ordrehistorikken.", link: "Logg inn" },
    { key: "campaign", name: "Kampanje", mod: "ms-topbar--campaign", icon: "percent", use: "Kampanjer som gjelder hele butikken.",
      text: "<strong>25 % på arbeidshansker</strong> ut uke 49.", link: "Se tilbudene" },
    { key: "important", name: "Viktig", mod: "ms-topbar--important", icon: "info", use: "Endringer kundene må merke seg.",
      text: "Fra 1. januar sender vi faktura bare på e-post.", link: "Les mer" },
    { key: "alert", name: "Avvik", mod: "ms-topbar--alert", icon: "truck", use: "Forsinkelser og driftsavvik.",
      text: "Leveranser fra sentrallageret er forsinket med 1-2 dager denne uken.", link: "Les mer" }
  ];

  var BOX = [
    { key: "light", name: "Lys", mod: "", use: "Standard. Rolig, passer for det meste.",
      tag: "Tjeneste", title: "Slangeverkstedet er åpent i romjula", text: "Trenger du ny hydraulikkslange før nyttår? Vi presser slanger mens du venter, 27.-30. desember.", cta: "Se åpningstider", img: "slangeverksted-oversikt.jpg" },
    { key: "blue", name: "Blå", mod: "ms-box--blue", use: "Merkevare og konto, for eksempel «Bli bedriftskunde».",
      tag: "Nyhet", title: "Bli bedriftskunde", text: "Få egne priser, handle på faktura og se alle ordrene dine på ett sted.", cta: "Søk om konto", img: "ordrekontor.jpg" },
    { key: "orange", name: "Oransje", mod: "ms-box--orange", use: "Kampanjer og tilbud som skal synes.",
      tag: "Kampanje", title: "Vinterkampanje", text: "20 % på strøsand, isbrodder og snøskuffer ut januar.", cta: "Se kampanjen", img: "lager-plukk-fra-bins.jpg" },
    { key: "dark", name: "Mørk", mod: "ms-box--dark", use: "Forsyningsløsninger og tyngre budskap.",
      tag: "Forsyningsløsning", title: "Aldri tomt for festemidler", text: "Med 2BOX fyller vi på før du går tom, rett i hyllene på verkstedet.", cta: "Les om 2BOX", img: "forsyningslosninger-2-boks.jpg" }
  ];

  var DEVICE = [{ key: "desktop", name: "PC" }, { key: "mobile", name: "Mobil" }];

  var state = {
    bannerTheme: "info", bannerIcon: true, bannerLink: true, bannerClose: true, bannerOn: true,
    boxTheme: "light", boxImage: false, boxTag: true, boxButton: true, boxOn: true,
    device: "desktop"
  };

  function find(list, key) { for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i]; return list[0]; }

  // Tall-spenn som «07-16» og «1-2» skal ikke deles over to linjer
  function keepRanges(text) { return text.replace(/(\d)-(\d)/g, "$1‑$2"); }

  function bannerHtml(t, o) {
    return '<div class="ms-topbar ' + t.mod + '" role="region" aria-label="Melding">' +
      (o.icon ? svg(t.icon, "ms-topbar__icon") : "") +
      '<p class="ms-topbar__text">' + keepRanges(t.text) +
      (o.link ? '<a class="ms-topbar__link" href="#" data-noop>' + t.link + " →</a>" : "") + "</p>" +
      (o.close ? '<button type="button" class="ms-topbar__close" aria-label="Lukk meldingen" data-close="banner">' + svg("close") + "</button>" : "") +
      "</div>";
  }

  function boxHtml(t, o) {
    return '<aside class="ms-box ' + t.mod + '" aria-label="' + t.title + '">' +
      (o.image ? '<img class="ms-box__media" src="' + IMG + t.img + '" alt="">' : "") +
      '<div class="ms-box__body">' +
      (o.tag ? '<span class="ms-box__tag">' + t.tag + "</span>" : "") +
      '<h3 class="ms-box__title">' + t.title + "</h3>" +
      '<p class="ms-box__text">' + t.text + "</p>" +
      (o.button ? '<a class="btn btn--primary btn--sm ms-box__cta" href="#" data-noop>' + t.cta + "</a>" : "") +
      "</div>" +
      (o.close !== false ? '<button type="button" class="ms-box__close" aria-label="Lukk" data-close="box">' + svg("close") + "</button>" : "") +
      "</aside>";
  }

  var stage = document.querySelector("[data-stage]");
  var bannerSlot = document.querySelector("[data-banner-slot]");
  var boxSlot = document.querySelector("[data-box-slot]");

  function render() {
    stage.setAttribute("data-device", state.device);
    bannerSlot.innerHTML = state.bannerOn
      ? bannerHtml(find(BANNER, state.bannerTheme), { icon: state.bannerIcon, link: state.bannerLink, close: state.bannerClose })
      : "";
    boxSlot.innerHTML = state.boxOn
      ? boxHtml(find(BOX, state.boxTheme), { image: state.boxImage, tag: state.boxTag, button: state.boxButton })
      : "";
    document.querySelectorAll("[data-toggle]").forEach(function (el) { el.checked = !!state[el.getAttribute("data-toggle")]; });
    document.querySelectorAll("[data-control] [data-value]").forEach(function (b) {
      var key = b.parentNode.getAttribute("data-control");
      b.setAttribute("aria-pressed", String(state[key] === b.getAttribute("data-value")));
    });
  }

  function chips(control, list) {
    var host = document.querySelector('[data-control="' + control + '"]');
    host.innerHTML = list.map(function (t) {
      return '<button type="button" class="mp-chip mp-chip--tab" data-value="' + t.key + '" aria-pressed="false">' + t.name + "</button>";
    }).join("");
    host.addEventListener("click", function (e) {
      var b = e.target.closest("[data-value]");
      if (!b) return;
      state[control] = b.getAttribute("data-value");
      if (control === "bannerTheme") state.bannerOn = true;
      if (control === "boxTheme") state.boxOn = true;
      render();
    });
  }

  chips("bannerTheme", BANNER);
  chips("boxTheme", BOX);
  chips("device", DEVICE);

  document.querySelectorAll("[data-toggle]").forEach(function (el) {
    el.addEventListener("change", function () { state[el.getAttribute("data-toggle")] = el.checked; render(); });
  });

  document.querySelector("[data-replay]").addEventListener("click", function () {
    state.boxOn = false;
    render();
    setTimeout(function () { state.boxOn = true; render(); }, 250);
  });

  document.addEventListener("click", function (e) {
    var close = e.target.closest("[data-close]");
    if (close && stage.contains(close)) {
      if (close.getAttribute("data-close") === "banner") state.bannerOn = false;
      else state.boxOn = false;
      render();
      return;
    }
    if (e.target.closest("[data-noop]")) e.preventDefault();
  });

  // Temaoversikt: alle temaene side om side
  document.querySelector('[data-swatches="banner"]').innerHTML = BANNER.map(function (t) {
    return '<div class="ms-swatch"><span class="ms-swatch__label"><b>' + t.name + "</b> · " + t.use + "</span>" +
      bannerHtml(t, { icon: true, link: true, close: true }).replace(/data-close="banner"/, "tabindex=\"-1\"") + "</div>";
  }).join("");
  document.querySelector('[data-swatches="box"]').innerHTML = BOX.map(function (t, i) {
    return '<div class="ms-swatch"><span class="ms-swatch__label"><b>' + t.name + "</b> · " + t.use + "</span>" +
      boxHtml(t, { image: i % 2 === 0, tag: true, button: true }).replace(/data-close="box"/, "tabindex=\"-1\"") + "</div>";
  }).join("");

  // Infoboksen glir inn litt etter at siden er åpnet, som den vil gjøre i nettbutikken
  state.boxOn = false;
  render();
  setTimeout(function () { state.boxOn = true; render(); }, 900);
})();
