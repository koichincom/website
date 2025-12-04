# AGENTS.md

Build & Dev: `npm run dev` | `npm run build` | `npm run preview`

Lint & Format (manual):
- ESLint: `npx eslint "src/**/*.{ts,tsx,astro}" --fix`
- Prettier: `npx prettier --write .`

Tests: No test framework configured. If Vitest is added:
- All: `npx vitest` | Single file: `npx vitest path/to/file.ts` | By name: `npx vitest -t "name"`

Code Style:
- TypeScript: strict types, no `any`, use `strictNullChecks` patterns
- Formatting: 4-space indentation (per .editorconfig), Prettier compatible
- Imports: external → internal → styles/assets; prefer named imports
- Naming: `camelCase` vars/functions; `PascalCase` components/types (suffix with `Props`/`Data`)
- CSS: Tailwind utilities preferred; shared styles in `src/styles/global.css`
- Error handling: validate early, return early, throw contextual errors, never swallow

Commits: Small, focused commits; no secrets or build artifacts.
