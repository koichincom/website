import { defineConfig, fontProviders } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { visit } from "unist-util-visit";

function remarkFlattenHeadings() {
    return (tree) => {
        visit(tree, "heading", (node) => {
            if (node.depth > 2) {
                node.depth = 2;
            }
        });
    };
}

export default defineConfig({
    site: "https://koichin.com",
    integrations: [sitemap(), mdx()],
    i18n: {
        locales: ["en", "ja"],
        defaultLocale: "en",
        routing: {
            prefixDefaultLocale: false,
            fallbackType: "rewrite",
        },
        fallback: {
            ja: "en",
        },
    },
    vite: {
        plugins: [tailwindcss()],
    },
    markdown: {
        remarkPlugins: [remarkFlattenHeadings],
        shikiConfig: {
            themes: {
                light: "github-light",
                dark: "github-dark",
            },
        },
    },
    experimental: {
        contentIntellisense: true,
        fonts: [
            {
                provider: fontProviders.fontsource(),
                name: "Iosevka Aile",
                cssVariable: "--font-iosevka-aile",
                display: "block",
            },
        ],
    },

    redirects: {
        // Writing redirects
        "/w": "/writing",
        "/writings": "/writing",
        "/b": "/writing",
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
