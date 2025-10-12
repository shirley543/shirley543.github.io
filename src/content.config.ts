import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';


/**
 * Retrieve all Markdown files from content directory,
 * to form content collections
 */

const about = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/about" }),
  schema:  z.object({
    name: z.string(),
    role: z.string(),
  })
});

const experience = defineCollection({
  loader: glob({ pattern: "**/*.(md)", base: "./src/data/experience" }),
  schema:  z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    location: z.string(),
    tech: z.array(z.string()),
    links: z.array(z.object({
      text: z.string(),
      url: z.string(),
    })),
  })
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.(md)", base: "./src/data/projects" }),
  schema:  z.object({
    project: z.string(),
    tech: z.array(z.string()),
    links: z.array(z.object({
      text: z.string(),
      url: z.string(),
    })),
  })
});

export const collections = { about, experience, projects };
