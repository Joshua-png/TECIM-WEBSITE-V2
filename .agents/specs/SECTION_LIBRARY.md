# SECTION_LIBRARY.md — Section Templates

Each template maps to a React component in `site/components/sections/` and a schema in `section_templates`. Admin edits only the fields listed. Design is hard-coded in the component.

`content` example shape:

```json
{
  "title": "...",
  "subtitle": "...",
  "buttonText": "...",
  "buttonLink": "...",
  "image": { "public_id": "...", "secure_url": "...", "width": 1200, "height": 800 }
}
```

## Template Catalog

### hero
- label, title, subtitle
- identities[] (slug: light | trumpets | swords, label, backgroundImage, steps[] { num, title, body, verse, image })
- Accent color per identity is **preset in code** (light → turquoise-bright, trumpets → gold-bright, swords → rose) — never CMS-editable.
- Layout variants: `full_height`

### about_image_left / about_image_right
- title, description, image, buttonText, buttonLink
- Layout variants: `image_left`, `image_right`, `full_width`, `split`

### vision
- title, text, image (optional)

### values
- title, cards[] (title, text, icon name from a fixed allowed set)

### timeline
- title, subtitle, events[] (date, title, description)

### gallery
- title, images[] (selected from media library, caption per image)
- Layout variants: `grid`, `masonry`

### testimonials
- title, testimonials[] (quote, name, role, avatar image)

### scripture
- title, verse, reference, backgroundImage (optional)

### cta
- title, text, buttonText, buttonLink

### video
- title, description, video (from media library or URL), posterImage

### faq
- title, items[] (question, answer)

### team
- title, members[] (name, role, photo, bio)

### quote
- quote, attribution

### numbers (stats)
- title, stats[] (value, label)

## Layout Variants
Preset-only, defined in code. Never free-form.
| Variant | Applies to |
|---|---|
| `image_left` / `image_right` | about, team, video |
| `full_width` | about, cta, scripture |
| `split` | about |
| `grid` / `masonry` | gallery |
| `full_height` | hero |

## Media Handling
- Image fields reference a `media` record (`public_id`, `secure_url`, `width`, `height`).
- Site renders via `next/image` with Cloudinary `f_auto,q_auto` for WebP.

## Adding a Template
Follow `.agents/index.md` §1 (Create a New Section Template). Update this file when the library changes.
