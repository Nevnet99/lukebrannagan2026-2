export type Experience = {
	slug: string;
	role: string;
	company: string;
	period: string;
	/** Inclusive start month, YYYY-MM */
	start: string;
	/** Inclusive end month, YYYY-MM — omit when current */
	end?: string;
	tags: string[];
	highlights: string[];
	current?: boolean;
};

export const experience: Experience[] = [
	{
		slug: "kroo",
		role: "Senior Web Platform Developer",
		company: "Kroo",
		period: "Jul 2023 – Present",
		start: "2023-07",
		tags: ["React", "Vite", "Zustand", "A11y"],
		current: true,
		highlights: [
			"Achieved 100/100 Lighthouse Scores: Led accessibility audit ensuring full WCAG 2.1 compliance.",
			"Boosted Developer Efficiency: Built scalable internal Design System using React and Vite.",
			"Modernized Architecture: Migrated legacy CRA apps to Vite; implemented TanStack Query.",
			"Engineering Excellence: Defined frontend architecture and best practices with Product/Design.",
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
			"Complex WYSIWYG Editor: Engineered a drag-and-drop web builder for non-technical users.",
		],
	},
	{
		slug: "primer",
		role: "Frontend Engineer",
		company: "Primer",
		period: "Jul 2022 – Nov 2022",
		start: "2022-07",
		end: "2022-11",
		tags: ["Design Systems", "Performance"],
		highlights: [
			"Cut Dev Time by ~50%: Scaled the GOAT Design System, streamlining frontend workflows.",
			"Reduced Costs by 3-4x: Re-architected Observability platform to lower resource consumption.",
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
			"Optimized Dashboard: Enhanced core UI performance, improving load times and usability.",
			"Feature Delivery: Collaborated with Backend/Design to ship features in an agile environment.",
		],
	},
	{
		slug: "dept",
		role: "Senior / Mid / Junior Developer",
		company: "DEPT",
		period: "Jan 2020 – Apr 2022",
		start: "2020-01",
		end: "2022-04",
		tags: ["Next.js", "Mentorship"],
		highlights: [
			"Delivered Large-Scale Apps: Built high-performance web apps for major clients.",
			"Mentorship: Mentored juniors on Next.js, React patterns, and Accessibility standards.",
		],
	},
	{
		slug: "oliver-james",
		role: "Junior Software Developer",
		company: "Oliver James",
		period: "Jan 2019 – Dec 2019",
		start: "2019-01",
		end: "2019-12",
		tags: ["C#", ".NET", "JavaScript"],
		highlights: ["Developed full-stack internal dashboards using C#, ASP.NET, and JavaScript."],
	},
];

const featuredSlugs = ["kroo", "primer", "dept"] as const;

export const featuredExperience = featuredSlugs.map((slug) => {
	const role = experience.find((item) => item.slug === slug);
	if (!role) throw new Error(`Missing featured experience: ${slug}`);
	return role;
});
