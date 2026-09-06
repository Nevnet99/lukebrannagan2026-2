import { defineCollection, z } from "astro:content";
import { writingTopics } from "@lukebrannagan/content";
import { glob } from "astro/loaders";

const topicIds = writingTopics.map((topic) => topic.id) as [
	(typeof writingTopics)[number]["id"],
	...(typeof writingTopics)[number]["id"][],
];

const writing = defineCollection({
	loader: glob({ base: "./src/content/writing", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		/** One primary topic from the canonical set — keeps filters scannable. */
		tags: z.array(z.enum(topicIds)).min(1).max(2),
		/** Optional series slug (e.g. book-reviews). */
		series: z.string().optional(),
		/** Book reviews — author of the book being reviewed. */
		bookAuthor: z.string().optional(),
		/** Book reviews — ISBN-13 (or 10) for covers + Amazon. */
		isbn: z.string().optional(),
		/** Book reviews — Amazon ASIN when it differs from ISBN-10. */
		amazonAsin: z.string().optional(),
		/** Book reviews — local or remote cover image URL. */
		cover: z.string().optional(),
		/** Book reviews — optional back cover image. */
		coverBack: z.string().optional(),
		/** Book reviews — optional spine image. */
		spine: z.string().optional(),
		/** Book reviews — rating out of 5. */
		rating: z.number().int().min(1).max(5).optional(),
		/** Book reviews — placeholder until the write-up ships. */
		reviewStatus: z.enum(["to-be-reviewed", "published"]).optional(),
		source: z.string().url().optional(),
		/**
		 * When false, omitted from writing index, home, and RSS.
		 * Series hubs can still list the post (e.g. bookshelf placeholders).
		 */
		listed: z.boolean().default(true),
		/** Hidden from Writing index, home, and RSS unless the reader opts in. */
		archived: z.boolean().default(false),
	}),
});

export const collections = { writing };
