import { DsBreadcrumb } from "./components/BreadCrumb";
import { DsContainer } from "./components/Container";
import { DsIcon } from "./components/Icon";
import { DsLink } from "./components/Link";
import { DsPopover } from "./components/Popover";
import { DsRule } from "./components/Rule";
import { DsSkipLinks } from "./components/SkipLinks";
import { DsStack } from "./components/Stack";
import { DsSwitch } from "./components/Switch";
import { DsText } from "./components/Text";
import { DsThemeToggle } from "./components/ThemeToggle";

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

export { type BreadcrumbItem, DsBreadcrumb } from "./components/BreadCrumb";
export { DsContainer } from "./components/Container";
export { DsIcon } from "./components/Icon";
export { DsLink } from "./components/Link";
export { DsPopover, type PopoverPlacement } from "./components/Popover";
export { DsRule } from "./components/Rule";
export { DsSkipLinks } from "./components/SkipLinks";
export { DsStack } from "./components/Stack";
export { DsSwitch } from "./components/Switch";
export { DsText } from "./components/Text";
export { DsThemeToggle } from "./components/ThemeToggle";
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
