// Enhanced API Library
export * from './api';

// Utility functions
export {
	formatTime12Hour,
	formatAllDateTimeRanges,
	getTimeRange,
	formatSingleDateTimeRange,
	formatCompactDateTimeRange,
	formatProgrammeDateFromArray,
	getProgrammeStatusFromArray,
	formatDateRange,
	getPrimaryTime
} from './utils';

// Components
export { default as VerticalSlider } from './components/VerticalSlider.svelte';
export { default as Nav } from './components/Nav.svelte';
export { default as DuotoneFilter } from './components/DuotoneFilter.svelte';
export { default as Modal } from './components/Modal.svelte';
export { default as Card } from './components/Card.svelte';
export { default as Header } from './components/Header.svelte';
export { default as LanguageSwitcher } from './components/LanguageSwitcher.svelte';

// Types
export type { SEOData } from './types/seo';

// SEO utilities
export {
	defaultSEO,
	createSEOData,
	createArticleSEO,
	createSlug,
	formatSEODate,
	truncateDescription
} from './seo';

// Stores
export {
	navItems,
	translatedNavItems,
	initializeNavigation,
	updateNavItemTitle
} from './stores/navStore';

// i18n & Language
export * from './stores/languageStore';
export * from './i18n';
export * from './i18n/translate';
