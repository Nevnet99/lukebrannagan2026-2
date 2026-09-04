export const site = {
	name: "Luke Brannagan",
	title: "Luke Brannagan",
	description:
		"Senior Software Engineer. I build scalable Design Systems and high-performance web applications.",
	url: "https://lukebrannagan.com",
	email: "luke@brannagan.co",
	location: "Manchester, UK",
	github: "https://github.com/Nevnet99",
	githubUser: "Nevnet99",
	linkedin: "https://www.linkedin.com/in/luke-brannagan",
	careerStart: "2019-01",
	role: "Senior Frontend Engineer",
	availability: "Available",
	heroLede: "Design systems, performance, and accessible interfaces for teams that ship.",
	tagline:
		"I build scalable Design Systems and high-performance web applications. Currently focused on Web Platform stewardship at Kroo.",
	summary:
		"Senior Frontend Engineer specializing in scalable Design Systems, Web Performance, and Accessibility. Expert in modernizing legacy architectures and driving engineering best practices.",
	coreStack: ["TypeScript", "React", "Next.js", "Go", "AWS"] as const,
	nav: [
		{ label: "Work", href: "/work" },
		{ label: "Writing", href: "/writing" },
		{ label: "CV", href: "/cv" },
	],
	social: [
		{ label: "GitHub", href: "https://github.com/Nevnet99" },
		{ label: "LinkedIn", href: "https://www.linkedin.com/in/luke-brannagan" },
		{ label: "Email", href: "mailto:luke@brannagan.co" },
	],
	cta: {
		heading: "Contact",
		body: "If you need a frontend engineer who cares about performance and accessibility, let's talk.",
	},
} as const;
