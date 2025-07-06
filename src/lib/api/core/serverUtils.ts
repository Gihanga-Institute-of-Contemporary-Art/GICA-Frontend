/**
 * Generic Server Utilities for SvelteKit
 * Project-agnostic server load functions that can be configured for any schema
 */

import type { GenericLoadConfig, DataManager, ProjectSchema, FallbackFactory } from '../core/types';

/**
 * Generic server load function creator
 */
export function createGenericServerLoader<T extends ProjectSchema>(dataManager: DataManager<T>) {
	/**
	 * Create a load function for any data type
	 */
	function createLoadFunction<D = unknown>(config: GenericLoadConfig<D>) {
		return async () => {
			try {
				let data: unknown;

				// Determine if this is a collection or page
				if (config.dataType.includes('/')) {
					// This is a detail request (e.g., "programmes/123")
					const [type, id] = config.dataType.split('/');
					data = await dataManager.getDetail(type as keyof T['details'], id);
				} else {
					// Try as collection first, then as page
					try {
						data = await dataManager.getCollection(config.dataType as keyof T['collections']);
					} catch {
						data = await dataManager.getPage(config.dataType as keyof T['pages']);
					}
				}

				return {
					[config.returnKey]: data
				};
			} catch (error) {
				console.error(`${config.errorPrefix || 'Error'} loading ${config.dataType}:`, error);

				// Use fallback if available
				if (config.fallbackFactory) {
					return {
						[config.returnKey]: config.fallbackFactory()
					};
				}

				// Return minimal fallback
				return {
					[config.returnKey]: {
						title: config.dataType,
						error: 'Failed to load data'
					}
				};
			}
		};
	}

	/**
	 * Create a batch loader for multiple data types
	 */
	function createBatchLoader(configs: GenericLoadConfig[]) {
		return async () => {
			const results: Record<string, unknown> = {};

			await Promise.allSettled(
				configs.map(async (config) => {
					try {
						const loadFn = createLoadFunction(config);
						const result = await loadFn();
						Object.assign(results, result);
					} catch (error) {
						console.error(`Batch load error for ${config.dataType}:`, error);
						if (config.fallbackFactory) {
							results[config.returnKey] = config.fallbackFactory();
						}
					}
				})
			);

			return results;
		};
	}

	return {
		createLoadFunction,
		createBatchLoader
	};
}

/**
 * Helper to create a simple load function
 */
export function createSimpleLoader<T extends ProjectSchema>(
	dataManager: DataManager<T>,
	dataType: string,
	returnKey: string,
	fallbackFactory?: FallbackFactory
) {
	const { createLoadFunction } = createGenericServerLoader(dataManager);
	return createLoadFunction({
		dataType,
		returnKey,
		fallbackFactory,
		errorPrefix: `[${dataType}]`
	});
}
