import { getProgrammes } from '$lib/api/adapters/gicaAdapter';

export const load = async () => {
	const programmes = await getProgrammes();
	return {
		programmes
	};
};
