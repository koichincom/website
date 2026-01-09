import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const writing = await getCollection("writing");
  // Sort by date descending (newest first)
  writing.sort(
    (a, b) => Number(new Date(b.data.date)) - Number(new Date(a.data.date)),
  );

  return rss({
    title: "Koichi's Writing",
    description: "Latest posts from Koichi Nakayamada",
    site: context.site,
    items: writing.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
    })),
  });
}
