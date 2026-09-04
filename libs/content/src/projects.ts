export type Project = {
	slug: string;
	title: string;
	summary: string;
	status?: "shipped" | "in-progress";
	featured?: boolean;
	role: string;
	stack: string[];
	problem: string;
	approach: string;
	outcome: string;
	links?: Array<{ label: string; href: string }>;
};

export const projects: Project[] = [
	{
		slug: "trading-engine",
		title: "Trading Engine",
		summary:
			"A concurrency-minded trading engine that models real-world order flow — built to learn backend patterns the hard way.",
		status: "shipped",
		featured: true,
		role: "Solo engineer",
		stack: ["Go", "Concurrency", "REST"],
		problem:
			"I wanted a serious playground for concurrency, ordering guarantees, and API design — not another CRUD demo.",
		approach:
			"Modelled orders, books, and fills as explicit domain types. Kept matching logic synchronous and deterministic, then wrapped IO at the edges.",
		outcome: "A runnable engine with clear seams for matching, persistence, and transport.",
		links: [{ label: "GitHub", href: "https://github.com/Nevnet99" }],
	},
	{
		slug: "astro-portfolio",
		title: "Astro Portfolio",
		summary:
			"This site: an ultra-minimal Astro portfolio with a small design system and content libraries.",
		status: "shipped",
		featured: true,
		role: "Design + engineering",
		stack: ["Astro", "TypeScript", "Nx", "Design system"],
		problem:
			"Most portfolio templates either look generic or fight the content. I needed a quiet system that can grow without collapsing into cards and gradients.",
		approach:
			"Built a constrained design system first — tokens, type, primitives — then composed sparse pages from shared content.",
		outcome: "A deployable static site scaffolded for case studies, writing, and a CV.",
		links: [
			{ label: "Live site", href: "https://lukebrannagan.com" },
			{ label: "GitHub", href: "https://github.com/Nevnet99" },
		],
	},
	{
		slug: "next-project",
		title: "Next Project",
		summary: "Architecture in progress — scoping the next systems-shaped build.",
		status: "in-progress",
		featured: false,
		role: "Scoping",
		stack: ["TBD"],
		problem:
			"The next build should stretch platform thinking: ownership boundaries, documentation, and something production-adjacent.",
		approach:
			"Currently mapping constraints — audience, runtime, and what “done” means — before committing to a stack.",
		outcome: "In progress.",
	},
];

export function getFeaturedProjects() {
	return projects.filter((project) => project.featured);
}

export function getProject(slug: string) {
	return projects.find((project) => project.slug === slug);
}
