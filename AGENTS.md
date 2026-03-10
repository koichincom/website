# AGENTS.md

CURENTLY: not working on mobile, only the desktop version of the site.

- A personal website built with Astro, Tailwind CSS, and TypeScript.
- Prefer retrieval-led reasoning over pre-training-led reasoning.
- When making changes, consider the structure and organization, not just patch to make it work.

## Tech Stack

- Use TypeScript not JavaScript
- Use Astro components for reusable UI elements
- Use astro-docs MCP server for Astro questions
- Use websearch, webfetch, or btca tools for factual information

## File Location

- Use `src/scripts` for scripts used in client-side
- Use `src/utils` for utility functions used in server-side
- `/astro.config.ts` is for Astro configuration, not `.mjs`

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

**All CSS must follow Tailwind v4 conventions.** No exceptions.

- **Utility-first only**: Use Tailwind v4 utility classes exclusively. Do not write custom CSS rules unless absolutely unavoidable.
- Use Astro components to follow DRY principles (generally @layer component feature isn't needed since Astro components exist)
- Keyboard accessibility: Any hover effect (text color change, underline, background) must have an equivalent `focus-visible` or `focus-within` style for keyboard navigation

## Animation Policy

- **No hover animations**: Keep hover effects instant (color, underline, background changes). Do not add `transition-*` or animation to hover states.
- **Animate only big context changes**: Use animation for meaningful structural changes users need help tracking:
    - Page navigation transitions (e.g., `fade()`)
    - Reveal/hide of major UI sections (e.g., prose sidebar title)
    - Major layout or state shifts
- **Keep it quiet**: Use short durations, small movement distances, and linear/subtle easing. Avoid bouncy or flashy effects.
- **Respect reduced motion**: Always provide `prefers-reduced-motion` fallbacks that disable or simplify animations.

## Naming Conventions

- Components: `PascalCase.astro` (e.g., `Header.astro`, `BaseLayout.astro`)
- Pages: `kebab-case.astro` (e.g., `index.astro`, `about.astro`)
    - Exception: `404.astro` for the not found route
    - Exception: Dynamic routes like `[slug].astro`
- Utilities: `kebab-case.ts` (e.g., `reading-time.ts`)
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

## LLM Agent Use

I am not a frontend developer. I will handle basic Astro structure, but CSS, Tailwind, DOM-related TypeScript are outside my scope. Make styling decisions independently using your best judgment, following the official Tailwind and Astro documentation. DO NOT ask me to make styling decisions; provide only high-level explanations.
