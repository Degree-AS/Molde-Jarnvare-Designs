# `/src/assets/images` — image library

Placeholders and illustrative images used while we build the design system
and page templates.

**Not production assets:** in production the images are pulled from the CMS
the frontend connects to. These files live here so page templates,
components, and `docs/` presentations can be shown in a complete context
during the design phase.

## Folder structure

```
images/
  marketing/     situational / lifestyle photography (workshop, warehouse,
                 order office, service flow)
  products/      tight product and assortment images (fasteners, hydraulics,
                 fittings)
  heritage/      historical images that carry the MJ story ("since 1930")
  team/          portraits used as avatars in person cards
```

Add subfolders as needed (e.g. `events/` for trade-show photos).

## File conventions

- **Format**: JPEG (`.jpg`), progressive, EXIF stripped
- **Max width**: 1600 px on the longest side
- **Quality**: 78 (mozjpeg / Pillow optimize)
- **File size**: ~ 100–300 KB per file. Anything above 500 KB should be
  re-run through Squoosh
- **Naming**: kebab-case, descriptive, ASCII-safe. Examples:
  `slangeverksted-presse.jpg`, `lager-pakking-2-boks.jpg`. No spaces, no
  `æ ø å`, no uppercase in the extension
- **Source**: every image originated in
  `Degree AS/Degree og Molde Jarnvare - Arbeidsdokumenter/03 Design & Grafisk/
  Aktuelle bilder ny nettside/` (May 12, 2026)

## Usage in code

```html
<!-- from src/pages/ -->
<img src="../assets/images/marketing/slangeverksted-presse.jpg"
     alt="Operator pressing a hydraulic hose on a Uniflex machine">

<!-- from src/components/<name>/ -->
<img src="../../assets/images/products/festemidler-hero.jpg"
     alt="Assortment of fasteners — hex bolts, nuts, washers">
```

## Usage in docs/

`docs/` files must be self-contained. If an image is used there, copy it
into `docs/assets/images/` (same pattern as the logos). Never `@import`
or use relative paths out of `docs/`.

## When the CMS is connected

1. Replace `img` paths in page templates with CMS tokens
   (e.g. `{{ cms.image.product_hero }}`)
2. `git rm -r src/assets/images/marketing` (and likewise) to remove the
   placeholders
3. Keep `herita