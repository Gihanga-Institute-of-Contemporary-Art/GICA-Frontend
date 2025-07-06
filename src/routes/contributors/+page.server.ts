import { getContributors } from '$lib/api/adapters/gicaAdapter';

export const load = async () => {
	const contributors = await getContributors();
	return {
		contributors
	};
};
