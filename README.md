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
