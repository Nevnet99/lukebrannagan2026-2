export {
	type Experience,
	type ExperienceRole,
	experience,
	featuredExperience,
} from "./experience";
export { amazonProductUrl, bookCoverSrc } from "./lib/amazon";
export { fuzzyMatch, fuzzyScore } from "./lib/fuzzy";
export {
	countWords,
	readingMinutes,
	readingTimeLabel,
} from "./lib/reading-time";
export {
	type RelatedWritingInput,
	type RelatedWritingResult,
	relatedWritingPosts,
} from "./lib/related-writing";
export { formatTenure } from "./lib/tenure";
export { isWritingPubliclyLinked } from "./lib/writing-visibility";
export {
	getFeaturedProjects,
	getProject,
	type Project,
	type ProjectMetric,
	projects,
} from "./projects";
export {
	getSeries,
	getSeriesForCollection,
	getSeriesForProject,
	getWorkSeriesMembers,
	getWorkSeriesSiblings,
	listFeaturedWorkEntries,
	listWorkIndexEntries,
	type Series,
	type SeriesCollection,
	type SeriesLayout,
	seriesHref,
	seriesList,
	seriesMemberCountLabel,
	type WorkIndexEntry,
} from "./series";
export { site } from "./site";
export {
	isWritingTopicId,
	sortWritingTopicIds,
	type WritingTopicId,
	writingTopicLabel,
	writingTopics,
} from "./writing-topics";
