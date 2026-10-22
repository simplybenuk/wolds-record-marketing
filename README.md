# Wolds Record Marketing Site

A lightweight, one-page marketing website for **Wolds Record** that is designed for trust, clarity, and beta signups.

## Run locally

Use a simple local server from the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

If you see a blank or white page, make sure you are opening the local server URL above (not a file preview tool that doesn't render static assets correctly).

## Build legal pages from markdown

Legal page source files live in `legal/privacy.md` and `legal/terms.md`.

Generate branded static HTML pages at `/privacy/index.html` and `/terms/index.html` with:

```bash
npm run build:legal
```

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, set:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/ (root)`
3. Save and wait for GitHub Pages to publish.

## Where to edit content and URLs

- Main page copy/structure: `index.html`
- Styling: `styles.css`
- Current fallback image: `assets/product-placeholder.svg`

Search for `TODO: Replace` in `index.html` for:

- domain / canonical URL
- app URL
- knowledge base URL
- privacy URL
- terms URL
- contact email
- pricing details
- screenshot / image paths

## Founding Practitioner capacity

The offer page uses a manual switch because the static site does not track application count. In `founding/index.html`, change `data-founding-full="false"` on the `<body>` element to `data-founding-full="true"` when all 20 places are filled. The full state closes the application form, hides founding-only details, and routes the primary calls to action to the free basic signup. It carries through `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content`.

## Using your provided images

Add your exported image files into `assets/` and update image `src` values in `index.html`.

Suggested filenames (optional):

- `assets/wolds-dashboard.png`
- `assets/wolds-records-illustration.png`
- `assets/wolds-hero-illustration.png`
