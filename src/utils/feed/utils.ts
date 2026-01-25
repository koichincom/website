import type { Element, Root as HastRoot, RootContent } from "hast";
import type { Root as MdastRoot } from "mdast";
import type { Plugin } from "unified";

import { Buffer } from "node:buffer";

import minifyHtml from "@minify-html/node";
import rehypeStringify from "rehype-stringify";
import remarkMarkers from "remark-flexible-markers";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type UrlLike = URL | string;

export async function mdxToHtml(mdxContent: string, site: UrlLike): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkMdx)
        .use(remarkMarkers, { markerClassName: () => [] })
        .use(remarkRemoveImports)
        .use(remarkRehype)
        .use(rehypeAbsoluteUrls, site)
        .use(rehypeStringify)
        .process(mdxContent);

    return minifyHtml
        .minify(Buffer.from(result.toString()), { keep_closing_tags: true })
        .toString();
}

const remarkRemoveImports: Plugin<[], MdastRoot> = () => {
    return (tree) => {
        tree.children = tree.children.filter((node) => node.type !== "mdxjsEsm");
        return tree;
    };
};

const rehypeAbsoluteUrls: Plugin<[UrlLike], HastRoot> = (baseUrl) => {
    return (tree) => {
        const visit = (node: RootContent | HastRoot): void => {
            if (node.type === "element") {
                const element = node as Element;
                element.properties = element.properties ?? {};

                if (typeof element.properties.href === "string") {
                    element.properties.href = createUrl(
                        element.properties.href,
                        baseUrl,
                    );
                }

                if (typeof element.properties.src === "string") {
                    element.properties.src = createUrl(
                        element.properties.src,
                        baseUrl,
                    );
                }
            }

            if ("children" in node) {
                node.children.forEach((child) => visit(child));
            }
        };

        visit(tree);
        return tree;
    };
};

export function createUrl(path: string, baseUrl: UrlLike): string {
    if (path.startsWith("mailto:") || path.startsWith("tel:")) {
        return path;
    }

    try {
        return new URL(path, baseUrl).href;
    } catch (error) {
        console.error("Invalid path or base URL:", error);
        return path;
    }
}
