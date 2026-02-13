import { defineConfig, fontProviders } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { flattenHeadings } from "./src/utils/flatten-headings";
import { rehypeCodeBlockHeader } from "./src/utils/rehype-code-block-header";
import { shikiCodeMeta } from "./src/utils/shiki-code-meta";

export default defineConfig({
    site: "https://koichin.com",
    integrations: [sitemap(), mdx()],
    vite: {
        plugins: [tailwindcss()],
    },
    trailingSlash: "never",
    markdown: {
        remarkPlugins: [flattenHeadings],
        rehypePlugins: [rehypeCodeBlockHeader],
        shikiConfig: {
            themes: {
                light: "github-light",
                dark: "github-dark",
            },
            transformers: [shikiCodeMeta()],
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
        // Writing
        "/w": "/writing",
        "/b": "/writing",
        "/blog": "/writing",
        "/blogs": "/writing",
        "/writings": "/writing",

        // Projects
        "/p": "/project",
        "/projects": "/project",

        // About
        "/a": "/about",

        // Feed
        "/feeds": "/feed",
        "/feed.xml": "/feed",
        "/rss": "/feed",
        "/rss.xml": "/feed",
        "/atom": "/feed",
        "/atom.xml": "/feed",

        // Social
        "/linkedin": "https://linkedin.com/in/koichincom/",
        "/x": "https://x.com/koichincom",
        "/twitter": "https://x.com/koichincom",
        "/github": "https://github.com/koichincom",
        "/gh": "https://github.com/koichincom",

        // Misc
        "/source": "https://github.com/koichincom/website",
        "/source-code": "https://github.com/koichincom/website",
    },
});
