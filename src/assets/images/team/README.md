# `/team` — portretter av ansatte

Brukes som avatar i `.person-card`-komponenten på forsiden og PDP-en.

## Erstatte placeholder med ekte portretter

Filen `ansatt-portrett.jpg` er en placeholder (MJ-blå med initialene «MJ») som
ligger her inntil de faktiske portrettene kommer fra fotograf.

For å bytte til ekte portretter:

1. Dropp portrettene inn i denne mappen som JPG-filer
2. Anbefalt navngivning: `<fornavn>-<etternavn>.jpg`, kebab-case, ASCII
   - `ola-nordmann.jpg`
   - `kari-bergshaug.jpg`
   - osv.
3. Spec: kvadratisk crop, 400 × 400 px, JPEG kvalitet ~80, EXIF stripped, ≤ 60 KB
4. Oppdater `img src` i `src/pages/home.html` og `src/pages/product.html` så
   hver person-card peker på sitt portrett

## I demo nå

Mens alle person-kort peker på samme `ansatt-portrett.jpg` ser man hvordan
designet fungerer med portretter, men det er bevisst tydelig at det er
plassholder (samme bilde gjentatt + MJ-merket).
