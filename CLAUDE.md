# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Static HTML + CSS design system for Molde Jarnvare (Norwegian B2B hardware e-commerce). **No build, no package.json, no JS framework, no tests, no linter.** Every artifact is a plain file you open in a browser.

Working language: Norwegian (`lang="nb"`). Code/comments in Norwegian; keep it that way unless the user asks otherwise.

The system was generated from a `DESIGN_SYSTEM.md` spec (v0.1) that is **not in this repo** — section numbers like §4, §12.1, §15.7 in comments/markup refer to it. Treat those references as anchors only; don't try to open the file.

## How this repo is worked on (read this first)

This repo is usually driven by a **non-technical user via Claude** — translate plain-language asks into the right plumbing, commit with a conventional-commit message, and push. Never make the user touch git. Small changes can go straight to `main`; use a short-lived branch + PR only if the user asks for review.

Common requests and the correct response:

- **"Change a color / spacing / type / token"** → edit the right file under `src/styles/tokens/` (re-export through `tokens/index.css` if it's a new file). If a `docs/*.html` snapshot uses that token, copy the new value into its inline `<style>` deliberately — `docs/` does not auto-update. Commit, push.
- **"Add / change a component"** → follow the Component convention below (dir = block = filename, strict BEM, add the `@import` line in the correct §-section of `src/styles/index.css`, add a standalone preview). Commit, push.
- **"Cut version N" / "freeze the current state" / "make a version for the customer to approve"** → run `scripts/cut-version.sh vN`; then add a new block at the **top** of the "Versjoner" list in `versions/index.html` (today's date, badge `Til godkjenning hos Molde Jarnvare`, links to the three artifacts, a short changelog vs the previous version); if relevant flip the previous block's badge to `Erstattet`; commit `chore(versions): klipp vN`; `git tag design-vN`; push branch + tags (the release workflow turns the tag into a GitHub Release). Also add three rows to the Notion **Design protocol** DB (one per artifact: Design guidelines / Component library / Page templates) with `Status: Pending`, `Version: N`, and `Link` pointing to the matching `…/versions/vN/...` URL — see "Approval log — Notion Design protocol" below. See `versions/README.md`.
- **"<Customer> approved version N"** → in `versions/index.html` change vN's badge to `Godkjent <date>`; commit; push. Then update the matching rows in the Notion **Design protocol** DB: `Status: Approved`, `Approved by: Leif Erling` (default approver on the Molde Jarnvare side — confirm if the user names someone else), `Approved date: <date>`. Flip the previous version's rows to `Replaced` if relevant. See "Approval log — Notion Design protocol" below.

Hard rules:

- **Routine edits to `docs/` or `src/` do NOT create a version.** Only cut a `versions/vN/` snapshot when explicitly asked for one.
- **Never edit anything under an existing `versions/vN/`** — those are frozen by definition. To preserve a state, cut a new version.
- Don't push tags or open releases unless the request was about cutting/approving a version.

## How to "run" things

There is nothing to install or build. To preview:

- Open any HTML file directly in a browser (`file://...`) or serve the repo root with any static server, e.g. `python3 -m http.server` and browse to `src/pages/index.html` or `src/components/index.html`.
- `src/components/<name>/<name>.html` — isolated preview of one component (loads tokens + its own CSS, nothing else).
- `src/components/index.html` — gallery of every component, loads `src/styles/index.css` (the production entry).
- `src/pages/index.html` — index of all composed pages (§15).
- `docs/index.html` — client-facing snapshot deck (different audience, different rules — see below).

GitHub Pages, when enabled with source `main` / `/docs`, publishes the whole repo but lands users in `docs/`. Relative links from `docs/` into `../src/` work in that deployment.

## Architecture (the parts that aren't obvious from `ls`)

### Two parallel surfaces — `src/` and `docs/`

| | `src/` | `docs/` |
|---|---|---|
| Audience | devs / designers | clients / management |
| Style sources | `@import` from `src/styles/tokens/` | tokens **inlined** in `<style>` |
| Coupling | live — edits propagate | versioned snapshot — frozen on date |
| Relative paths | freely uses `../` | self-contained, no `@import` outward |

Never make a `docs/*.html` file `@import` from `src/`. Each `docs/` file must stand alone (sendable as a single attachment). When tokens change in `src/`, `docs/` does not auto-update — that's intentional.

### CSS load order in `src/styles/index.css`

The order is significant and must be preserved: `tokens → base → components (primitives §12 → composites §13 → e-commerce §14 → site shell §15.1) → patterns (§16)`. Adding a new component means adding one `@import` line in the right section. The file is the single production entry-point.

### Tokens are the law

All colors / spacing / typography / radii / shadows / motion live as CSS custom properties under `src/styles/tokens/`. Two layers:

- Primitive: `--mj-blue`, `--mj-ink-2`, etc. — what the color *is*.
- Semantic: `--color-text-primary`, `--color-bg-surface`, `--focus-ring`, etc. — what it's *for*.

Components must reference semantic tokens. **Never hardcode** `padding: 24px` etc. — use `var(--s-6)`. Spacing is a 4px scale (`--s-1`=4px ... `--s-13`=128px). If a needed value doesn't exist as a token, add it to tokens first (with a justification), then use it.

### Component convention

```
src/components/<block-name>/
  <block-name>.css     BEM — block matches dir name
  <block-name>.html    (optional) standalone preview
  README.md            (optional) usage rules
```

BEM strictly: `.block`, `.block__element`, `.block--modifier`. Block name = directory name = filename stem.

A standalone preview `*.html` loads (1) Source Sans 3 from Google Fonts, (2) `../../styles/tokens/index.css`, (3) its own CSS, (4) a small inline reset. Multiple variants on one page, separated by `.preview-label`.

Promote inline ad-hoc styling to a new component on the **second** use, not the first.

### Pages and partials

`src/pages/*.html` compose components into full pages. `src/pages/_partials.html` is a **non-runnable** reference of copy-paste blocks (header, footer, etc.) — do not link to it from a page; copy from it. When a backend templating engine is introduced later, `_partials.html` becomes the master layout.

### Versioned snapshots — `versions/`

`versions/vN/` are frozen `cp -R` copies of `docs/` + `src/` + `index.html` at the time the version was cut — same inner structure, so all relative links/imports inside the snapshot keep working untouched. They exist so the customer can approve a concrete version while later changes become a new one. `versions/index.html` is the human-facing version log (status + links + changelog), published at `/versions/`. Cut a new one with `scripts/cut-version.sh vN`, then add a block to `versions/index.html`, commit, and tag `design-vN` (the `.github/workflows/design-version-release.yml` workflow turns the tag into a GitHub Release). Never edit anything under `versions/vN/` after it's cut, and never let a snapshot link out of its own subtree. See `versions/README.md`.

### Approval log — Notion Design protocol

The Degree-AS Notion workspace mirrors customer approvals as a database. One row per (artifact × version) — the audit trail; the repo holds the artifacts.

- **Where:** Project front page → Documentation → **Design protocol**. Page id `35db5715-86c7-80d0-9b8f-e85081582838`, inline DB id `35db5715-86c7-8042-ae7b-000babc2c791`. English reference doc ("Versioning workflow") at `https://www.notion.so/361b571586c7819d9f2adfdf71a3fa8a`.
- **Schema:** `Name` (title) · `Version` · `Status` (`Pending` / `Approved` / `Replaced`) · `Approved by` · `Approved date` · `Comment` · `Link`.
- **Approver on the client side:** Leif Erling (Molde Jarnvare). Confirm with the user if a different name is mentioned.
- **`Link` must point to the versioned URL**, never to the live one. ✅ `…/versions/vN/docs/designsystem.html` — ❌ `…/docs/designsystem.html` (changes every commit, breaks the approval chain).
- **Three artifacts per version**, canonical URLs:
  - Design guidelines: `https://degree-as.github.io/Molde-Jarnvare-Designs/versions/vN/docs/designsystem.html`
  - Component library: `https://degree-as.github.io/Molde-Jarnvare-Designs/versions/vN/src/components/index.html`
  - Page templates: `https://degree-as.github.io/Molde-Jarnvare-Designs/versions/vN/src/pages/index.html`

## House rules when editing

- Match existing comment density and Norwegian voice in CSS comments.
- New token? Add to the right `src/styles/tokens/<file>.css` and re-export through `src/styles/tokens/index.css` if it's a new file.
- New component? Create the dir, add the CSS, add the `@import` in `src/styles/index.css` in the correct §-section, and (recommended) add a standalone preview `<name>.html`.
- Touching `docs/*.html`? Keep tokens inlined. Don't introduce `@import` to `src/`. If you change tokens that the snapshot uses, copy the new values into the inline `<style>` deliberately. To preserve a prior state, cut a `versions/vN/` snapshot (see above) — not an ad-hoc `docs/archive/` copy.
- The Aptos brand font has a webfont substitute: Source Sans 3. JetBrains Mono for code/SKU/numbers.
