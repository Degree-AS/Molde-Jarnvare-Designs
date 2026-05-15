# Contributing to the Molde Jarnvare design system

Quick orientation for new contributors — designers, frontend developers,
and AI tooling alike. Read `CLAUDE.md` for deeper architecture; this file
is the "first day" guide.

## Languages used

- **End-user-visible content** (page text, button labels, examples in
  `src/pages/*.html` and `docs/*.html` — but note `docs/` is now in English
  because both MJ leadership and the international team read it):
  Norwegian where the content represents actual UI for MJ customers.
- **Everything else** (CSS comments, README files, CLAUDE.md, ADRs, commit
  messages, dev-facing HTML comments): English. The engineering team is
  international.

Some BEM class names retain Norwegian-origin business terms (`sortilog`,
`two-bin-dashboard`, `sales-impersonation`, `quick-order`). These are
explained in English in `src/components/README.md`.

## How to run things locally

There is no build step. To preview:

```bash
# from repo root
python3 -m http.server
# or any static server
```

Then browse to:

- `src/pages/index.html` — every page template grouped by section
- `src/components/index.html` — every component on one page
- `docs/index.html` — client-facing presentations
- `src/components/<name>/<name>.html` — isolated preview of one component

## Project structure

```
src/
  styles/
    tokens/          CSS custom properties — colors, type, spacing, etc.
    base/            reset + typography + global utilities
    index.css        Production entry — imports tokens, base, components
  components/        BEM components, one folder per block
  patterns/          Cross-component patterns — form-validation, print
  pages/             Page templates composed from components
  assets/            Logos, images
docs/                Client-facing snapshot documentation (self-contained)
versions/            Frozen version snapshots for client approval
                     (see versions/README.md)
```

## Adding a new component — checklist

1. Create `src/components/<block-name>/`
2. Add `<block-name>.css` using BEM:
   - block: `.block-name`
   - element: `.block-name__element`
   - modifier: `.block-name__element--modifier`
3. Reference tokens, never hardcode values:
   ```css
   /* GOOD */
   padding: var(--s-6);
   /* BAD */
   padding: 24px;
   ```
4. Add an `@import` line in `src/styles/index.css` in the correct
   §-section (primitives §12 → composites §13 → e-commerce §14 → site
   shell §15.1 → patterns §16)
5. (Recommended) Add `<block-name>.html` — standalone preview that loads
   tokens + the component's CSS only
6. (Recommended) Add `README.md` if the component has non-trivial usage
   rules, props, or accessibility notes

## Adding a new token

1. Add the value to the right file in `src/styles/tokens/<file>.css`
2. If it's a new category (rare), add a new file there and re-export it
   from `src/styles/tokens/index.css`
3. Document the rationale in a code comment — "what's it for", not just
   "what it is"
4. Verify color contrast if a color: ≥4.5:1 for text or ≥3:1 for UI
   graphics against the surfaces it sits on

## Editing `docs/*.html`

These files are **self-contained snapshots** sent to MJ. They:

- Inline tokens at the top of `<style>` — no `@import` reaches into
  `src/`
- Use no relative paths out of `docs/` except for the two convenience
  links from `index.html`
- Are versioned by date, not auto-updated from `src/`

When `src/styles/tokens/` changes, `docs/*.html` does **not** update
automatically. Sync them deliberately when shipping a new snapshot.
See `docs/README.md` for the snapshot procedure.

## Commit conventions

We use Conventional Commits with a Norwegian-friendly twist:

```
feat(component): add price-display variant for inkluded VAT
fix(a11y): darken --mj-warning to pass WCAG 2.2 AA contrast
chore(i18n): translate component CSS comments to English
refactor(tokens): split shadow scale into elevation levels
docs(designsystem): update §14 with the variant matrix
```

`feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test` are the
common prefixes. Scope (in parens) names the component or area.

## Code review

- Visual review in the relevant `<name>.html` preview
- Run `axe-core` against the component if it has interaction
- Check that tokens are used, not hardcoded values
- Check that BEM is strict (`block__element--modifier`)
- Check that the component preview file still renders correctly

## When in doubt

Open an issue or ping the design lead in Slack. The design system is
opinionated on token discipline and accessibility — both deliberately —
but everything else has room for discussion.
