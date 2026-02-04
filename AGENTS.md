# AGENTS.md

Purpose: Essential guidance for agentic coding agents operating in this repository.

if the function is used multiple times across different files, place it in `src/utils/`.

## Quick Reference

- Local Dev: `bun run dev` (Starts Astro on port 4321)
- **Validation**: `bun run check` (Run this after making changes to validate TypeScript, CSS, and routing)
- Production Build: `bun run build` (Outputs to `dist/`)
- Preview Build: `bun run preview` (Local server for `dist/` contents)
- Docs MCP: `astro-docs` is available via MCP (use `astro-docs_search_astro_docs`)

## Build, Dev and Validation

### Package Manager and Runtime

This project supports both Bun and npm. Bun is the preferred runtime.

- Primary Runtime: Bun
- Fallback: npm

### Primary Commands

- Dev Server: `bun run dev` (Uses Astro)
- Production Build: `bun run build` (Outputs to `dist/`; triggers full validation)
- Preview Build: `bun run preview` (Local server for `dist/` contents)
- Validation: `bun run check` (Astro type-checking and diagnostics)
- Astro CLI: `bunx astro <args>`

### Validation Workflow

To validate changes, always run `bun run check` first. Then run `bun run build` for a complete production check.

## Project Structure

Key organizational rules:

- `src/components/`: Keep flat unless a clear sub-module emerges.
- `src/content/`: TOML for projects, Markdown for writing.
- `src/styles/`: Global CSS and Tailwind 4 configuration (`global.css`).

## Code Style and Conventions

### 1. Naming Conventions

**Astro Components and Layouts**: Use `PascalCase.astro` (e.g., `BaseLayout.astro`, `PostLayout.astro`, `Header.astro`, `WritingList.astro`). This follows Astro/React conventions where component names must start with an uppercase letter to distinguish them from HTML tags.

- Components: `PascalCase.astro` (e.g., `Header.astro`, `WritingList.astro`).
- Layouts: `PascalCase.astro` with "Layout" suffix (e.g., `BaseLayout.astro`, `PostLayout.astro`).
- Utility/Script Files: `kebab-case.ts` (e.g., `reading-time.ts`, `date-formatter.ts`).
- Functions/Variables: `camelCase` (e.g., `getReadingTime`, `initGlobalTooltips`).
- Constants: `UPPER_SNAKE_CASE` (e.g., `TOOLTIP_ID`, `WORDS_PER_MINUTE`).
- Types/Interfaces: `PascalCase` with descriptive suffixes (e.g., `Props`, `PostData`).

### 2. TypeScript Patterns

- Strictness: Use strict types; avoid `any`. `strictNullChecks` is enabled.
- Props Definition: Export an `interface Props` in the Astro frontmatter.
- Explicit Returns: Specify return types for all exported functions.
- Zod Validation: Use Zod schemas in `src/content.config.ts` for all collections.
- Type Narrowing: Use `instanceof` or type guards for DOM elements in `src/scripts/`.

### 3. Import Organization

1. External Packages: (e.g., `astro:content`, `@astrojs/rss`).
2. Internal Modules/Components: Use relative paths (e.g., `../components/Header.astro`).
3. Styles and Assets: (e.g., `../styles/global.css`, `../assets/logo.svg`).

### 4. Astro Components

- Logic: Keep logic in the frontmatter (`---`). Avoid complex logic in the template.
- Content: Prefer `getCollection()` for data-driven pages.
- Dynamic Routes: Use `export async function getStaticPaths()` for generating pages.

### 5. CSS and Styling (Tailwind-First)

- **CORE MANDATE**: Use Tailwind utility classes directly in templates for ALL styling.
- **NO CUSTOM CSS**: Do not write custom CSS in components or `global.css` unless utility classes genuinely cannot achieve the result.
- **Theme Variables**: Use the `(--variable-name)` syntax for theme variables:
    - Background: `bg-(--color-background)` / `dark:bg-(--color-background-dark)`
    - Text: `text-(--color-text-first)` / `dark:text-(--color-text-first-dark)`
    - Accent: `text-(--color-accent-light)` / `dark:text-(--color-accent-dark)`
- **Typography**: Use the `@tailwindcss/typography` (`prose`) class for Markdown/content areas.
- **Dark Mode**: Use the `dark:` prefix for all color-related utilities.

### 6. Motion and Animation

- **No Motion**: Do not add animations, transitions, or scripted motion effects anywhere in the codebase.
- **Allowed Exception (View Transitions)**: View transitions are allowed only to reduce FOUC when configured with `<ClientRouter fallback="swap" />`, `transition:animate="none"` on the `<html>` element, and `transition:persist` only on shared layout elements that should not change per page (e.g., footer). Do not use any other `transition:*` directives.
- **Tailwind**: Avoid `transition-*`, `duration-*`, and `animate-*` utilities.
- **CSS/JS**: Avoid keyframes, animation properties, or animation libraries.

### 7. Formatting and Indentation

- Indentation: 4 spaces (strictly enforced).
- Strings: Use double quotes for strings and attributes.
- Semicolons: Required.
- Trailing Whitespace: Trim all trailing whitespace on save.

### 8. Error Handling and Logic

- Validate Early: Check for missing props at the start of the frontmatter.
- Early Returns: Use `if (!condition) return;` to avoid deeply nested blocks.
- Null Safety: Use optional chaining (`?.`) and nullish coalescing (`??`) extensively.

## Tooling and Safety

- Secrets: NEVER commit secrets, API keys, or `.env` files.
- Commits: Make small, atomic commits. Focus the message on "why" the change was made.
- Build Output: Never commit the `dist/` directory.
- Accessibility: Ensure images have `alt` text and interactive elements have `aria-label` or `data-tooltip`.

## Common Patterns

- Redirects: Managed in `astro.config.mjs`. Add new aliases there.
- Reading Time: Use `getReadingTime` utility for post metadata.
