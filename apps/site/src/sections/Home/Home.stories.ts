import {
	getWorkSeriesMembers,
	listFeaturedWorkEntries,
	listFeaturedWritingSeries,
	site,
} from "@lukebrannagan/content";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { sectionHeadStyles } from "../../components/SectionHeading/section-head.css";
import { renderSeriesStack } from "../../components/SeriesStack/series-stack";

const meta = {
	title: "Sections/Home",
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Stand-in titles for series peeks (Storybook has no `getCollection`). */
const sampleWritingMembersBySeries: Record<string, { title: string }[]> = {
	"ai-and-craft": [
		{ title: "The Coming Crash of Vibe-Coded Software" },
		{ title: "AI, Moving from Manual to Automatic" },
	],
};

export const Intro: Story = {
	render: () => html`
		<ds-container>
			<header style="padding-top: 0">
				<ds-stack gap="md">
					<ds-text as="h1" variant="display">${site.name}</ds-text>
					<ds-text variant="muted">${site.role} · ${site.location}</ds-text>
					<ds-text variant="body">${site.tagline}</ds-text>
				</ds-stack>
			</header>
		</ds-container>
	`,
};

export const SelectedWork: Story = {
	render: () => {
		const featuredWork = listFeaturedWorkEntries();
		return html`
			<style>
				${sectionHeadStyles}
			</style>
			<ds-container>
				<ds-stack gap="md">
					<div class="section-head">
						<ds-text as="h2" variant="meta">Selected work</ds-text>
						<ds-link class="section-head__link" href="/work">View all</ds-link>
					</div>
					<ul class="surface-list">
						${featuredWork.map((entry) => {
							if (entry.type === "series") {
								return renderSeriesStack(entry.series, getWorkSeriesMembers(entry.series));
							}
							return html`
								<li>
									<article class="surface surface--interactive">
										<div class="surface__row">
											<ds-link stretch href=${`/work/${entry.project.slug}`}>
												<span class="surface__icon">
													<ds-icon name="web"></ds-icon>
												</span>
												${entry.project.title}
											</ds-link>
											<span class="surface__meta"
												>${entry.project.stack.join(" · ")}</span
											>
										</div>
										<ds-text variant="muted">${entry.project.summary}</ds-text>
									</article>
								</li>
							`;
						})}
					</ul>
				</ds-stack>
			</ds-container>
		`;
	},
};

export const Writing: Story = {
	render: () => {
		const featuredWriting = listFeaturedWritingSeries();
		return html`
			<style>
				${sectionHeadStyles}
			</style>
			<ds-container>
				<ds-stack gap="md">
					<div class="section-head">
						<ds-text as="h2" variant="meta">Writing</ds-text>
						<ds-link class="section-head__link" href="/writing">All writing</ds-link>
					</div>
					<ul class="surface-list">
						${featuredWriting.map((series) => {
							const members =
								sampleWritingMembersBySeries[series.slug] ??
								series.memberSlugs.map((slug) => ({ title: slug }));
							return renderSeriesStack(series, members);
						})}
					</ul>
				</ds-stack>
			</ds-container>
		`;
	},
};

export const WritingEmpty: Story = {
	name: "Writing (empty)",
	render: () => html`
		<style>
			${sectionHeadStyles}
		</style>
		<ds-container>
			<ds-stack gap="md">
				<div class="section-head">
					<ds-text as="h2" variant="meta">Writing</ds-text>
				</div>
				<ds-stack gap="md">
					<ds-text variant="muted">${site.writing.empty}</ds-text>
					<p>
						<ds-link href=${site.writing.emptyAction.href}>
							${site.writing.emptyAction.label}
						</ds-link>
					</p>
				</ds-stack>
			</ds-stack>
		</ds-container>
	`,
};

export const Contact: Story = {
	render: () => html`
		<ds-container>
			<ds-stack gap="md">
				<ds-text as="h2" variant="meta">Contact</ds-text>
				<ds-text variant="body">${site.cta.body}</ds-text>
				<p>
					<ds-link href=${`mailto:${site.email}`}>${site.email}</ds-link>
				</p>
			</ds-stack>
		</ds-container>
	`,
};
