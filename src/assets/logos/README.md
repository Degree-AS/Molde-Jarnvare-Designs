# `/src/assets/logos` — Molde Jarnvare logos

Two variants, both PNG with a transparent background:

| File | Use |
|---|---|
| `molde-jarnvare-positive.png` | Default — for light surfaces (white, surface-0) |
| `molde-jarnvare-negative.png` | For dark surfaces (Reflex blue, dark gray) |

Both variants are also mirrored under `docs/assets/logos/` because `docs/`
files are self-contained and cannot reach out of their folder.

## Usage

```html
<a class="site-header__logo" href="/" aria-label="Molde Jarnvare">
  <img src="../assets/logos/molde-jarnvare-positive.png"
       alt="Molde Jarnvare"
       class="site-header__logo-img">
</a>
```

`alt` should be the company name, not the word "logo". `aria-label` on the
anchor tells screen readers what clicking the logo does.

## Touch icon / favicon

Not in this folder yet. The "MJ" monogram (without "1930") needed for
favicon (16/32 px) and iOS/Android touch icon is one of the open questions
flagged in `docs/designsystem.html` (§Avklaringer).

## File specs

- Format: PNG with alpha channel
- Width: 800 px (positive), 800 px (negative)
- File size: ~30 KB each
- Source: brand book 2025 (Sept 24, 2025)
