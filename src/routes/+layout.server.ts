export const prerender = true;
import { getStaticData, fetchStaticData } from '$lib/api/staticApi';

import type { Home } from '$lib/api/types';

const development = import.meta.env.DEV === true;

export const load = async () => {
	if (!development) {
		const site = getStaticData<Home>('home');
		return { pages: site.pages, home: site };
	} else {
		const site = await fetchStaticData<Home>('home');
		return { pages: site.pages, home: site };
	}
};
