// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://koichin.com",
  integrations: [sitemap()],
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: "Inter",
        cssVariable: "--font-family-inter",
        weights: ["100 900"],
      },
      {
        provider: fontProviders.fontsource(),
        name: "Lora",
        cssVariable: "--font-family-lora",
        weights: ["100 900"],
        styles: ["normal", "italic"],
      },
      {
        provider: fontProviders.fontsource(),
        name: "Iosevka",
        cssVariable: "--font-family-iosevka",
        weights: [400, 700],
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },

  redirects: {
    "/proj": "/project",
    "/projects": "/project",
    "/blog": "/writing",
    "/blogs": "/writing",
    "/clubs": "/club",

    "/github": "https://github.com/koichincom",
    "/gh": "https://github.com/koichincom",
    "/linkedin": "https://linkedin.com/in/koichincom/",
    "/in": "https://linkedin.com/in/koichincom/",
    "/twitter": "https://x.com/koichincom",
    "/x": "https://x.com/koichincom",

    "/hci": "https://discord.gg/TF38g4AGtk",
    "/ada": "https://discord.gg/KP297tkq3X",
  },
});
