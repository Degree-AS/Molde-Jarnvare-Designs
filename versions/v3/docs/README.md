# `/docs` — client-facing documentation

This folder contains **self-contained HTML presentations** of the design
system, aimed at MJ leadership, the client, and external readers. Different
from `src/`:

| Folder | Audience | Content |
|---|---|---|
| `src/components/`, `src/pages/` | Developers & designers | Live markup + CSS as it will actually work |
| `docs/` | Client, leadership, external | Explanatory pages about *why* and *how* |

## Why self-contained files

Each file in `docs/` must be sendable on its own — as an attachment, or via
a direct link to a single file — without the rest of the repo following along.

That means:

- **Tokens are inlined** in the top `<style>`. No `@import` to `src/styles/`.
- **No relative paths** out of the folder, except for navigation links from
  `index.html` to `src/pages/` and `src/components/` (those are convenience
  links, not document dependencies).
- **Inline SVG icons** instead of `<img>` where possible.

Consequence: when we update a token in `src/styles/tokens/`, these docs do
**not** update automatically. They are **versioned snapshots**. That is a
feature: a docs file dated 2026-05-12 shows the system as it was that day.

## How to add a new presentation

1. Copy `designsystem.html` to a descriptive filename:
   - `brand-guide.html` for a short-form overview
   - `presentation-2026-q2.html` for a time-specific walkthrough
   - `accessibility-deep-dive.html` for a topic-specific deep dive

2. Update the top of the file:
   - `<title>`
   - `.hero__overline` (version + date)
   - `.hero__title`
   - `.hero__lead`

3. Edit the sections below. Each section follows the pattern:
   ```html
   <section class="section" id="section-id">
     <div class="section__num">NN / Category</div>
     <h2 class="section__title">Section title</h2>
     <p class="section__lead">Lead text.</p>
     ...
   </section>
   ```

4. Update the sidebar nav (`.nav` at the top) with the correct anchors.

5. Add an `<a class="card">` entry to `index.html` pointing at the new file.

## Versioning snapshots

When there is a major revision (v0.2 → v1.0), keep the old file and create
a new one. For example:

```
docs/
  designsystem.html             ← always the most recent version
  archive/
    designsystem-v0.1.html
    designsystem-v1.0.html
```

This lets the client compare against earlier approved versions.

## GitHub Pages

When Pages is enabled with source `main` / `/docs`, **only this folder** is
published at `https://degree-as.github.io/Molde-Jarnvare-Designs/`. `../src/`
is NOT available on Pages — so any resource docs needs (images, logos)
must live under `docs/assets/`, and links that point to `../src/...` work
only locally from the repo, not on Pages.
