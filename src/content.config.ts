import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Types for start and end date
 */

/**
 * Year-Month date: must be in YYYY-MM format.
 * Example: "2025-08" = Date(2025, 7, 1)
 */
const YearMonthDate = z.preprocess((val) => {
  if (typeof val === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(val.trim())) {
    // Convert to full date string (so z.coerce.date can parse it)
    return `${val.trim()}-01`;
  }
  return val;
}, z.coerce.date().refine(
  (date) => !isNaN(date.getTime()),
  { message: "Must be a valid YYYY-MM" }
));

/**
 * Year-Month or Present date: can be YYYY-MM or "Present".
 * Example: "2025-08" = Date(2025, 7, 1)
 *           "Present" = "Present"
 */
const YearMonthPresentDate = z.preprocess((val) => {
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.toLowerCase() === "present") return "Present";
    if (/^\d{4}-(0[1-9]|1[0-2])$/.test(trimmed)) return `${trimmed}-01`;
  }
  return val;
}, z.union([z.literal("Present"), z.coerce.date()]));

export const StartDate = YearMonthDate;
export const EndDate = YearMonthPresentDate;

/**
 * Retrieve all Markdown files from content directory,
 * to form content collections
 */

const about = defineCollection({
  loader: glob({ pattern: "**/*.(md)", base: "./src/content/about" }),
  schema:  z.object({
    name: z.string(),
    role: z.string(),
  })
});

const experience = defineCollection({
  loader: glob({ pattern: "**/*.(md)", base: "./src/content/experience" }),
  schema:  z.object({
    company: z.string(),
    role: z.string(),
    startDate: StartDate,
    endDate: EndDate,
    location: z.string(),
    tech: z.array(z.string()),
    links: z.array(z.object({
      text: z.string(),
      url: z.string(),
    })),
  })
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.(md)", base: "./src/content/projects" }),
  schema:  z.object({
    project: z.string(),
    order: z.number(),
    tech: z.array(z.string()),
    links: z.array(z.object({
      text: z.string(),
      url: z.string(),
    })),
  })
});

export const collections = { about, experience, projects };
