import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
    const blog = await getCollection('blog');
    return rss({
        title: "Koichi's Blog",
        description: 'Thoughts, experiences, and insights from Koichi',
        site: context.site,
        items: blog.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            description: post.data.title,
            link: `/blog/${post.id}/`,
        })),
    });
}
