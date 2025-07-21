export const prerender = true;

import { getHome } from '$lib/api/adapters/gicaAdapter';
import type { Home } from '$lib/api/schemas/gicaSchema';

export const load = async () => {
	try {
		const home = await getHome();

		// Add pages to the result for layout navigation
		return {
			home,
			pages: home.pages || []
		};
	} catch (error) {
		console.error('Failed to load site data in layout:', error);

		// Return fallback data
		return {
			home: {
				title: 'GICA',
				headline: '',
				about: [],
				carousel: [],
				pages: [],
				translation: {
					language: 'rw',
					headline: '',
					about: []
				}
			} as Home,
			pages: []
		};
	}
};
