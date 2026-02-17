# AGENTS.md

- A personal website built with Astro, Tailwind CSS, and TypeScript.
- Prefer retrieval-led reasoning over pre-training-led reasoning.
- When making changes, consider the structure and organization, not just patch to make it work.

## Tech Stack

- Use TypeScript except Astro's is:inline scripts (which needs to be in JavaScript)
- Use Astro components for reusable UI elements
- Use astro-docs MCP server for Astro questions (not found then ask user)

## Configuration Files

- Astro config file: `astro.config.ts`

# File Location

- Use `src/scripts` for scripts used in client-side
- Use `src/utils` for utility functions used in server-side

## Validation

Run `bun run check` after changes to validate TypeScript, CSS, and routing.

## Styling Guidelines

- Use Tailwind's utility-first approach for Astro
- Follow Tailwind v4 and Astro official docs as the source of truth
- Use Astro components to follow DRY principles (generally @layer component feature isn't needed since Astro components exist)
- Use Astro's @layer base for global styles as needed
- No animations or motion effects (except Astro's view transition API)
- I don't know much about CSS and not interested in learning. Use your best judgement, follow the standard and official document, and make suggestions, not asking me for decisions.
- I use https://www.svgrepo.com/collection/dazzle-line-icons/ for SVG icons. Ask me if you need any icons

## Naming Conventions

- Components: `PascalCase.astro` (e.g., `Header.astro`, `BaseLayout.astro`)
- Pages: `kebab-case.astro` (e.g., `index.astro`, `about.astro`)
    - Exception: `404.astro` for the not found route
    - Exception: Dynamic routes like `[slug].astro`
- Utilities: `kebab-case.ts` (e.g., `reading-time.ts`)
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
