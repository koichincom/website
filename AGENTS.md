# AGENTS.md

- A personal website built with Astro, Tailwind CSS, and TypeScript.
- Not working on mobile now, only the desktop version of the site.
- Prefer retrieval-led reasoning over pre-training-led reasoning.
- When making changes, consider the structure and organization, not patch to make it work in hacky ways.

## Tech Stack and Tools

- Use TypeScript, Tailwind CSS v4, and Astro 5 and follow their best practices, especially for Tailwind CSS v4 and custom CSS
- Use Astro components for reusable UI elements
- Use astro-docs MCP server for Astro questions
- Use websearch, webfetch, and btca tools for factual information
- Run `bun run check` after a chunk of changes

## LLM Agent Use

In this project, I'll be mainly involved in the basic Astro structure (components, pages, layouts, HTML) and some basic TypeScript, but I'll let LLM agents handle all CSS, Tailwind/CSS, and browser/frontend-related work such as DOM manipulation. I'm not a frontend developer, so I need the LLM agents to take care of them and make sure they follow the standards and best practices, and I won't be able to give a good review. If I ask about them, explain in very-highlevel, so I can understand the general idea.

## File Locations

- Use `src/scripts` for scripts used in client-side
- Use `src/utils` for utility functions used in server-side
- `/astro.config.ts` is for Astro configuration

## Assets

- Default to `src/assets` for local assets.
- Use `public/` only when a file must be referenced by a stable direct URL and served untouched.
- In `.astro`, import SVGs as components (no `?raw`) when rendering markup.
- In `src/scripts/*.ts`, use `?raw` only when an API expects SVG/HTML as a string.
- In `src/scripts/*.ts`, use `?url` when a URL string is required.
- Do not add wrapper icon components unless they provide meaningful shared semantics/default behavior beyond simple class passthrough.

## Design Principles

- Any hover effect must have an equivalent `focus-visible` or `focus-within` style for keyboard navigation
- Don't use animation for small interactions such as hovering
- Use meaningful animation only for big context changes, but don't use it unless instructed to
- Always provide `prefers-reduced-motion` fallbacks that disable animations
- By default, use accent color for hover effects only, and if nothing is hovered, the accent color shouldn't be present in the UI

## Naming Conventions

- Components: `PascalCase.astro`
- Pages: `kebab-case.astro`
    - Exception: `404.astro`
    - Exception: Dynamic routes like `[slug].astro`
- Utilities: `kebab-case.ts`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
