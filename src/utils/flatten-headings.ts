import { visit } from "unist-util-visit";
import type { Root, Heading } from "mdast";

export function flattenHeadings() {
    return (tree: Root) => {
        visit(tree, "heading", (node: Heading) => {
            if (node.depth !== 2) {
                node.depth = 2;
            }
        });
    };
}
