import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writing = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
    schema: z.object({
        title: z.string().describe("Post title"),
        published: z.date().describe("Initial publication date"),
        updates: z
            .array(z.date())
            .default([])
            .describe("List of all update dates"),
        updated: z.date().optional().describe("Last updated date"),
        tags: z
            .array(z.string())
            .optional()
            .describe("Tags for categorization"),
        image: z
            .string()
            .optional()
            .describe("Optional image path for the post"),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: "**/*.toml", base: "./src/content/projects" }),
    schema: z.object({
        name: z.string().describe("Project name"),
        primaryUrl: z.string().url().describe("Main project destination"),
        published: z.date().describe("Publication/start date for sorting"),
        urls: z
            .array(
                z.object({
                    label: z.string(),
                    url: z.string().url(),
                }),
            )
            .optional()
            .describe("Additional links (repo, demo, docs)"),
        roles: z.array(z.string()).optional().describe("Current roles"),
        description: z.string().describe("Project description"),
        tags: z
            .array(z.string())
            .optional()
            .describe("Tech stack and domain tags"),
        image: z.string().optional().describe("Project image path"),
    }),
});

export const collections = { writing, projects };
