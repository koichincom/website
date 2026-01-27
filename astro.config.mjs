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
        // Writing redirects
        "/w": "/writing",
        "/writings": "/writing",
        "/blog": "/writing",
        "/blogs": "/writing",

        // Project redirects
        "/p": "/project",
        "/pj": "/project",
        "/pjt": "/project",
        "/proj": "/project",
        "/projects": "/project",

        // Social redirects
        "/github": "https://github.com/koichincom",
        "/gh": "https://github.com/koichincom",
        "/linkedin": "https://linkedin.com/in/koichincom/",
        "/li": "https://linkedin.com/in/koichincom/",
        "/in": "https://linkedin.com/in/koichincom/",
        "/x": "https://x.com/koichincom",
        "/twitter": "https://x.com/koichincom",
    },
});
