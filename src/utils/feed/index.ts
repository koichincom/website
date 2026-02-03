import type { APIContext } from "astro";
import type { FeedOptions, Item as FeedItem } from "feed";

import { getCollection } from "astro:content";
import { Feed } from "feed";

import { createUrl, mdxToHtml } from "./utils";
import { filterByLang } from "../../i18n/utils";
import { DEFAULT_LANG } from "../../i18n/config";

type SiteAuthor = {
    name: string;
    email?: string;
    link?: string;
};

type FeedItemData = FeedItem & {
    date: Date;
};

type FeedVariant = "atom" | "rss";

export async function generateFeed(
    context: APIContext,
    variant: FeedVariant,
): Promise<Feed> {
    const site = getSiteUrl(context);
    const author: SiteAuthor = {
        name: "Koichi Nakayamada",
        email: "k@koichin.com",
        link: site,
    };

    const feed = createFeedInstance(site, author);
    const items = await getFeedItems(site, author, variant);

    items
        .sort((a, b) => b.date.valueOf() - a.date.valueOf())
        .forEach((item) => feed.addItem(item));

    return feed;
}

function getSiteUrl(context: APIContext): string {
    const site = context.site;

    if (!site) {
        throw new Error("Site URL is required to generate feeds.");
    }

    const siteUrl = site.toString();

    return siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
}

function createFeedInstance(site: string, author: SiteAuthor): Feed {
    const feedOptions: FeedOptions = {
        title: "Koichi Nakayamada",
        description: "Writing and projects from Koichi Nakayamada.",
        id: site,
        link: site,
        language: "en",
        favicon: createUrl("/favicon.ico", site),
        copyright: `Copyright ${new Date().getFullYear()} Koichi Nakayamada`,
        feedLinks: {
            rss: createUrl("/rss/", site),
            atom: createUrl("/atom/", site),
        },
        author,
    };

    return new Feed(feedOptions);
}

async function getFeedItems(
    site: string,
    author: SiteAuthor,
    variant: FeedVariant,
): Promise<FeedItemData[]> {
    const [writingItems, projectItems] = await Promise.all([
        getWritingItems(site, author, variant),
        getProjectItems(site, author),
    ]);

    return [...writingItems, ...projectItems];
}

async function getWritingItems(
    site: string,
    author: SiteAuthor,
    variant: FeedVariant,
): Promise<FeedItemData[]> {
    const allPosts = await getCollection("writing");
    const writingPosts = filterByLang(allPosts, DEFAULT_LANG);

    return Promise.all(
        writingPosts.map(async (post) => {
            // Remove language prefix from ID for URL
            const slug = post.id.replace(/^(en|ja)\//, "");
            const link = createUrl(`/writing/${slug}`, site);
            const content = await mdxToHtml(post.body || "", site);
            const date = post.data.lastUpdated ?? post.data.published;
            const baseItem = {
                title: post.data.title,
                id: link,
                link,
                date,
                published: post.data.published,
                author: [author],
            };

            if (variant === "rss") {
                return {
                    ...baseItem,
                    description: content,
                };
            }

            return {
                ...baseItem,
                content,
            };
        }),
    );
}

async function getProjectItems(
    site: string,
    author: SiteAuthor,
): Promise<FeedItemData[]> {
    const allProjects = await getCollection("projects");
    const projects = filterByLang(allProjects, DEFAULT_LANG);
    const projectNotice =
        "The URL might directly lead to the project website or the repository.";

    return Promise.all(
        projects.map(async (project) => {
            const link = project.data.mainUrl;
            const description = await mdxToHtml(
                `${projectNotice}\n\n${project.data.description}`,
                site,
            );
            return {
                title: project.data.name,
                id: link,
                link,
                description,
                date: project.data.published,
                published: project.data.published,
                author: [author],
            };
        }),
    );
}
