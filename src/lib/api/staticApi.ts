import { fetchApi } from './client';
import {
	type Home,
	type Visit,
	type Programmes,
	type Programme,
	type Exhibitions,
	type Exhibition,
	type Contributor,
	type Contributors,
	type ContentBlock,
	type MediaCover
} from './types';
import { procesContentBlockImages, cacheMediaImage } from './imageCache';

// Store preloaded data
const staticData = new Map<string, unknown>();

/**
 * Preloads all data needed for static site generation
 */
export async function preloadAllData(): Promise<void> {
	try {
		const [homeData, visitData, programsData, exhibitionData, contributorsData] = await Promise.all(
			[
				fetchApi<Home>('home'),
				fetchApi<Visit>('visit'),
				fetchApi<Programmes>('programmes'),
				fetchApi<Exhibitions>('exhibitions'),
				fetchApi<Contributors>('contributors')
			]
		);

		staticData.set('home', homeData);
		staticData.set('visit', visitData);
		staticData.set('programmes', programsData);
		staticData.set('exhibitions', exhibitionData);
		staticData.set('contributors', contributorsData);

		const programPromises = programsData.children.map((program) =>
			fetchApi<Programme>(program.id).then((data) => staticData.set(program.id, data))
		);

		const exhibitionPromises = exhibitionData.children.map((exhibition) =>
			fetchApi<Exhibition>(exhibition.id).then((data) => staticData.set(exhibition.id, data))
		);

		const contributorPromises = contributorsData.children.map((contributor) =>
			fetchApi<Contributor>(contributor.id).then((data) => staticData.set(contributor.id, data))
		);

		await Promise.all([...programPromises, ...exhibitionPromises, ...contributorPromises]);

		// Process and cache all images after data is loaded
		await Promise.all([
			cacheHomeImages(),
			cacheVisitImages(),
			cacheCollectionImages<Programmes>('programmes'),
			cacheCollectionImages<Exhibitions>('exhibitions'),
			cacheCollectionImages<Contributors>('contributors'),
			cacheDetailImages<Programme>('programmes'),
			cacheDetailImages<Exhibition>('exhibitions'),
			cacheDetailImages<Contributor>('contributors')
		]);

		console.log('Successfully preloaded all static data with cached images');
	} catch (error) {
		console.error('Failed to preload static data:', error);
		throw error;
	}
}

/**
 * Get preloaded data by key
 */
export function getStaticData<T>(key: string): T {
	if (!staticData.has(key)) {
		throw new Error(`Static data for "${key}" not found. Make sure to preload it first.`);
	}
	return staticData.get(key) as T;
}

/**
 * Check if data is preloaded
 */
export function hasStaticData(key: string): boolean {
	return staticData.has(key);
}

/**
 * Fetch data from the API
 */
export async function fetchStaticData<T>(key: string): Promise<T> {
	if (hasStaticData(key)) {
		return getStaticData<T>(key);
	}

	const data = await fetchApi<T>(key);
	staticData.set(key, data);
	return data;
}

/**
 * Cache all images in the home page data
 */
async function cacheHomeImages(): Promise<void> {
	const homeData = getStaticData<Home>('home');

	// Process hero images
	if (homeData.carousel?.length) {
		homeData.carousel = await Promise.all(
			homeData.carousel.map(async (item) => ({
				...item,
				cover: await cacheMediaImage(item)
			}))
		);
	}

	staticData.set('home', homeData);
}

// Cache all images in the visit page
async function cacheVisitImages(): Promise<void> {
	const visitData = getStaticData<Visit>('visit');

	// Process cover image
	if (visitData.photography?.length) {
		visitData.photography = await Promise.all(
			visitData.photography.map(async (item) => ({
				...item,
				cover: await cacheMediaImage(item)
			}))
		);
	}

	staticData.set('visit', visitData);
}

/**
 * Cache all images in collection listings (announcements, programs)
 */
async function cacheCollectionImages<
	T extends { children: Array<{ cover: MediaCover }>; text?: ContentBlock[] }
>(dataKey: string): Promise<void> {
	const data = getStaticData<T>(dataKey);

	// Process collection item cover images
	if (data.children?.length) {
		data.children = await Promise.all(
			data.children.map(async (item) => ({
				...item,
				cover: await cacheMediaImage(item.cover)
			}))
		);
	}

	// Process any images in content blocks
	if (data.text?.length) {
		data.text = await procesContentBlockImages(data.text);
	}

	staticData.set(dataKey, data);
}

/**
 * Cache all images in detail pages (individual announcement or program)
 */
async function cacheDetailImages<
	T extends { id: string; cover: MediaCover; text?: ContentBlock[] | string }
>(collectionKey: string): Promise<void> {
	const collection = getStaticData<{ children: Array<{ id: string }> }>(collectionKey);

	await Promise.all(
		collection.children.map(async (item) => {
			const data = getStaticData<T>(item.id);

			// Cache cover image
			if (data.cover?.url) {
				data.cover = await cacheMediaImage(data.cover);
			}

			// Cache images in content blocks
			if (Array.isArray(data.text) && data.text.length) {
				data.text = await procesContentBlockImages(data.text);
			}

			staticData.set(item.id, data);
		})
	);
}
