// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    site: "https://koichin.com",
    integrations: [sitemap()],
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

    redirects: {
        "/proj": "/project",
        "/projects": "/project",
        "/blog": "/writing",
        "/blogs": "/writing",
        "/writings": "/writing",
        "/clubs": "/club",

        "/github": "https://github.com/koichincom",
        "/gh": "https://github.com/koichincom",
        "/linkedin": "https://linkedin.com/in/koichincom/",
        "/in": "https://linkedin.com/in/koichincom/",
        "/x": "https://x.com/koichincom",
        "/twitter": "https://x.com/koichincom",

        "/hci": "https://discord.gg/TF38g4AGtk",
        "/ada": "https://discord.gg/KP297tkq3X",
    },
});
