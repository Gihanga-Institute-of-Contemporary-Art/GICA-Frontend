import { writable, derived } from 'svelte/store';
import { currentLanguage } from './languageStore';
import { ui } from '../i18n';

export interface NavItem {
	title: string;
	href: string;
	slug: string;
	translationKey?: keyof typeof import('../i18n').uiTranslations;
}

// Navigation configuration with translation keys
const navConfig: NavItem[] = [
	{ title: 'Home', href: '/', slug: 'home', translationKey: 'home' },
	{ title: 'Programme', href: '/programme', slug: 'programme', translationKey: 'programme' },
	{
		title: 'Contributors',
		href: '/contributors',
		slug: 'contributors',
		translationKey: 'contributors'
	},
	{ title: 'Visit us', href: '/visit', slug: 'visit', translationKey: 'visit' }
];

export const navItems = writable<NavItem[]>(navConfig);

// Create a derived store that provides translated nav items
export const translatedNavItems = derived([navItems, currentLanguage], ([items]) => {
	return items.map((item) => ({
		...item,
		title: item.translationKey ? ui(item.translationKey) : item.title
	}));
});

// Function to initialize navigation (can be extended for dynamic data)
export function initializeNavigation() {
	// If your CMS provides navigation data in the future, you can process it here
	// For now, we'll use the configured structure
	navItems.set(navConfig);
}

// Function to update a specific nav item title
export function updateNavItemTitle(slug: string, newTitle: string) {
	navItems.update((items) =>
		items.map((item) => (item.slug === slug ? { ...item, title: newTitle } : item))
	);
}
