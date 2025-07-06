/**
 * API Configuration and Environment Management
 * Centralized configuration for API client with validation and fallbacks
 */
import { KIRBY_BASE_URL, KIRBY_API_TOKEN } from '$env/static/private';

export interface ApiConfig {
	baseUrl: string;
	apiToken?: string;
	timeout?: number;
	retryAttempts?: number;
	retryDelay?: number;
	cacheEnabled?: boolean;
	cacheTtl?: number;
	maxCacheSize?: number;
	environment?: 'development' | 'production' | 'test';
}

export interface CacheConfig {
	enabled: boolean;
	ttl: number; // Time to live in milliseconds
	maxSize: number; // Maximum number of cache entries
	persistent?: boolean; // For future localStorage/indexedDB support
}

export interface RetryConfig {
	attempts: number;
	delay: number; // Initial delay in milliseconds
	backoffMultiplier?: number;
	maxDelay?: number;
}

// Default configuration
const DEFAULT_CONFIG: Required<ApiConfig> = {
	baseUrl: KIRBY_BASE_URL || 'http://localhost:3000',
	apiToken: KIRBY_API_TOKEN || '',
	timeout: 30000, // 30 seconds
	retryAttempts: 3,
	retryDelay: 1000, // 1 second
	cacheEnabled: true,
	cacheTtl: 300000, // 5 minutes
	maxCacheSize: 100,
	environment: 'production'
};

class ConfigManager {
	private config: Required<ApiConfig>;
	private initialized = false;

	constructor() {
		this.config = { ...DEFAULT_CONFIG };
	}

	/**
	 * Initialize configuration with environment variables or provided config
	 */
	init(customConfig?: Partial<ApiConfig>): void {
		if (this.initialized) {
			return;
		}

		// Try to load from environment variables
		try {
			const envConfig: Partial<ApiConfig> = {};

			// First try SvelteKit environment variables
			if (KIRBY_BASE_URL && KIRBY_BASE_URL.trim() !== '') {
				envConfig.baseUrl = KIRBY_BASE_URL;
			}
			if (KIRBY_API_TOKEN && KIRBY_API_TOKEN.trim() !== '') {
				envConfig.apiToken = KIRBY_API_TOKEN;
			}

			// Check for Node.js process.env (works in most environments)
			if (typeof process !== 'undefined' && process.env) {
				envConfig.baseUrl =
					envConfig.baseUrl || process.env.KIRBY_BASE_URL || process.env.API_BASE_URL || '';
				envConfig.apiToken =
					envConfig.apiToken || process.env.KIRBY_API_TOKEN || process.env.API_TOKEN || '';
				const nodeEnv = process.env.NODE_ENV;
				envConfig.environment =
					nodeEnv === 'development' || nodeEnv === 'test' ? nodeEnv : 'production';
			}

			// Merge configurations: defaults < environment < custom
			this.config = {
				...DEFAULT_CONFIG,
				...envConfig,
				...customConfig
			};

			this.validateConfig();
			this.initialized = true;
		} catch (error) {
			console.warn('Failed to initialize config from environment:', error);
			// Fall back to provided config or defaults
			this.config = { ...DEFAULT_CONFIG, ...customConfig };
			this.validateConfig(); // Still validate the fallback config
			this.initialized = true;
		}
	}

	/**
	 * Validate essential configuration
	 */
	private validateConfig(): void {
		if (!this.config.baseUrl || this.config.baseUrl.trim() === '') {
			// Provide a development fallback
			this.config.baseUrl = 'http://localhost:3000';
			console.warn(
				'API base URL not configured, using development fallback: http://localhost:3000'
			);
		}

		try {
			new URL(this.config.baseUrl);
		} catch {
			throw new Error(`Invalid API base URL: ${this.config.baseUrl}`);
		}

		if (this.config.timeout < 1000) {
			console.warn('API timeout is very low, consider increasing for production use');
		}

		if (this.config.retryAttempts > 5) {
			console.warn('High retry attempts may cause performance issues');
		}
	}

	/**
	 * Get current configuration
	 */
	getConfig(): Required<ApiConfig> {
		if (!this.initialized) {
			this.init();
		}
		return { ...this.config };
	}

	/**
	 * Update configuration (useful for testing or runtime changes)
	 */
	updateConfig(updates: Partial<ApiConfig>): void {
		this.config = { ...this.config, ...updates };
		this.validateConfig();
	}

	/**
	 * Get cache configuration
	 */
	getCacheConfig(): CacheConfig {
		const config = this.getConfig();
		return {
			enabled: config.cacheEnabled,
			ttl: config.cacheTtl,
			maxSize: config.maxCacheSize,
			persistent: false // For future implementation
		};
	}

	/**
	 * Get retry configuration
	 */
	getRetryConfig(): RetryConfig {
		const config = this.getConfig();
		return {
			attempts: config.retryAttempts,
			delay: config.retryDelay,
			backoffMultiplier: 2,
			maxDelay: 10000 // 10 seconds
		};
	}

	/**
	 * Check if we're in development mode
	 */
	isDevelopment(): boolean {
		return this.getConfig().environment === 'development';
	}

	/**
	 * Reset configuration (useful for testing)
	 */
	reset(): void {
		this.config = { ...DEFAULT_CONFIG };
		this.initialized = false;
	}
}

// Export singleton instance
export const configManager = new ConfigManager();

// Convenience function for quick setup
export function setupApiConfig(config: Partial<ApiConfig>): void {
	configManager.init(config);
}

/**
 * Setup API config with SvelteKit environment variables
 * Call this from a server-side file that can import from $env/static/private
 */
export function setupApiConfigWithEnv(envVars: {
	KIRBY_BASE_URL?: string;
	KIRBY_API_TOKEN?: string;
	[key: string]: string | undefined;
}): void {
	configManager.init({
		baseUrl: envVars.KIRBY_BASE_URL || '',
		apiToken: envVars.KIRBY_API_TOKEN || ''
	});
}
