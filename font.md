# Font Setup Notes

This project previously used Astro's experimental font pipeline with Fontsource.
I removed it on 2026-01-22 to simplify the stack while I learn Astro's font
management. These notes capture the prior setup so it is easy to restore later.

## Previous approach
- `astro.config.mjs` used `experimental.fonts` with `fontProviders.fontsource()`.
- Fonts were defined as CSS variables like `--font-family-inter` and
  `--font-family-iosevka`.
- `src/layouts/base.astro` imported `Font` from `astro:assets` and injected
  `<Font cssVariable="--font-family-inter" preload />` into the `<head>`.
- `src/styles/global.css` mapped Tailwind variables to the font variables:
  `--font-sans: var(--font-family-inter), ui-sans-serif, sans-serif;`

## Font packages that were installed
- `@fontsource-variable/inter`
- `@fontsource-variable/lora`
- `@fontsource/iosevka`

## Why it was removed
I want to reintroduce fonts later after reviewing Astro's font pipeline and
choosing a new type system.
