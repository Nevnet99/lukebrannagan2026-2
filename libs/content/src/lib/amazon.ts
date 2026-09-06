/**
 * Amazon Associates product URLs (UK marketplace by default).
 * Pass `tag` from site config / PUBLIC_AMAZON_ASSOCIATE_TAG when enrolled.
 */
export function amazonProductUrl(options: {
	title: string;
	author?: string;
	/** Amazon ASIN (preferred) or ISBN-10. */
	asin?: string;
	/** ISBN-13 or ISBN-10 — used when asin is missing (search fallback for ISBN-13). */
	isbn?: string;
	marketplace?: string;
	tag?: string;
}): string {
	const host = options.marketplace?.trim() || "www.amazon.co.uk";
	const tag = options.tag?.trim();
	const asin = normalizeAsin(options.asin) ?? isbn10FromIsbn(options.isbn);

	if (asin) {
		const url = new URL(`https://${host}/dp/${asin}`);
		if (tag) url.searchParams.set("tag", tag);
		return url.toString();
	}

	const query = [options.title, options.author].filter(Boolean).join(" ");
	const url = new URL(`https://${host}/s`);
	url.searchParams.set("k", query);
	if (tag) url.searchParams.set("tag", tag);
	return url.toString();
}

function normalizeAsin(value: string | undefined): string | null {
	if (!value?.trim()) return null;
	const cleaned = value
		.trim()
		.toUpperCase()
		.replace(/[^0-9A-Z]/g, "");
	return /^[0-9A-Z]{10}$/.test(cleaned) ? cleaned : null;
}

/** Prefer ISBN-10 for Amazon /dp/ links. */
function isbn10FromIsbn(value: string | undefined): string | null {
	if (!value?.trim()) return null;
	const digits = value.replace(/[^0-9Xx]/g, "").toUpperCase();
	if (digits.length === 10 && /^\d{9}[\dX]$/.test(digits)) return digits;
	if (digits.length === 13 && digits.startsWith("978")) {
		const core = digits.slice(3, 12);
		let sum = 0;
		for (let i = 0; i < 9; i++) {
			sum += Number(core[i]) * (10 - i);
		}
		const check = (11 - (sum % 11)) % 11;
		return `${core}${check === 10 ? "X" : String(check)}`;
	}
	return null;
}

/** Prefer explicit cover, else Open Library by ISBN. */
export function bookCoverSrc(options: {
	slug: string;
	cover?: string;
	isbn?: string;
}): string | null {
	if (options.cover?.trim()) return options.cover.trim();
	if (options.isbn?.trim()) {
		const isbn = options.isbn.replace(/[^0-9Xx]/g, "");
		return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
	}
	return null;
}
