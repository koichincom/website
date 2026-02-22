import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writing = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
    schema: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        published: z.date(),
        pinned: z
            .boolean()
            .optional()
            .describe(
                "Whether to pin this post to the top of the writing list page",
            ),
        updates: z
            .array(z.date())
            .default([])
            .describe("List of all update dates"),
        tags: z.array(z.string()).optional(),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: "**/*.toml", base: "./src/content/projects" }),
    schema: z.object({
        name: z.string(),
        description: z.string(),
        published: z
            .date()
            .describe(
                "Publication date of the entry (mainly for sorting, and not project launch date)",
            ),
        url: z.string().url(),
        type: z.enum(["tryOut", "experiment", "hardware"]),
        oss: z.boolean(),
        pinned: z
            .boolean()
            .optional()
            .describe(
                "Whether to pin this project to the top of the project list page",
            ),
        featured: z
            .boolean()
            .optional()
            .describe("Whether to feature this item on the home page"),
        tags: z.array(z.string()).optional(),
    }),
});

const siteInfo = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/site-info" }),
    schema: z.object({
        title: z.string(),
        effectiveDate: z
            .date()
            .describe("The effective date of this information"),
    }),
});

export const collections = { writing, projects, siteInfo };
