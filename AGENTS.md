# AGENTS.md

Purpose: Essential guidance for agentic coding agents operating in this repository.

## Build, Dev and Validation

### Package Manager and Runtime
This project supports both Bun and npm. Bun is frequently used for local development and running scripts.
- Primary Runtime: Bun
- Fallback: npm

### Primary Commands
- Dev Server: bun run dev (Runs on port 4321; uses Astro)
- Production Build: bun run build (Outputs to dist/; triggers type-checking)
- Preview Build: bun run preview (Local server for dist/ contents)
- Astro CLI: bunx astro <args>
- Type Check: bunx tsc --noEmit (Fast validation for TypeScript files)

If Bun is unavailable, use the npm equivalents:
- Dev Server: npm run dev
- Production Build: npm run build
- Type Check: npx tsc --noEmit

### CRITICAL: Validation Workflow
Do NOT run "bun run dev" or "npm run dev" to validate your changes.
- These are continuous processes that will hang your environment and provide no terminal feedback.
- To validate code changes: Always run "bun run build" (or "npm run build"). This is the most reliable way to catch TypeScript errors, CSS compilation issues (Tailwind 4), missing imports, and broken routes.
- If you only modified .ts files and want speed, use "bunx tsc --noEmit".

## Testing
- Current Status: No test suite is currently implemented in the project.
- Proposed Framework: If you are tasked with adding tests, use Vitest.
- Installation: bun add -d vitest
- Run all tests: bunx vitest
- Run single file: bunx vitest path/to/test.ts
- Run single test: bunx vitest -t "test name"

## Project Structure
- src/assets/: Static assets, images, and raw placeholders.
- src/components/: Reusable Astro components. Keep this flat unless a clear sub-module emerges.
- src/content/: Content collections (TOML for projects, Markdown for writing).
- src/layouts/: Base page templates (e.g., base.astro, post.astro). Layouts should wrap major page sections.
- src/pages/: File-based routing. Includes .astro pages, .md pages, and API routes like rss.xml.ts.
- src/scripts/: Client-side TypeScript logic. Scripts here are often imported in Astro component <script> tags.
- src/styles/: Global CSS and Tailwind 4 configuration (global.css).
- src/utils/: Pure utility functions and shared helpers (e.g., readingTime.ts).

## Code Style and Conventions

### 1. Naming Conventions
- Directories/Files: kebab-case.astro or kebab-case.ts.
- Components: PascalCase.astro (e.g., BaseLayout.astro, Shortcuts.astro).
- Functions/Variables: camelCase (e.g., getReadingTime, initGlobalTooltips).
- Constants: UPPER_SNAKE_CASE (e.g., TOOLTIP_ID, WORDS_PER_MINUTE).
- Types/Interfaces: PascalCase with descriptive suffixes (e.g., Props, PostData).

### 2. TypeScript Patterns
- Strictness: Use strict types; avoid any. strictNullChecks is enabled in tsconfig.json.
- Props Definition: Export an interface Props in the Astro frontmatter for component inputs.
- Explicit Returns: Specify return types for all exported functions to improve clarity and catch errors early.
- Zod Validation: Use Zod schemas in src/content.config.ts for all content collection definitions.
- Type Narrowing: Use instanceof or type guards when dealing with DOM elements in src/scripts/.

### 3. Import Organization
Order imports logically to maintain a clean frontmatter:
1. External Packages: (e.g., astro:content, @astrojs/rss, toastify-js).
2. Internal Modules/Components: Use relative paths (e.g., ../components/Header.astro).
3. Styles and Assets: (e.g., ../styles/global.css, ../assets/logo.svg).

### 4. Astro Components
- Logic: Keep logic in the frontmatter (---). Avoid complex logic inside the HTML template.
- Content: Prefer getCollection() from astro:content for data-driven pages.
- Dynamic Routes: Use export async function getStaticPaths() for generating pages from collections.
- Slots: Use the <slot /> component for layouts to wrap page content.
- Persistence: Use transition:persist on components that should maintain state across navigation (e.g., Header, Shortcuts).
- Client Scripts: Put DOM-heavy logic in src/scripts/ and import it into the <script> block.

### 5. CSS and Styling
- Tailwind CSS 4: Use utility classes directly in templates. Tailwind 4 is integrated via @tailwindcss/vite.
- Custom Variables: Use the (--variable-name) syntax for theme variables (e.g., bg-(--color-background)).
- Typography: Use the @tailwindcss/typography (prose) class for Markdown/content-heavy areas.
- Global Styles: Add base styles or complex component classes to src/styles/global.css only when necessary.
- Dark Mode: Use the dark: prefix for all color-related utilities.

### 6. Formatting and Indentation
- Indentation: 4 spaces (strictly enforced by .editorconfig).
- Strings: Use double quotes for strings and attributes.
- Semicolons: Required (standard TypeScript/JavaScript style).
- Trailing Whitespace: Trim all trailing whitespace on save.

### 7. Error Handling and Logic
- Validate Early: Check for missing props or empty collection results at the start of the frontmatter.
- Early Returns: Use if (!condition) return; or equivalent logic to avoid deeply nested blocks.
- Null Safety: Use optional chaining (?.) and nullish coalescing (??) extensively when dealing with optional content fields.

## Content Collections
- Writing: Markdown files in src/content/writing/. Required fields: title, published, description.
- Projects: TOML files in src/content/projects/. Required fields: name, primaryUrl, published, description.
- Schema: All definitions are centralized in src/content.config.ts. Always update this file when adding new fields to collections.
- Sorting: Usually sort by published date in descending order.

## Tooling and Safety
- Secrets: NEVER commit secrets, API keys, or .env files.
- Commits: Make small, atomic commits. Focus the commit message on "why" the change was made.
- Build Output: Never commit the dist/ directory.
- External Rules: No .cursorrules or .github/copilot-instructions.md were detected. Treat this AGENTS.md as the primary source of truth for repository standards.
- Accessibility: Ensure all images have alt text and interactive elements have appropriate aria labels (see tooltip.ts for examples).

## Proactive Actions
- Testing Utility: If you add a new utility in src/utils/, add a corresponding test file (e.g., name.test.ts).
- Linking: When creating a new page, ensure it is linked in the Header.astro or Footer.astro if appropriate.
- Visuals: If modifying styles, check both light and dark modes (using dark: prefix).
- Tooltips: Use data-tooltip="Label" on interactive elements to trigger the global tooltip script.

## Common Patterns
- Redirects: Managed in astro.config.mjs. Add new aliases there rather than creating empty pages.
- View Transitions: Enabled via <ViewTransitions /> in BaseLayout. Ensure scripts use astro:page-load event.
- Metadata: SEO meta tags are handled in BaseLayout.astro. Pass title, description, and image props as needed.
