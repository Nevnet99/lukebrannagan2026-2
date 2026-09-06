import { getProject, type Project, projects } from "./projects";

export type SeriesCollection = "work" | "writing";

export type SeriesLayout = "list" | "bookshelf";

export type Series = {
	slug: string;
	title: string;
	summary: string;
	/** Longer hub overview; falls back to summary when omitted */
	body?: string[];
	collection: SeriesCollection;
	/** Ordered member slugs (work project slugs or writing post ids) */
	memberSlugs: string[];
	/** Show on the home Selected work list (as a series stack). */
	featured?: boolean;
	/** Hub presentation — bookshelf for book-reviews. */
	layout?: SeriesLayout;
};

export type WorkIndexEntry =
	| { type: "series"; series: Series }
	| { type: "item"; project: Project };

export const seriesList: Series[] = [
	{
		slug: "kroo",
		title: "Kroo",
		summary:
			"Three case studies from kroo.com: the design system, Sanity CMS, and the rebrand rebuild.",
		body: [
			"At Kroo I work on the public website. These three pieces cover the shared UI kit, editor publishing, and shipping brand and architecture together.",
		],
		collection: "work",
		featured: true,
		memberSlugs: ["kroo-design-system", "kroo-cms", "kroo-rebrand"],
	},
	{
		slug: "book-reviews",
		title: "Book reviews",
		summary: "Books on craft, systems, and adjacent reading — reviews as they land.",
		body: [
			"A shelf of books I’m reading or revisiting. Reviews show up here when they’re written; unfinished stubs stay out of the public site.",
		],
		collection: "writing",
		layout: "bookshelf",
		memberSlugs: [
			"hypermedia-systems",
			"high-performance-browser-networking",
			"functional-programming-in-scala",
			"philosophy-of-software-design",
			"staff-engineers-path",
			"coding-interview-patterns",
			"system-design-interview",
			"search-inside-yourself",
			"software-engineers-guidebook",
			"atomic-habits",
			"clojure-for-the-brave-and-true",
			"software-engineering-at-google",
			"ddia",
			"grokking-data-structures",
			"elixir-in-action",
			"little-elixir-and-otp-guidebook",
			"saas-playbook",
			"pragmatic-programmer",
			"you-dont-know-js-up-and-going",
			"the-one-thing",
		],
	},
];

export function getSeries(slug: string, collection?: SeriesCollection) {
	return seriesList.find(
		(entry) => entry.slug === slug && (collection == null || entry.collection === collection),
	);
}

export function getSeriesForCollection(collection: SeriesCollection) {
	return seriesList.filter((entry) => entry.collection === collection);
}

/** Work projects in series order. */
export function getWorkSeriesMembers(series: Series): Project[] {
	if (series.collection !== "work") return [];
	return series.memberSlugs
		.map((slug) => getProject(slug))
		.filter((project): project is Project => project != null);
}

export function getSeriesForProject(projectSlug: string) {
	return seriesList.find(
		(entry) => entry.collection === "work" && entry.memberSlugs.includes(projectSlug),
	);
}

export function getWorkSeriesSiblings(projectSlug: string) {
	const series = getSeriesForProject(projectSlug);
	if (!series) return null;

	const members = getWorkSeriesMembers(series);
	const index = members.findIndex((project) => project.slug === projectSlug);
	if (index < 0) return null;

	return {
		series,
		prev: index > 0 ? members[index - 1] : null,
		next: index < members.length - 1 ? members[index + 1] : null,
		index,
		total: members.length,
	};
}

/**
 * Selected work index: one entry per series (first occurrence), then
 * standalone projects that are not in any work series.
 */
export function listWorkIndexEntries(): WorkIndexEntry[] {
	const seenSeries = new Set<string>();
	const entries: WorkIndexEntry[] = [];

	for (const project of projects) {
		const belonging = getSeriesForProject(project.slug);
		if (belonging) {
			if (!seenSeries.has(belonging.slug)) {
				seenSeries.add(belonging.slug);
				entries.push({ type: "series", series: belonging });
			}
			continue;
		}
		entries.push({ type: "item", project });
	}

	return entries;
}

/**
 * Home Selected work: featured series stacks, then featured standalone projects
 * (members of a featured series are omitted so Kroo isn’t listed twice).
 */
export function listFeaturedWorkEntries(): WorkIndexEntry[] {
	const entries: WorkIndexEntry[] = [];
	const featuredSeriesSlugs = new Set<string>();

	for (const series of seriesList) {
		if (series.collection !== "work" || !series.featured) continue;
		featuredSeriesSlugs.add(series.slug);
		entries.push({ type: "series", series });
	}

	for (const project of projects) {
		if (!project.featured) continue;
		const belonging = getSeriesForProject(project.slug);
		if (belonging && featuredSeriesSlugs.has(belonging.slug)) continue;
		entries.push({ type: "item", project });
	}

	return entries;
}

export function seriesHref(series: Series) {
	return series.collection === "work"
		? `/work/series/${series.slug}`
		: `/writing/series/${series.slug}`;
}

export function seriesMemberCountLabel(
	count: number,
	collection: SeriesCollection,
	layout?: SeriesLayout,
) {
	if (layout === "bookshelf") {
		return count === 1 ? "1 book" : `${count} books`;
	}
	if (collection === "work") {
		return count === 1 ? "1 case study" : `${count} case studies`;
	}
	return count === 1 ? "1 post" : `${count} posts`;
}
