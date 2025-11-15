# Project Overview

This is a personal website and blog built with [Astro](https://astro.build/). It's designed to be simple, fast, and includes features like a Vim-style keyboard navigation, auto OS-theme detection, and smooth page transitions using the View Transitions API.

The project uses [Tailwind CSS](https://tailwindcss.com/) for styling and [React](https://react.dev/) as a UI framework integrated with Astro. Content is managed through Astro's content collections, with blog posts written in Markdown and project data in JSON files.

## Building and Running

To get started with this project, you'll need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start a local development server, typically at `http://localhost:4321`.

3.  **Build the project:**
    ```bash
    npm run build
    ```
    This will create a production-ready build of the website in the `dist/` directory.

4.  **Preview the build:**
    ```bash
    npm run preview
    ```
    This will start a local server to preview the production build.

## Development Conventions

### Content

*   **Blog Posts:** To add a new blog post, create a new Markdown file (`.md`) in the `src/content/blog/` directory. The file's frontmatter must include a `title` and a `date`.
*   **Projects:** To add a new project, create a new JSON file (`.json`) in the `src/content/projects/` directory. The JSON file should follow the schema defined in `src/content.config.ts`.
*   **Visions:** To add a new vision, create a new Markdown file (`.md`) in the `src/content/vision/` directory. The file's frontmatter must include a `title` and a `date`.

### Pages

To add a new static page, create a new `.astro` file in the `src/pages/` directory. For example, creating `src/pages/about.astro` will make it available at the `/about` URL. It's recommended to use the `src/layouts/base.astro` layout for a consistent look and feel.

### Styling

The project uses Tailwind CSS for styling. You can find the global styles in `src/styles/global.css`.

### Vim-style Keyboard Navigation

The `src/scripts/vim.ts` file implements a Vim-style keyboard navigation system. This script is initialized in `src/layouts/base.astro` and is available on all pages.
