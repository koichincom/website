// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://koichin.com",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },

  redirects: {
    // Redirects for closer URLs
    "/project": "/proj",
    "/projects": "/proj",
    "/blogs": "/blog",
    "/clubs": "/club",

    // Redirects for social media
    "/github": "https://github.com/koichincom",
    "/gh": "https://github.com/koichincom",
    "/linkedin": "https://linkedin.com/in/koichincom/",
    "/in": "https://linkedin.com/in/koichincom/",
    "/twitter": "https://x.com/koichincom",
    "/x": "https://x.com/koichincom",

    // Others
    "/hci": "https://discord.gg/TF38g4AGtk",
    "/ada": "https://discord.gg/KP297tkq3X",
  },
});
