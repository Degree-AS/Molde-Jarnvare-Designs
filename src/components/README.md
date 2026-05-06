# Components

Denne mappen inneholder alle UI-komponenter i designsystemet. Hver komponent
ligger i sin egen mappe med CSS, en selvstendig HTML-preview og valgfri
dokumentasjon.

## Mappestruktur

```
src/components/
  hero/
    hero.css       Komponent-CSS (BEM)
    hero.html      Live preview — åpne i nettleser for å se varianter
    README.md      (valgfritt) Bruksregler, props, do/don't
  product-card/
    ...
```

## Navngiving

- **Mappenavn og filnavn:** lowercase kebab-case (`hero`, `product-card`,
  `quantity-stepper`).
- **CSS-klasser:** [BEM](https://getbem.com/naming/) — `.block__element--modifier`.
  Block-navnet matcher mappenavnet.

  ```css
  .hero            /* block */
  .hero__title     /* element */
  .hero--dark      /* modifier */
  ```

## Tokens, ikke hardkodede verdier

All farge, spacing, typografi, radius, skygge, motion osv. skal hentes fra
`src/styles/tokens/`. Aldri `padding: 24px` — alltid `padding: var(--s-6)`.

Hvis du trenger en verdi som ikke finnes som token, **legg den til i tokens
først** (med begrunnelse i PR), ikke i komponenten.

## Selvstendige previews

Hver `*.html`-fil i en komponentmappe skal kunne åpnes direkte i nettleser og
vise komponenten med riktig styling. Den inkluderer:

1. Webfont (Source Sans 3) fra Google Fonts.
2. Tokens via `../../styles/tokens/index.css`.
3. Komponentens egen CSS.
4. En minimal inline preview-reset (flyttes til `src/styles/base/reset.css`
   senere).

Vis gjerne flere varianter i samme preview, separert med en `.preview-label`.

## Når blir noe en egen komponent?

Tommelfingerregel: **andre gang** du trenger samme mønster i en annen
komponent, er det tid for å trekke det ut. Første gang er det greit å
inline-style det inne i komponenten som trenger det (slik `hero__cta` gjør i
påvente av en Button-komponent).

## Pages

Hele sider — som komponerer flere komponenter — ligger i `src/pages/` (én nivå
opp). En side er bare en HTML-fil som linker inn tokens, base-styles og de
komponentene den bruker.
