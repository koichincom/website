AGENTS — Repository agent guidance

- Build: `npm run build` (runs `astro build`).
- Dev: `npm run dev` (runs `astro dev`).
- Preview: `npm run preview` (serves local build).
- Run a single test: this repo has no test runner configured; add Vitest/Jest and run `npx vitest run path/to/test` or `npm test -- path/to/test` for a single-file run.

Code style & conventions
- Formatting: use Prettier-compatible formatting (2 spaces) and keep files short and focused.
- TypeScript: `strict` enabled via Astro's `strict.json`; prefer explicit types for public APIs and `unknown` for untrusted inputs.
- Imports: use absolute paths where Astro supports them; prefer named imports and keep import order logical (external, internal, styles).
- React components: use PascalCase for component filenames and exports; Astro components may be kebab or Pascal but keep consistent.
- CSS/Tailwind: favor utility classes in templates; extract repeated patterns into `global.css` or component-scoped styles.
- Naming: variables and functions in camelCase; types and interfaces in PascalCase prefixed when useful (`Props`, `Data`).
- Error handling: return early, validate external inputs, and throw meaningful errors with context; log sparingly in production code.
- Git: keep commits small and focused; do not include secrets or build artifacts.

Automation rules
- No `.cursor` or Copilot instruction files were found; if present, mirror those rules here and follow any Copilot suggestions conservatively.

If you want, I can add a test runner (Vitest) and a lint/prettier config next.