/**
 * Generic Data Manager
 * Project-agnostic data management that can be configured for any project schema
 */

import { apiClient } from './client';
import { generalCache } from './cache';
import { imageCache } from './imageCache';
import { batchProcess, deepClone } from './utils';
import { errorLogger, ApiErrorFactory } from './errors';
import type {
	ProjectSchema,
	SchemaConfig,
	DataManager,
	MediaAsset,
	FallbackFactory,
	PreloadOptions,
	PreloadResult
} from './types';

/**
 * Generic data manager that works with any project schema
 */
export class GenericDataManager<T extends ProjectSchema = ProjectSchema> implements DataManager<T> {
	private staticData = new Map<string, unknown>();
	private loadingPromises = new Map<string, Promise<unknown>>();
	private readonly CACHE_PREFIX = 'static_';
	private fallbackFactories = new Map<string, FallbackFactory>();

	constructor(
		private config: SchemaConfig<T>,
		fallbacks?: Record<string, FallbackFactory>
	) {
		if (fallbacks) {
			Object.entries(fallbacks).forEach(([key, factory]) => {
				this.fallbackFactories.set(key, factory);
			});
		}
	}

	/**
	 * Get collection data
	 */
	async getCollection<K extends keyof T['collections']>(type: K): Promise<T['collections'][K]> {
		return this.getData(String(type)) as Promise<T['collections'][K]>;
	}

	/**
	 * Get page data
	 */
	async getPage<K extends keyof T['pages']>(type: K): Promise<T['pages'][K]> {
		return this.getData(String(type)) as Promise<T['pages'][K]>;
	}

	/**
	 * Get detail data
	 */
	async getDetail<K extends keyof T['details']>(type: K, id: string): Promise<T['details'][K]> {
		const key = `${String(type)}/${id}`;
		return this.getData(key) as Promise<T['details'][K]>;
	}

	/**
	 * Generic data fetching with caching
	 */
	private async getData(key: string): Promise<unknown> {
		// Check if we already have this data
		if (this.staticData.has(key)) {
			return deepClone(this.staticData.get(key));
		}

		// Check if we're already loading this data
		if (this.loadingPromises.has(key)) {
			return this.loadingPromises.get(key);
		}

		// Check cache first
		const cacheKey = `${this.CACHE_PREFIX}${key}`;
		const cached = generalCache.get(cacheKey);
		if (cached) {
			this.staticData.set(key, cached);
			return deepClone(cached);
		}

		// Create loading promise
		const loadingPromise = this.fetchData(key);
		this.loadingPromises.set(key, loadingPromise);

		try {
			const data = await loadingPromise;
			this.staticData.set(key, data);
			generalCache.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes
			return deepClone(data);
		} catch (error) {
			const apiError = ApiErrorFactory.fromUnknownError(error, {
				additionalInfo: { operation: 'getData', key }
			});
			errorLogger.logError(apiError);

			// Try to return fallback data
			const fallback = this.fallbackFactories.get(key);
			if (fallback) {
				const fallbackData = fallback();
				this.staticData.set(key, fallbackData);
				return fallbackData;
			}

			throw error;
		} finally {
			this.loadingPromises.delete(key);
		}
	}

	/**
	 * Fetch data from API
	 */
	private async fetchData(key: string): Promise<unknown> {
		try {
			const response = await apiClient.get(`/${key}`);
			return response.data;
		} catch (error) {
			throw ApiErrorFactory.fromUnknownError(error, {
				additionalInfo: { key, operation: 'fetchData' }
			});
		}
	}

	/**
	 * Preload all data based on schema configuration
	 */
	async preloadAll(options: PreloadOptions = {}): Promise<PreloadResult> {
		const startTime = Date.now();
		const result: PreloadResult = {
			success: true,
			loadedCollections: [],
			loadedDetails: [],
			cachedImages: 0,
			errors: [],
			executionTime: 0
		};

		try {
			// Preload collections
			await this.preloadCollections(result, options);

			// Preload pages
			await this.preloadPages(result, options);

			// Preload details if requested
			if (options.includeDetails) {
				await this.preloadDetails(result, options);
			}

			// Cache images if requested
			if (options.cacheImages) {
				await this.preloadImages(result, options);
			}
		} catch (error) {
			result.success = false;
			result.errors.push({
				stage: 'preload',
				error: error instanceof Error ? error.message : String(error)
			});
		}

		result.executionTime = Date.now() - startTime;
		return result;
	}

	/**
	 * Preload collections
	 */
	private async preloadCollections(result: PreloadResult, options: PreloadOptions): Promise<void> {
		const collections = this.config.collectionTypes;

		await batchProcess(
			collections,
			async (collectionType) => {
				try {
					await this.getCollection(collectionType);
					result.loadedCollections.push(String(collectionType));
					options.onProgress?.('collections', result.loadedCollections.length, collections.length);
				} catch (error) {
					result.errors.push({
						stage: `collection-${String(collectionType)}`,
						error: error instanceof Error ? error.message : String(error)
					});
				}
			},
			{ concurrency: options.concurrency || 3 }
		);
	}

	/**
	 * Preload pages
	 */
	private async preloadPages(result: PreloadResult, options: PreloadOptions): Promise<void> {
		const pages = this.config.pageTypes;

		await batchProcess(
			pages,
			async (pageType) => {
				try {
					await this.getPage(pageType);
					options.onProgress?.('pages', result.loadedCollections.length, pages.length);
				} catch (error) {
					result.errors.push({
						stage: `page-${String(pageType)}`,
						error: error instanceof Error ? error.message : String(error)
					});
				}
			},
			{ concurrency: options.concurrency || 3 }
		);
	}

	/**
	 * Preload detail items
	 */
	private async preloadDetails(result: PreloadResult, options: PreloadOptions): Promise<void> {
		// This would require additional logic to get detail IDs from collections
		// Implementation depends on specific project requirements

		// For now, just mark as completed to avoid unused parameter warnings
		options.onProgress?.('details', 0, 0);
		// Future implementation would populate result.loadedDetails
	}

	/**
	 * Preload and cache images
	 */
	private async preloadImages(result: PreloadResult, options: PreloadOptions): Promise<void> {
		const images: MediaAsset[] = [];

		// Extract images from all loaded data
		for (const [, data] of this.staticData) {
			this.extractImages(data, images);
		}

		// Cache images in batches
		await batchProcess(
			images,
			async (image, index) => {
				try {
					await imageCache.cacheImage(image.url);
					result.cachedImages++;
					// Report progress
					options.onProgress?.('images', index + 1, images.length);
				} catch (error) {
					// Log but don't fail the whole process for image caching
					const apiError = ApiErrorFactory.fromUnknownError(error, {
						additionalInfo: { operation: 'cacheImage', url: image.url }
					});
					errorLogger.logError(apiError);
				}
			},
			{ concurrency: 5 }
		);
	}

	/**
	 * Extract images from data recursively
	 */
	private extractImages(data: unknown, images: MediaAsset[]): void {
		if (!data || typeof data !== 'object') return;

		if (Array.isArray(data)) {
			data.forEach((item) => this.extractImages(item, images));
			return;
		}

		const obj = data as Record<string, unknown>;

		// Check if this is a media asset
		if (obj.url && typeof obj.url === 'string') {
			images.push(obj as unknown as MediaAsset);
		}

		// Check for common image fields
		const imageFields = ['cover', 'image', 'images', 'carousel', 'photography'];
		for (const field of imageFields) {
			if (obj[field]) {
				this.extractImages(obj[field], images);
			}
		}

		// Check content blocks
		if (obj.content || obj.text || obj.about) {
			this.extractImages(obj.content || obj.text || obj.about, images);
		}

		// Recursively check other objects
		Object.values(obj).forEach((value) => {
			if (typeof value === 'object') {
				this.extractImages(value, images);
			}
		});
	}

	/**
	 * Clear all cached data
	 */
	clearCache(): void {
		this.staticData.clear();
		this.loadingPromises.clear();

		// Clear related caches
		const keys = Array.from(generalCache.keys()).filter((key) => key.startsWith(this.CACHE_PREFIX));
		keys.forEach((key) => generalCache.delete(key));
	}

	/**
	 * Check if data exists
	 */
	hasData(key: string): boolean {
		return this.staticData.has(key) || generalCache.has(`${this.CACHE_PREFIX}${key}`);
	}

	/**
	 * Set fallback factory for a specific data type
	 */
	setFallback(key: string, factory: FallbackFactory): void {
		this.fallbackFactories.set(key, factory);
	}
}

/**
 * Create a configured data manager instance
 */
export function createDataManager<T extends ProjectSchema>(
	config: SchemaConfig<T>,
	fallbacks?: Record<string, FallbackFactory>
): GenericDataManager<T> {
	return new GenericDataManager(config, fallbacks);
}
