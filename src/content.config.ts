import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writing = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
    schema: z.object({
        title: z.string().describe("The title of the writing piece"),
        published: z.date().describe("Publication date"),
        pinned: z.boolean().optional().describe("Pin this item to the top"),
        updates: z
            .array(z.date())
            .default([])
            .describe("List of all update dates"),
        lastUpdated: z.date().optional().describe("Last updated date"),
        tags: z
            .array(z.string())
            .optional()
            .describe("Tags for categorization"),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: "**/*.toml", base: "./src/content/projects" }),
    schema: z.object({
        name: z.string(),
        description: z.string().describe("A brief description of the project"),
        published: z
            .date()
            .describe(
                "Publication date of the TOML entry (mainly for sorting)",
            ),
        mainUrl: z.string().url().describe("The primary URL of the project"),
        research: z
            .boolean()
            .default(false)
            .describe("Whether this project is research-oriented"),
        pinned: z.boolean().optional().describe("Pin this item to the top"),
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
