# Logo-filer

Per **§9 Logo usage** i designsystemet skal følgende filer ligge her:

| Fil | Variant | Bruk |
|-----|---------|------|
| `molde-jarnvare-positive.png` | Positiv (Reflex blå) | Header på lyse sider, e-postsignatur, print |
| `molde-jarnvare-negative.png` | Negativ (hvit) | Footer på Reflex-blå bakgrunn, hero på mørk variant |

**Kilde:** Mottatt fra brand 2025-09-09 som `Logo-rgb-2025-stor.png` (positiv) og
`Logo-negativ-2025.png` (negativ). Filene er omdøpt til kebab-case, men selve
bilde-innholdet er uendret.

**Format:** PNG 3000×377, 8-bit RGBA, non-interlaced.

## Anbefalinger

- **SVG foretrekkes** når tilgjengelig — `.svg` versjoner kan legges side ved side med `.png` (markupen kan oppdateres til å bruke `<picture>` med både).
- **Minimumsbredde 200 px** for full lockup (per §9.2).
- **Ikke endre proporsjoner, farger, eller legg til effekter** (per §9.4 — eies av Grafia 2025).

## Hvor brukes filene

- `src/components/site-header/` + alle `src/pages/*.html` — positiv variant
- `src/components/site-footer/` + `src/pages/home.html` + `src/pages/_partials.html` — negativ variant
- `src/components/index.html` — positiv variant (komponent-galleri)

Hvis filnavn endres må følgende oppdateres samtidig:
`src/components/site-header/site-header.css`,
`src/components/site-footer/site-footer.css`,
og alle `src/pages/*.html` der `<img class="site-header__logo-img">` eller `<img class="site-footer__logo-img">` finnes.
