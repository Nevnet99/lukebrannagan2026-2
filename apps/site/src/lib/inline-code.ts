/**
 * Split markdown-style `inline code` into text/code segments for rendering.
 * Unpaired backticks stay as plain text.
 */
export type InlinePart = { type: "text" | "code"; value: string };

export function splitInlineCode(text: string): InlinePart[] {
	const parts: InlinePart[] = [];
	const pattern = /`([^`]+)`/g;
	let lastIndex = 0;

	for (const match of text.matchAll(pattern)) {
		const index = match.index ?? 0;
		if (index > lastIndex) {
			parts.push({ type: "text", value: text.slice(lastIndex, index) });
		}
		parts.push({ type: "code", value: match[1] ?? "" });
		lastIndex = index + match[0].length;
	}

	if (lastIndex < text.length) {
		parts.push({ type: "text", value: text.slice(lastIndex) });
	}

	if (parts.length === 0) {
		parts.push({ type: "text", value: text });
	}

	return parts;
}
