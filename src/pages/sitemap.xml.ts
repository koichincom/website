import { getCollection } from 'astro:content';

export async function GET(context: any) {
    const blog = await getCollection('blog');
    const projects = await getCollection('projects');

    const staticPages = [
        { url: '', changefreq: 'weekly', priority: 1.0, lastmod: undefined },
        { url: 'blog', changefreq: 'weekly', priority: 0.8, lastmod: undefined },
        { url: 'proj', changefreq: 'monthly', priority: 0.8, lastmod: undefined },
        { url: 'club', changefreq: 'monthly', priority: 0.7, lastmod: undefined },
        { url: 'me', changefreq: 'monthly', priority: 0.7, lastmod: undefined },
    ];

    const blogPages = blog.map((post) => ({
        url: `blog/${post.id}`,
        lastmod: post.data.date,
        changefreq: 'never',
        priority: 0.7,
    }));

    const projectPages = projects.map((project) => ({
        url: `proj`,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: undefined,
    }));

    const allPages = [...staticPages, ...blogPages, ...projectPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
            .map(
                (page) => `
  <url>
    <loc>${context.site}${page.url}</loc>
${page.lastmod ? `    <lastmod>${new Date(page.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
            )
            .join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
