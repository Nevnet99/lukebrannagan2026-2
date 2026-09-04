import { DsContainer } from "./components/container";
import { DsLink } from "./components/link";
import { DsRule } from "./components/rule";
import { DsSkipLinks } from "./components/skip-links";
import { DsStack } from "./components/stack";
import { DsText } from "./components/text";

const registry = [
	["ds-container", DsContainer],
	["ds-stack", DsStack],
	["ds-text", DsText],
	["ds-link", DsLink],
	["ds-rule", DsRule],
	["ds-skip-links", DsSkipLinks],
] as const;

/** Register all design-system custom elements (idempotent). */
export function defineDesignSystem() {
	for (const [tag, ctor] of registry) {
		if (!customElements.get(tag)) {
			customElements.define(tag, ctor);
		}
	}
}

defineDesignSystem();

export { DsContainer } from "./components/container";
export { DsLink } from "./components/link";
export { DsRule } from "./components/rule";
export { DsSkipLinks } from "./components/skip-links";
export { DsStack } from "./components/stack";
export { DsText } from "./components/text";
export type { SpacingToken, TextTag, TextVariant } from "./types";
