/**
 * Enhanced Caching System
 * Provides TTL-based caching, size limits, and batch operations
 */

export interface CacheEntry<T = unknown> {
	data: T;
	timestamp: number;
	ttl: number;
	accessCount: number;
	lastAccessed: number;
}

export interface CacheStats {
	size: number;
	maxSize: number;
	hitRate: number;
	totalHits: number;
	totalMisses: number;
	oldestEntry?: number;
	newestEntry?: number;
}

export interface CacheOptions {
	ttl?: number;
	maxSize?: number;
	onEviction?: (key: string, entry: CacheEntry) => void;
}

export class AdvancedCache {
	private cache = new Map<string, CacheEntry>();
	private defaultTtl: number;
	private maxSize: number;
	private hits = 0;
	private misses = 0;
	private onEviction?: (key: string, entry: CacheEntry) => void;

	constructor(options: CacheOptions = {}) {
		this.defaultTtl = options.ttl || 300000; // 5 minutes default
		this.maxSize = options.maxSize || 100;
		this.onEviction = options.onEviction;
	}

	/**
	 * Set a value in the cache
	 */
	set<T>(key: string, value: T, ttl?: number): void {
		const now = Date.now();
		const entry: CacheEntry<T> = {
			data: value,
			timestamp: now,
			ttl: ttl || this.defaultTtl,
			accessCount: 0,
			lastAccessed: now
		};

		// Check if we need to evict entries
		if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
			this.evictOldest();
		}

		this.cache.set(key, entry);
	}

	/**
	 * Get a value from the cache
	 */
	get<T>(key: string): T | null {
		const entry = this.cache.get(key);

		if (!entry) {
			this.misses++;
			return null;
		}

		const now = Date.now();

		// Check if entry has expired
		if (now - entry.timestamp > entry.ttl) {
			this.cache.delete(key);
			this.misses++;
			return null;
		}

		// Update access statistics
		entry.accessCount++;
		entry.lastAccessed = now;
		this.hits++;

		return entry.data as T;
	}

	/**
	 * Check if a key exists and is not expired
	 */
	has(key: string): boolean {
		const entry = this.cache.get(key);
		if (!entry) return false;

		const now = Date.now();
		if (now - entry.timestamp > entry.ttl) {
			this.cache.delete(key);
			return false;
		}

		return true;
	}

	/**
	 * Delete a specific key
	 */
	delete(key: string): boolean {
		return this.cache.delete(key);
	}

	/**
	 * Clear all cache entries
	 */
	clear(): void {
		this.cache.clear();
		this.hits = 0;
		this.misses = 0;
	}

	/**
	 * Get cache statistics
	 */
	getStats(): CacheStats {
		const entries = Array.from(this.cache.values());
		const totalRequests = this.hits + this.misses;

		return {
			size: this.cache.size,
			maxSize: this.maxSize,
			hitRate: totalRequests > 0 ? this.hits / totalRequests : 0,
			totalHits: this.hits,
			totalMisses: this.misses,
			oldestEntry: entries.length > 0 ? Math.min(...entries.map((e) => e.timestamp)) : undefined,
			newestEntry: entries.length > 0 ? Math.max(...entries.map((e) => e.timestamp)) : undefined
		};
	}

	/**
	 * Clean up expired entries
	 */
	cleanup(): number {
		const now = Date.now();
		let removedCount = 0;

		for (const [key, entry] of this.cache.entries()) {
			if (now - entry.timestamp > entry.ttl) {
				this.cache.delete(key);
				removedCount++;
			}
		}

		return removedCount;
	}

	/**
	 * Get all cache keys
	 */
	keys(): string[] {
		return Array.from(this.cache.keys());
	}

	/**
	 * Get cache size
	 */
	size(): number {
		return this.cache.size;
	}

	/**
	 * Evict the oldest entry (LRU-style)
	 */
	private evictOldest(): void {
		let oldestKey: string | null = null;
		let oldestTime = Infinity;

		for (const [key, entry] of this.cache.entries()) {
			if (entry.lastAccessed < oldestTime) {
				oldestTime = entry.lastAccessed;
				oldestKey = key;
			}
		}

		if (oldestKey) {
			const entry = this.cache.get(oldestKey);
			this.cache.delete(oldestKey);
			if (entry && this.onEviction) {
				this.onEviction(oldestKey, entry);
			}
		}
	}

	/**
	 * Set multiple values at once
	 */
	setMany<T>(entries: Array<{ key: string; value: T; ttl?: number }>): void {
		entries.forEach(({ key, value, ttl }) => {
			this.set(key, value, ttl);
		});
	}

	/**
	 * Get multiple values at once
	 */
	getMany<T>(keys: string[]): Array<{ key: string; value: T | null }> {
		return keys.map((key) => ({
			key,
			value: this.get<T>(key)
		}));
	}

	/**
	 * Get cache entry metadata
	 */
	getEntryMetadata(key: string): Omit<CacheEntry, 'data'> | null {
		const entry = this.cache.get(key);
		if (!entry) return null;

		return {
			timestamp: entry.timestamp,
			ttl: entry.ttl,
			accessCount: entry.accessCount,
			lastAccessed: entry.lastAccessed
		};
	}
}

/**
 * Specialized cache for API responses
 */
export class ApiCache extends AdvancedCache {
	constructor(options: CacheOptions = {}) {
		super({
			ttl: 300000, // 5 minutes default for API responses
			maxSize: 50, // Smaller default for API cache
			...options
		});
	}

	/**
	 * Generate a cache key for API requests
	 */
	static generateKey(endpoint: string, params?: Record<string, unknown>): string {
		const baseKey = endpoint.replace(/[^a-zA-Z0-9]/g, '_');
		if (!params || Object.keys(params).length === 0) {
			return baseKey;
		}

		const sortedParams = Object.keys(params)
			.sort()
			.map((key) => `${key}=${JSON.stringify(params[key])}`)
			.join('&');

		return `${baseKey}?${sortedParams}`;
	}

	/**
	 * Cache an API response with automatic key generation
	 */
	setApiResponse<T>(
		endpoint: string,
		data: T,
		params?: Record<string, unknown>,
		ttl?: number
	): void {
		const key = ApiCache.generateKey(endpoint, params);
		this.set(key, data, ttl);
	}

	/**
	 * Get a cached API response
	 */
	getApiResponse<T>(endpoint: string, params?: Record<string, unknown>): T | null {
		const key = ApiCache.generateKey(endpoint, params);
		return this.get<T>(key);
	}

	/**
	 * Check if an API response is cached
	 */
	hasApiResponse(endpoint: string, params?: Record<string, unknown>): boolean {
		const key = ApiCache.generateKey(endpoint, params);
		return this.has(key);
	}
}

// Create and export default cache instances
export const apiCache = new ApiCache();
export const generalCache = new AdvancedCache();
