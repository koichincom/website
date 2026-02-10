import type { Element, Parent, Properties, Root, Text } from "hast";
import { visit } from "unist-util-visit";

const LANGUAGE_LABELS: Record<string, string> = {
    cjs: "CJS",
    cpp: "C++",
    cs: "C#",
    html: "HTML",
    js: "JavaScript",
    jsx: "JSX",
    md: "Markdown",
    mdx: "MDX",
    py: "Python",
    rb: "Ruby",
    sh: "Shell",
    sql: "SQL",
    ts: "TypeScript",
    tsx: "TSX",
    yml: "YAML",
};

const normalizeOptionalText = (
    value: string | undefined,
): string | undefined => {
    if (!value) {
        return undefined;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
};

const getStringProperty = (
    properties: Properties | undefined,
    key: string,
): string | undefined => {
    if (!properties) {
        return undefined;
    }

    const value = properties[key];

    if (typeof value === "string") {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map((entry) => String(entry)).join(" ");
    }

    return undefined;
};

const getClassList = (properties: Properties | undefined): string[] => {
    const classValues = [properties?.className, properties?.class];
    const classes: string[] = [];

    for (const classValue of classValues) {
        if (typeof classValue === "string") {
            classes.push(...classValue.split(/\s+/).filter(Boolean));
            continue;
        }

        if (Array.isArray(classValue)) {
            classes.push(
                ...classValue.map((entry) => String(entry)).filter(Boolean),
            );
        }
    }

    return classes;
};

const isShikiCodeBlock = (node: Element): boolean => {
    if (getClassList(node.properties).includes("astro-code")) {
        return true;
    }

    const dataLanguage = normalizeOptionalText(
        getStringProperty(node.properties, "data-language"),
    );
    const dataCodeLanguage = normalizeOptionalText(
        getStringProperty(node.properties, "data-code-language"),
    );

    return Boolean(dataLanguage || dataCodeLanguage);
};

const formatLanguageLabel = (language: string): string => {
    return LANGUAGE_LABELS[language] ?? language;
};

const createTextNode = (value: string): Text => ({
    type: "text",
    value,
});

const createElementNode = (
    tagName: string,
    properties: Properties,
    children: Array<Element | Text>,
): Element => ({
    type: "element",
    tagName,
    properties,
    children,
});

export const rehypeCodeBlockHeader = () => {
    return (tree: Root): void => {
        visit(tree, "element", (node, index, parent) => {
            if (index === undefined || !parent || node.tagName !== "pre") {
                return;
            }

            if (!isShikiCodeBlock(node)) {
                return;
            }

            const filename = normalizeOptionalText(
                getStringProperty(node.properties, "data-code-filename"),
            );
            const language = normalizeOptionalText(
                getStringProperty(node.properties, "data-code-language") ??
                    getStringProperty(node.properties, "data-language"),
            );
            const normalizedLanguage = language?.toLowerCase();
            const languageLabel =
                normalizedLanguage &&
                normalizedLanguage !== "text" &&
                normalizedLanguage !== "plaintext"
                    ? formatLanguageLabel(normalizedLanguage)
                    : undefined;
            const displayedLanguageLabel = filename ? undefined : languageLabel;

            const headerChildren: Array<Element | Text> = [];

            if (filename) {
                headerChildren.push(
                    createElementNode(
                        "span",
                        { className: ["code-block__filename"] },
                        [createTextNode(filename)],
                    ),
                );
            }

            if (displayedLanguageLabel) {
                headerChildren.push(
                    createElementNode(
                        "span",
                        { className: ["code-block__language"] },
                        [createTextNode(displayedLanguageLabel)],
                    ),
                );
            }

            headerChildren.push(
                createElementNode(
                    "button",
                    {
                        type: "button",
                        className: ["code-block__copy"],
                        "data-code-copy-btn": "true",
                        "aria-label": "Copy code",
                    },
                    [createTextNode("Copy")],
                ),
            );

            const wrapperProperties: Properties = {
                className: ["code-block"],
                "data-code-block": "true",
            };

            if (filename) {
                wrapperProperties["data-has-filename"] = "true";
            }

            if (displayedLanguageLabel) {
                wrapperProperties["data-has-language"] = "true";
            }

            const wrapper = createElementNode("div", wrapperProperties, [
                createElementNode(
                    "div",
                    { className: ["code-block__header"] },
                    headerChildren,
                ),
                node,
            ]);

            (parent as Parent).children[index] = wrapper;
        });
    };
};
