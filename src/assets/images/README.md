# `/src/assets/images` — bildebibliotek

Placeholders og illustrative bilder brukt mens vi bygger designsystemet og sidemaler.
**Ikke produksjons-assets:** i drift hentes bildene fra CMS-et frontend kobles mot.
Disse filene står her for at sidemaler, komponenter og docs/-presentasjoner skal
kunne vises i en helhetlig sammenheng under designarbeidet.

## Mappestruktur

```
images/
  marketing/     situasjons-/lifestyle-foto (verksted, lager, ordrekontor, serviceflow)
  products/      tette produkt- og sortimentsbilder (festemidler, hydraulikk, koblinger)
  heritage/      historiske bilder som forteller MJ-historien («siden 1930»)
```

Mappene utvides etter behov (eks. `team/` for portretter når portrettmaterialet er klart).

## Filkonvensjoner

- **Format**: JPEG (`.jpg`), progressive, EXIF stripped
- **Maks bredde**: 1600 px på lengste side
- **Kvalitet**: 78 (mozjpeg / Pillow optimize)
- **Filstørrelse**: ~ 100–300 KB per fil. Hvis et bilde går over 500 KB, gjør en runde til i Squoosh
- **Navngivning**: kebab-case, beskrivende, ASCII-trygt. Eks: `slangeverksted-presse.jpg`,
  `lager-pakking-2-boks.jpg`. Ingen mellomrom, ingen `æ ø å`, ingen versaler i extension
- **Opphav**: alle bilder hentet fra `Degree AS/Degree og Molde Jarnvare - Arbeidsdokumenter/
  03 Design & Grafisk/Aktuelle bilder ny nettside/` (12. mai 2026)

## Bruk i kode

```html
<!-- fra src/pages/ -->
<img src="../assets/images/marketing/slangeverksted-presse.jpg" alt="Operatør presser hydraulikkslange på Uniflex-maskin">

<!-- fra src/components/<navn>/ -->
<img src="../../assets/images/products/festemidler-hero.jpg" alt="Utvalg av festemidler — sekskantskruer, mutter, skiver">
```

## Bruk i docs/

`docs/`-filer skal være selvstendige. Hvis et bilde brukes der, kopier det inn under
`docs/assets/images/` (samme mønster som logoene). Aldri `@import` eller relative paths
ut av `docs/`.

## Når CMS er på plass

1. Erstatte img-stier i sidemaler med CMS-tokens (eks. `{{ cms.image.product_hero }}`)
2. `git rm -r src/assets/images/marketing` (og tilsvarende) for å fjerne placeholders
3. Beholde `heritage/` hvis disse skal være statiske brand-assets (typisk: ja)
