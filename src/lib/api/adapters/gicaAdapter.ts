/**
 * GICA API Adapter
 * Provides GICA-specific implementations and fallbacks
 */

import { createDataManager } from '../core/dataManager';
import { gicaSchemaConfig } from '../schemas/gicaSchema';
import type { FallbackFactory } from '../core/types';

// GICA-specific fallback data
const gicaFallbacks: Record<string, FallbackFactory> = {
	home: () => ({
		title: 'GICA',
		headline: '',
		about: [],
		carousel: [],
		pages: []
	}),
	contributors: () => ({
		title: 'Contributors',
		text: [],
		pages: [],
		children: []
	}),
	visit: () => ({
		title: 'Visit',
		address: '',
		email: '',
		socials: [],
		photography: [],
		hours: [],
		pages: []
	}),
	exhibitions: () => ({
		title: 'Exhibitions',
		text: [],
		pages: [],
		children: []
	}),
	programmes: () => ({
		title: 'Programmes',
		text: [],
		pages: [],
		children: []
	})
};

/**
 * Create a configured GICA data manager
 */
export function createGicaDataManager() {
	return createDataManager(gicaSchemaConfig, gicaFallbacks);
}

/**
 * Singleton GICA data manager instance
 */
export const gicaDataManager = createGicaDataManager();

// Export configured data manager with GICA-specific typing
export type GicaDataManager = ReturnType<typeof createGicaDataManager>;

// Helper functions for common GICA operations
export async function getHome() {
	return gicaDataManager.getPage('home');
}

export async function getVisit() {
	return gicaDataManager.getPage('visit');
}

export async function getContributors() {
	return gicaDataManager.getCollection('contributors');
}

export async function getProgrammes() {
	return gicaDataManager.getCollection('programmes');
}

export async function getContributor(id: string) {
	return gicaDataManager.getDetail('contributors', id);
}

export async function getProgramme(id: string) {
	return gicaDataManager.getDetail('programmes', id);
}

/**
 * Preload all GICA data
 */
export async function preloadGicaData(options?: {
	includeDetails?: boolean;
	cacheImages?: boolean;
	onProgress?: (stage: string, progress: number, total: number) => void;
}) {
	return gicaDataManager.preloadAll(options);
}

/**
 * Clear all GICA cached data
 */
export function clearGicaCache() {
	gicaDataManager.clearCache();
}
