export type ProjectMetric = {
	label: string;
	value: string;
};

export type Project = {
	slug: string;
	title: string;
	summary: string;
	status?: "shipped" | "in-progress";
	featured?: boolean;
	/** Series slug when this project belongs to a work series */
	series?: string;
	role: string;
	stack: string[];
	/** Optional framing before the problem */
	context?: string[];
	problem: string[];
	approach: string[];
	/** Concrete choices a lead can skim */
	decisions?: string[];
	metrics?: ProjectMetric[];
	outcome: string[];
	/** Shipped-adjacent roadmap; keep brief */
	next?: string[];
	links?: Array<{ label: string; href: string }>;
};

export const projects: Project[] = [
	{
		slug: "kroo-design-system",
		title: "Kroo design system",
		summary:
			"Design system for kroo.com as an npm package: tokens, primitives, Storybook, and accessibility built into the components product engineers reuse.",
		status: "shipped",
		featured: true,
		series: "kroo",
		role: "Senior Web Platform Developer",
		stack: ["React", "Vite", "Storybook", "TypeScript"],
		context: [
			"At Kroo I work on the public website, kroo.com. The site had moved off WordPress into Next.js with no shared UI kit, so every feature reinvented layout and a11y.",
		],
		problem: [
			"Without a design system, screens drifted. Accessibility was solved per page or skipped. Product engineers rebuilt the same controls instead of composing from a shared set.",
		],
		approach: [
			"Built the design system as an npm package on React and Vite: tokens, primitive components, and Storybook.",
			"Put accessibility in the primitives so correct behaviour ships with the component instead of getting re-solved on every screen.",
		],
		decisions: [
			"Ship a shared package with Storybook before chasing multi-app adoption.",
			"Put accessibility in primitives so product engineers do not reinvent it on every page.",
		],
		metrics: [
			{ label: "Delivery", value: "Tokens, primitives, and Storybook as one npm package" },
			{ label: "A11y", value: "Correct behaviour inherited from primitives" },
		],
		outcome: [
			"The website builds from the shared package. New UI starts from primitives and Storybook instead of a blank file.",
		],
		links: [{ label: "Open kroo.com", href: "https://www.kroo.com" }],
	},
	{
		slug: "kroo-cms",
		title: "Kroo CMS",
		summary:
			"Sanity on kroo.com so marketing and design create pages and posts, preview changes, and publish without a pull request.",
		status: "shipped",
		featured: true,
		series: "kroo",
		role: "Senior Web Platform Developer",
		stack: ["Sanity", "Next.js", "React"],
		context: [
			"At Kroo I work on the public website, kroo.com. Before Sanity, every content change still needed an engineer.",
		],
		problem: [
			"There was no CMS. Marketing and design could not ship copy or layout without engineering. Website work and content tickets fought for the same time.",
		],
		approach: [
			"Integrated Sanity so marketing and design own layout and copy. They can create pages and blog posts, preview changes, and publish without a pull request.",
			"Interactive pieces that still need engineering stay in code. A dense HTML/JS iPhone shell was replaced with an image where the markup cost was not worth the fidelity.",
		],
		decisions: [
			"Give editors full page and blog control in Sanity; keep high-cost interactive components in code.",
			"Replace the HTML/JS device shell with an image where the markup cost was not worth the fidelity.",
		],
		metrics: [
			{
				label: "Content",
				value: "Publish in Sanity with preview; no engineer for routine changes",
			},
		],
		outcome: [
			"Routine content is a Sanity publish. Engineering time goes to the site itself instead of copy tickets.",
		],
		links: [{ label: "Open kroo.com", href: "https://www.kroo.com" }],
	},
	{
		slug: "kroo-rebrand",
		title: "Kroo rebrand",
		summary:
			"Rebuilt kroo.com for a rebrand: brand and architecture in one release, fewer components, less code, better core metrics.",
		status: "shipped",
		featured: false,
		series: "kroo",
		role: "Senior Web Platform Developer",
		stack: ["Next.js", "React", "TypeScript"],
		context: [
			"At Kroo I work on the public website, kroo.com. The rebrand needed a new look and a cleaner front-end at the same time.",
		],
		problem: [
			"The existing UI was heavy: too many components, dead code, and dependencies that hurt performance. A long dual-brand period would have meant maintaining two sites.",
		],
		approach: [
			"Shipped brand and architecture together. Component count went from 100+ down to about 25. I cut about 28k lines of code and shipped the same page count.",
			"Cutting dependencies and dead UI dropped core performance metrics by about 20% and shrank the bundle. The rebuild took roughly three weeks of focused delivery.",
		],
		decisions: [
			"Ship brand and architecture in one release rather than a long dual-brand migration.",
		],
		metrics: [
			{ label: "Components", value: "100+ → ~25 in the rebuild" },
			{ label: "Code deleted", value: "~28k lines; same pages shipped" },
			{ label: "Core metrics", value: "~20% better after cutting deps and dead UI" },
			{ label: "Rebuild", value: "~3 weeks to rebrand and ship" },
		],
		outcome: [
			"The rebranded site shipped thinner: fewer components, less code, better core metrics, same pages.",
		],
		links: [{ label: "Open kroo.com", href: "https://www.kroo.com" }],
	},
	{
		slug: "primer",
		title: "Primer observability",
		summary:
			"Moved Primer’s customer observability dashboards from a single static build toward config and API-driven UI, grew GOAT, and cut wasteful API calls that were roughly tripling request volume.",
		status: "shipped",
		featured: true,
		role: "Frontend Engineer",
		stack: ["Next.js", "React", "Vite"],
		context: [
			"Primer’s observability product gives customers dashboards over payment and platform signals, including custom dashboards. I joined the frontend work on that surface and on GOAT, the shared design system product teams used to ship UI faster.",
		],
		problem: [
			"The early direction was a single hard-coded dashboard. That would have blocked custom dashboards and forced engineering for every layout or content change customers needed.",
			"Fetching was wrong under the Rules of Hooks: hooks stacked work across re-renders, so each dashboard fired roughly three times the API calls it needed. Product engineers were still rebuilding common UI instead of composing from GOAT.",
		],
		approach: [
			"Pushed a data-driven model (config and API-driven dashboards) so the same platform could grow into custom dashboards instead of one static screen.",
			"Reworked data fetching so hooks were not re-invoked through avoidable re-renders. Request volume dropped to the correct number of calls per dashboard.",
			"Grew GOAT so product engineers could compose shared components instead of rebuilding the same primitives on every surface.",
		],
		decisions: [
			"Choose config and API-driven dashboards over a one-off static dashboard so custom dashboards stay possible.",
			"Fix fetch lifetime and hook usage before adding more dashboard features on top of tripled traffic.",
			"Invest in GOAT so delivery speed comes from reuse, not duplicate components.",
		],
		metrics: [
			{ label: "API calls", value: "~3× too many → correct volume per dashboard" },
			{ label: "Observability cost", value: "About 3–4× lower API cost after the fetch fix" },
			{ label: "Delivery", value: "Frontend delivery with GOAT roughly twice as fast" },
		],
		outcome: [
			"Dashboards could expand toward custom, customer-facing views without rebuilding the product for every layout. API traffic matched real need, cost dropped, and GOAT removed repeated UI work for other product engineers.",
		],
		links: [
			{
				label: "Read observability dashboards docs",
				href: "https://primer.io/docs/observability/dashboards/overview",
			},
			{
				label: "Read custom dashboards docs",
				href: "https://primer.io/docs/observability/custom-dashboards/overview",
			},
		],
	},
	{
		slug: "astro-portfolio",
		title: "This site",
		summary:
			"lukebrannagan.com rebuilt as Astro + Nx: Lit design system, shared content library, filterable writing, and case studies written the way I write about Kroo and Primer.",
		status: "shipped",
		featured: false,
		role: "Design and engineering",
		stack: ["Astro", "TypeScript", "Nx", "Lit", "Bun", "Storybook"],
		context: [
			"This is lukebrannagan.com. Selected work and writing. Older portfolio versions either fought the writing or looked like a template with different copy pasted in.",
			"The repo is Bun + Nx. `apps/site` is Astro 6. `libs/design-system` holds tokens and Lit primitives. `libs/content` holds typed copy, projects, experience, and helpers covered by Vitest.",
		],
		problem: [
			"Most portfolio templates bury posts under cards and gradients. I needed type, space, and one accent to carry the page.",
			"Content was split: markdown for writing, loose objects for work, no shared helpers for tenure, reading time, or topic labels. Filters and SEO came late when they came at all.",
			"At Kroo I put a11y in primitives. The personal site had to do the same: real buttons and links, focus-visible, skip links, reduced motion. No control that looks like a link when it is not one.",
		],
		approach: [
			"Tokens first (Mist neutrals, Tide accent, spacing aliases for label through page), then Lit elements: container, stack, text, link, rule, theme toggle, skip links. Pages compose those. Storybook covers the design system and the site shell.",
			"Site copy, projects, experience, and writing-topic helpers live in `@lukebrannagan/content` so Astro pages stay thin. Writing is an Astro content collection with an `archived` flag. The writing index filters by search, topic, and archived state via URL params, and announces result counts in a polite live region.",
			"Case studies follow one outline: context, problem, approach, decisions, metrics, outcome. Work and writing detail pages share a sticky on-this-page TOC.",
			"Static site basics shipped with the build: sitemap, robots.txt, RSS, Open Graph, JSON-LD. Theme toggle supports light and dark; light is the default look. Post pages surface related writing by shared topic and series.",
		],
		decisions: [
			"Astro for static content pages. Lit for the design system so the same primitives can leave React (same direction as the Lit migration at Kroo).",
			"One Nx workspace with Bun instead of separate repos for site, design system, and content.",
			"List rows use surface shadow and stretch links. Background boxes only where there is a real hit target.",
			"Archived is a native checkbox with the same field label pattern as Search and Topics. Clear filters is a button.",
			"Older posts stay archived by default and stay out of the home feed and RSS.",
		],
		metrics: [
			{ label: "Workspace", value: "1 Astro app, design-system lib, content lib" },
			{ label: "Writing", value: "Search, topics, archived toggle, URL state, RSS" },
			{ label: "Case studies", value: "Same outline for Kroo studies, Primer, and this site" },
			{ label: "A11y", value: "Skip links, focus-visible, reduced motion, native filter controls" },
		],
		outcome: [
			"I change content and tokens instead of inventing a layout per page. Selected work and writing share one visual system. The design system stays small: compose from a few primitives, do not grow a second product kit.",
		],
		next: [
			"Add case study depth when work ships. Do not grow components unless a page needs them.",
			"Try the same Lit tokens and primitives in internal tooling where React is not required.",
		],
		links: [
			{ label: "Open lukebrannagan.com", href: "https://lukebrannagan.com" },
			{ label: "GitHub", href: "https://github.com/Nevnet99" },
		],
	},
];

export function getFeaturedProjects() {
	return projects.filter((project) => project.featured);
}

export function getProject(slug: string) {
	return projects.find((project) => project.slug === slug);
}
