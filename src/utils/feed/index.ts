import type { APIContext } from "astro";
import type { FeedOptions, Item as FeedItem } from "feed";

import { getCollection } from "astro:content";
import { Feed } from "feed";

import { createUrl, mdxToHtml } from "./utils";

type SiteAuthor = {
    name: string;
    email?: string;
    link?: string;
};

type FeedItemData = FeedItem & {
    date: Date;
};

type FeedFormat = "atom" | "rss";
type FeedScope = "combined" | "project" | "writing";

export async function generateFeed(
    context: APIContext,
    scope: FeedScope,
    format: FeedFormat,
): Promise<Feed> {
    const site = getSiteUrl(context);
    const author: SiteAuthor = {
        name: "Koichi Nakayamada",
        email: "k@koichin.com",
        link: site,
    };

    const feed = createFeedInstance(site, author, scope);
    const items = await getFeedItems(site, author, scope, format);

    items
        .sort((a, b) => b.date.valueOf() - a.date.valueOf())
        .slice(0, 20)
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

function createFeedInstance(
    site: string,
    author: SiteAuthor,
    scope: FeedScope,
): Feed {
    const scopeConfig = getScopeConfig(scope, site);
    const feedOptions: FeedOptions = {
        title: scopeConfig.title,
        description: scopeConfig.description,
        id: scopeConfig.link,
        link: scopeConfig.link,
        language: "en",
        favicon: createUrl("/favicon.ico", site),
        copyright: `Copyright ${new Date().getFullYear()} Koichi Nakayamada`,
        feedLinks: {
            rss: createUrl(scopeConfig.rssPath, site),
            atom: createUrl(scopeConfig.atomPath, site),
        },
        author,
    };

    return new Feed(feedOptions);
}

async function getFeedItems(
    site: string,
    author: SiteAuthor,
    scope: FeedScope,
    format: FeedFormat,
): Promise<FeedItemData[]> {
    if (scope === "writing") {
        return getWritingItems(site, author, format);
    }

    if (scope === "project") {
        return getProjectItems(site, author);
    }

    const [writingItems, projectItems] = await Promise.all([
        getWritingItems(site, author, format),
        getProjectItems(site, author),
    ]);

    return [...writingItems, ...projectItems];
}

async function getWritingItems(
    site: string,
    author: SiteAuthor,
    format: FeedFormat,
): Promise<FeedItemData[]> {
    const writingPosts = await getCollection("writing");

    return Promise.all(
        writingPosts.map(async (post) => {
            const link = createUrl(`/writing/${post.id}`, site);
            const content = await mdxToHtml(post.body || "", site);
            const date = post.data.published;
            const baseItem = {
                title: post.data.title,
                id: link,
                link,
                date,
                published: post.data.published,
                author: [author],
            };

            if (format === "rss") {
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

function getScopeConfig(
    scope: FeedScope,
    site: string,
): {
    title: string;
    description: string;
    link: string;
    rssPath: string;
    atomPath: string;
} {
    if (scope === "writing") {
        return {
            title: "Koichi Nakayamada - Writing",
            description: "Writing from Koichi Nakayamada.",
            link: createUrl("/writing", site),
            rssPath: "/rss/writing",
            atomPath: "/atom/writing",
        };
    }

    if (scope === "project") {
        return {
            title: "Koichi Nakayamada - Projects",
            description: "Projects from Koichi Nakayamada.",
            link: createUrl("/project", site),
            rssPath: "/rss/project",
            atomPath: "/atom/project",
        };
    }

    return {
        title: "Koichi Nakayamada",
        description: "Writing and projects from Koichi Nakayamada.",
        link: createUrl("/", site),
        rssPath: "/rss",
        atomPath: "/atom",
    };
}

async function getProjectItems(
    site: string,
    author: SiteAuthor,
): Promise<FeedItemData[]> {
    const projects = await getCollection("projects");
    const projectNotice =
        "The URL might directly lead to the project website or the repository.";

    return Promise.all(
        projects.map(async (project) => {
            const link = project.data.url;
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
