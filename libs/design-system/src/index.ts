import { DsBreadcrumb } from "./components/breadcrumb";
import { DsContainer } from "./components/container";
import { DsIcon } from "./components/icon";
import { DsLink } from "./components/link";
import { DsPopover } from "./components/popover";
import { DsRule } from "./components/rule";
import { DsSkipLinks } from "./components/skip-links";
import { DsStack } from "./components/stack";
import { DsSwitch } from "./components/switch";
import { DsText } from "./components/text";
import { DsThemeToggle } from "./components/theme-toggle";

const registry = [
	["ds-container", DsContainer],
	["ds-stack", DsStack],
	["ds-text", DsText],
	["ds-link", DsLink],
	["ds-rule", DsRule],
	["ds-icon", DsIcon],
	["ds-switch", DsSwitch],
	["ds-breadcrumb", DsBreadcrumb],
	["ds-popover", DsPopover],
	["ds-skip-links", DsSkipLinks],
	["ds-theme-toggle", DsThemeToggle],
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

export { type BreadcrumbItem, DsBreadcrumb } from "./components/breadcrumb";
export { DsContainer } from "./components/container";
export { DsIcon } from "./components/icon";
export { DsLink } from "./components/link";
export { DsPopover, type PopoverPlacement } from "./components/popover";
export { DsRule } from "./components/rule";
export { DsSkipLinks } from "./components/skip-links";
export { DsStack } from "./components/stack";
export { DsSwitch } from "./components/switch";
export { DsText } from "./components/text";
export { DsThemeToggle } from "./components/theme-toggle";
export { type IconName, iconNames, isIconName } from "./icons";
export {
	applyTheme,
	getStoredTheme,
	getSystemTheme,
	isTheme,
	resolveTheme,
	setTheme,
	THEME_STORAGE_KEY,
	type Theme,
	themeBootScript,
	toggleTheme,
	withoutThemeTransitions,
} from "./theme";
export type { SpacingToken, TextTag, TextVariant } from "./types";
