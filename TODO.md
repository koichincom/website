- Tailwind CSS integration (final step)
	- [x] Verify packages installed: `tailwindcss`, `@tailwindcss/vite` (confirmed in `package.json`)
	- [ ] Create `tailwind.config.cjs` (or `tailwind.config.js` / `tailwind.config.mjs`) and set `content` globs to scan project files (`src/**/*.{astro,html,js,ts,jsx,tsx}`)
	- [x] Configure `astro.config.mjs` to use the `@tailwindcss/vite` plugin (already configured)
	- [x] Ensure `src/layouts/base.astro` imports `src/styles/global.css` (already imports)
	- [ ] Update `src/styles/global.css` to include Tailwind directives near the top:

		```css
		@import "tailwindcss/base";
		@import "tailwindcss/components";
		@import "tailwindcss/utilities";
		```

		Keep project-specific overrides below those imports (currently present).
	- [ ] Run `npm run dev` and verify Tailwind utilities render on pages (smoke test)
	- [ ] (Optional) Add Tailwind plugins/UI kits (daisyUI, Flowbite) if needed and document usage