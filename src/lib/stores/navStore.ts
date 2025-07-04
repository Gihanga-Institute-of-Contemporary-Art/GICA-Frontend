import { writable } from 'svelte/store';

export interface NavItem {
	title: string;
	href: string;
	slug: string;
}

// Navigation configuration that can be easily modified
const navConfig = [
	{ title: 'Home', href: '/', slug: 'home' },
	{ title: 'Exhibitions', href: '/exhibitions', slug: 'exhibitions' },
	{ title: 'Programme', href: '/programme', slug: 'programme' },
	{ title: 'Contributors', href: '/contributors', slug: 'contributors' },
	{ title: 'Visit us', href: '/visit', slug: 'visit' }
];

export const navItems = writable<NavItem[]>(navConfig);

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
