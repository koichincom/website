import { defineConfig, fontProviders } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    site: "https://koichin.com",
    integrations: [sitemap(), mdx()],
    vite: {
        plugins: [tailwindcss()],
    },
    markdown: {
        shikiConfig: {
            themes: {
                light: "github-light",
                dark: "github-dark",
            },
        },
    },
    experimental: {
        fonts: [
            {
                provider: fontProviders.fontsource(),
                name: "Iosevka Aile",
                cssVariable: "--font-iosevka-aile",
            },
        ],
    },

    redirects: {
        "/proj": "/project",
        "/projects": "/project",
        "/blog": "/writing",
        "/blogs": "/writing",
        "/writings": "/writing",

        "/github": "https://github.com/koichincom",
        "/gh": "https://github.com/koichincom",
        "/linkedin": "https://linkedin.com/in/koichincom/",
        "/li": "https://linkedin.com/in/koichincom/",
        "/in": "https://linkedin.com/in/koichincom/",
        "/x": "https://x.com/koichincom",
        "/twitter": "https://x.com/koichincom",

        "/hci": "https://discord.gg/TF38g4AGtk",
        "/ada": "https://discord.gg/KP297tkq3X",
    },
});
