export type ExperienceRole = {
	role: string;
	period: string;
	/** Inclusive start month, YYYY-MM */
	start: string;
	/** Inclusive end month, YYYY-MM — omit when current */
	end?: string;
};

export type Experience = {
	slug: string;
	/** Current or most recent title at this company */
	role: string;
	company: string;
	/** Full company tenure */
	period: string;
	/** Inclusive start month, YYYY-MM */
	start: string;
	/** Inclusive end month, YYYY-MM — omit when current */
	end?: string;
	tags: string[];
	highlights: string[];
	/** Role ladder when promoted in place — newest first */
	roles?: ExperienceRole[];
	current?: boolean;
};

export const experience: Experience[] = [
	{
		slug: "kroo",
		role: "Senior Web Platform Developer",
		company: "Kroo Bank",
		period: "Jul 2023 – Present",
		start: "2023-07",
		tags: ["React", "Next.js", "Vite", "Sanity", "Design systems", "A11y"],
		current: true,
		roles: [
			{
				role: "Senior Web Platform Developer",
				period: "Jan 2025 – Present",
				start: "2025-01",
			},
			{
				role: "Web Platform Developer",
				period: "Jul 2023 – Jan 2025",
				start: "2023-07",
				end: "2025-01",
			},
		],
		highlights: [
			"Led and shipped a full rebrand of Kroo’s website: 15+ responsive pages in React, Next.js, and TypeScript.",
			"Architected and shipped Sanity CMS so marketing manages content without engineering; content releases dropped from days to minutes.",
			"Planned and built the web design system from scratch on React and Vite (npm package, tokens, primitives, Storybook).",
			"Refactored core UI for WCAG compliance. Pipelines, Storybook, and engineering standards for kroo.com.",
		],
	},
	{
		slug: "dexla",
		role: "Frontend Engineer",
		company: "Dexla",
		period: "Feb 2023 – Jun 2023",
		start: "2023-02",
		end: "2023-06",
		tags: ["Next.js", "React", "DnD"],
		highlights: [
			"Built a WYSIWYG web builder in Next.js with drag-and-drop components for non-technical page composition.",
		],
	},
	{
		slug: "primer",
		role: "Frontend Engineer",
		company: "Primer",
		period: "Jul 2022 – Nov 2022",
		start: "2022-07",
		end: "2022-11",
		tags: ["Design systems", "Performance"],
		highlights: [
			"Grew the GOAT design system and cut frontend development time by about 2×.",
			"Moved observability dashboards to config and API-driven UI; operating cost fell by about 3–4×.",
			"Worked with Product, Design, and Backend on frontend delivery.",
		],
	},
	{
		slug: "harbr",
		role: "Frontend Engineer",
		company: "Harbr",
		period: "Apr 2022 – Jun 2022",
		start: "2022-04",
		end: "2022-06",
		tags: ["React", "Redux"],
		highlights: [
			"Built and maintained the dashboard in React and Redux: usability, performance, and fixes.",
			"Shipped features with Product, Design, and Backend. Raised structure and practice issues in the codebase.",
		],
	},
	{
		slug: "dept",
		role: "Senior Frontend Developer",
		company: "DEPT",
		period: "Jan 2020 – Apr 2022",
		start: "2020-01",
		end: "2022-04",
		tags: ["Next.js", "React", "Mentorship"],
		roles: [
			{
				role: "Senior Frontend Developer",
				period: "Jan 2022 – Apr 2022",
				start: "2022-01",
				end: "2022-04",
			},
			{
				role: "Frontend Developer",
				period: "Jan 2021 – Dec 2021",
				start: "2021-01",
				end: "2021-12",
			},
			{
				role: "Junior Frontend Developer",
				period: "Jan 2020 – Dec 2020",
				start: "2020-01",
				end: "2020-12",
			},
		],
		highlights: [
			"Delivered client web apps with design, project management, and backend partners.",
			"Maintained client sites for performance and scalability. Took part in reviews and agile delivery.",
			"Mentored junior developers on React, Next.js, and frontend practice.",
		],
	},
	{
		slug: "oliver-james",
		role: "Junior Software Developer",
		company: "Oliver James Associates",
		period: "Jan 2019 – Dec 2019",
		start: "2019-01",
		end: "2019-12",
		tags: ["C#", ".NET", "JavaScript"],
		highlights: [
			"Built internal apps and dashboards with C#, ASP.NET WebForms, HTML, CSS, and JavaScript.",
			"Mixed development, QA, and agile process work: reviews, sprint planning, and retrospectives.",
		],
	},
	{
		slug: "manchester-codes",
		role: "Junior Software Developer",
		company: "Manchester Codes",
		period: "Jun 2018 – Feb 2019",
		start: "2018-06",
		end: "2019-02",
		tags: ["JavaScript", "React", "TDD"],
		highlights: [
			"Completed a 6-month immersive bootcamp: JavaScript, HTML, CSS, then React, Express, MongoDB, and TDD.",
			"Practised agile (Kanban), pair programming, Git, and team projects from scratch.",
		],
	},
];

const featuredSlugs = ["kroo", "primer", "dept"] as const;

export const featuredExperience = featuredSlugs.map((slug) => {
	const role = experience.find((item) => item.slug === slug);
	if (!role) throw new Error(`Missing featured experience: ${slug}`);
	return role;
});
