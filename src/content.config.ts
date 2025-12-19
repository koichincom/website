import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Blog collection schema
 * Markdown files in src/content/blog/
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().describe("Post title"),
    date: z.date().describe("Publication date"),
    update: z.date().nullable().optional().describe("Last update date"),
    tags: z.array(z.string()).optional().describe("Tags for categorization"),
  }),
});

/**
 * Projects collection schema
 * JSON files in src/content/projects/
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string().describe("Project name"),
    url: z.string().url().describe("Project URL or repository"),
    role: z
      .array(z.tuple([z.string(), z.string()]))
      .describe("Roles and periods: [[title, period], ...]"),
    description: z.string().describe("Project description"),
    achievements: z
      .array(z.string())
      .describe("Key achievements or highlights"),
    technologies: z.array(z.string()).describe("Technologies and tools used"),
    order: z.number().optional().describe("Display order"),
  }),
});

export const collections = { blog, projects };
