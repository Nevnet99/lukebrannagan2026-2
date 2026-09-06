export const site = {
	name: "Luke Brannagan",
	title: "Luke Brannagan",
	description:
		"Senior frontend engineer in Manchester. Design systems, performance, and accessible interfaces.",
	url: "https://lukebrannagan.com",
	/** Default share image (1200×630). Absolute URL built in BaseLayout. */
	ogImage: "/og.png",
	locale: "en_GB",
	language: "en-GB",
	email: "luke@brannagan.co",
	location: "Manchester, UK",
	github: "https://github.com/Nevnet99",
	githubUser: "Nevnet99",
	linkedin: "https://www.linkedin.com/in/luke-brannagan",
	careerStart: "2018-06",
	role: "Senior Web Platform Developer",
	availability: "Open to opportunities",
	heroLede: "Design systems, performance, and accessible interfaces.",
	tagline:
		"I build design systems and high-performance frontends. At Kroo I work on the public website: architecture, core repos, and accessibility. Lately I’m digging into backend so I can take on more fullstack work.",
	summary:
		"Senior frontend engineer. Design systems, web performance, and accessibility. At Kroo I rebuild the website, ship Sanity, and keep the public site WCAG-compliant.",
	coreStack: ["TypeScript", "React", "Next.js", "Go", "AWS"] as const,
	nav: [
		{ label: "Selected work", href: "/work" },
		{ label: "Writing", href: "/writing" },
	],
	social: [
		{ label: "GitHub", href: "https://github.com/Nevnet99" },
		{ label: "LinkedIn", href: "https://www.linkedin.com/in/luke-brannagan" },
		{ label: "Email", href: "mailto:luke@brannagan.co" },
	],
	footerLegal: [
		{ label: "RSS", href: "/rss.xml" },
		{ label: "Colophon", href: "/colophon" },
		{ label: "Accessibility", href: "/accessibility" },
		{ label: "Cookie policy", href: "/cookies" },
	],
	colophon: {
		lede: "How this site is put together: stack, content model, and the feeds machines read.",
	},
	accessibility: {
		lede: "What I aim for on this site, what still needs work, and how to tell me when something breaks.",
	},
	writing: {
		lede: "Notes on design systems, frontend architecture, and accessibility.",
		rssLabel: "RSS feed",
		empty:
			"No posts yet. Writing on design systems, frontend architecture, and accessibility will land here.",
		emptyAction: { label: "Browse selected work", href: "/work" },
		archivedLede: "Older posts kept for history. Not part of the main Writing feed.",
		relatedHeading: "Related writing",
	},

	/**
	 * Amazon Associates — set `associateTag` (or PUBLIC_AMAZON_ASSOCIATE_TAG)
	 * once enrolled. Links still work without a tag; you just won’t earn.
	 */
	amazon: {
		marketplace: "www.amazon.co.uk",
		associateTag: "lukeb0f-21",
	},
	cta: {
		heading: "Contact",
		body: "Looking for a frontend engineer who cares about performance and accessibility? Email me.",
	},
} as const;
