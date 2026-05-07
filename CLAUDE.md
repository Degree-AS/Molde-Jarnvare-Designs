# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Static HTML + CSS design system for Molde Jarnvare (Norwegian B2B hardware e-commerce). **No build, no package.json, no JS framework, no tests, no linter.** Every artifact is a plain file you open in a browser.

Working language: Norwegian (`lang="nb"`). Code/comments in Norwegian; keep it that way unless the user asks otherwise.

The system was generated from a `DESIGN_SYSTEM.md` spec (v0.1) that is **not in this repo** — section numbers like §4, §12.1, §15.7 in comments/markup refer to it. Treat those references as anchors only; don't try to open the file.

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

## House rules when editing

- Match existing comment density and Norwegian voice in CSS comments.
- New token? Add to the right `src/styles/tokens/<file>.css` and re-export through `src/styles/tokens/index.css` if it's a new file.
- New component? Create the dir, add the CSS, add the `@import` in `src/styles/index.css` in the correct §-section, and (recommended) add a standalone preview `<name>.html`.
- Touching `docs/*.html`? Keep tokens inlined. Don't introduce `@import` to `src/`. If you change tokens that the snapshot uses, copy the new values into the inline `<style>` deliberately — or duplicate the file under `docs/archive/` first if the user wants to preserve the prior version.
- The Aptos brand font has a webfont substitute: Source Sans 3. JetBrains Mono for code/SKU/numbers.
