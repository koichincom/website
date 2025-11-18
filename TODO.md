# Todo

## Undone

### P0

### P1

### P2

- [ ] Add more to the project page and simplify the layout

## Done

- [x] Toast is inconsistent, when it's in other than the home page.
- [x] Fix toast notification bug where toast appears on a left top without the UI
- [x] Popup to show the vim bindings help (vim-help.astro) Currently Disabled since not prioritized
  - [x] Modal implemented with styling and keyboard shortcuts (? to open, q/Esc to close)
  - [x] Fix: click-outside backdrop to close doesn't work
  - [x] Fix: 'q' to close doesn't work
- [x] Feature: Vim page navigation chips
- [x] Feature: Email copy chip
- [x] Feature: Vision page
- [x] Feature: Reading time estimates for blog posts
- [x] Implement Tailwind CSS for all components and pages
  - [x] Basics
  - [x] Responsive design considerations
  - [x] Fix: gradation on header and footer text when switching between light/dark mode
    - [x] Separated accent colors: `--color-accent-light` and `--color-accent-dark`
    - [x] Updated all components to use correct accent colors for light/dark modes
- [x] Have a basic content in contents/
- [x] Basic Astro project structure
- [x] Basic vim navigation system (vim.ts)
- [x] Tailwind CSS setup checklist for Astro project:
  - [x] Verify packages installed: `tailwindcss`, `@tailwindcss/vite` (confirmed in `package.json`)
  - [x] Use CSS-first Tailwind v4 setup (no JS config). `@source` in `src/styles/global.css` is used to declare scan paths for `.astro` and other files.
  - [x] Configure `astro.config.mjs` to use the `@tailwindcss/vite` plugin (already configured)
  - [x] Ensure `src/layouts/base.astro` imports `src/styles/global.css` (already imports)
  - [x] Update `src/styles/global.css` to include Tailwind directives near the top:
        Keep project-specific overrides below those imports (currently present).
  - [x] run `npm run dev` and verify Tailwind base styles load (preflight/reset CSS confirmed)
  - [x] Tailwind utilities generation verified after switching to CSS-first approach (H1 smoke test confirmed `text-red-500` works).
- [x] Bug: "G" vim command not working, not prioritized
