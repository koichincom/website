# Prose Sidebar ToC: Remaining Non-CSS Work

This note covers only what is left to finish the current Table of Contents behavior without touching CSS.

## What is already done

- ToC links now have stable hooks in `src/layouts/ProseLayout.astro`:
    - `data-prose-toc` on the `<nav>`
    - `data-prose-toc-link` on each ToC link
    - `data-toc-slug` on each ToC link
- Styling behavior is already in place for:
    - hover/focus accent + underline
    - current section text-second + underline (via `aria-current="location"` or `data-current="true"`)

## What is left (TS/logic only)

Implement scrollspy in `src/scripts/prose-sidebar.ts` so the ToC marks the current section as the user scrolls.

### 1) Add ToC constants

In `src/scripts/prose-sidebar.ts`, add constants like:

- `TOC_TRIGGER_RATIO = 0.3` (30% from top)
- selectors for:
    - ToC links: `[data-prose-toc-link]`
    - headings: `.prose h2[id]`

### 2) Build current-heading resolver

Create a function that, for one prose layout, finds the active heading slug:

1. Read all `h2[id]` inside that layout's `.prose` content.
2. Compute trigger line: `const triggerY = window.innerHeight * TOC_TRIGGER_RATIO`.
3. Pick the **last heading** whose `getBoundingClientRect().top <= triggerY`.
4. Fallbacks:
    - If none are above trigger yet, use the first heading.
    - If list is empty, return `null`.

This gives the expected "current section" behavior at 30% viewport height.

### 3) Apply active state to ToC links

Create a function that updates all ToC links in one layout:

- For the active link:
    - set `aria-current="location"`
    - set `data-current="true"`
- For non-active links:
    - remove `aria-current`
    - remove `data-current`

Match links by `data-toc-slug` against heading `id`.

### 4) Wire lifecycle events

Reuse your existing init flow in `src/scripts/prose-sidebar.ts`:

- Run once on init.
- Re-run on `scroll` (passive), `resize`, and `astro:after-swap`.
- Keep it scoped per `[data-prose-layout]` so it works across pages and Astro client-router swaps.

You already have an initialization guard and sidebar observer setup; integrate ToC updates there instead of creating a separate script.

### 5) Keep this behavior desktop-only for now

Given current project note (desktop focus), it is fine to run this only where ToC exists in desktop layout. The logic can safely no-op when no ToC links/headings are found.

## Suggested function shape (example)

Use this only as structure guidance:

```ts
const getActiveTocSlug = (layout: HTMLElement): string | null => {
    // read headings, compute triggerY (30%), return active heading id
};

const syncTocForLayout = (layout: HTMLElement): void => {
    // read links, get active slug, set/remove aria-current + data-current
};

const syncAllProseTocs = (): void => {
    document
        .querySelectorAll<HTMLElement>("[data-prose-layout]")
        .forEach((layout) => syncTocForLayout(layout));
};
```

## Done criteria

- Scrolling updates exactly one ToC item as current.
- Current item changes around 30% viewport height (not center).
- Keyboard/mouse hover styles still work (already CSS-driven).
- No JS errors on pages without ToC.
- Works after Astro page transitions (`astro:after-swap`).
