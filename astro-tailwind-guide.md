<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

Here is a thorough summary in English of the latest, official preparation steps for using Tailwind CSS with Astro, based on the most up-to-date sources as of late 2025:

***

## Preparing to Use Tailwind CSS with Astro

### 1. Create a New Astro Project

If you don't have an Astro project yet, start by creating one:

```bash
npm create astro@latest my-project
cd my-project
npm install
```

This sets up a new Astro project with the necessary defaults.

***

### 2. Install Tailwind CSS and Vite Plugin

Tailwind CSS v4 uses the official Vite plugin for integration with Astro. You need two main packages:

```bash
npm install tailwindcss @tailwindcss/vite
```

Use the official Vite plugin `@tailwindcss/vite` rather than the deprecated `@astrojs/tailwind` package.

***

### 3. Configure Astro to Use the Tailwind Vite Plugin

In the root `astro.config.mjs` (or `.ts` if using TypeScript), add the Tailwind Vite plugin to Astro’s Vite plugins:

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Restart the development server after editing the config so the plugin loads properly.

***

### 4. Create Global CSS for Tailwind

Create a CSS file to include Tailwind’s directives, e.g. `src/styles/global.css`, with this content:

```css
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

Import this CSS file in your main Astro layout or page files to apply Tailwind styles globally:

```astro
---
import "../styles/global.css";
---
```


***

### 5. Run the Development Server

Start your development server to see Tailwind styles applied:

```bash
npm run dev
```


***

### Notes and Best Practices

- The previously used Astro Tailwind integration `@astrojs/tailwind` is now deprecated and should be replaced by the Vite plugin method.
- Ensure your Node.js version meets Astro’s requirements (v18.20.8, v20.3.0, or v22.0.0+).
- If you want to extend Tailwind with UI kits like daisyUI or Flowbite, separately install them and import their styles/plugins as advised by their documentation.
- Tailwind v4 integration is fully supported and recommended in Astro using this approach.

***

This setup summary aligns with the latest official Astro and Tailwind docs and community guides as of October 2025, ensuring optimal, current best practice for development with Astro and Tailwind CSS.[^1][^2][^3]
<span style="display:none">[^10][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://v3.tailwindcss.com/docs/guides/astro

[^2]: https://tailwindcss.com/docs/installation/framework-guides/astro

[^3]: https://tailkits.com/blog/tailwind-astro-tutorial/

[^4]: https://docs.astro.build/en/guides/integrations-guide/tailwind/

[^5]: https://flowbite.com/docs/getting-started/astro/

[^6]: https://docs.astro.build/en/install-and-setup/

[^7]: https://dav.one/setting-up-astro-project-with-tailwindcss-and-daisyui/

[^8]: https://www.reddit.com/r/astrojs/comments/1j4fe67/how_tf_do_i_install_tailwind_im_a_beginner_and/

[^9]: https://www.material-tailwind.com/docs/react/guide/astro

[^10]: https://daisyui.com/docs/install/astro/?lang=en

