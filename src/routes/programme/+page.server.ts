import type { Programmes } from '$lib/api/types';
import { getStaticData, fetchStaticData } from '$lib/api/staticApi';

export const load = async () => {
	const development = import.meta.env.DEV === true;

	if (!development) {
		const site = getStaticData<Programmes>('programmes');
		return { programmes: site };
	} else {
		const site = await fetchStaticData<Programmes>('programmes');
		return { programmes: site };
	}
};
