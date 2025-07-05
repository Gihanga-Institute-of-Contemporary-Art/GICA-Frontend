import type { Exhibitions } from '$lib/api/types';
import { getStaticData, fetchStaticData } from '$lib/api/staticApi';

export const load = async () => {
	const development = import.meta.env.DEV === true;

	if (!development) {
		const site = getStaticData<Exhibitions>('exhibitions');
		return { exhibitions: site };
	} else {
		const site = await fetchStaticData<Exhibitions>('exhibitions');
		return { exhibitions: site };
	}
};
