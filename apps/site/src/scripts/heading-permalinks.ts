/**
 * Copy heading deep links and show a mist toast.
 * Enhance markdown headings under `[data-heading-permalinks]`;
 * work pages use `.section-heading` buttons from the server.
 */

const TOAST_ID = "permalink-toast";
const TOAST_MS = 2400;

function ensureToast(): HTMLElement {
	let toast = document.getElementById(TOAST_ID);
	if (toast) return toast;

	toast = document.createElement("div");
	toast.id = TOAST_ID;
	toast.className = "permalink-toast";
	toast.setAttribute("role", "status");
	toast.setAttribute("aria-live", "polite");
	toast.setAttribute("aria-atomic", "true");
	toast.hidden = true;
	document.body.append(toast);
	return toast;
}

let toastTimer = 0;

function showToast(message: string) {
	const toast = ensureToast();
	toast.textContent = "";
	// Stable empty region, then update (better screen-reader announce)
	requestAnimationFrame(() => {
		toast.hidden = false;
		toast.textContent = message;
	});

	window.clearTimeout(toastTimer);
	toastTimer = window.setTimeout(() => {
		toast.hidden = true;
		toast.textContent = "";
	}, TOAST_MS);
}

function headingUrl(id: string): string {
	const url = new URL(window.location.href);
	url.hash = id;
	url.search = "";
	return url.toString();
}

async function copyText(text: string): Promise<boolean> {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch {
		/* fall through */
	}

	const field = document.createElement("textarea");
	field.value = text;
	field.setAttribute("readonly", "");
	field.style.position = "fixed";
	field.style.opacity = "0";
	document.body.append(field);
	field.select();
	const ok = document.execCommand("copy");
	field.remove();
	return ok;
}

function createPermalinkButton(id: string, label: string): HTMLButtonElement {
	const button = document.createElement("button");
	button.type = "button";
	button.className = "heading-permalink";
	button.dataset.headingId = id;
	button.setAttribute("aria-label", `Copy link to ${label}`);
	button.innerHTML =
		'<svg class="heading-permalink__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.354 5.5H4a2.5 2.5 0 0 0 0 5h2.354a.75.75 0 0 1 0 1.5H4a4 4 0 0 1 0-8h2.354a.75.75 0 0 1 0 1.5Zm3.292 0H12a2.5 2.5 0 0 1 0 5H9.646a.75.75 0 0 0 0 1.5H12a4 4 0 0 0 0-8H9.646a.75.75 0 0 0 0 1.5ZM5.5 7.25h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1 0-1.5Z"/></svg>';
	return button;
}

function enhanceProseHeadings(scope: ParentNode) {
	const headings = scope.querySelectorAll<HTMLElement>("h2[id], h3[id], h4[id]");
	for (const heading of headings) {
		if (heading.querySelector(".heading-permalink")) continue;
		const id = heading.id;
		if (!id) continue;
		const label = heading.textContent?.trim() || "section";
		heading.classList.add("heading-with-permalink");
		heading.append(createPermalinkButton(id, label));
	}
}

async function onPermalinkClick(event: Event) {
	const target = event.target;
	if (!(target instanceof Element)) return;
	const button = target.closest<HTMLButtonElement>(".heading-permalink");
	if (!button) return;

	event.preventDefault();
	const id = button.dataset.headingId;
	if (!id) return;

	const url = headingUrl(id);
	const ok = await copyText(url);
	showToast(ok ? "Link copied" : "Couldn’t copy link");
}

export function initHeadingPermalinks(root: ParentNode = document) {
	const scopes = root.querySelectorAll("[data-heading-permalinks]");
	for (const scope of scopes) {
		enhanceProseHeadings(scope);
	}

	ensureToast();
	root.addEventListener("click", onPermalinkClick);
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => initHeadingPermalinks(), {
			once: true,
		});
	} else {
		initHeadingPermalinks();
	}
}
