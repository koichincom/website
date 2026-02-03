export const LANGUAGES = {
    en: "English",
    ja: "日本語",
} as const;

export const DEFAULT_LANG = "en" as const;

export type Lang = keyof typeof LANGUAGES;
