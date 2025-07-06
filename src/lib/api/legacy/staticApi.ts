/**
 * Enhanced Static API Data Management
 * Production-ready static site data preloading with comprehensive caching and error handling
 */

import { apiClient } from '../core/client';
import {
	type Home,
	type Visit,
	type Programmes,
	type Exhibitions,
	type Contributors,
	type ContentBlock,
	type MediaCover,
	type CollectionType,
	type DetailType
} from './types';
import { imageCache, procesContentBlockImages, cacheMediaImage } from '../core/imageCache';
import { generalCache } from '../core/cache';
import { batchProcess, deepClone } from '../core/utils';
import { errorLogger, ApiErrorFactory } from '../core/errors';

export interface PreloadOptions {
	includeDetails?: boolean;
	cacheImages?: boolean;
	concurrency?: number;
	onProgress?: (stage: string, progress: number, total: number) => void;
}

export interface PreloadResult {
	success: boolean;
	loadedCollections: string[];
	loadedDetails: string[];
	cachedImages: number;
	errors: Array<{ stage: string; error: string }>;
	executionTime: number;
}

/**
 * Enhanced static data manager with advanced caching and error handling
 */
export class StaticDataManager {
	private staticData = new Map<string, unknown>();
	private loadingPromises = new Map<string, Promise<unknown>>();
	private readonly CACHE_PREFIX = 'static_';

	/**
	 * Preload all static data with comprehensive error handling
	 */
	async preloadAllData(options: PreloadOptions = {}): Promise<PreloadResult> {
		const startTime = Date.now();
		const { includeDetails = false, cacheImages = true, concurrency = 3, onProgress } = options;

		const result: PreloadResult = {
			success: false,
			loadedCollections: [],
			loadedDetails: [],
			cachedImages: 0,
			errors: [],
			executionTime: 0
		};

		try {
			onProgress?.('Loading collections', 0, 5);

			// Load main collections
			const collections = await this.loadCollections();
			result.loadedCollections = Object.keys(collections);

			onProgress?.('Loading collections', 5, 5);

			// Load individual details if requested
			if (includeDetails) {
				const detailsResult = await this.loadAllDetails(concurrency, onProgress);
				result.loadedDetails = detailsResult.loaded;
				result.errors.push(...detailsResult.errors);
			}

			// Cache images if requested
			if (cacheImages) {
				const imageResult = await this.cacheAllImages(concurrency, onProgress);
				result.cachedImages = imageResult.cached;
				result.errors.push(...imageResult.errors);
			}

			result.success = result.errors.length === 0;
			result.executionTime = Date.now() - startTime;

			console.log(`Static data preload completed in ${result.executionTime}ms`);
			console.log(
				`Collections: ${result.loadedCollections.length}, Details: ${result.loadedDetails.length}, Images: ${result.cachedImages}`
			);

			return result;
		} catch (error) {
			const apiError = ApiErrorFactory.fromUnknownError(error);
			errorLogger.logError(apiError, 'error', { operation: 'preload-all-data' });

			result.errors.push({
				stage: 'preload',
				error: apiError.message
			});
			result.executionTime = Date.now() - startTime;

			throw apiError;
		}
	}

	/**
	 * Load main collections
	 */
	private async loadCollections(): Promise<Record<string, unknown>> {
		const endpoints = ['home', 'visit', 'programmes', 'exhibitions', 'contributors'] as const;

		const responses = await Promise.allSettled([
			this.fetchAndCache<Home>('home'),
			this.fetchAndCache<Visit>('visit'),
			this.fetchAndCache<Programmes>('programmes'),
			this.fetchAndCache<Exhibitions>('exhibitions'),
			this.fetchAndCache<Contributors>('contributors')
		]);

		const collections: Record<string, unknown> = {};

		responses.forEach((response, index) => {
			const endpoint = endpoints[index];
			if (response.status === 'fulfilled') {
				collections[endpoint] = response.value;
			} else {
				errorLogger.logError(ApiErrorFactory.fromUnknownError(response.reason), 'error', {
					endpoint,
					operation: 'load-collection'
				});
			}
		});

		return collections;
	}

	/**
	 * Load all detail pages
	 */
	private async loadAllDetails(
		concurrency: number,
		onProgress?: (stage: string, progress: number, total: number) => void
	): Promise<{ loaded: string[]; errors: Array<{ stage: string; error: string }> }> {
		const collections = ['programmes', 'exhibitions', 'contributors'] as const;
		const allDetails: Array<{ id: string; collection: string }> = [];
		const errors: Array<{ stage: string; error: string }> = [];

		// Collect all detail IDs
		for (const collectionName of collections) {
			try {
				const collection = this.getStaticData<{ children: Array<{ id: string }> }>(collectionName);
				if (collection?.children) {
					allDetails.push(
						...collection.children.map((item) => ({
							id: item.id,
							collection: collectionName
						}))
					);
				}
			} catch (error) {
				errors.push({
					stage: `collect-${collectionName}-ids`,
					error: error instanceof Error ? error.message : 'Unknown error'
				});
			}
		}

		if (allDetails.length === 0) {
			return { loaded: [], errors };
		}

		onProgress?.('Loading details', 0, allDetails.length);

		// Load details in batches
		const loaded: string[] = [];
		await batchProcess(
			allDetails,
			async ({ id }, index) => {
				try {
					await this.fetchAndCache<DetailType>(id);
					loaded.push(id);
					onProgress?.('Loading details', index + 1, allDetails.length);
				} catch (error) {
					errors.push({
						stage: `load-detail-${id}`,
						error: error instanceof Error ? error.message : 'Unknown error'
					});
				}
			},
			{
				concurrency,
				onError: (error, item) => {
					errors.push({
						stage: `load-detail-${item.id}`,
						error: error.message
					});
				}
			}
		);

		return { loaded, errors };
	}

	/**
	 * Cache all images
	 */
	private async cacheAllImages(
		concurrency: number,
		onProgress?: (stage: string, progress: number, total: number) => void
	): Promise<{ cached: number; errors: Array<{ stage: string; error: string }> }> {
		const errors: Array<{ stage: string; error: string }> = [];
		let cached = 0;

		try {
			onProgress?.('Caching images', 0, 5);

			// Cache home images
			try {
				await this.cacheHomeImages();
				cached++;
				onProgress?.('Caching images', 1, 5);
			} catch (error) {
				errors.push({
					stage: 'cache-home-images',
					error: error instanceof Error ? error.message : 'Unknown error'
				});
			}

			// Cache visit images
			try {
				await this.cacheVisitImages();
				cached++;
				onProgress?.('Caching images', 2, 5);
			} catch (error) {
				errors.push({
					stage: 'cache-visit-images',
					error: error instanceof Error ? error.message : 'Unknown error'
				});
			}

			// Cache collection images
			const collections: Array<{ key: CollectionType; name: string }> = [
				{ key: 'programmes', name: 'programmes' },
				{ key: 'exhibitions', name: 'exhibitions' },
				{ key: 'contributors', name: 'contributors' }
			];

			for (let i = 0; i < collections.length; i++) {
				try {
					await this.cacheCollectionImages(collections[i].key);
					cached++;
					onProgress?.('Caching images', 3 + i, 5);
				} catch (error) {
					errors.push({
						stage: `cache-${collections[i].name}-images`,
						error: error instanceof Error ? error.message : 'Unknown error'
					});
				}
			}

			return { cached, errors };
		} catch (error) {
			errors.push({
				stage: 'cache-all-images',
				error: error instanceof Error ? error.message : 'Unknown error'
			});
			return { cached, errors };
		}
	}

	/**
	 * Fetch data with caching
	 */
	private async fetchAndCache<T>(endpoint: string): Promise<T> {
		// Check if already loading
		if (this.loadingPromises.has(endpoint)) {
			return this.loadingPromises.get(endpoint) as Promise<T>;
		}

		// Check static cache first
		if (this.staticData.has(endpoint)) {
			return this.staticData.get(endpoint) as T;
		}

		// Check general cache
		const cached = generalCache.get<T>(this.CACHE_PREFIX + endpoint);
		if (cached) {
			this.staticData.set(endpoint, cached);
			return cached;
		}

		// Fetch from API
		const loadingPromise = apiClient
			.get<T>(endpoint)
			.then((response) => {
				const data = response.data;
				this.staticData.set(endpoint, data);
				generalCache.set(this.CACHE_PREFIX + endpoint, data);
				this.loadingPromises.delete(endpoint);
				return data;
			})
			.catch((error) => {
				this.loadingPromises.delete(endpoint);
				throw error;
			});

		this.loadingPromises.set(endpoint, loadingPromise);
		return loadingPromise;
	}

	/**
	 * Get preloaded data by key
	 */
	getStaticData<T>(key: string): T {
		if (!this.staticData.has(key)) {
			throw new Error(`Static data for "${key}" not found. Make sure to preload it first.`);
		}
		return deepClone(this.staticData.get(key) as T);
	}

	/**
	 * Check if data is preloaded
	 */
	hasStaticData(key: string): boolean {
		return this.staticData.has(key);
	}

	/**
	 * Fetch data from API with fallback to static cache
	 */
	async fetchStaticData<T>(key: string): Promise<T> {
		if (this.hasStaticData(key)) {
			return this.getStaticData<T>(key);
		}

		return await this.fetchAndCache<T>(key);
	}

	/**
	 * Cache home page images
	 */
	private async cacheHomeImages(): Promise<void> {
		const homeData = this.getStaticData<Home>('home');

		if (homeData.carousel?.length) {
			homeData.carousel = await Promise.all(
				homeData.carousel.map(async (item) => ({
					...item,
					...(await cacheMediaImage(item))
				}))
			);
			this.staticData.set('home', homeData);
		}
	}

	/**
	 * Cache visit page images
	 */
	private async cacheVisitImages(): Promise<void> {
		const visitData = this.getStaticData<Visit>('visit');

		if (visitData.photography?.length) {
			visitData.photography = await Promise.all(
				visitData.photography.map(async (item) => ({
					...item,
					...(await cacheMediaImage(item))
				}))
			);
			this.staticData.set('visit', visitData);
		}
	}

	/**
	 * Cache collection images
	 */
	private async cacheCollectionImages(collectionKey: CollectionType): Promise<void> {
		const data = this.getStaticData<{
			children: Array<{ cover: MediaCover }>;
			text?: ContentBlock[];
		}>(collectionKey);

		// Process collection item cover images
		if (data.children?.length) {
			data.children = await Promise.all(
				data.children.map(async (item) => ({
					...item,
					cover: await cacheMediaImage(item.cover)
				}))
			);
		}

		// Process content block images
		if (data.text?.length) {
			data.text = await procesContentBlockImages(data.text);
		}

		this.staticData.set(collectionKey, data);
	}

	/**
	 * Cache detail page images
	 */
	async cacheDetailImages(collectionKey: CollectionType): Promise<void> {
		const collection = this.getStaticData<{ children: Array<{ id: string }> }>(collectionKey);

		if (!collection?.children) return;

		await batchProcess(
			collection.children,
			async (item) => {
				try {
					const data = this.getStaticData<{
						id: string;
						cover: MediaCover;
						text?: ContentBlock[] | string;
					}>(item.id);

					// Cache cover image
					if (data.cover?.url) {
						data.cover = await cacheMediaImage(data.cover);
					}

					// Cache content block images
					if (Array.isArray(data.text) && data.text.length) {
						data.text = await procesContentBlockImages(data.text);
					}

					this.staticData.set(item.id, data);
				} catch (error) {
					console.warn(`Failed to cache images for ${item.id}:`, error);
				}
			},
			{ concurrency: 5 }
		);
	}

	/**
	 * Clear all cached data
	 */
	clearCache(): void {
		this.staticData.clear();
		this.loadingPromises.clear();
		generalCache.clear();
		imageCache.resetStats();
	}

	/**
	 * Get cache statistics
	 */
	getStats() {
		return {
			staticDataSize: this.staticData.size,
			loadingPromises: this.loadingPromises.size,
			imageCache: imageCache.getStats(),
			generalCache: generalCache.getStats()
		};
	}
}

// Create and export singleton instance
export const staticDataManager = new StaticDataManager();

// Export backward-compatible functions
export async function preloadAllData(): Promise<void> {
	await staticDataManager.preloadAllData({ includeDetails: false, cacheImages: true });
}

export function getStaticData<T>(key: string): T {
	return staticDataManager.getStaticData<T>(key);
}

export function hasStaticData(key: string): boolean {
	return staticDataManager.hasStaticData(key);
}

export async function fetchStaticData<T>(key: string): Promise<T> {
	return staticDataManager.fetchStaticData<T>(key);
}

// Export individual cache functions for backward compatibility
export async function cacheDetailImages(collectionKey: CollectionType): Promise<void> {
	return staticDataManager.cacheDetailImages(collectionKey);
}
