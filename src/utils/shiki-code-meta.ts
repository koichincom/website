import type { ShikiTransformer } from "shiki";

type MetaValue = string | boolean;

const META_ATTRIBUTE_PATTERN =
    /([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g;

const parseMetaAttributes = (
    rawMeta: string | undefined,
): Record<string, MetaValue> => {
    const attributes: Record<string, MetaValue> = {};

    if (!rawMeta) {
        return attributes;
    }

    for (const match of rawMeta.matchAll(META_ATTRIBUTE_PATTERN)) {
        const key = match[1];

        if (!key) {
            continue;
        }

        const value = match[2] ?? match[3] ?? match[4];
        attributes[key] = value ?? true;
    }

    return attributes;
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

const getLanguage = (langOption: unknown): string | undefined => {
    if (typeof langOption === "string") {
        return normalizeOptionalText(langOption.toLowerCase());
    }

    if (typeof langOption === "object" && langOption !== null) {
        const name = (langOption as { name?: unknown }).name;

        if (typeof name === "string") {
            return normalizeOptionalText(name.toLowerCase());
        }
    }

    return undefined;
};

const getFilename = (
    attributes: Record<string, MetaValue>,
): string | undefined => {
    const filenameAttribute = attributes.filename;
    const fileAttribute = attributes.file;
    const candidate =
        typeof filenameAttribute === "string"
            ? filenameAttribute
            : typeof fileAttribute === "string"
              ? fileAttribute
              : undefined;

    return normalizeOptionalText(candidate);
};

export const shikiCodeMeta = (): ShikiTransformer => {
    return {
        name: "shiki-code-meta",
        pre(node) {
            const attributes = parseMetaAttributes(this.options.meta?.__raw);
            const filename = getFilename(attributes);
            const language = getLanguage(this.options.lang);

            if (filename) {
                node.properties["data-code-filename"] = filename;
            }

            if (language && language !== "plaintext" && language !== "text") {
                node.properties["data-code-language"] = language;
            }
        },
    };
};
