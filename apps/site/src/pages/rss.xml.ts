import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { isWritingPubliclyLinked, site } from "@lukebrannagan/content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
	const posts = (await getCollection("writing"))
		.filter((post) => !post.data.archived && isWritingPubliclyLinked(post.data))
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return rss({
		title: `${site.name} — Writing`,
		description: site.writing.lede,
		site: context.site ?? site.url,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/writing/${post.id}/`,
			categories: [...post.data.tags],
		})),
		customData: `<language>en-gb</language>`,
	});
};
