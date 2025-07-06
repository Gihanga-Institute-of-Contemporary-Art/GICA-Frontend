/**
 * API Library Entry Point (v2.0)
 * Modern, portable, and type-safe API library
 *
 * USAGE PATTERNS:
 *
 * Modern (Recommended):
 * import { getHome, getContributors } from '$lib/api/adapters/gicaAdapter';
 *
 * Generic Core:
 * import { createDataManager } from '$lib/api/core';
 *
 * Legacy (Still supported):
 * import { preloadAllData, getStaticData } from '$lib/api/legacy/staticApi';
 */

// Internal imports for functions
import { setupApiConfig as _setupApiConfig } from './core/config';

// NEW: Modern modular exports (recommended for new projects)
export * from './core';
export * from './schemas/gicaSchema';
export * from './adapters/gicaAdapter';

// Legacy exports for backward compatibility
export {
	staticDataManager,
	preloadAllData,
	getStaticData,
	hasStaticData,
	fetchStaticData,
	cacheDetailImages
} from './legacy/staticApi';
export type {
	PreloadOptions as LegacyPreloadOptions,
	PreloadResult as LegacyPreloadResult
} from './legacy/staticApi';

export {
	createServerLoader,
	loadEntity,
	loadHome,
	createLoadFunction,
	createBatchLoader
} from './legacy/serverUtils';
export type { ServerLoadConfig } from './legacy/serverUtils';

// Legacy types (from the original types.ts - deprecated but kept for compatibility)
export type {
	BaseEntity,
	BaseCollection,
	MediaCover,
	SrcSet,
	ContentBlock as LegacyContentBlock,
	TextContentBlock as LegacyTextContentBlock,
	ImageContentBlock as LegacyImageContentBlock,
	TextContent,
	ImageContent,
	TextBlockValue,
	Home,
	Visit,
	Page,
	Contributor,
	Contributors,
	Programme,
	Programmes,
	Exhibition,
	Exhibitions,
	DateStructure,
	SocialLink,
	SocialPlatform,
	OperatingHours,
	CollectionType as LegacyCollectionType,
	PageType as LegacyPageType,
	DataType as LegacyDataType,
	DetailType as LegacyDetailType,
	CollectionMap,
	PageMap,
	DetailMap,
	DataMap,
	ApiResponse as ApiResponseType,
	ApiResponseMeta,
	ValidationError,
	ValidationResult,
	WithRequired,
	WithOptional,
	isTextContentBlock,
	isImageContentBlock
} from './legacy/types';

/**
 * Version
 * Legacy: 1.0.0, Modern: 2.0.0
 */
export const VERSION = '2.0.0';
export const LEGACY_VERSION = '1.0.0';

/**
 * Quick setup function for new projects
 *
 * @example
 * ```typescript
 * import { quickSetup } from '@/lib/api';
 *
 * quickSetup({
 *   baseUrl: 'https://api.example.com',
 *   apiToken: 'your-token'
 * });
 * ```
 */
export function quickSetup(config: {
	baseUrl: string;
	apiToken?: string;
	timeout?: number;
	retryAttempts?: number;
	cacheEnabled?: boolean;
}): void {
	_setupApiConfig(config);
}

/**
 * Initialize the API library with sensible defaults
 * Call this once in your application startup
 */
export function initializeApi(config?: {
	baseUrl?: string;
	apiToken?: string;
	environment?: 'development' | 'production' | 'test';
}): void {
	try {
		_setupApiConfig(config || {});
		console.log('API library initialized successfully');
	} catch (error) {
		console.error('Failed to initialize API library:', error);
		throw error;
	}
}

// Legacy comment preserved for backward compatibility
/*
 * MIGRATION GUIDE:
 *
 * Legacy approach (still works):
 * import { preloadAllData, getStaticData } from '$lib/api';
 *
 * Modern approach (recommended):
 * import { gicaDataManager, getHome, getContributors } from '$lib/api/adapters/gicaAdapter';
 *
 * For new projects:
 * 1. Create schema in schemas/yourSchema.ts
 * 2. Create adapter in adapters/yourAdapter.ts
 * 3. Import and use your adapter functions
 *
 * See MIGRATION_GUIDE.md for detailed instructions.
 */
