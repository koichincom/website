import type { Lang } from "./config";

export const ui = {
    en: {
        // Navigation
        "nav.writing": "Writing",
        "nav.projects": "Projects",
        "nav.about": "About",

        // Common
        "common.published": "Published",
        "common.lastUpdated": "Last updated",
        "common.minRead": "min read",
        "common.skipToContent": "Skip to content",

        // Footer sections
        "footer.sitemap": "Sitemap",
        "footer.legal": "Legal",
        "footer.connect": "Connect",
        "footer.feeds": "Feeds",

        // Homepage
        "home.featuredProjects": "Featured Projects",
        "home.latestWriting": "Latest Writing",
        "home.viewAllProjects": "View all projects",
        "home.viewAllWriting": "View all writing",

        // RSS
        "rss.title": "Koichi Nakayamada - Writing",
        "rss.description":
            "Latest articles and thoughts from Koichi Nakayamada",

        // 404
        "404.title": "Page Not Found",
        "404.message": "The page you're looking for doesn't exist.",
        "404.backHome": "Back to home",
    },
    ja: {
        // Navigation
        "nav.writing": "記事",
        "nav.projects": "プロジェクト",
        "nav.about": "About",

        // Common
        "common.published": "公開",
        "common.lastUpdated": "最終更新",
        "common.minRead": "分で読めます",
        "common.skipToContent": "コンテンツへスキップ",

        // Footer sections
        "footer.sitemap": "サイトマップ",
        "footer.legal": "法的事項",
        "footer.connect": "Connect",
        "footer.feeds": "フィード",

        // Homepage
        "home.featuredProjects": "注目プロジェクト",
        "home.latestWriting": "最新記事",
        "home.viewAllProjects": "すべてのプロジェクト",
        "home.viewAllWriting": "すべての記事",

        // RSS
        "rss.title": "Koichi Nakayamada - 記事",
        "rss.description": "Koichi Nakayamadaの最新記事と思考",

        // 404
        "404.title": "ページが見つかりません",
        "404.message": "お探しのページは存在しません。",
        "404.backHome": "ホームに戻る",
    },
} as const;

export function useTranslations(lang: Lang) {
    return function t(key: keyof (typeof ui)["en"]): string {
        return ui[lang][key] || ui["en"][key];
    };
}
