/**
 * Core API Library Exports
 * Project-agnostic functionality that can be used across different projects
 */

// Core types and interfaces
export * from './types';

// Data management
export * from './dataManager';

// Server utilities
export * from './serverUtils';

// Configuration
export { setupApiConfig, setupApiConfigWithEnv, configManager } from './config';
export type { ApiConfig, CacheConfig, RetryConfig } from './config';

// HTTP Client
export { apiClient, fetchApi, fetchWithCache } from './client';
export type { RequestOptions, ApiResponse } from './client';

// Error handling
export { ApiError, ApiErrorFactory, errorLogger } from './errors';
export { ApiErrorType } from './errors';
export type { ApiErrorContext, ErrorLogEntry } from './errors';

// Caching
export { apiCache, generalCache, AdvancedCache, ApiCache } from './cache';
export type { CacheEntry, CacheStats, CacheOptions } from './cache';

// Image caching and optimization
export {
	imageCache,
	ImageCache,
	cacheImage,
	procesContentBlockImages,
	cacheMediaImages,
	cacheMediaImage
} from './imageCache';
export type {
	CacheOptions as ImageCacheOptions,
	ImageTransformation,
	CacheResult,
	ImageCacheStats
} from './imageCache';

// Utilities
export {
	sleep,
	createTimeoutController,
	withRetry,
	fetchWithTimeout,
	batchProcess,
	debounce,
	throttle,
	deepClone,
	isPlainObject,
	deepMerge,
	generateUUID,
	toKebabCase,
	toCamelCase,
	sanitizeFilename,
	formatBytes,
	getFileExtension,
	isAbsoluteUrl
} from './utils';
