/**
 * Server utilities for SvelteKit load functions
 * Provides reusable patterns for data loading in +page.server.ts and +layout.server.ts files
 */

import { getStaticData, fetchStaticData } from './staticApi';
import type { DataType } from './types';

/**
 * Configuration for server data loading
 */
export interface ServerLoadConfig<T = unknown> {
	/** The data type/endpoint to fetch (can be collection or single page) */
	dataType: DataType;
	/** The key to use in the returned data object */
	returnKey: string;
	/** Custom fallback data factory function */
	fallbackFactory?: () => T;
	/** Custom error message prefix */
	errorPrefix?: string;
}

/**
 * Default fallback data factories for common data types
 */
const defaultFallbacks = {
	home: () => ({
		title: 'GICA',
		headline: '',
		about: [],
		carousel: [],
		pages: []
	}),
	contributors: () => ({
		title: 'Contributors',
		content: [],
		cover: null,
		id: 'contributors',
		slug: 'contributors',
		contributors: []
	}),
	visit: () => ({
		title: 'Visit',
		content: [],
		cover: null,
		id: 'visit',
		slug: 'visit',
		operatingHours: [],
		socialLinks: []
	}),
	exhibitions: () => ({
		title: 'Exhibitions',
		content: [],
		cover: null,
		id: 'exhibitions',
		slug: 'exhibitions',
		exhibitions: []
	}),
	programmes: () => ({
		title: 'Programmes',
		content: [],
		cover: null,
		id: 'programmes',
		slug: 'programmes',
		programmes: []
	})
};

/**
 * Generic server load function that handles the common pattern of:
 * - Checking development environment
 * - Loading data from cache or API
 * - Handling errors with fallback data
 *
 * @param config Configuration object for the load function
 * @returns Load function result with the requested data
 *
 * @example
 * ```typescript
 * // In +page.server.ts
 * export const load = () => createServerLoader({
 *   dataType: 'contributors',
 *   returnKey: 'contributors'
 * });
 * ```
 */
export async function createServerLoader<T = unknown>(
	config: ServerLoadConfig<T>
): Promise<Record<string, T>> {
	const { dataType, returnKey, fallbackFactory, errorPrefix = 'Failed to load' } = config;

	const development = import.meta.env.DEV === true;

	try {
		let data: T;

		if (!development) {
			data = getStaticData<T>(dataType);
		} else {
			data = await fetchStaticData<T>(dataType);
		}

		return { [returnKey]: data };
	} catch (error) {
		console.error(`${errorPrefix} ${dataType} data:`, error);

		// Use custom fallback or default fallback
		const fallback = fallbackFactory
			? fallbackFactory()
			: (defaultFallbacks[dataType as keyof typeof defaultFallbacks]?.() as unknown as T) ||
				({
					title: dataType.charAt(0).toUpperCase() + dataType.slice(1),
					content: [],
					cover: null,
					id: dataType,
					slug: dataType
				} as unknown as T);

		return { [returnKey]: fallback };
	}
}

/**
 * Convenience function for common single-entity loads
 * Automatically uses the dataType as the return key
 */
export const loadEntity = <T = unknown>(dataType: DataType, fallbackFactory?: () => T) =>
	createServerLoader<T>({
		dataType,
		returnKey: dataType,
		fallbackFactory
	});

/**
 * Convenience function for home page loading (special case with pages)
 */
export const loadHome = () =>
	createServerLoader({
		dataType: 'home' as DataType,
		returnKey: 'home',
		errorPrefix: 'Failed to load site data in layout'
	});

/**
 * Higher-order function that creates a load function
 * This is useful when you need to maintain the exact function signature
 * that SvelteKit expects
 */
export function createLoadFunction<T = unknown>(config: ServerLoadConfig<T>) {
	return async () => createServerLoader(config);
}

/**
 * Batch loader for loading multiple data types in a single function
 * Useful for layout files that need multiple data sources
 */
export async function createBatchLoader(
	configs: Array<ServerLoadConfig<unknown>>
): Promise<Record<string, unknown>> {
	const results = await Promise.allSettled(configs.map((config) => createServerLoader(config)));

	const combinedResult: Record<string, unknown> = {};

	results.forEach((result, index) => {
		if (result.status === 'fulfilled') {
			Object.assign(combinedResult, result.value);
		} else {
			const config = configs[index];
			console.error(`Failed to load ${config.dataType}:`, result.reason);

			// Add fallback for failed load
			const fallback =
				config.fallbackFactory?.() ||
				(defaultFallbacks[config.dataType as keyof typeof defaultFallbacks]?.() as unknown) ||
				({
					title: config.dataType.charAt(0).toUpperCase() + config.dataType.slice(1),
					content: [],
					cover: null,
					id: config.dataType,
					slug: config.dataType
				} as unknown);

			combinedResult[config.returnKey] = fallback;
		}
	});

	return combinedResult;
}
