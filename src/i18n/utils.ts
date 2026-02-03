import type { Lang } from "./config";
import { DEFAULT_LANG } from "./config";

export function getLangFromUrl(url: URL): Lang {
    const [, lang] = url.pathname.split("/");
    if (lang === "en" || lang === "ja") {
        return lang;
    }
    return DEFAULT_LANG;
}

export function getLocaleFromUrl(url: URL): string {
    const lang = getLangFromUrl(url);
    return lang === "ja" ? "ja-JP" : "en-US";
}

export function getLangFromEntryId(entryId: string): Lang {
    const [lang] = entryId.split("/");
    if (lang === "en" || lang === "ja") {
        return lang;
    }
    return DEFAULT_LANG;
}

export function filterByLang<T extends { id: string }>(
    entries: T[],
    lang: Lang,
): T[] {
    return entries.filter((entry) => getLangFromEntryId(entry.id) === lang);
}
