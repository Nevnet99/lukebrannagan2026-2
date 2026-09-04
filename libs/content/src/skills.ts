export type SkillGroup = {
	title: string;
	items: string[];
};

export const skills: SkillGroup[] = [
	{
		title: "Languages",
		items: ["TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "C#", "Golang"],
	},
	{
		title: "Stack",
		items: ["React", "Next.js", "Node.js"],
	},
	{
		title: "Tooling",
		items: ["Vite", "Rollup", "pnpm", "ESLint", "Prettier", "Biome", "Storybook"],
	},
	{
		title: "Data",
		items: ["Zustand", "Redux", "TanStack Query"],
	},
	{
		title: "Testing",
		items: ["Vitest", "React Testing Library", "Playwright"],
	},
	{
		title: "Styling",
		items: ["Tailwind CSS", "CSS Modules", "Styled Components"],
	},
	{
		title: "CMS",
		items: ["Contentful", "Sanity", "Storyblok"],
	},
];
