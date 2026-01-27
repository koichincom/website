# Todo

- [x] Make original Iosevka font for this website
    - Made an issue to the custom build temprate repo, and when it's accepted, I will make a PR that allow the user to leave the build to the relase or another branch so the build could be distributed like CDN, very easily. Until then, I will use font source's CDN.
- [x] RSS and Atom feed integration
    - https://gsong.dev/articles/astro-feed-unified/
    - https://jenxi.com/atom-feed-for-astro
- [x] Two site maps are generated
- [ ] Content structure and display refactoring: What to display on the home, writing, and project pages
- [ ] Design decisions, where to put what
- [ ] Add Japanese language support

Writing: Title min date
Projects: Title description date

- `name` — string — Project name
- `primaryUrl` — string (url) — Main project destination
- `published` — date — Publication/start date for sorting
- `urls` — array of { `label`: string, `url`: string (url) } (optional) — Additional links (repo, demo, docs)
- `roles` — string[] (optional) — Current roles
- `description` — string — Project description
- `tags` — string[] (optional) — Tech stack and domain tags
- `image` — string (optional) — Project image path
