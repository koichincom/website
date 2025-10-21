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
	- [x] Run `npm run dev` and verify Tailwind base styles load (preflight/reset CSS confirmed)
	- [x] Tailwind utilities generation verified after switching to CSS-first approach (H1 smoke test confirmed `text-red-500` works).
- [x] Bug: "G" vim command not working, not prioritized