# `/docs` — klient-vendt dokumentasjon

Denne mappa inneholder **selvstendige HTML-presentasjoner** av designsystemet,
ment for ledelsen, kunden og eksterne lesere. Skiller seg fra `src/`:

| Mappe | Hvem leser? | Hva ser de? |
|-------|-------------|-------------|
| `src/components/`, `src/pages/` | Utviklere & designere | Live markup + CSS, slik det faktisk vil fungere |
| `docs/` | Kunde, ledelse, eksterne | Forklarende sider om *hvorfor* og *hvordan* |

## Hvorfor selvstendige filer

Hver fil i `docs/` skal kunne sendes alene — som vedlegg, eller deles via en
direkte lenke til én fil — uten at resten av repoet må følge med.

Det betyr:

- **Tokens inlines** øverst i `<style>`. Ingen `@import` til `src/styles/`.
- **Ingen relative paths** ut av mappa, bortsett fra navigerings-lenker fra
  `index.html` til `src/pages/` og `src/components/` (disse er bekvemmelighet,
  ikke avhengighet for selve dokumentet).
- **Inline SVG-ikoner** istedenfor `<img>` der det går an.

Konsekvens: når vi oppdaterer en token i `src/styles/tokens/`, oppdateres ikke
disse docs automatisk. De er **versjonerte snapshots**. Det er en feature: en
docs-fil med dato 2026-05-06 viser systemet slik det var den dagen.

## Slik lager du en ny presentasjon

1. Kopier `designsystem.html` til et beskrivende navn:
   - `brand-guide.html` for kortform-oversikt
   - `presentasjon-2026-q2.html` for tids-spesifikk gjennomgang
   - `tilgjengelighet.html` for tema-spesifikk dypdykk

2. Oppdater øverst i fila:
   - `<title>`
   - `.hero__overline` (versjon + dato)
   - `.hero__title`
   - `.hero__lead`

3. Rediger seksjonene under. Hver seksjon har:
   ```html
   <section class="section" id="seksjons-id">
     <div class="section__num">NN / Kategori</div>
     <h2 class="section__title">Seksjonstittel</h2>
     <p class="section__lead">Ledetekst.</p>
     ...
   </section>
   ```

4. Oppdater sidebar-navigasjonen (`.nav` på toppen) med korrekte ankre.

5. Legg en `<a class="card">` i `index.html` som peker på den nye fila.

## Versjonering av snapshots

Når dere har en stor revisjon (v0.2 → v1.0), behold den gamle fila og lag en
ny. F.eks.:

```
docs/
  designsystem.html             ← alltid nyeste versjon
  archive/
    designsystem-v0.1.html
    designsystem-v1.0.html
```

Slik kan kunden alltid sammenligne med tidligere godkjente versjoner.

## GitHub Pages

Hvis Pages aktiveres med kilde `main` / `/docs`, blir denne mappa publisert
automatisk på `https://degree-as.github.io/Molde-Jarnvare-Designs/`. Da
fungerer `index.html` som forsiden, og lenker fra den til `../src/pages/` og
`../src/components/` virker også (Pages publiserer hele repoet, men starter
nettleseren i `/docs`).
