#!/usr/bin/env bash
# Klipp en frosset versjon av designsystemet.
#
#   scripts/cut-version.sh v2
#
# Kopierer dagens docs/ + src/ + index.html til versions/v2/ (samme indre
# mappestruktur, så alle relative lenker/CSS-importer fortsatt virker).
# Etterpå: legg til en blokk i versions/index.html, commit, og lag git-taggen
# design-v2 (workflowen .github/workflows/design-version-release.yml lager
# en GitHub Release når taggen pushes).
set -euo pipefail

ver="${1:-}"
if [[ -z "$ver" ]]; then
  echo "Bruk: $0 <versjon>   f.eks. $0 v2" >&2
  exit 1
fi
if [[ ! "$ver" =~ ^v[0-9]+$ ]]; then
  echo "Versjon må være på formen v<tall>, f.eks. v2 (fikk: '$ver')" >&2
  exit 1
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
dest="$repo_root/versions/$ver"

if [[ -e "$dest" ]]; then
  echo "versions/$ver finnes allerede — slett den først hvis du vil klippe på nytt." >&2
  exit 1
fi

if [[ -n "$(git -C "$repo_root" status --porcelain)" ]]; then
  echo "Arbeidstreet er ikke rent. Commit eller stash først så snapshotet blir reproduserbart." >&2
  exit 1
fi

mkdir -p "$dest"
cp -R "$repo_root/docs" "$repo_root/src" "$repo_root/index.html" "$dest/"

today="$(date +%Y-%m-%d)"
cat <<EOF

  Klippet versions/$ver fra dagens main ($today, commit $(git -C "$repo_root" rev-parse --short HEAD)).

  Neste steg:
    1. Legg til en blokk for $ver øverst under «Versjoner» i versions/index.html
       (dato $today, status «Til godkjenning hos Molde Jarnvare», lenker, endringsliste).
    2. git add versions/$ver versions/index.html && git commit -m "chore(versions): klipp $ver"
    3. git tag design-$ver && git push origin HEAD --tags
    4. Når Molde Jarnvare godkjenner: oppdater statusen i versions/index.html og i Notion Design-protokollen.

EOF
