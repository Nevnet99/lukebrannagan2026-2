/**
 * Reading progress for long-form writing and work pages.
 * Tracks scroll through `[data-scroll-progress-root]` (falls back to document).
 */
export function initScrollProgress(root: ParentNode = document) {
	const chrome = root.querySelector<HTMLElement>("[data-scroll-progress]");
	const bar = chrome?.querySelector<HTMLElement>("[data-scroll-progress-bar]");
	if (!chrome || !bar) return;

	const article =
		root.querySelector<HTMLElement>("[data-scroll-progress-root]") ?? document.documentElement;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	let target = 0;
	let displayed = 0;
	let raf = 0;
	let completed = false;

	const clamp = (value: number) => Math.min(1, Math.max(0, value));

	const measure = () => {
		const rect = article.getBoundingClientRect();
		const top = window.scrollY + rect.top;
		const height = article.offsetHeight;
		const view = window.innerHeight;
		const start = top;
		const end = top + height - view;

		if (height <= view) {
			target = window.scrollY > start ? 1 : 0;
			return;
		}

		target = clamp((window.scrollY - start) / (end - start));
	};

	const paint = (value: number) => {
		const pct = Math.round(value * 100);
		bar.style.transform = `scaleX(${value})`;
		chrome.style.setProperty("--scroll-progress", String(value));
		chrome.setAttribute("aria-valuenow", String(pct));
		chrome.classList.toggle("is-active", value > 0.002);
		chrome.classList.toggle("is-complete", value >= 0.995);

		if (value >= 0.995 && !completed) {
			completed = true;
			chrome.classList.add("is-just-complete");
			window.setTimeout(() => chrome.classList.remove("is-just-complete"), 480);
		}
		if (value < 0.995) {
			completed = false;
			chrome.classList.remove("is-just-complete");
		}
	};

	const tick = () => {
		raf = 0;
		if (reduceMotion.matches) {
			displayed = target;
			paint(displayed);
			return;
		}

		const delta = target - displayed;
		if (Math.abs(delta) < 0.001) {
			displayed = target;
			paint(displayed);
			return;
		}

		displayed += delta * 0.22;
		paint(displayed);
		raf = window.requestAnimationFrame(tick);
	};

	const schedule = () => {
		measure();
		if (raf) return;
		raf = window.requestAnimationFrame(tick);
	};

	measure();
	paint(target);
	displayed = target;

	window.addEventListener("scroll", schedule, { passive: true });
	window.addEventListener("resize", schedule, { passive: true });
	reduceMotion.addEventListener("change", schedule);
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => initScrollProgress(), {
			once: true,
		});
	} else {
		initScrollProgress();
	}
}
