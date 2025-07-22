/**
 * Enhanced API Client
 * Production-ready HTTP client with retry logic, caching, and comprehensive error handling
 */

import { configManager } from './config';
import { ApiErrorFactory, errorLogger } from './errors';
import { apiCache } from './cache';
import { withRetry, fetchWithTimeout, generateUUID } from './utils';

export interface RequestOptions {
	method?: string;
	headers?: Record<string, string>;
	body?: unknown;
	timeout?: number;
	retries?: number;
	cache?: boolean;
	cacheTtl?: number;
	abortSignal?: AbortSignal;
}

export interface ApiResponse<T> {
	data: T;
	status: number;
	headers: Headers;
	requestId: string;
	cached: boolean;
	executionTime: number;
}

/**
 * Enhanced API Client class
 */
export class ApiClient {
	private requestInterceptors: Array<
		(options: RequestOptions) => RequestOptions | Promise<RequestOptions>
	> = [];
	private responseInterceptors: Array<
		(response: ApiResponse<unknown>) => ApiResponse<unknown> | Promise<ApiResponse<unknown>>
	> = [];

	constructor() {
		// Don't cache config values - get them dynamically
	}

	/**
	 * Get current base URL from config
	 */
	private getBaseUrl(): string {
		return configManager.getConfig().baseUrl;
	}

	/**
	 * Get current default headers from config
	 */
	private getDefaultHeaders(): Record<string, string> {
		const config = configManager.getConfig();
		return {
			'Content-Type': 'application/json',
			...(config.apiToken && { Authorization: `Bearer ${config.apiToken}` })
		};
	}

	/**
	 * Add request interceptor
	 */
	addRequestInterceptor(
		interceptor: (options: RequestOptions) => RequestOptions | Promise<RequestOptions>
	): void {
		this.requestInterceptors.push(interceptor);
	}

	/**
	 * Add response interceptor
	 */
	addResponseInterceptor(
		interceptor: (
			response: ApiResponse<unknown>
		) => ApiResponse<unknown> | Promise<ApiResponse<unknown>>
	): void {
		this.responseInterceptors.push(interceptor);
	}

	/**
	 * Make an API request
	 */
	async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
		const requestId = generateUUID();
		const startTime = Date.now();
		const config = configManager.getConfig();

		// Apply request interceptors
		let processedOptions = { ...options };
		for (const interceptor of this.requestInterceptors) {
			processedOptions = await interceptor(processedOptions);
		}

		const {
			method = 'GET',
			headers = {},
			body,
			timeout = config.timeout,
			cache = config.cacheEnabled,
			cacheTtl = config.cacheTtl,
			abortSignal
		} = processedOptions;

		console.log('API Client initialized with base URL:', this.getBaseUrl());

		// Check cache for GET requests
		if (method === 'GET' && cache) {
			const cachedResponse = apiCache.getApiResponse<T>(endpoint);
			if (cachedResponse) {
				const response: ApiResponse<T> = {
					data: cachedResponse,
					status: 200,
					headers: new Headers(),
					requestId,
					cached: true,
					executionTime: Date.now() - startTime
				};

				// Apply response interceptors
				let processedResponse = response as ApiResponse<unknown>;
				for (const interceptor of this.responseInterceptors) {
					processedResponse = await interceptor(processedResponse);
				}

				return processedResponse as ApiResponse<T>;
			}
		}

		const url = this.buildUrl(endpoint);
		const requestHeaders = { ...this.getDefaultHeaders(), ...headers };

		const makeRequest = async (): Promise<ApiResponse<T>> => {
			try {
				const response = await fetchWithTimeout(
					url,
					{
						method,
						headers: requestHeaders,
						body: body ? JSON.stringify(body) : undefined,
						signal: abortSignal
					},
					timeout
				);

				if (!response.ok) {
					throw ApiErrorFactory.fromResponse(response, {
						endpoint,
						method,
						requestId
					});
				}

				const data = (await response.json()) as T;

				// Cache successful GET responses
				if (method === 'GET' && cache && response.status < 400) {
					apiCache.setApiResponse(endpoint, data, undefined, cacheTtl);
				}

				const apiResponse: ApiResponse<T> = {
					data,
					status: response.status,
					headers: response.headers,
					requestId,
					cached: false,
					executionTime: Date.now() - startTime
				};

				// Apply response interceptors
				let processedResponse = apiResponse as ApiResponse<unknown>;
				for (const interceptor of this.responseInterceptors) {
					processedResponse = await interceptor(processedResponse);
				}

				return processedResponse as ApiResponse<T>;
			} catch (error) {
				const apiError = ApiErrorFactory.fromUnknownError(error, {
					endpoint,
					method,
					requestId
				});

				errorLogger.logError(apiError, 'error', {
					endpoint,
					method,
					requestId,
					executionTime: Date.now() - startTime
				});

				throw apiError;
			}
		};

		// Execute with retry logic
		return withRetry(makeRequest, configManager.getRetryConfig(), {
			endpoint,
			operation: 'api-request'
		});
	}

	/**
	 * GET request
	 */
	async get<T>(
		endpoint: string,
		options: Omit<RequestOptions, 'method'> = {}
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: 'GET' });
	}

	/**
	 * POST request
	 */
	async post<T>(
		endpoint: string,
		body?: unknown,
		options: Omit<RequestOptions, 'method' | 'body'> = {}
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: 'POST', body, cache: false });
	}

	/**
	 * PUT request
	 */
	async put<T>(
		endpoint: string,
		body?: unknown,
		options: Omit<RequestOptions, 'method' | 'body'> = {}
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: 'PUT', body, cache: false });
	}

	/**
	 * DELETE request
	 */
	async delete<T>(
		endpoint: string,
		options: Omit<RequestOptions, 'method'> = {}
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: 'DELETE', cache: false });
	}

	/**
	 * Build full URL from endpoint
	 */
	private buildUrl(endpoint: string): string {
		const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
		const baseUrl = this.getBaseUrl();
		const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
		return `${cleanBaseUrl}/${cleanEndpoint}`;
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		apiCache.clear();
	}

	/**
	 * Get cache statistics
	 */
	getCacheStats() {
		return apiCache.getStats();
	}
}

// Create singleton client instance
export const apiClient = new ApiClient();

/**
 * Convenience function for simple GET requests (backward compatibility)
 */
export async function fetchApi<T>(endpoint: string): Promise<T> {
	const response = await apiClient.get<T>(endpoint);
	return response.data;
}

/**
 * Convenience function with caching (backward compatibility)
 */
export async function fetchWithCache<T>(endpoint: string): Promise<T> {
	const response = await apiClient.get<T>(endpoint, { cache: true });
	return response.data;
}
