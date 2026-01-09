# AGENTS.md

Purpose: Guidance for agentic coding agents working in this repository.

## Build, Dev & Validation

### Commands
- **Dev server:** `npm run dev` (Runs on port 4321 by default)
- **Build:** `npm run build` (Production build, outputs to `dist/`)
- **Preview:** `npm run preview` (Preview the production build locally)
- **Astro CLI:** `npm run astro` (Run any astro command)

### CRITICAL: Testing & Validation Workflow
**Do NOT run `npm run dev` or `npm run preview` to validate your changes.**
- These are **CONTINUOUS watch processes** that run indefinitely.
- Executing them will cause your environment to hang until timeout, providing no feedback.
- **To validate code changes:** Always run `npm run build`. This catches TypeScript errors, CSS issues, missing imports, and broken routes.
- **To check types quickly:** Run `npx tsc --noEmit` if you only modified `.ts` files.

## Testing
- No test suite currently exists in the project.
- If adding tests, use **Vitest**.
- **Run all tests:** `npx vitest`
- **Run single file:** `npx vitest path/to/test.ts`
- **Run single test:** `npx vitest -t "test name"`

## Project Structure
- `src/assets/`: Static assets and placeholders.
- `src/components/`: Reusable Astro components (flat structure).
- `src/content/`: Content collections (TOML for projects, Markdown for writing).
- `src/layouts/`: Base page templates and wrapper components.
- `src/pages/`: File-based routing (including dynamic routes like `[slug].astro`).
- `src/scripts/`: Client-side TypeScript logic.
- `src/styles/`: Global CSS and Tailwind configurations.
- `src/utils/`: Pure utility functions and helpers.

## Code Style & Conventions

### 1. Naming Conventions
- **Files:** `kebab-case.astro` or `kebab-case.ts`.
- **Components:** `PascalCase` (e.g., `BaseLayout.astro`, `PostHeader.astro`).
- **Functions/Variables:** `camelCase` (e.g., `getReadingTime`, `isPublished`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `WORDS_PER_MINUTE`).
- **Types/Interfaces:** `PascalCase` with descriptive suffixes like `Props` or `Data`.

### 2. TypeScript Patterns
- **Strictness:** Use strict types; avoid `any`. `strictNullChecks` is enabled.
- **Interfaces:** Define component props using `export interface Props`.
- **Return Types:** Always specify explicit return types for exported functions.
- **Validation:** Use Zod schemas for data validation (see `src/content.config.ts`).

### 3. Import Organization
Order imports logically:
1. External packages (e.g., `astro:content`, `@astrojs/rss`).
2. Internal modules/components using relative paths (e.g., `../components/...`).
3. Styles and assets (e.g., `../styles/global.css`).

### 4. Astro Components
- Use the frontmatter (`---`) for logic and data fetching.
- Prefer `getCollection()` for content-driven pages.
- Use `export async function getStaticPaths()` for dynamic route generation.
- Use the `<slot />` component for layouts.

### 5. CSS & Styling
- Favor **Tailwind CSS** utility classes directly in templates.
- Extract shared/complex styles to `src/styles/global.css` sparingly.
- Use the `@tailwindcss/typography` plugin (`prose` class) for Markdown content.

### 6. Formatting
- **Indentation:** 2 spaces.
- **Semicolons:** Use sparingly/Prettier default (consistency is key).
- **Strings:** Double quotes preferred.

### 7. Error Handling & Logic
- **Validate Early:** Check inputs and content schemas at the boundaries.
- **Return Early:** Avoid deep nesting of `if/else` blocks.
- **Null Safety:** Use optional chaining (`?.`) and nullish coalescing (`??`).

## Content Collections
- **Writing:** Markdown files in `src/content/writing/`. Requires `title`, `published`, and `description`.
- **Projects:** TOML files in `src/content/projects/`.
- Schema definitions are centralized in `src/content.config.ts`.

## Tooling Configuration
- **Cursor/Copilot:** No specific `.cursorrules` or `.github/copilot-instructions.md` detected. Respect these guidelines as the source of truth.
- **Commits:** Make small, atomic commits. Focus on the "why" in commit messages. Never commit secrets or the `dist/` directory.
