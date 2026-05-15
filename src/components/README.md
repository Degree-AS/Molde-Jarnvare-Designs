# Components

This folder contains every UI component in the design system. Each component
lives in its own folder with CSS, an optional standalone HTML preview, and
optional documentation.

## Folder structure

```
src/components/
  hero/
    hero.css       Component CSS (BEM)
    hero.html      Live preview — open in a browser to see variants
    README.md      (optional) Usage rules, props, do/don't
  product-card/
    ...
```

## Naming

- **Folder and file names:** lowercase kebab-case (`hero`, `product-card`,
  `quantity-stepper`).
- **CSS classes:** [BEM](https://getbem.com/naming/) — `.block__element--modifier`.
  The block name matches the folder name.

  ```css
  .hero            /* block */
  .hero__title     /* element */
  .hero--dark      /* modifier */
  ```

## Adding a new component

1. Create `src/components/<name>/`
2. Add `<name>.css` with the BEM class hierarchy and tokens from
   `src/styles/tokens/` (never hard-coded values)
3. Add an `@import` line in `src/styles/index.css` in the correct §-section
4. (Recommended) Add `<name>.html` — a standalone preview that loads tokens
   and the component's own CSS so the component can be reviewed in isolation
5. (Recommended) Add `README.md` with usage rules, prop docs, accessibility
   notes, and do/don't examples

## Norwegian-origin business terms (glossary for non-Norwegian contributors)

A handful of component names use Norwegian business terms because they
describe MJ-specific workflows. Class names and folder names are kept as-is
in code; documentation explains the concept in English.

| Term | English explanation |
|---|---|
| `sortilog` | Customer-specific assortment with pre-negotiated pricing; shown in account dashboard for B2B customers |
| `two-bin-dashboard` | Kanban-style replenishment system where MJ refills the customer's bins on a schedule |
| `sales-impersonation` | "Shop as customer" mode that lets MJ sales reps place orders on behalf of a customer |
| `quick-order` | Bulk SKU paste order pad — for experienced buyers who already know article numbers |
| `request-quote` / `quote-view` | The B2B quote workflow (request → review → convert to order) |
| `stock-notify` | "Notify me when back in stock" button on PDP |

If you add a new component using a Norwegian-origin business name, document
it here so Polish and other non-Norwegian developers can follow along.

## Visible content vs. dev documentation

- **Visible HTML content** (`<h1>`, button labels, body text in `src/pages/`)
  stays in Norwegian — these mirror what end users will see.
- **All CSS comments, README files, and dev-facing HTML comments** are in
  English so the wider engineering team can read and contribute.

## Token rules

Always reference semantic tokens from `src/styles/tokens/`:

```css
/* GOOD */
.btn--primary { background: var(--color-action-primary); }

/* BAD */
.btn--primary { background: #0D2B7E; }
```

If a needed value doesn't exist as a token, add it to the right tokens file
first (with justification in the comment), then use it.
