# -*- coding: utf-8 -*-
"""Felles site-header for alle skisser — én kilde, byttes inn i alle sider.

Kjør fra repo-roten etter endringer i headeren (menypunkter, ikoner, tekster):
    python scripts/site-header.py

Oppdaterer src/pages/*.html (unntatt index.html og _partials.html),
src/components/index.html og docs/explorations/*.html. Anonyme sider
(ANON under) får «Logg inn» i stedet for konto + handlekurv.
_partials.html oppdateres ikke automatisk — lim inn build('', '../assets/', False).
Rør aldri versions/ — de er frosne.
"""
import io, re, glob

ICON = {
  'menu':   '<path d="M4 6h16M4 12h16M4 18h16"/>',
  'search': '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>',
  'user':   '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>',
  'cart':   '<path d="M6 6h15l-1.5 9H7.5z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
  'close':  '<path d="M6 6l12 12M18 6 6 18"/>',
  'next':   '<path d="m9 6 6 6-6 6"/>',
  'prev':   '<path d="m15 6-6 6 6 6"/>',
  'phone':  '<path d="M3.5 5.5c0-1.1.9-2 2-2h2.2c.5 0 .9.3 1 .8l1 4c.1.4 0 .8-.3 1.1L7.5 11a14 14 0 0 0 5.5 5.5l1.6-1.9c.3-.3.7-.4 1.1-.3l4 1c.5.1.8.5.8 1V18.5c0 1.1-.9 2-2 2A16.5 16.5 0 0 1 3.5 5.5z"/>',
}
def svg(name, cls='site-header__action-icon', extra=''):
    return f'<svg class="{cls}{extra}" viewBox="0 0 24 24" aria-hidden="true">{ICON[name]}</svg>'

FESTEMIDLER = ["Annet festemateriell","Blindnagler og blindmuttere","Gjengestenger","Låseringer",
  "Muttere","Pinner og hylser","Skiver","Skruer og bolter","Spiker"]
PRODUCTS = [
  ("Festemidler", FESTEMIDLER),
  ("Verktøy", ["Håndverktøy","Elektroverktøy","Skrumaskiner og borr","Nøkler og tang"]),
  ("Verneutstyr", ["Hansker","Briller og hørselsvern","Hjelmer","Vernefottøy","Åndedrettsvern"]),
  ("Hydraulikk", ["Slanger og koblinger","Sylindere","Ventiler og pumper"]),
  ("Sveis", ["Sveiseapparater","Elektroder og tråd","Beskyttelsesgass"]),
  ("Industri", ["Kulelagre","Drev og tannhjul","Akselkoblinger"]),
  ("Slipemidler", ["Slipeskiver","Slipepapir","Polering"]),
  ("Tetninger og pakninger", ["O-ringer","Flatpakninger","Tetningsmasse"]),
  ("Lim og kjemikalier", ["Industrilim","Silikon og fugemasse","Sprayer og rens"]),
  ("Måleinstrumenter", ["Skyvelære og mikrometer","Multimeter","Vekter og våger"]),
  ("Smøring og rens", ["Smøreolje og fett","Avfetting og rens","Rustbeskyttelse"]),
  ("Bil og verksted", ["Jekker og bukker","Verktøyvogner","Trykkluft og slanger"]),
  ("Lagring og logistikk", ["Plastbokser og kasser","Hyller og reoler","Pakketape og emballasje"]),
  ("Elektro", ["Kabel og ledning","Plugger og kontakter","Sikringer og automater"]),
  ("Skilt og merking", ["Etiketter og tape","Sikkerhetsskilt","Avsperring"]),
]
SUPPLY = [("2BOX","content-2box.html"),("Scan2order",None),("Weight2Order",None),("Verktøysporing",None)]
SERVICES = ["Slange-verksted","Analyse og kalibrering","Profiltøy","Kurs og opplæring","Enerpac","Parker Store","ONIX","Serviceverksted"]
MENUS = [  # (trigger-tekst, megameny-id, skuff-panel-id, "Alle …"-tittel, "Se alle …")
  ("Produkter", "megamenu", "drawer-products", "Alle produkter", "Se alle produkter"),
  ("Forsyningsløsninger", "megamenu-supply", "drawer-supply", "Alle forsyningsløsninger", "Se alle forsyningsløsninger"),
  ("Øvrige Tjenester", "megamenu-services", "drawer-services", "Alle øvrige tjenester", "Se alle øvrige tjenester"),
]

SEARCH_ICON = '<svg class="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>'

def build(p, a, anon, attrs=''):
    """p = prefiks til src/pages/, a = prefiks til src/assets/, anon = anonym besøkende."""
    def href(x): return f'{p}{x}' if x else '#'
    def link(name): return href('category.html') if name == 'Skruer og bolter' else '#'
    def search_form(ind):
        i = ' ' * ind
        return [f'{i}<form class="search-bar" role="search" action="{href("search.html")}">',
                f'{i}  {SEARCH_ICON}',
                f'{i}  <input class="search-bar__input" type="search" name="q" placeholder="Søk i 30 000+ artikler, NOBB-nr, EAN…" aria-label="Søk">',
                f'{i}  <button class="search-bar__submit" type="submit">Søk</button>',
                f'{i}</form>']
    L = []
    w = L.append
    w(f'<header class="site-header"{attrs}>')
    w('  <div class="site-header__inner">')
    w('    <!-- Meny + søk — kun mobil/tablet (skjult fra --bp-lg) -->')
    w('    <div class="site-header__start">')
    w(f'      <button class="site-header__action" type="button" aria-label="Åpne meny" aria-controls="site-nav-drawer" aria-expanded="false">{svg("menu")}</button>')
    w(f'      <button class="site-header__action site-header__action--search" type="button" aria-label="Åpne søk" aria-controls="site-header-search-mobile" aria-expanded="false">{svg("search")}</button>')
    w('    </div>')
    w(f'    <a class="site-header__logo" href="{href("home.html")}" aria-label="Molde Jarnvare – til forsiden"><img src="{a}logos/molde-jarnvare-positive.png" alt="Molde Jarnvare" class="site-header__logo-img"></a>')
    w('    <p class="site-header__tagline">Totalleverandør av festemidler, hydraulikk, verneutstyr, verktøy og forbruksmateriell</p>')
    w('    <div class="site-header__actions">')
    if anon:
        w('      <!-- Anonym besøkende (ADO 19544): Logg inn i stedet for konto + handlekurv -->')
        w(f'      <a class="site-header__action" href="{href("login.html")}" aria-label="Logg inn">{svg("user")}</a>')
    else:
        w(f'      <a class="site-header__action" href="{href("account.html")}" aria-label="Min konto">{svg("user")}</a>')
        w(f'      <a class="site-header__action" href="{href("cart.html")}" aria-label="Handlekurv (3)">{svg("cart")}<span class="badge badge--numeric site-header__action-badge">3</span></a>')
    w('    </div>')
    w('  </div>')
    w('')
    w('  <!-- Mobilsøk — åpnes av søkeikonet (skjult fra --bp-lg) -->')
    w('  <div class="site-header__search-panel" id="site-header-search-mobile" hidden>')
    w('    <div class="site-header__search-panel-inner">')
    L.extend(search_form(6))
    w('    </div>')
    w('  </div>')
    w('')
    w('  <!-- Rad 2 — søk + hovedmeny (kun desktop) -->')
    w('  <div class="site-header__main">')
    w('    <div class="site-header__main-inner">')
    w('      <div class="site-header__search">')
    L.extend(search_form(8))
    w('      </div>')
    w('      <nav class="site-header__nav" aria-label="Hovedmeny">')
    for text, mid, _, _, _ in MENUS:
        w(f'        <button class="site-header__nav-trigger" type="button" aria-controls="{mid}" aria-expanded="false">{text}<svg class="site-header__nav-trigger-icon" width="14" height="14" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>')
    w(f'        <a class="site-header__nav-link" href="{href("team.html")}"><svg class="site-header__nav-link-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">{ICON["phone"]}</svg>Kontakt</a>')
    w('      </nav>')
    w('    </div>')
    w('  </div>')
    w('')
    w('  <!-- Megamenyer — én per trigger, åpnes under headeren på desktop.')
    w('       Backdrop ligger inni headeren så den havner under panelene (samme stacking context). -->')
    w('  <div class="megamenu-backdrop" aria-hidden="true"></div>')
    for text, mid, _, title, seeall in MENUS:
        w(f'  <div class="megamenu" id="{mid}" role="navigation" aria-label="{text}">')
        w('    <div class="megamenu__inner">')
        w(f'      <div class="megamenu__intro"><h2 class="megamenu__intro-title">{title}</h2></div>')
        w('      <div class="megamenu__columns">')
        if mid == 'megamenu':
            for head, items in PRODUCTS:
                w('        <div class="megamenu__group">')
                w(f'          <a class="megamenu__heading" href="#">{head}</a>')
                w('          <ul class="megamenu__list">')
                for it in items:
                    w(f'            <li><a href="{link(it)}">{it}</a></li>')
                w('          </ul>')
                w('        </div>')
        elif mid == 'megamenu-supply':
            for name, h in SUPPLY:
                w(f'        <div class="megamenu__group"><a class="megamenu__heading" href="{href(h)}">{name}</a></div>')
        else:
            for name in SERVICES:
                w(f'        <div class="megamenu__group"><a class="megamenu__heading" href="#">{name}</a></div>')
        w('      </div>')
        w('      <div class="megamenu__footer">')
        w(f'        <a class="megamenu__footer-link" href="#">{seeall} →</a>')
        if mid == 'megamenu':
            w('        <span class="megamenu__intro-meta">Bestill direkte med <strong>NOBB-nr</strong> eller <strong>EAN</strong> via søket</span>')
        w('      </div>')
        w('    </div>')
        w('  </div>')
    w('')
    close = f'<button class="site-header__drawer-close" type="button" aria-label="Lukk meny" data-drawer-close>{svg("close")}</button>'
    w('  <!-- Mobilmeny — skuff fra venstre (skjult fra --bp-lg). Ett panel per undermeny. -->')
    w('  <div class="site-header__drawer-backdrop" aria-hidden="true"></div>')
    w('  <div class="site-header__drawer" id="site-nav-drawer" role="dialog" aria-modal="true" aria-label="Meny">')
    w('    <div class="site-header__drawer-panel" id="drawer-main">')
    w(f'      <div class="site-header__drawer-header"><span class="site-header__drawer-title">Meny</span>{close}</div>')
    w('      <nav class="site-header__drawer-nav" aria-label="Hovedmeny (mobil)">')
    for text, _, pid, _, _ in MENUS:
        w(f'        <button class="site-header__drawer-item" type="button" data-drawer-panel="{pid}">{text}{svg("next", "site-header__drawer-icon", " site-header__drawer-icon--chevron")}</button>')
    w(f'        <a class="site-header__drawer-item site-header__drawer-item--contact" href="{href("team.html")}">{svg("phone", "site-header__drawer-icon")}Kontakt</a>')
    w('      </nav>')
    w('    </div>')
    for text, mid, pid, _, seeall in MENUS:
        w(f'    <div class="site-header__drawer-panel" id="{pid}" hidden>')
        w(f'      <div class="site-header__drawer-header"><button class="site-header__drawer-back" type="button" data-drawer-panel="drawer-main">{svg("prev", "site-header__drawer-icon")}{text}</button>{close}</div>')
        w(f'      <a class="site-header__drawer-all" href="#">{seeall}</a>')
        if mid == 'megamenu':
            for head, items in PRODUCTS:
                w('      <div class="site-header__drawer-group">')
                w(f'        <a class="site-header__drawer-group-title" href="#">{head}</a>')
                w('        <ul class="site-header__drawer-list">')
                for it in items:
                    w(f'          <li><a class="site-header__drawer-link" href="{link(it)}">{it}</a></li>')
                w('        </ul>')
                w('      </div>')
        else:
            entries = SUPPLY if mid == 'megamenu-supply' else [(n, None) for n in SERVICES]
            w(f'      <nav class="site-header__drawer-nav" aria-label="{text}">')
            for name, h in entries:
                w(f'        <a class="site-header__drawer-item" href="{href(h)}">{name}</a>')
            w('      </nav>')
        w('    </div>')
    w('  </div>')
    w('</header>')
    return '\n'.join(L)

HEADER_RX = re.compile(r'<header class="site-header[^"]*"([^>]*)>.*?</header>'
                       r'(\s*<div class="site-header__drawer-backdrop"[^>]*></div>)?'
                       r'(\s*<div class="megamenu-backdrop"[^>]*></div>)?', re.S)
CSS_RX = re.compile(r'(<link rel="stylesheet" href="([^"]*)styles/index\.css">)')

def keep_attrs(raw):
    # behold preview-attributter (data-preview-*) fra den gamle header-taggen
    return ''.join(' ' + m for m in re.findall(r'data-preview-[a-z-]+="[^"]*"', raw))

def apply(path, p, a, anon):
    s = io.open(path, encoding='utf-8', newline='').read()
    crlf = '\r\n' in s
    s = s.replace('\r\n', '\n')
    m = HEADER_RX.search(s)
    assert m, path
    s = s[:m.start()] + build(p, a, anon, keep_attrs(m.group(1))) + s[m.end():]
    if 'scripts/site-header.js' not in s:
        s, n = CSS_RX.subn(lambda mm: mm.group(1) + f'\n  <script src="{mm.group(2)}scripts/site-header.js" defer></script>', s, count=1)
        assert n == 1, path
    if crlf:
        s = s.replace('\n', '\r\n')
    io.open(path, 'w', encoding='utf-8', newline='').write(s)

if __name__ == '__main__':
    ANON = {'category-anonym.html', 'content-2box.html', 'product-anonym.html', 'product-minarc-anonym.html', 'login.html'}
    n = 0
    for f in sorted(glob.glob('src/pages/*.html')):
        name = f.replace('\\', '/').split('/')[-1]
        if name in ('index.html', '_partials.html'):
            continue
        apply(f, '', '../assets/', name in ANON)
        n += 1
    apply('src/components/index.html', '../pages/', '../assets/', False)
    n += 1
    for f in glob.glob('docs/explorations/*.html'):
        apply(f, '../../src/pages/', '../../src/assets/', False)
        n += 1
    print('oppdatert', n, 'filer')
