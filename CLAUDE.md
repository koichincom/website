# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website built with Astro 5, featuring a blog, projects showcase, and Vim-style keyboard navigation. Previously powered by Jekyll, now upgraded for better performance and TypeScript support. Deployed on Cloudflare Pages.

**Site URL**: https://koichin.com

## Commands

### Development

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Linting/Formatting

No automated linting configured. Run manually when needed:

```bash
npx eslint "src/**/*.{ts,tsx,astro}" --fix
npx prettier --write .
```

## Architecture

### Content Collections

The site uses Astro's Content Collections API (`src/content.config.ts`) with type-safe schemas:

- **Blog** (`src/content/blog/*.md`): Markdown files with frontmatter (title, date, tags). Loaded via glob pattern.
- **Projects** (`src/content/projects/*.json`): JSON files with structured project data (name, url, role, description, achievements, technologies, order).

Access collections via `getCollection("blog")` or `getCollection("projects")`.

### Routing & Pages

- **Dynamic routes**: `/blog/[slug].astro` uses content collection IDs as slugs
- **Static pages**: `index.astro`, `blog.astro`, `proj.astro`, `about.astro`, `club.astro`
- **Redirects**: Defined in `astro.config.mjs` for shortlinks (`/gh` → GitHub, `/in` → LinkedIn, etc.)

### Layouts

- **base.astro**: Primary layout with Header, Footer, meta tags (OG, Twitter Card), RSS feed link, and Vim bindings initialization
- **post.astro**: Blog post layout (wraps base.astro, includes Giscus comments integration)

All layouts import `src/styles/global.css` for Tailwind v4 styles.

### Vim Navigation System

Global keyboard navigation implemented in `src/scripts/vim.ts`:

- **Navigation**: `h` (home), `b` (blog), `p` (projects), `a` (about), `c` (club)
- **Scrolling**: `gg` (top), `G` (bottom), `u` (up half page), `d` (down half page)
- **Utilities**: `y` (copy URL to clipboard via Sonner toast)
- **Multi-key sequences**: 500ms timeout for `gg` command
- **Skip conditions**: Disabled in input/textarea fields and with modifier keys (Ctrl/Meta/Alt)

Initialized in `base.astro` via inline script. Uses `astro:transitions/client` for client-side navigation.

### Styling

**Tailwind CSS v4** (CSS-first configuration):

- Configuration in `src/styles/global.css` using `@source` directive to declare scan paths
- Vite plugin configured in `astro.config.mjs`
- Custom CSS variables for colors in `global.css` (e.g., `--color-background`, `--color-text-first`)
- Uses arbitrary value syntax: `bg-(--color-background)`, `text-(--color-text-first)`

**Spacing & Typography Conventions:**

- **Intro/description paragraphs**: `mb-4` or `mb-8` for vertical separation
- **Section/group spacing**: `mb-6` or `mb-8` between major content blocks
- **List item spacing**: `py-2` for inline lists (e.g., blog, projects on homepage), `mb-6` for card-based lists (e.g., full project page)
- **Heading margins**: `mb-2` (small headings), `mb-3` (medium), `mb-4` (section headings)
- **Text colors**: All user-facing text should include dark mode support:
  - Primary text: `text-(--color-text-first) dark:text-(--color-text-first-dark)`
  - Secondary text: `text-(--color-text-second) dark:text-(--color-text-second-dark)`
  - Tertiary text: `text-(--color-text-third) dark:text-(--color-text-third-dark)`
- **Links with hover states**: `text-(--color-accent) hover:underline transition-colors duration-200`

### RSS Feed

Generated at `/rss.xml` via `src/pages/rss.xml.ts`:

- Fetches blog collection and sorts by date (newest first)
- Returns RSS 2.0 feed using `@astrojs/rss`

### Integrations

- **@astrojs/react**: React components support (used for Sonner toasts)
- **@astrojs/sitemap**: Auto-generates sitemap.xml
- **@astrojs/rss**: RSS feed generation
- **Giscus**: GitHub Discussions-powered comments on blog posts (configured in post.astro layout)

## Code Style

- **TypeScript**: Strict mode enabled (extends `astro/tsconfigs/strict.json`), `strictNullChecks: true`
- **Formatting**: 2-space indentation, Prettier-compatible
- **Imports**: External → internal absolute → styles/assets; prefer named imports
- **Components**: React (PascalCase), Astro (consistent style)
- **Naming**: camelCase for functions/variables, PascalCase for types (suffix `Props`/`Data` when helpful)
- **CSS**: Prefer Tailwind utilities; extract shared patterns to `global.css`
- **Error handling**: Validate inputs, return early, throw contextual errors
- **Git**: Small focused commits, never commit secrets/node_modules/build artifacts

## Content Management

### Adding Blog Posts

Create `src/content/blog/{slug}.md` with frontmatter:

```yaml
---
title: "Post Title"
date: 2025-01-15
tags: ["tag1", "tag2"] # optional
---
```

### Adding Projects

Create `src/content/projects/{id}.json`:

```json
{
  "name": "Project Name",
  "url": "https://github.com/...",
  "role": [["Role Title", "Jan 2024 - Present"]],
  "description": "Brief description",
  "achievements": ["Achievement 1", "Achievement 2"],
  "technologies": ["React", "TypeScript"],
  "order": 1
}
```

Projects display in order of `order` field (lower numbers first).

## SEO & Meta

All pages use `base.astro` layout which includes:

- Open Graph tags (og:title, og:description, og:url)
- Twitter Card meta tags
- Canonical URLs
- RSS feed link
- Sitemap auto-generated via `@astrojs/sitemap`

## Known Issues

- "G" vim command has a known bug (not prioritized per TODO.md)
- Help modal for vim bindings (`?` key) not yet implemented
