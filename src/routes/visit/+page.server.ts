import { getStaticData, fetchStaticData } from '$lib/api/staticApi';

import type { Visit } from '$lib/api/types';

const development = import.meta.env.DEV === true;

export const load = async () => {
	if (!development) {
		const site = getStaticData<Visit>('visit');
		return { visit: site };
	} else {
		const site = await fetchStaticData<Visit>('visit');
		return { visit: site };
	}
};
