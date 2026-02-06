import type { APIContext } from "astro";

import { generateFeed } from "../../../utils/feed";

export async function GET(context: APIContext): Promise<Response> {
    const feed = await generateFeed(context, "project", "rss");

    return new Response(feed.rss2(), {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
        },
    });
}
