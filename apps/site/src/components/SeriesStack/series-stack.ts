import { type Series, seriesHref, seriesMemberCountLabel } from "@lukebrannagan/content";
import { html, type TemplateResult } from "lit";

/** Peek poses — keep in sync with `SeriesStack.astro`. */
const scatter = [
	{
		side: "start",
		restTx: "-32%",
		restRot: "-9deg",
		restTy: "-0.2rem",
		popTx: "-82%",
		popRot: "-11deg",
		popTy: "-0.35rem",
		layer: 3,
	},
	{
		side: "start",
		restTx: "-10%",
		restRot: "-3deg",
		restTy: "0.25rem",
		popTx: "-48%",
		popRot: "-4deg",
		popTy: "0.2rem",
		layer: 2,
	},
	{
		side: "end",
		restTx: "32%",
		restRot: "9deg",
		restTy: "0.1rem",
		popTx: "82%",
		popRot: "11deg",
		popTy: "-0.15rem",
		layer: 3,
	},
] as const;

export function renderSeriesStack(series: Series, members: { title: string }[]): TemplateResult {
	const href = seriesHref(series);
	const countLabel = seriesMemberCountLabel(members.length, series.collection, series.layout);
	const accessibleName = `${series.title}, series, ${countLabel}`;
	const peeks = members.slice(0, 3);
	const iconName = series.collection === "writing" ? "article" : "web";

	return html`
		<li class="series-stack" style=${`--stack-depth: ${peeks.length}`}>
			<div class="series-stack__frame">
				<div class="series-stack__deck" aria-hidden="true">
					${peeks.map((member, index) => {
						const pose = scatter[index] ?? scatter[0];
						return html`
							<div
								class="series-stack__card series-stack__card--back series-stack__card--${pose.side}"
								data-series-peek=${index}
								style="
									--rest-tx: ${pose.restTx};
									--rest-ty: ${pose.restTy};
									--rest-rot: ${pose.restRot};
									--pop-tx: ${pose.popTx};
									--pop-ty: ${pose.popTy};
									--pop-rot: ${pose.popRot};
									--layer: ${pose.layer};
									--pop-delay: ${index * 45}ms;
								"
							>
								<span class="series-stack__card-title">${member.title}</span>
							</div>
						`;
					})}
				</div>

				<article
					class="series-stack__card series-stack__card--front surface surface--interactive surface--series"
				>
					<div class="surface__row">
						<ds-link stretch href=${href}>
							<span class="surface__icon surface__icon--series">
								<ds-icon name=${iconName}></ds-icon>
							</span>
							<span aria-hidden="true">${series.title}</span>
							<span class="visually-hidden">${accessibleName}</span>
						</ds-link>
						<span class="surface__meta series-stack__meta">
							<span class="series-stack__kind">Series</span>
							<span class="series-stack__count">${countLabel}</span>
						</span>
					</div>
					<ds-text variant="muted">${series.summary}</ds-text>
				</article>
			</div>
		</li>
	`;
}
