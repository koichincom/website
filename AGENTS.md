# AGENTS.md

- A personal website built with Astro, Tailwind CSS, and TypeScript.
- Prefer retrieval-led reasoning over pre-training-led reasoning.
- I don't know much about CSS and not interested in learning them. Please use your best judgement, follow the industry standard, and make suggestions, not asking me about it.
- To avoid structural code debt, think about the overall structure and how the part is related in the big picture when making changes.

## Tech Stack

- Use TypeScript (not JavaScript) for all code
- Use Astro components for reusable UI elements
- Use astro-docs MCP server for Astro questions (not found then ask user)

## Validation

Run `bun run check` after changes to validate TypeScript, CSS, and routing.

## Styling Guidelines

- Use Tailwind utility-first approach
- Use Astro components to follow DRY principles (avoid custom CSS)
- No animations, transitions, or motion effects
- Exception: View transitions with `transition:animate="none"` only

## Naming Conventions

- Components: `PascalCase.astro` (e.g., `Header.astro`, `BaseLayout.astro`)
- Pages: `kebab-case.astro` (e.g., `index.astro`, `about.astro`)
    - Exception: `404.astro` for the not found route
    - Exception: Dynamic routes like `[slug].astro`
- Utilities: `kebab-case.ts` (e.g., `reading-time.ts`)
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
