# Website

My personal website built with Astro and Tailwind CSS.

## Undone

### P0

- [ ] Implement Tailwind CSS for all components and pages
  - [x] Basics
  - [ ] Responsive design considerations
- [ ] Fix: gradation on header and footer text when switching between light/dark mode

### P1

- [ ] Popup to show the vim bindings help (vim-help.astro)
  - [x] Modal implemented with styling and keyboard shortcuts (? to open, q/Esc to close)
  - [ ] Fix: click-outside backdrop to close doesn't work
  - [ ] Fix: 'q' to close doesn't work

### P2

## Done

- [x] Basic Astro project structure
- [x] Basic vim navigation system (vim.ts)
- [x] Tailwind CSS setup checklist for Astro project:
  - [x] Verify packages installed: `tailwindcss`, `@tailwindcss/vite` (confirmed in `package.json`)
  - [x] Use CSS-first Tailwind v4 setup (no JS config). `@source` in `src/styles/global.css` is used to declare scan paths for `.astro` and other files.
  - [x] Configure `astro.config.mjs` to use the `@tailwindcss/vite` plugin (already configured)
  - [x] Ensure `src/layouts/base.astro` imports `src/styles/global.css` (already imports)
  - [x] Update `src/styles/global.css` to include Tailwind directives near the top:

    ```css
    @import "tailwindcss/preflight";
    @import "tailwindcss/utilities";
    ```

    Keep project-specific overrides below those imports (currently present).

  - [x] run `npm run dev` and verify Tailwind base styles load (preflight/reset CSS confirmed)
  - [x] Tailwind utilities generation verified after switching to CSS-first approach (H1 smoke test confirmed `text-red-500` works).

- [x] Bug: "G" vim command not working, not prioritized
