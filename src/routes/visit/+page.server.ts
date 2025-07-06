import { getVisit } from '$lib/api/adapters/gicaAdapter';

export const load = async () => {
	const visit = await getVisit();
	return {
		visit
	};
};
