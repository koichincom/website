# AGENTS.md

- A personal website built with Astro, Tailwind CSS, and TypeScript.
- Prefer retrieval-led reasoning over pre-training-led reasoning.
- When making changes, consider the structure and organization, not just patch to make it work.

## Tech Stack

- Use TypeScript by default
- Use Astro components for reusable UI elements
- Use astro-docs MCP server for Astro questions

# File Location

- Use `src/scripts` for scripts used in client-side
- Use `src/utils` for utility functions used in server-side

## Assets and SVGs

- Default to `src/assets` for local assets.
- Use `public/` only when a file must be referenced by a stable direct URL and served untouched.
- In `.astro`, import SVGs as components (no `?raw`) when rendering markup.
- In `src/scripts/*.ts`, use `?raw` only when an API expects SVG/HTML as a string.
- In `src/scripts/*.ts`, use `?url` when a URL string is required.
- Do not add wrapper icon components unless they provide meaningful shared semantics/default behavior beyond simple class passthrough.

## Validation

Run `bun run check` after changes to validate TypeScript, CSS, and routing.

## Styling Guidelines

- Use Tailwind's utility-first approach for Astro
- Follow Tailwind v4 and Astro official docs as the source of truth
- Use Astro components to follow DRY principles (generally @layer component feature isn't needed since Astro components exist)
- Use Astro's @layer base for global styles as needed
- No animations or motion effects (except Astro's view transition API)

## Naming Conventions

- Components: `PascalCase.astro` (e.g., `Header.astro`, `BaseLayout.astro`)
- Pages: `kebab-case.astro` (e.g., `index.astro`, `about.astro`)
    - Exception: `404.astro` for the not found route
    - Exception: Dynamic routes like `[slug].astro`
- Utilities: `kebab-case.ts` (e.g., `reading-time.ts`)
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

## LLM Agent Use

I am not a frontend developer and don't have expertise in CSS or Tailwind. I will handle TypeScript, HTML, and basic Astro structure, but CSS and Tailwind are outside my scope. Make styling decisions independently using your best judgment, following the official Tailwind and Astro documentation. Don't ask me to make styling decisions; provide only high-level explanations.
