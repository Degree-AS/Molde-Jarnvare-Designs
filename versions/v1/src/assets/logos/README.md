# Logo-filer

Per **§9 Logo usage** i designsystemet skal følgende filer ligge her:

| Fil | Variant | Bruk |
|-----|---------|------|
| `molde-jarnvare-positive.png` | Positiv (Reflex blå) | Header på lyse sider, e-postsignatur, print |
| `molde-jarnvare-negative.png` | Negativ (hvit) | Footer på Reflex-blå bakgrunn, hero på mørk variant |
| `mj-mark.png` *(valgfritt)* | Kun MJ-merke | Touch-icon, små flater under 200 px bredde |
| `favicon.svg` *(valgfritt)* | Favicon | MJ-merke uten "1930" |

## Anbefalinger

- **SVG foretrekkes** når tilgjengelig — `.svg` versjoner kan legges side ved side med `.png` (markupen kan oppdateres til å bruke `<picture>` med både).
- **Minimumsbredde 200 px** for full lockup (per §9.2).
- **Ikke endre proporsjoner, farger, eller legg til effekter** (per §9.4 — eies av Grafia 2025).

## Hvor brukes filene

- `src/components/site-header/` — positiv variant
- `src/components/site-footer/` — negativ variant
- `src/pages/*.html` — direkte `<img>` referanser

Hvis filnavn endres må følgende oppdateres samtidig:
`src/components/site-header/site-header.css`,
`src/components/site-footer/site-footer.css`,
og alle `src/pages/*.html` der `<img class="site-header__logo-img">` finnes.
