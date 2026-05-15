# `/team` — employee portraits

Used as avatars in the `.person-card` component on the front page and PDP.

## Replacing the placeholder with real portraits

The file `ansatt-portrett.jpg` is a placeholder (MJ-blue with "MJ" initials)
that lives here until the real portraits are delivered by the photographer.

To swap in real portraits:

1. Drop the portraits into this folder as JPG files
2. Recommended naming: `<firstname>-<lastname>.jpg`, kebab-case, ASCII
   - `ola-nordmann.jpg`
   - `kari-bergshaug.jpg`
   - etc.
3. Spec: square crop, 400 × 400 px, JPEG quality ~80, EXIF stripped, ≤ 60 KB
4. Update the `img src` attributes in `src/pages/home.html` and
   `src/pages/product.html` so each person-card points to its own portrait

## In the current demo

All person-cards currently point to the same `ansatt-portrett.jpg`. This
demonstrates how the design looks with portraits while keeping it obvious
that the content is a placeholder (same image repeated + the MJ monogram).
