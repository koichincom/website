# Todo

## Priorities

### Now

- [ ] Feed and List CTA button at the end of the writing/project page/list
- [ ] Home: hero and overall page design

### P0

- [ ] Mobile responsive design

### P1

### P2

- [ ] Add Japanese support
- [ ] Overall design: CSS adjastments and color palette
- [ ] SEO improvements by checking the docs/SEO.md

## Done

- [x] view-transition: persist might be avoided for header to not ship JavaScript, and implement the same with SSR
- [x] Fully improve the AGENTS.md (remove the ones added by the template agent stuff and more personalize it)
- [x] Make original Iosevka font for this website
    - Made an issue to the custom build temprate repo, and when it's accepted, I will make a PR that allow the user to leave the build to the relase or another branch so the build could be distributed like CDN, very easily. Until then, I will use font source's CDN.
- [x] RSS and Atom feed integration
    - https://gsong.dev/articles/astro-feed-unified/
    - https://jenxi.com/atom-feed-for-astro
- [x] Two site maps are generated
- [x] List clicked article's divider hidden problem
- [x] Font flash prevention and learning about font loading display settings (swap, optional, etc)
- [x] Content structure and display refactoring: What to display on the home, writing, and project pages
- [x] Content improvements and completion
    - [x] Project posts
    - [x] Writing posts
- [x] Footer
    - [x] Rethink the purpose and make it more like a site map if needed
    - [x] Is privacy policy and copyright needed?
    - [x] Sitemap, license, legal, social media, contact
- [x] Site info pages using MDX
    - [x] Legal page
    - [x] License page
    - [x] Cookie Policy page
    - [x] Review the made three pages
- [x] Header
    - [x] Reading progress bar at the top
    - [x] Dynamic header href link (disable the link where the user is currently at)
    - [x] Dupulicated name in the home page; do I need to hide it when in the home page?: Yes but in the future when finalizing the home page design and text
- [x] Post page/Legal page
    - [x] Footnotes for writing articles: done by Astro's markdown built-in
    - [x] Why the theme setting on the code block affect and make it monochrome: The dual theme is expected in that case, and it just doesn't fit and override with something. I don't need to think about the detail.
    - [x] How does the CSS controlling work?: Shiki for codeblock is from Astro-side, and Tailwind Prose is controlling the rest. Shiki somehow has precedence.
    - [x] The font related variables from Shiki is defined by what?: Seemingly from theme, and I don't think i need to know
    - [x] Use the same font color for the post/legal page: overwridden the prose by tailwind
    - [x] How big the font size are in prose default?: It's 16px, so same as the text-base
    - [x] How can I make the font size for codeblocks bigger?: It's done by Tailwind prose control, since the default prose was applied, I learnd about the combination of `<pre>` and `<code>`
    - [x] Metadata design improvements
- [x] Refactor the layouts/ and related files to clean up the structure
- [x] Make a centralized date formatting utility
- [x] Clean up the content.config.ts: removing unnecessary element for making it easy to update in the future
- [x] Remove unused tooltip script
- [x] Align writing last updated metadata between site and feed (updates array vs lastUpdated)
- [x] Create /feed page with RSS and Atom links and update the footer link; make three feeds for each RSS and Atom
- [x] Verify social meta tag naming (x or twitter)
- [x] Remove the toast library and toast related code
- [x] Site info pages meta data: Add contact info to the top and turn the domain to a href link
- [x] Find a way to apply the NewTabLink component for content/ files: found
- [x] HTML and CSS strucuture cleaning and refactoring
- [x] Title prop in BaseLayout: Remove and replace with a component for each page for flexility
- [x] Header link activation logic bug: removing the trailing slash by regex
- [x] Set the astro trailing slash never
- [x] Header: indicate the current page with a pill: View Transition and CSR were used
- [x] Project page: hardware section explanation: h2 boundary design decision is needed
- [x] Render age in client side
- [x] Abandon the home exception for the header link activation, and have consistent mental model for the header links
- [x] Adjust to the px-3 that the header pill has (text that touches the side should have px-3, but any bg button should have 0 padding x to match the header pill design, the divider should also have 0 padding x)
- [x] URL styling default
- [x] Header pill hitbox adjustment
- [x] Header highlight continuity logic for the better View Transition experience
- [x] Fix Shiki and Prose syntax highlighting conflict
- [x] Copy, language, and filename (optional) feature for codeblocks functionality
- [x] NewTabLink & CopyLink component: non-copiable, line wrapping, and SVG as needed
- [x] Include all content in feed?: Yes, keep it
- [x] Link design for header, main and footer
- [x] Link design and refactor for prose
- [x] Prose tailwind refactor, commenting, and cleaning
- [x] Table of content scrolls to the right position with smooth scroll
- [x] Scrollable table of content
