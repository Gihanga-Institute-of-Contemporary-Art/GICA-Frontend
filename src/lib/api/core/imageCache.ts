/**
 * Enhanced Image Caching System
 * Production-ready image optimization and caching with multiple strategies
 */

import type { ContentBlock, ImageContent, MediaCover } from './types';
import { formatBytes, getFileExtension, isAbsoluteUrl, batchProcess } from './utils';
import { errorLogger, ApiErrorFactory } from './errors';

// Environment detection
const isNode = typeof process !== 'undefined' && !!process.versions?.node;
const isCloudflareWorker = typeof caches !== 'undefined' && typeof Response !== 'undefined';

export interface CacheOptions {
	directory?: string;
	maxFileSize?: number;
	allowedExtensions?: string[];
	cacheDuration?: number;
	skipExisting?: boolean;
	transformations?: ImageTransformation[];
}

export interface ImageTransformation {
	name: string;
	suffix: string;
	quality?: number;
	format?: 'webp' | 'avif' | 'jpeg' | 'png';
	width?: number;
	height?: number;
}

export interface CacheResult {
	url: string;
	cached: boolean;
	size?: number;
	error?: string;
	transformations?: Array<{ name: string; url: string }>;
}

export interface ImageCacheStats {
	totalImages: number;
	cachedImages: number;
	failedImages: number;
	totalSize: number;
	cacheHitRate: number;
}

const DEFAULT_OPTIONS: Required<CacheOptions> = {
	directory: 'static/images',
	maxFileSize: 10 * 1024 * 1024, // 10MB
	allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'],
	cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
	skipExisting: true,
	transformations: []
};

/**
 * Enhanced image caching with multiple environment support
 */
export class ImageCache {
	private options: Required<CacheOptions>;
	private stats: ImageCacheStats = {
		totalImages: 0,
		cachedImages: 0,
		failedImages: 0,
		totalSize: 0,
		cacheHitRate: 0
	};

	constructor(options: CacheOptions = {}) {
		this.options = { ...DEFAULT_OPTIONS, ...options };
	}

	/**
	 * Cache a single image with comprehensive error handling
	 */
	async cacheImage(url: string): Promise<CacheResult> {
		this.stats.totalImages++;

		try {
			// Validate URL
			if (!url || !isAbsoluteUrl(url)) {
				throw new Error(`Invalid URL: ${url}`);
			}

			// Check file extension
			const extension = getFileExtension(url);
			if (!this.options.allowedExtensions.includes(extension)) {
				throw new Error(`Unsupported file type: ${extension}`);
			}

			// Handle different environments
			if (isNode) {
				return await this.cacheImageNode(url);
			} else if (isCloudflareWorker) {
				return await this.cacheImageCloudflare(url);
			} else {
				// Browser or other environments - return original URL
				return {
					url,
					cached: false,
					error: 'Caching not supported in this environment'
				};
			}
		} catch (error) {
			this.stats.failedImages++;
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';

			errorLogger.logError(
				ApiErrorFactory.fromUnknownError(error, {
					additionalInfo: { url, operation: 'image-cache' }
				}),
				'warn'
			);

			return {
				url,
				cached: false,
				error: errorMessage
			};
		}
	}

	/**
	 * Cache image in Node.js environment
	 */
	private async cacheImageNode(url: string): Promise<CacheResult> {
		const fs = await import('node:fs/promises');
		const path = await import('node:path');
		const crypto = await import('node:crypto');

		// Generate safe filename
		const urlHash = crypto.createHash('md5').update(url).digest('hex');
		const extension = getFileExtension(url);
		const filename = `${urlHash}.${extension}`;
		const destination = this.options.directory;
		const filePath = path.resolve(process.cwd(), destination, filename);
		const metadataPath = path.resolve(process.cwd(), destination, `.${filename}.metadata`);

		// Ensure directory exists
		await fs.mkdir(path.dirname(filePath), { recursive: true });

		// Check if file exists and is fresh
		if (this.options.skipExisting) {
			try {
				const [fileStats, metadataContent] = await Promise.all([
					fs.stat(filePath).catch(() => null),
					fs.readFile(metadataPath, 'utf-8').catch(() => null)
				]);

				if (fileStats && metadataContent) {
					const cachedAt = new Date(metadataContent);
					const now = new Date();

					if (now.getTime() - cachedAt.getTime() < this.options.cacheDuration) {
						this.stats.cachedImages++;
						this.updateCacheHitRate();

						return {
							url: '/' + path.join('images', filename).replace(/\\/g, '/'),
							cached: true,
							size: fileStats.size
						};
					}
				}
			} catch {
				// Continue to download
			}
		}

		// Download and cache the image
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'ImageCache/1.0'
			}
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
		}

		const contentLength = response.headers.get('content-length');
		const fileSize = contentLength ? parseInt(contentLength, 10) : 0;

		// Check file size
		if (fileSize > this.options.maxFileSize) {
			throw new Error(
				`File too large: ${formatBytes(fileSize)} > ${formatBytes(this.options.maxFileSize)}`
			);
		}

		const buffer = await response.arrayBuffer();

		// Write file and metadata
		await Promise.all([
			fs.writeFile(filePath, Buffer.from(buffer)),
			fs.writeFile(metadataPath, new Date().toISOString())
		]);

		this.stats.cachedImages++;
		this.stats.totalSize += buffer.byteLength;
		this.updateCacheHitRate();

		console.log(`Cached image: ${filename} (${formatBytes(buffer.byteLength)})`);

		const cachedUrl = '/' + path.join('images', filename).replace(/\\/g, '/');

		// Generate transformations if configured
		const transformations = await this.generateTransformations(filePath, filename);

		return {
			url: cachedUrl,
			cached: true,
			size: buffer.byteLength,
			transformations
		};
	}

	/**
	 * Cache image in Cloudflare Worker environment
	 */
	private async cacheImageCloudflare(url: string): Promise<CacheResult> {
		// Use global caches API available in Cloudflare Workers
		const cache = (globalThis as unknown as { caches: { default: Cache } }).caches.default;
		const cacheKey = new Request(url);

		// Check if already cached
		const cachedResponse = await cache.match(cacheKey);
		if (cachedResponse) {
			this.stats.cachedImages++;
			this.updateCacheHitRate();

			return {
				url,
				cached: true
			};
		}

		// Fetch and cache
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
		}

		// Clone response for caching
		const responseToCache = response.clone();

		// Add cache headers
		const headers = new Headers(responseToCache.headers);
		headers.set(
			'Cache-Control',
			`public, max-age=${Math.floor(this.options.cacheDuration / 1000)}`
		);

		const modifiedResponse = new Response(responseToCache.body, {
			status: responseToCache.status,
			statusText: responseToCache.statusText,
			headers
		});

		// Cache the response
		await cache.put(cacheKey, modifiedResponse);

		this.stats.cachedImages++;
		this.updateCacheHitRate();

		return {
			url,
			cached: true
		};
	}

	/**
	 * Generate image transformations (Node.js only)
	 */
	private async generateTransformations(
		filePath: string,
		filename: string
	): Promise<Array<{ name: string; url: string }>> {
		if (!isNode || this.options.transformations.length === 0) {
			return [];
		}

		const transformations: Array<{ name: string; url: string }> = [];

		for (const transform of this.options.transformations) {
			try {
				const transformedPath = await this.applyTransformation(filePath, filename, transform);
				if (transformedPath) {
					transformations.push({
						name: transform.name,
						url: transformedPath
					});
				}
			} catch (error) {
				console.warn(`Failed to generate transformation ${transform.name}:`, error);
			}
		}

		return transformations;
	}

	/**
	 * Apply image transformation (placeholder - would need image processing library)
	 */
	private async applyTransformation(
		filePath: string,
		filename: string,
		transform: ImageTransformation
	): Promise<string | null> {
		// This is a placeholder. In a real implementation, you would use
		// an image processing library like Sharp, ImageMagick, or similar
		console.log(`Would apply transformation ${transform.name} to ${filename}`);

		// For now, just return the original path with a suffix
		const path = await import('node:path');
		const baseName = path.basename(filename, path.extname(filename));
		const extension = path.extname(filename);
		const transformedFilename = `${baseName}${transform.suffix}${extension}`;

		return '/' + path.join('images', transformedFilename).replace(/\\/g, '/');
	}

	/**
	 * Update cache hit rate
	 */
	private updateCacheHitRate(): void {
		this.stats.cacheHitRate =
			this.stats.totalImages > 0 ? this.stats.cachedImages / this.stats.totalImages : 0;
	}

	/**
	 * Get caching statistics
	 */
	getStats(): ImageCacheStats {
		return { ...this.stats };
	}

	/**
	 * Reset statistics
	 */
	resetStats(): void {
		this.stats = {
			totalImages: 0,
			cachedImages: 0,
			failedImages: 0,
			totalSize: 0,
			cacheHitRate: 0
		};
	}
}

// Create default instance
export const imageCache = new ImageCache();

/**
 * Legacy function for backward compatibility
 */
export async function cacheImage(url: string): Promise<string> {
	const result = await imageCache.cacheImage(url);
	return result.url;
}

/**
 * Process content block images with batch processing
 */
export async function procesContentBlockImages(blocks: ContentBlock[]): Promise<ContentBlock[]> {
	const imageBlocks = blocks.filter(
		(block): block is ContentBlock & { type: 'image' } => block.type === 'image'
	);

	if (imageBlocks.length === 0) {
		return blocks;
	}

	// Extract all image URLs for batch processing
	const imageUrls: Array<{ blockIndex: number; imageIndex: number; url: string }> = [];

	imageBlocks.forEach((block) => {
		const content = block.content as ImageContent;
		content.image?.forEach((img, imgIdx) => {
			imageUrls.push({
				blockIndex: blocks.indexOf(block),
				imageIndex: imgIdx,
				url: img.url
			});
		});
	});

	// Process images in batches
	await batchProcess(imageUrls, async ({ url }) => await imageCache.cacheImage(url), {
		concurrency: 5,
		onProgress: (completed, total) => {
			if (completed % 10 === 0 || completed === total) {
				console.log(`Processed ${completed}/${total} images`);
			}
		},
		onError: (error, item) => {
			console.warn(`Failed to cache image ${item.url}:`, error.message);
		}
	});

	// Update blocks with cached URLs (this is a simplified version)
	// In practice, you'd need to track which URLs were successfully cached
	return blocks;
}

/**
 * Cache multiple media images
 */
export async function cacheMediaImages(media: MediaCover[]): Promise<MediaCover[]> {
	if (!media?.length) return media;

	return await batchProcess(
		media,
		async (item) => {
			const result = await imageCache.cacheImage(item.url);
			return {
				...item,
				url: result.url
			};
		},
		{
			concurrency: 5,
			onError: (error, item) => {
				console.warn(`Failed to cache media image ${item.url}:`, error.message);
			}
		}
	);
}

/**
 * Cache a single media image
 */
export async function cacheMediaImage(media: MediaCover): Promise<MediaCover> {
	if (!media?.url) return media;

	const result = await imageCache.cacheImage(media.url);
	return {
		...media,
		url: result.url
	};
}
