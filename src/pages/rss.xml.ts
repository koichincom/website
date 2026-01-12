import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const writing = await getCollection("writing");
  writing.sort(
    (a, b) => Number(new Date(b.data.published)) - Number(new Date(a.data.published)),
  );

  return rss({
    title: "Koichi's Writing",
    description: "Latest posts from Koichi Nakayamada",
    site: context.site ?? "https://koichin.com",
    items: writing.map((post) => ({
      title: post.data.title,
      pubDate: post.data.published,
      link: `/writing/${post.id}/`,
    })),
  });
}
