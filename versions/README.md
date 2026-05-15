# Versjoner

Frosne kopier av designsystemet. Hver `versions/vN/` er en selvstendig
øyeblikksbilde med stabil URL — laget for at Molde Jarnvare skal kunne godkjenne
en konkret versjon, og at vi senere kan lage en ny versjon uten å miste den forrige.

## Hva ligger her

```
versions/
  index.html      ← versjonsloggen (publisert på GitHub Pages: /versions/)
  v1/             ← frosset kopi: v1/docs/ + v1/src/ + v1/index.html
  v2/             ← neste frosne kopi …
```

Den indre mappestrukturen er identisk med repo-roten med vilje — da virker alle
relative lenker og `@import` inne i snapshotet uten endringer. Et snapshot er
ren `cp -R`, ingen omskriving av stier.

`docs/` og `src/` i repo-roten er fortsatt «gjeldende arbeidsversjon» og endres
løpende. Snapshots fryser tre artefakter samtidig: designretningslinjer
(`docs/designsystem.html`), komponentbibliotek (`src/components/`) og
komponentblokker / sidemaler (`src/pages/`).

## Lage en ny versjon

```bash
scripts/cut-version.sh v2          # kopierer dagens docs/ + src/ + index.html → versions/v2/
# rediger versions/index.html: legg til en blokk for v2 øverst under «Versjoner»
git add versions/v2 versions/index.html
git commit -m "chore(versions): klipp v2"
git tag design-v2
git push origin HEAD --tags         # workflowen lager en GitHub Release for design-v2
```

Når Molde Jarnvare godkjenner: bytt statusbadgen i `versions/index.html` til
«Godkjent <dato>», merk den forrige versjonen som «Erstattet» om relevant, og
noter godkjenningen i Design-protokollen i Notion.

## Hvorfor ikke bare git-tagger / branches

GitHub Pages publiserer kun den gjeldende tilstanden til `main` — gamle tagger og
brancher er ikke surfbare som live-sider. Derfor trenger vi frosne mapper med egne
URL-er. Taggene (`design-vN`) og Releases er sporbarhetslaget på toppen.
