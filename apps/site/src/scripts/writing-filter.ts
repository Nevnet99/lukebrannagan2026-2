import { fuzzyMatch, writingTopicLabel } from "@lukebrannagan/content";
import { clampPage, PAGE_SIZE, pageCount, paginationEnabled } from "../lib/pagination";

type WritingItem = {
	el: HTMLElement;
	kind: "series" | "post";
	title: string;
	description: string;
	/** Tags always available (active posts / non-archived series members). */
	tags: string[];
	/** Series only: tags from archived members, merged when showArchived. */
	archivedTags: string[];
	series: string;
	listed: boolean;
	haystack: string;
	publishedAt: number;
	archived: boolean;
};

function parseTagList(value: string | undefined): string[] {
	return (value ?? "")
		.split(",")
		.map((tag) => tag.trim().toLowerCase())
		.filter(Boolean);
}

function readParams() {
	const params = new URLSearchParams(window.location.search);
	const q = params.get("q") ?? "";
	const tags = [...params.getAll("topic"), ...params.getAll("tag")].filter(Boolean);
	const series = params.getAll("series").filter(Boolean);
	const showArchived = params.get("archived") === "1" || params.get("archived") === "true";
	const page = Number(params.get("page") ?? "1");
	return { q, tags, series, showArchived, page };
}

function writeParams(
	q: string,
	tags: string[],
	series: string[],
	showArchived: boolean,
	page: number,
) {
	const params = new URLSearchParams();
	const trimmed = q.trim();
	if (trimmed) params.set("q", trimmed);
	for (const tag of tags) params.append("topic", tag);
	for (const slug of series) params.append("series", slug);
	if (showArchived) params.set("archived", "1");
	if (page > 1) params.set("page", String(page));
	const next = params.toString();
	const url = next ? `${window.location.pathname}?${next}` : window.location.pathname;
	window.history.replaceState({}, "", url);
}

function pluralize(count: number, singular: string, plural: string) {
	return count === 1 ? singular : plural;
}

function formatTopics(topics: string[]): string {
	return topics.map((topic) => writingTopicLabel(topic)).join(", ");
}

function emptyMessage(q: string, tags: string[], series: string[], showArchived: boolean): string {
	const query = q.trim();
	const topicLabel = formatTopics(tags);
	if (query && tags.length > 0) {
		return `No results for “${query}” in ${topicLabel}.`;
	}
	if (query) {
		return `No results for “${query}”.`;
	}
	if (tags.length > 0) {
		return `No posts in ${topicLabel}.`;
	}
	if (series.length > 0) {
		return "No series match these filters.";
	}
	if (!showArchived) {
		return "No posts match these filters. Try showing archived posts.";
	}
	return "No posts match these filters.";
}

function formatStatus(opts: {
	visiblePosts: number;
	visible: number;
	pool: number;
	seriesCount: number;
	filtering: boolean;
}): string {
	if (!opts.filtering) {
		const parts = [
			opts.seriesCount > 0 ? `${opts.seriesCount} series` : null,
			`${opts.visiblePosts} ${pluralize(opts.visiblePosts, "post", "posts")}`,
		].filter(Boolean);
		return parts.join(" · ");
	}
	return `${opts.visible} of ${opts.pool} ${pluralize(opts.pool, "result", "results")}`;
}

export function initWritingFilter(root: ParentNode = document) {
	const form = root.querySelector<HTMLFormElement>("[data-writing-filters]");
	const list = root.querySelector<HTMLElement>("[data-writing-list]");
	const empty = root.querySelector<HTMLElement>("[data-writing-empty]");
	const status = root.querySelector<HTMLElement>("[data-writing-status]");
	const clearButtons = [...root.querySelectorAll<HTMLButtonElement>("[data-writing-clear]")];
	const search = root.querySelector<HTMLInputElement>("[data-writing-search]");
	const archivedToggle = root.querySelector<HTMLElement & { checked: boolean }>(
		"[data-writing-archived]",
	);
	const pagination = root.querySelector<HTMLElement>("[data-pagination]");
	const pageStatus = pagination?.querySelector<HTMLElement>("[data-pagination-status]");
	const prevButton = pagination?.querySelector<HTMLButtonElement>("[data-pagination-prev]");
	const nextButton = pagination?.querySelector<HTMLButtonElement>("[data-pagination-next]");

	if (!form || !list || !empty || !status || !search || clearButtons.length === 0) {
		return;
	}

	const seriesCount = Number(status.dataset.seriesCount ?? "0");

	const items: WritingItem[] = [...list.querySelectorAll<HTMLElement>("[data-writing-item]")].map(
		(el) => {
			const title = el.dataset.title ?? "";
			const description = el.dataset.description ?? "";
			const tags = parseTagList(el.dataset.tags);
			const archivedTags = parseTagList(el.dataset.archivedTags);
			const series = (el.dataset.series ?? "").trim();
			const listed = el.dataset.listed !== "false";
			const publishedAt = Date.parse(el.dataset.pubDate ?? "") || 0;
			const archived = el.dataset.archived === "true";
			const kind = el.dataset.writingKind === "series" ? "series" : "post";
			return {
				el,
				kind,
				title,
				description,
				tags,
				archivedTags,
				series,
				listed,
				publishedAt,
				archived,
				haystack: [
					title,
					description,
					tags.join(" "),
					archivedTags.join(" "),
					el.dataset.body ?? "",
				].join("\n"),
			};
		},
	);

	const tagButtons = [...form.querySelectorAll<HTMLButtonElement>("[data-writing-tag]")];
	const topicsFieldset = form.querySelector<HTMLElement>("[data-writing-topics]");
	const seriesButtons = [...form.querySelectorAll<HTMLButtonElement>("[data-writing-series]")];

	let query = "";
	let selected = new Set<string>();
	let selectedSeries = new Set<string>();
	let showArchived = false;
	let page = 1;

	const inPool = (item: WritingItem) => {
		if (item.kind === "series") return true;
		if (!showArchived && item.archived) return false;
		return item.listed;
	};

	const effectiveTags = (item: WritingItem) => {
		if (showArchived && item.archivedTags.length > 0) {
			return [...new Set([...item.tags, ...item.archivedTags])];
		}
		return item.tags;
	};

	const syncTopicButtons = () => {
		const available = new Set(items.filter(inPool).flatMap((item) => effectiveTags(item)));
		let anyVisible = false;
		for (const button of tagButtons) {
			const tag = button.dataset.writingTag ?? "";
			const visible = available.has(tag);
			button.hidden = !visible;
			if (visible) anyVisible = true;
			if (!visible && selected.has(tag)) {
				selected.delete(tag);
				button.setAttribute("aria-pressed", "false");
			}
		}
		if (topicsFieldset) {
			topicsFieldset.hidden = !anyVisible;
		}
	};

	const applyFromUrl = () => {
		const { q, tags, series, showArchived: archived, page: urlPage } = readParams();
		query = q;
		selected = new Set(tags.map((tag) => tag.toLowerCase()));
		selectedSeries = new Set(series);
		showArchived = archived;
		page = urlPage;
		search.value = q;
		for (const button of tagButtons) {
			const tag = button.dataset.writingTag ?? "";
			button.setAttribute("aria-pressed", selected.has(tag) ? "true" : "false");
		}
		for (const button of seriesButtons) {
			const slug = button.dataset.writingSeries ?? "";
			button.setAttribute("aria-pressed", selectedSeries.has(slug) ? "true" : "false");
		}
		if (archivedToggle) {
			archivedToggle.checked = showArchived;
		}
	};

	const render = (opts: { resetPage?: boolean } = {}) => {
		if (opts.resetPage) page = 1;

		syncTopicButtons();

		const ranked = items
			.map((item) => {
				if (!inPool(item)) return null;
				if (selectedSeries.size > 0) {
					if (!item.series || !selectedSeries.has(item.series)) return null;
				}
				const tags = effectiveTags(item);
				if (selected.size > 0) {
					const hit = tags.some((tag) => selected.has(tag));
					if (!hit) return null;
				}
				const score = fuzzyMatch(query, [
					item.title,
					item.description,
					tags.join(" "),
					item.haystack,
				]);
				if (score == null) return null;
				return { item, score };
			})
			.filter((row): row is { item: WritingItem; score: number } => row != null)
			.sort((a, b) => {
				const searching = query.trim().length > 0;
				if (searching && b.score !== a.score) return b.score - a.score;
				if (b.item.publishedAt !== a.item.publishedAt) {
					return b.item.publishedAt - a.item.publishedAt;
				}
				return a.item.title.localeCompare(b.item.title);
			});

		const visible = ranked.length;
		const enabled = paginationEnabled(visible);
		const totalPages = pageCount(visible);
		page = clampPage(page, totalPages);
		const start = (page - 1) * PAGE_SIZE;
		const pageRows = enabled ? ranked.slice(start, start + PAGE_SIZE) : ranked;

		for (const item of items) {
			item.el.hidden = true;
		}

		for (const { item } of pageRows) {
			item.el.hidden = false;
			list.append(item.el);
		}

		const pool = items.filter(inPool).length;
		const filtering = query.trim().length > 0 || selected.size > 0 || selectedSeries.size > 0;

		empty.hidden = visible > 0;
		if (visible === 0) {
			const label = empty.querySelector("[data-writing-empty-label]");
			if (label) {
				label.textContent = emptyMessage(query, [...selected], [...selectedSeries], showArchived);
			}
		}

		for (const button of clearButtons) {
			const isRailClear = button.classList.contains("filters__clear");
			if (isRailClear) {
				button.disabled = !filtering;
				button.setAttribute("aria-hidden", filtering ? "false" : "true");
			} else {
				button.hidden = !filtering;
			}
		}

		status.textContent = formatStatus({
			visiblePosts: ranked.filter((row) => row.item.kind === "post").length,
			visible,
			pool,
			seriesCount,
			filtering,
		});

		if (pageStatus) {
			pageStatus.textContent = `Page ${page} of ${totalPages}`;
		}
		if (prevButton) {
			prevButton.disabled = !(enabled && page > 1);
		}
		if (nextButton) {
			nextButton.disabled = !(enabled && page < totalPages);
		}
		if (pagination) {
			pagination.hidden = visible === 0;
		}

		writeParams(query, [...selected], [...selectedSeries], showArchived, page);
	};

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		render({ resetPage: true });
	});

	search.addEventListener("input", () => {
		query = search.value;
		render({ resetPage: true });
	});

	for (const button of tagButtons) {
		button.addEventListener("click", () => {
			const tag = button.dataset.writingTag ?? "";
			if (!tag) return;
			if (selected.has(tag)) selected.delete(tag);
			else selected.add(tag);
			button.setAttribute("aria-pressed", selected.has(tag) ? "true" : "false");
			render({ resetPage: true });
		});
	}

	for (const button of seriesButtons) {
		button.addEventListener("click", () => {
			const slug = button.dataset.writingSeries ?? "";
			if (!slug) return;
			if (selectedSeries.has(slug)) selectedSeries.delete(slug);
			else selectedSeries.add(slug);
			button.setAttribute("aria-pressed", selectedSeries.has(slug) ? "true" : "false");
			render({ resetPage: true });
		});
	}

	if (archivedToggle) {
		archivedToggle.addEventListener("change", () => {
			showArchived = archivedToggle.checked;
			render({ resetPage: true });
		});
	}

	const clearAll = () => {
		query = "";
		selected.clear();
		selectedSeries.clear();
		search.value = "";
		for (const button of tagButtons) {
			button.setAttribute("aria-pressed", "false");
		}
		for (const button of seriesButtons) {
			button.setAttribute("aria-pressed", "false");
		}
		render({ resetPage: true });
		search.focus();
	};

	for (const button of clearButtons) {
		button.addEventListener("click", clearAll);
	}

	prevButton?.addEventListener("click", () => {
		if (prevButton.disabled) return;
		page -= 1;
		render();
		list.focus({ preventScroll: true });
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
	});

	nextButton?.addEventListener("click", () => {
		if (nextButton.disabled) return;
		page += 1;
		render();
		list.focus({ preventScroll: true });
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
	});

	applyFromUrl();
	render();
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => initWritingFilter(), {
			once: true,
		});
	} else {
		initWritingFilter();
	}
}
