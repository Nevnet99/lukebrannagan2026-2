#!/usr/bin/env bun
/**
 * Resolve ISBNs (Open Library), write frontmatter, download covers locally.
 *
 * Usage: bun run apps/site/scripts/fetch-book-covers.mjs
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const writingDir = path.join(root, "apps/site/src/content/writing");
const coverDir = path.join(root, "apps/site/public/covers/books");

/** Known ISBN-13 overrides when Open Library search is ambiguous. */
const isbnBySlug = {
	"hypermedia-systems": "9798390803288",
	"high-performance-browser-networking": "9781449344764",
	"functional-programming-in-scala": "9781617290657",
	"philosophy-of-software-design": "9781732102200",
	"staff-engineers-path": "9781098118730",
	"coding-interview-patterns": "9781736049112",
	"system-design-interview": "9798664653403",
	"search-inside-yourself": "9780062116932",
	"software-engineers-guidebook": "9789083381824",
	"atomic-habits": "9780735211292",
	"clojure-for-the-brave-and-true": "9781593275914",
	"software-engineering-at-google": "9781492082798",
	ddia: "9781449373320",
	"grokking-data-structures": "9781633436985",
	"elixir-in-action": "9781617295027",
	"little-elixir-and-otp-guidebook": "9781633430112",
	"saas-playbook": "9798988330912",
	"pragmatic-programmer": "9780135957059",
	"you-dont-know-js-up-and-going": "9781491924464",
	"the-one-thing": "9781885167774",
};

/** Optional ASIN when it differs from ISBN-10. */
const asinBySlug = {
	"system-design-interview": "B08CMF2CQF",
	"saas-playbook": "B0BRY9ZYXD",
	"hypermedia-systems": "B0C9S9BZK5",
	"coding-interview-patterns": "B0D1XY9K7M",
};

/** Direct cover URLs when Open Library has no ISBN art. */
const coverUrlBySlug = {
	"hypermedia-systems": "https://hypermedia.systems/images/cover.png",
	"grokking-data-structures":
		"https://images.manning.com/360/480/resize/book/c/d2857e4-0ccb-4758-b294-ddd56d1477fd/LaRocca-HI.png",
	"saas-playbook": "https://covers.openlibrary.org/b/id/14623962-L.jpg",
};

/**
 * @typedef {Record<string, string | number | boolean | string[]>} Frontmatter
 */

/**
 * @param {string} raw
 */
function parseFile(raw) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) throw new Error("Missing frontmatter");
	const fmBlock = match[1];
	const body = match[2];
	/** @type {Frontmatter} */
	const fm = {};
	/** @type {string[]} */
	const order = [];
	for (const line of fmBlock.split("\n")) {
		const idx = line.indexOf(":");
		if (idx < 0) continue;
		const key = line.slice(0, idx).trim();
		let value = line.slice(idx + 1).trim();
		order.push(key);
		if (value === "true") value = true;
		else if (value === "false") value = false;
		else if (value.startsWith("[") && value.endsWith("]")) {
			value = value
				.slice(1, -1)
				.split(",")
				.map((part) => part.trim().replace(/^["']|["']$/g, ""))
				.filter(Boolean);
		} else {
			value = value.replace(/^["']|["']$/g, "");
		}
		fm[key] = value;
	}
	return { fm, body, order };
}

/**
 * @param {Frontmatter} fm
 * @param {string} body
 * @param {string[]} order
 */
function serializeFile(fm, body, order) {
	const keys = [...order];
	for (const key of Object.keys(fm)) {
		if (!keys.includes(key)) keys.push(key);
	}
	const lines = keys.map((key) => {
		const value = fm[key];
		if (Array.isArray(value)) {
			return `${key}: [${value.join(", ")}]`;
		}
		if (typeof value === "string") {
			const forceQuote = key === "isbn" || key === "amazonAsin" || key === "cover";
			const needsQuote =
				forceQuote ||
				value.includes(":") ||
				value.includes("#") ||
				value.includes('"') ||
				value.includes("'") ||
				value.startsWith(" ") ||
				/^\d+$/.test(value);
			return needsQuote ? `${key}: ${JSON.stringify(value)}` : `${key}: ${value}`;
		}
		return `${key}: ${String(value)}`;
	});
	return `---\n${lines.join("\n")}\n---\n${body.startsWith("\n") ? body : `\n${body}`}`;
}

/** @param {number} ms */
async function sleep(ms) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {string} title
 * @param {string} author
 */
async function searchOpenLibrary(title, author) {
	const url = new URL("https://openlibrary.org/search.json");
	url.searchParams.set("title", title);
	if (author) url.searchParams.set("author", author.split("&")[0]?.trim() ?? author);
	url.searchParams.set("limit", "5");
	const res = await fetch(url, {
		headers: { "User-Agent": "lukebrannagan.com-book-covers/1.0 (personal site)" },
	});
	if (!res.ok) return null;
	const data = await res.json();
	const doc = data.docs?.[0];
	const isbn13 = doc?.isbn?.find((value) => value.replace(/\D/g, "").length === 13);
	const any = doc?.isbn?.[0];
	return isbn13 ?? any ?? null;
}

/**
 * @param {string} url
 * @param {string} dest
 */
async function downloadCoverUrl(url, dest) {
	const res = await fetch(url, {
		headers: {
			"User-Agent": "lukebrannagan.com-book-covers/1.0 (personal site)",
		},
		redirect: "follow",
	});
	if (!res.ok) return false;
	const type = res.headers.get("content-type") ?? "";
	if (!type.includes("image")) return false;
	const buf = Buffer.from(await res.arrayBuffer());
	if (buf.byteLength < 2_000) return false;
	await writeFile(dest, buf);
	return true;
}

/**
 * @param {string} isbn
 * @param {string} dest
 */
async function downloadCover(isbn, dest) {
	const clean = isbn.replace(/[^0-9Xx]/g, "");
	const url = `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg?default=false`;
	return downloadCoverUrl(url, dest);
}

async function main() {
	await mkdir(coverDir, { recursive: true });
	const files = (await readdir(writingDir)).filter((name) => name.endsWith(".md"));
	let updated = 0;
	let covers = 0;

	for (const file of files) {
		const slug = file.replace(/\.md$/, "");
		const full = path.join(writingDir, file);
		const raw = await readFile(full, "utf8");
		const { fm, body, order } = parseFile(raw);
		if (fm.series !== "book-reviews") continue;

		const title = String(fm.title ?? "");
		const author = String(fm.bookAuthor ?? "");
		let isbn = String(fm.isbn ?? isbnBySlug[slug] ?? "").trim();

		if (!isbn) {
			isbn = (await searchOpenLibrary(title, author)) ?? "";
			await sleep(350);
		}

		if (isbn) fm.isbn = isbn;
		const asin = asinBySlug[slug] ?? String(fm.amazonAsin ?? "").trim();
		if (asin) fm.amazonAsin = asin;

		const coverRel = `/covers/books/${slug}.jpg`;
		const coverAbs = path.join(coverDir, `${slug}.jpg`);
		let gotCover = false;
		if (isbn) {
			gotCover = await downloadCover(isbn, coverAbs);
			await sleep(200);
		}
		if (!gotCover && coverUrlBySlug[slug]) {
			gotCover = await downloadCoverUrl(coverUrlBySlug[slug], coverAbs);
			await sleep(200);
		}
		if (gotCover) {
			fm.cover = coverRel;
			covers += 1;
			console.log(`cover  ${slug}`);
		} else if (isbn) {
			console.warn(`no cover for ${slug} (isbn ${isbn})`);
		} else {
			console.warn(`no isbn for ${slug}`);
		}

		if (!order.includes("isbn") && fm.isbn) order.push("isbn");
		if (!order.includes("amazonAsin") && fm.amazonAsin) order.push("amazonAsin");
		if (!order.includes("cover") && fm.cover) order.push("cover");

		await writeFile(full, serializeFile(fm, body, order));
		updated += 1;
	}

	console.log(`\nUpdated ${updated} book posts, downloaded ${covers} covers → ${coverDir}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
