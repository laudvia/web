# ReWallet — Responsive + Accessible Landing Page (Lab)

This project is a static, **mobile-first** landing page based on the provided design.

## What is implemented

- Responsive layout: 320px → 2560px
- Breakpoints: **768px** and **1200px** (layout changes significantly at tablet and wide desktop widths)
- Flexbox + CSS Grid used for layout
- Adaptive images (`max-width: 100%; height: auto;`)
- No horizontal scroll on any tested width
- Accessibility:
  - `lang` on `<html>`
  - Correct heading structure
  - Landmarks (`header`, `nav`, `main`, `footer`)
  - Skip link
  - Focus-visible styles
  - Keyboard navigation
  - Accordion uses `<details>` and is keyboard-accessible
  - `sr-only` helper class
- Interactions (JS):
  - Mobile hamburger menu + drawer
  - “Wallets” dropdown (desktop)
  - Testimonials navigation (mobile: single-card view)
  - Wallet selection form (demo submission)

## Lab 4 (forms + Constraint Validation API)

- Registration modal created with `<dialog>` and opened via `showModal()`.
- Accessible form with `novalidate`, field-level validation on `blur` via `validity`, error messages bound via `aria-describedby`.
- `:user-valid` / `:user-invalid` styling and JS-driven `aria-invalid` states.
- Password reveal while pointer is pressed (`pointerdown` / `pointerup`).

## Lab 6 (JSON + Fetch API)

- Separate page: `lab6.html`.
- Gallery: fetches images from `/images` (or from `data-api-base`), shows loader, retries up to 3 times, and reports errors via toasts.
- Temperature: sends `POST` JSON to `/temperature` with correct `Content-Type` and disables the form while awaiting a response.
- Toast notifications with smooth show/hide and separate styles for success/error.

## Run locally

Open `index.html` in the browser, or use a simple local server:

```bash
# from the project folder
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Git + GitHub (SSH)

```bash
git init
git add .
git commit -m "Add responsive accessible landing page"
git branch -M main
git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
git push -u origin main
```

## Hosting (GitHub Pages)

1. Push repository to GitHub.
2. Repository Settings → Pages
3. Source: `Deploy from a branch`
4. Branch: `main` and folder `/root`
5. Save, then open the provided Pages URL.

## Lab 6 API (optional)

Lab 6 uses `fetch()` and requires an API that provides:

- `GET /images` (returns JSON array)
- `POST /temperature` (accepts JSON)

If your mentor provided a ready-made server (“сервер с документацией”), set its URL in `lab6.html` via
`data-api-base`.

If you do not have a server, you can run the included mock API:

- `server/` (Node.js + Express), see `server/README.md`.
