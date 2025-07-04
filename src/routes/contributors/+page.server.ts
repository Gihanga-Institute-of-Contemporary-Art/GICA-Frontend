import type { Contributors } from '$lib/api/types';
import { getStaticData, fetchStaticData } from '$lib/api/staticApi';

export const load = async () => {
	const development = import.meta.env.DEV === true;

	if (!development) {
		const site = getStaticData<Contributors>('contributors');
		return { contributors: site };
	} else {
		const site = await fetchStaticData<Contributors>('contributors');
		return { contributors: site };
	}
};
