import { defineConfig, fontProviders } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { visit } from "unist-util-visit";
import type { Root, Heading } from "mdast";

// Turn all headings into h2 to flatten the heading structure
function remarkFlattenHeadings() {
    return (tree: Root) => {
        visit(tree, "heading", (node: Heading) => {
            if (node.depth > 2) {
                node.depth = 2;
            }
        });
    };
}

export default defineConfig({
    site: "https://koichin.com",
    integrations: [sitemap(), mdx()],
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

        // About redirects
        "/a": "/about",
        "/ab": "/about",
        "/abt": "/about",
        "/aboutme": "/about",
        "/abouts": "/about",

        // Feed redirects
        "/f": "/feed",
        "/atom": "/feed",
        "/rss": "/feed",
        "/atom.xml": "/feed",
        "/feed.xml": "/feed",
        "/rss.xml": "/feed",
        "/feeds": "/feed",

        // Social redirects
        "/github": "https://github.com/koichincom",
        "/gh": "https://github.com/koichincom",
        "/linkedin": "https://linkedin.com/in/koichincom/",
        "/li": "https://linkedin.com/in/koichincom/",
        "/in": "https://linkedin.com/in/koichincom/",
        "/x": "https://x.com/koichincom",
        "/twitter": "https://x.com/koichincom",

        // Misc redirects
        "/source": "https://github.com/koichincom/website",
        "/source-code": "https://github.com/koichincom/website",
    },
});
