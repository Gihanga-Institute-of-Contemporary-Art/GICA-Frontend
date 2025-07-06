/**
 * Utility Functions for API Operations
 * Reusable helpers for common tasks like retries, timeouts, and data processing
 */

import { ApiError, ApiErrorFactory, ApiErrorType } from './errors';
import type { RetryConfig } from './config';

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create an AbortController that times out after specified milliseconds
 */
export function createTimeoutController(timeoutMs: number): AbortController {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => {
		controller.abort();
	}, timeoutMs);

	// Clean up timeout when the signal is aborted from elsewhere
	controller.signal.addEventListener('abort', () => {
		clearTimeout(timeoutId);
	});

	return controller;
}

/**
 * Retry function with exponential backoff
 */
export async function withRetry<T>(
	fn: () => Promise<T>,
	config: RetryConfig,
	context: { endpoint?: string; operation?: string } = {}
): Promise<T> {
	let lastError: ApiError;
	let delay = config.delay;

	for (let attempt = 1; attempt <= config.attempts; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = ApiErrorFactory.fromUnknownError(error, {
				...context,
				retryAttempt: attempt
			});

			// Don't retry if error is not retryable or this is the last attempt
			if (!lastError.isRetryable || attempt === config.attempts) {
				throw lastError;
			}

			// Wait before next attempt with exponential backoff
			await sleep(delay);
			delay = Math.min(delay * (config.backoffMultiplier || 2), config.maxDelay || 10000);
		}
	}

	throw lastError!;
}

/**
 * Create a fetch request with timeout and proper error handling
 */
export async function fetchWithTimeout(
	url: string,
	options: RequestInit = {},
	timeoutMs = 30000
): Promise<Response> {
	const controller = createTimeoutController(timeoutMs);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		});

		return response;
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				throw ApiErrorFactory.fromNetworkError(new Error('Request timed out'), { endpoint: url });
			}
			throw ApiErrorFactory.fromNetworkError(error, { endpoint: url });
		}
		throw error;
	}
}

/**
 * Batch process items with concurrency limit
 */
export async function batchProcess<T, R>(
	items: T[],
	processor: (item: T, index: number) => Promise<R>,
	options: {
		concurrency?: number;
		onProgress?: (completed: number, total: number) => void;
		onError?: (error: Error, item: T, index: number) => void;
	} = {}
): Promise<R[]> {
	const { concurrency = 5, onProgress, onError } = options;
	const results: R[] = new Array(items.length);
	const errors: Array<{ index: number; error: Error }> = [];
	let completed = 0;

	// Process items in batches
	for (let i = 0; i < items.length; i += concurrency) {
		const batch = items.slice(i, i + concurrency);
		const batchPromises = batch.map(async (item, batchIndex) => {
			const actualIndex = i + batchIndex;
			try {
				const result = await processor(item, actualIndex);
				results[actualIndex] = result;
				completed++;
				onProgress?.(completed, items.length);
				return result;
			} catch (error) {
				const apiError = ApiErrorFactory.fromUnknownError(error);
				errors.push({ index: actualIndex, error: apiError });
				onError?.(apiError, item, actualIndex);
				completed++;
				onProgress?.(completed, items.length);
				throw apiError;
			}
		});

		// Wait for current batch to complete
		await Promise.allSettled(batchPromises);
	}

	// If there were errors, throw an aggregate error
	if (errors.length > 0) {
		throw new ApiError(
			`Batch processing failed for ${errors.length} items`,
			ApiErrorType.UNKNOWN_ERROR,
			undefined,
			{
				additionalInfo: {
					errors: errors.map((e) => ({ index: e.index, message: e.error.message }))
				}
			}
		);
	}

	return results;
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: never[]) => Promise<unknown>>(
	func: T,
	waitMs: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
	let timeoutId: NodeJS.Timeout | null = null;
	let resolvers: Array<{
		resolve: (value: Awaited<ReturnType<T>>) => void;
		reject: (error: unknown) => void;
	}> = [];

	return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
		return new Promise((resolve, reject) => {
			resolvers.push({ resolve, reject });

			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(async () => {
				const currentResolvers = resolvers;
				resolvers = [];

				try {
					const result = await func(...args);
					currentResolvers.forEach(({ resolve }) => resolve(result as Awaited<ReturnType<T>>));
				} catch (error) {
					currentResolvers.forEach(({ reject }) => reject(error));
				}
			}, waitMs);
		});
	};
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: never[]) => unknown>(
	func: T,
	limitMs: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
	let lastCall = 0;
	let lastResult: ReturnType<T> | undefined;

	return (...args: Parameters<T>): ReturnType<T> | undefined => {
		const now = Date.now();
		if (now - lastCall >= limitMs) {
			lastCall = now;
			lastResult = func(...args) as ReturnType<T>;
			return lastResult;
		}
		return lastResult;
	};
}

/**
 * Deep clone an object (JSON-safe)
 */
export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (obj instanceof Date) {
		return new Date(obj.getTime()) as unknown as T;
	}

	if (obj instanceof Array) {
		return obj.map((item) => deepClone(item)) as unknown as T;
	}

	if (typeof obj === 'object') {
		const cloned = {} as T;
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				cloned[key] = deepClone(obj[key]);
			}
		}
		return cloned;
	}

	return obj;
}

/**
 * Check if a value is a plain object
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
	return (
		value !== null &&
		typeof value === 'object' &&
		Object.prototype.toString.call(value) === '[object Object]'
	);
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends Record<string, unknown>>(
	target: T,
	...sources: Array<Partial<T>>
): T {
	if (!sources.length) return target;
	const source = sources.shift();

	if (isPlainObject(target) && isPlainObject(source)) {
		for (const key in source) {
			if (isPlainObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return deepMerge(target, ...sources);
}

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

/**
 * Convert a string to kebab-case
 */
export function toKebabCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase();
}

/**
 * Convert a string to camelCase
 */
export function toCamelCase(str: string): string {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, '');
}

/**
 * Sanitize a filename for safe usage
 */
export function sanitizeFilename(filename: string): string {
	return filename
		.replace(/[^a-z0-9.-]/gi, '_')
		.replace(/_{2,}/g, '_')
		.replace(/^_|_$/g, '');
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get file extension from URL or filename
 */
export function getFileExtension(urlOrFilename: string): string {
	const url = new URL(urlOrFilename, 'http://example.com');
	const pathname = url.pathname;
	const lastDot = pathname.lastIndexOf('.');

	if (lastDot === -1) return '';
	return pathname.slice(lastDot + 1).toLowerCase();
}

/**
 * Check if URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}
