# Website

My personal website, designed to be minimal and fast. Visit [koichin.com](https://koichin.com).

- [**Astro**](https://astro.build/) as the core web framework
- [**View Transitions API**](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) for smooth page transitions
- **Auto OS-theme detection**
- **RSS feed + sitemap** for SEO and syndication
- **Giscus comments** with GitHub Discussions integration
- **Reading time estimates** for writing
- **Toastify-js toasts** for user feedback

## Content schemas

Astro generates JSON schemas for collections in `.astro/collections/` when you run `bun run build`.
This repo maps `src/content/projects/**/*.toml` to `.astro/collections/projects.schema.json` via `.taplo.toml` for TOML validation.
For writing frontmatter, use `.astro/collections/writing.schema.json` in your editor's frontmatter schema mapping.
