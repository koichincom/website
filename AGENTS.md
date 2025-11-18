# AGENTS.md

Purpose: Guidance for agentic coding agents working in this repository. See `CLAUDE.md` for full project context.

Build & Dev

- Dev server: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Astro CLI: `npm run astro`

Lint & Format

- ESLint (manual): `npx eslint "src/**/*.{ts,tsx,astro}" --fix`
- Prettier: `npx prettier --write .`

Tests

- No test script in `package.json`; tooling may use Vitest.
- Run all tests (if installed): `npx vitest`
- Run a single file: `npx vitest path/to/test.file.ts`
- Run a single test by name: `npx vitest -t "test name"`

Code Style (high level)

- TypeScript: prefer strict types; avoid `any`; use `strictNullChecks` patterns.
- Formatting: 2-space indentation; keep Prettier compatible.
- Imports: External → internal (absolute) → styles/assets; prefer named imports.
- Naming: `camelCase` for variables/functions; `PascalCase` for components/types (use `Props`/`Data` suffixes).
- Components: React components PascalCase; Astro components match file names.
- CSS: favor Tailwind utilities; extract shared styles to `src/styles/global.css`.
- Error handling: validate inputs early; return early; throw contextual errors; do not swallow errors.

Cursor / Copilot

- No `.cursor/rules/` or `.github/copilot-instructions.md` detected; if added, agents must respect those rules.

Commits

- Make small, focused commits; do not commit secrets or build artifacts.

