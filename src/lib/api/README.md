# Portable API Library (v2.0)

A modern, type-safe, and portable API library for SvelteKit applications that can be easily adapted to different projects.

## 🚀 What's New in v2.0

- 🏗️ **Project-agnostic core** - Generic functionality that works with any project
- 🎯 **Type-safe** - Full TypeScript support with project-specific types
- 🔄 **Portable** - Easy to move between different projects
- 📦 **Modular** - Clean separation between core functionality and project-specific code
- 🔙 **Backward compatible** - All existing GICA code continues to work

## Features (Enhanced from v1.0)

- ✅ **Production-Ready**: Comprehensive error handling, retry logic, and logging
- ✅ **Intelligent Caching**: Multi-level caching with TTL and size limits
- ✅ **Image Optimization**: Automatic image caching and optimization
- ✅ **Type Safety**: Full TypeScript support with comprehensive type definitions
- ✅ **Environment Agnostic**: Works in Node.js, Cloudflare Workers, and browsers
- ✅ **Static Site Generation**: Optimized for static site generation workflows
- ✅ **Configurable**: Flexible configuration system with sensible defaults
- ✅ **Monitoring**: Built-in statistics and performance monitoring

## Quick Start (v2.0 - Recommended)

### For GICA Project (Current)

```typescript
// Modern approach (recommended)
import { getHome, getContributors, preloadGicaData } from '$lib/api/adapters/gicaAdapter';

export const load = async () => {
	const home = await getHome();
	return { home };
};

// Legacy approach (still works)
import { preloadAllData, getStaticData } from '$lib/api';
```

### For New Projects

1. **Define your schema** (`schemas/yourSchema.ts`)
2. **Create your adapter** (`adapters/yourAdapter.ts`)
3. **Use in your routes**

See `MIGRATION_GUIDE.md` for detailed instructions.

---

## Quick Start (v1.0 - Legacy)

### 1. Installation

The library is designed to be copied into your project. Place the `api` directory in your `src/lib/` folder.

### 2. Environment Setup

Add your API configuration to your environment variables:

```bash
# .env
KIRBY_BASE_URL=https://your-api.com/api
KIRBY_API_TOKEN=your-api-token
NODE_ENV=development
```

### 3. Initialize the Library

```typescript
// src/app.ts or your main entry point
import { initializeApi } from '$lib/api';

// Initialize with environment variables (automatic)
initializeApi();

// Or with custom configuration
initializeApi({
	baseUrl: 'https://your-api.com/api',
	apiToken: 'your-token',
	environment: 'production'
});
```

### 4. Basic Usage

```typescript
import { apiClient, fetchApi } from '$lib/api';

// Simple fetch (backward compatible)
const data = await fetchApi<MyType>('endpoint');

// Advanced usage with full response
const response = await apiClient.get<MyType>('endpoint');
console.log(response.data, response.status, response.cached);

// POST request
const result = await apiClient.post<ResponseType>('endpoint', {
	key: 'value'
});
```

## Configuration

### Environment Variables

| Variable          | Description              | Default      |
| ----------------- | ------------------------ | ------------ |
| `KIRBY_BASE_URL`  | API base URL             | Required     |
| `KIRBY_API_TOKEN` | API authentication token | Optional     |
| `NODE_ENV`        | Environment mode         | 'production' |

### Programmatic Configuration

```typescript
import { setupApiConfig } from '$lib/api';

setupApiConfig({
	baseUrl: 'https://api.example.com',
	apiToken: 'your-token',
	timeout: 30000, // 30 seconds
	retryAttempts: 3, // Retry failed requests 3 times
	retryDelay: 1000, // Initial retry delay: 1 second
	cacheEnabled: true, // Enable response caching
	cacheTtl: 300000, // Cache TTL: 5 minutes
	maxCacheSize: 100, // Maximum cache entries
	environment: 'production'
});
```

## API Client

### Basic Requests

```typescript
import { apiClient } from '$lib/api';

// GET request
const users = await apiClient.get<User[]>('users');

// POST request
const newUser = await apiClient.post<User>('users', {
	name: 'John Doe',
	email: 'john@example.com'
});

// PUT request
const updatedUser = await apiClient.put<User>('users/1', {
	name: 'Jane Doe'
});

// DELETE request
await apiClient.delete('users/1');
```

### Advanced Options

```typescript
// Request with custom options
const response = await apiClient.get<Data>('endpoint', {
	timeout: 10000, // 10 second timeout
	retries: 5, // 5 retry attempts
	cache: false, // Disable caching for this request
	headers: {
		// Additional headers
		'X-Custom': 'value'
	}
});

// Using AbortController
const controller = new AbortController();
const response = await apiClient.get<Data>('endpoint', {
	abortSignal: controller.signal
});

// Cancel request after 5 seconds
setTimeout(() => controller.abort(), 5000);
```

### Request Interceptors

```typescript
import { apiClient } from '$lib/api';

// Add authentication header
apiClient.addRequestInterceptor(async (options) => {
	const token = await getAuthToken();
	return {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${token}`
		}
	};
});

// Add request ID for tracing
apiClient.addRequestInterceptor((options) => {
	return {
		...options,
		headers: {
			...options.headers,
			'X-Request-ID': generateUUID()
		}
	};
});
```

## Caching System

### API Response Caching

```typescript
import { apiCache } from '$lib/api';

// Check if data is cached
if (apiCache.hasApiResponse('users')) {
	const cachedUsers = apiCache.getApiResponse<User[]>('users');
}

// Manual cache management
apiCache.setApiResponse('users', userData, undefined, 600000); // 10 minutes
apiCache.clear(); // Clear all cache

// Cache statistics
const stats = apiCache.getStats();
console.log(`Hit rate: ${stats.hitRate * 100}%`);
```

### General Purpose Caching

```typescript
import { generalCache } from '$lib/api';

// Store any data
generalCache.set('user-preferences', preferences, 3600000); // 1 hour

// Retrieve data
const prefs = generalCache.get<UserPreferences>('user-preferences');

// Batch operations
generalCache.setMany([
	{ key: 'key1', value: data1 },
	{ key: 'key2', value: data2, ttl: 1800000 } // 30 minutes
]);
```

## Image Caching

### Automatic Image Optimization

```typescript
import { imageCache, cacheMediaImage } from '$lib/api';

// Cache a single image
const result = await imageCache.cacheImage('https://example.com/image.jpg');
console.log(result.url); // Local cached URL
console.log(result.cached); // true if successfully cached
console.log(result.size); // File size in bytes

// Cache media cover
const media: MediaCover = {
	url: 'https://example.com/image.jpg',
	alt: 'Description'
};
const cachedMedia = await cacheMediaImage(media);
```

### Batch Image Processing

```typescript
import { procesContentBlockImages, cacheMediaImages } from '$lib/api';

// Process content blocks with images
const blocks: ContentBlock[] = [...];
const processedBlocks = await procesContentBlockImages(blocks);

// Cache multiple media items
const mediaList: MediaCover[] = [...];
const cachedMedia = await cacheMediaImages(mediaList);
```

### Image Cache Configuration

```typescript
import { ImageCache } from '$lib/api';

const customImageCache = new ImageCache({
	directory: 'static/cached-images',
	maxFileSize: 5 * 1024 * 1024, // 5MB max
	allowedExtensions: ['jpg', 'png', 'webp'],
	cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
	skipExisting: true
});
```

## Static Data Management

### Basic Usage

```typescript
import { staticDataManager, preloadAllData, getStaticData, fetchStaticData } from '$lib/api';

// Preload all static data (in +layout.server.ts)
await preloadAllData();

// Get preloaded data
const homeData = getStaticData<Home>('home');
const programmes = getStaticData<Programmes>('programmes');

// Fetch data with fallback
const visitData = await fetchStaticData<Visit>('visit');
```

### Advanced Preloading

```typescript
import { staticDataManager } from '$lib/api';

// Advanced preloading with options
const result = await staticDataManager.preloadAllData({
	includeDetails: true, // Load individual pages
	cacheImages: true, // Cache all images
	concurrency: 5, // Process 5 items at once
	onProgress: (stage, current, total) => {
		console.log(`${stage}: ${current}/${total}`);
	}
});

console.log('Preload result:', result);
```

### Cache Management

```typescript
// Cache detail page images
await staticDataManager.cacheDetailImages('programmes');

// Get statistics
const stats = staticDataManager.getStats();
console.log('Static data size:', stats.staticDataSize);
console.log('Image cache stats:', stats.imageCache);

// Clear all caches
staticDataManager.clearCache();
```

## Error Handling

### Built-in Error Types

```typescript
import { ApiError, ApiErrorType } from '$lib/api';

try {
	const data = await apiClient.get<Data>('endpoint');
} catch (error) {
	if (error instanceof ApiError) {
		console.log('Error type:', error.type);
		console.log('Status code:', error.status);
		console.log('Is retryable:', error.isRetryable);
		console.log('User message:', error.toUserMessage());
	}
}
```

### Error Logging and Monitoring

```typescript
import { errorLogger } from '$lib/api';

// Get recent errors
const recentErrors = errorLogger.getRecentLogs(10);

// Get error statistics
const errorStats = errorLogger.getErrorStats();
console.log('Network errors:', errorStats[ApiErrorType.NETWORK_ERROR]);
console.log('Auth errors:', errorStats[ApiErrorType.AUTHENTICATION_ERROR]);

// Clear error logs
errorLogger.clearLogs();
```

## Utilities

### Retry Logic

```typescript
import { withRetry } from '$lib/api';

const result = await withRetry(
	async () => {
		// Your async operation
		return await riskyOperation();
	},
	{
		attempts: 3,
		delay: 1000,
		backoffMultiplier: 2,
		maxDelay: 10000
	}
);
```

### Debouncing and Throttling

```typescript
import { debounce, throttle } from '$lib/api';

// Debounce API calls
const debouncedSearch = debounce(async (query: string) => {
	return await apiClient.get<SearchResult[]>(`search?q=${query}`);
}, 300);

// Throttle user actions
const throttledSave = throttle(async (data: FormData) => {
	return await apiClient.post('save', data);
}, 1000);
```

### Data Utilities

```typescript
import { deepClone, deepMerge, formatBytes } from '$lib/api';

// Deep clone objects
const clonedData = deepClone(originalData);

// Merge objects deeply
const merged = deepMerge(defaults, userConfig, overrides);

// Format file sizes
console.log(formatBytes(1024)); // "1 KB"
console.log(formatBytes(1048576)); // "1 MB"
```

## SvelteKit Integration

### Layout Server

```typescript
// src/routes/+layout.server.ts
import { preloadAllData } from '$lib/api';

export async function load() {
	try {
		// Preload all static data for the site
		await preloadAllData();

		return {
			preloaded: true
		};
	} catch (error) {
		console.error('Failed to preload static data:', error);
		return {
			preloaded: false,
			error: 'Failed to load site data'
		};
	}
}
```

### Page Server

```typescript
// src/routes/programmes/+page.server.ts
import { getStaticData } from '$lib/api';
import type { Programmes } from '$lib/api';

export async function load() {
	try {
		const programmes = getStaticData<Programmes>('programmes');

		return {
			programmes
		};
	} catch (error) {
		throw error(404, 'Programmes not found');
	}
}
```

### Dynamic Routes

```typescript
// src/routes/programmes/[slug]/+page.server.ts
import { fetchStaticData } from '$lib/api';
import type { Programme } from '$lib/api';

export async function load({ params }) {
	try {
		const programme = await fetchStaticData<Programme>(params.slug);

		return {
			programme
		};
	} catch (error) {
		throw error(404, 'Programme not found');
	}
}
```

## Performance Optimization

### Batch Processing

```typescript
import { batchProcess } from '$lib/api';

// Process many items with controlled concurrency
await batchProcess(
	largeDataSet,
	async (item, index) => {
		return await processItem(item);
	},
	{
		concurrency: 5,
		onProgress: (completed, total) => {
			console.log(`Progress: ${completed}/${total}`);
		},
		onError: (error, item, index) => {
			console.warn(`Failed to process item ${index}:`, error);
		}
	}
);
```

### Memory Management

```typescript
// Monitor cache sizes
const apiStats = apiClient.getCacheStats();
const imageStats = imageCache.getStats();

console.log('API cache hit rate:', apiStats.hitRate);
console.log('Image cache size:', formatBytes(imageStats.totalSize));

// Clear caches when needed
if (apiStats.size > 1000) {
	apiClient.clearCache();
}
```

## Development vs Production

### Development Mode Features

- Detailed console logging
- Error stack traces
- Cache miss notifications
- Performance warnings

### Production Mode Features

- Minimal logging
- Error sanitization
- Optimized caching
- Performance monitoring

## Migration Guide

### From Simple fetchApi

```typescript
// Before
const data = await fetchApi<MyType>('endpoint');

// After (no changes needed - backward compatible)
const data = await fetchApi<MyType>('endpoint');

// Or upgrade to full client
const response = await apiClient.get<MyType>('endpoint');
const data = response.data;
```

### From Basic Cache

```typescript
// Before
if (cache.has('key')) {
	return cache.get('key');
}
const data = await fetch(url);
cache.set('key', data);

// After
const response = await apiClient.get<MyType>('endpoint', {
	cache: true,
	cacheTtl: 300000
});
const data = response.data; // Automatically cached
```

## Contributing

When extending this library:

1. **Maintain backward compatibility** for existing functions
2. **Add comprehensive error handling** for new features
3. **Include TypeScript types** for all new interfaces
4. **Add proper logging** and monitoring capabilities
5. **Write performance-conscious code** with proper caching
6. **Include JSDoc documentation** for public functions

## License

This library is designed to be part of your project. Modify and extend as needed for your specific requirements.
