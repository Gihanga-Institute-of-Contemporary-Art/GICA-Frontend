# Server Load Function Optimization

This document explains the optimizations made to reduce repetition in SvelteKit server load functions.

## What Was Changed

### Before (Repetitive Pattern)

Each `+page.server.ts` and `+layout.server.ts` file contained ~25-30 lines of boilerplate code:

- Manual environment checking (`import.meta.env.DEV`)
- Conditional logic for development vs production
- Identical error handling patterns
- Similar fallback data structures
- Repeated imports

### After (Optimized)

Each server file now contains just 4-6 lines:

- Single import of the utility function
- Single function call with configuration
- Type-safe with full TypeScript support

## New Utility Functions

### `createServerLoader<T>(config)`

The main utility function that handles:

- Automatic development/production environment detection
- Data loading from cache (production) or API (development)
- Error handling with customizable fallback data
- Type-safe return values

### `loadEntity<T>(dataType, fallbackFactory?)`

Convenience function for simple entity loading where the return key matches the data type.

### `createLoadFunction<T>(config)`

Higher-order function that returns a load function, useful when you need the exact function signature SvelteKit expects.

### `createBatchLoader(configs[])`

For loading multiple data sources in a single function (useful for layouts).

## Usage Examples

### Simple Page Load

```typescript
// Before (30 lines)
import { getStaticData, fetchStaticData } from '$lib/api';
import type { Contributors } from '$lib/api';

export const load = async () => {
	const development = import.meta.env.DEV === true;
	try {
		// ... 25+ lines of boilerplate
	} catch (error) {
		// ... error handling
	}
};

// After (5 lines)
import { createServerLoader } from '$lib/api';
import type { Contributors } from '$lib/api';

export const load = () =>
	createServerLoader<Contributors>({
		dataType: 'contributors',
		returnKey: 'contributors'
	});
```

### Custom Error Handling

```typescript
export const load = () =>
	createServerLoader<Home>({
		dataType: 'home',
		returnKey: 'home',
		errorPrefix: 'Failed to load site data in layout',
		fallbackFactory: () => ({
			title: 'Custom Fallback',
			headline: '',
			about: [],
			carousel: [],
			pages: []
		})
	});
```

### Using the Convenience Function

```typescript
import { loadEntity } from '$lib/api';
import type { Visit } from '$lib/api';

export const load = () => loadEntity<Visit>('visit');
```

## Type System

The API now distinguishes between collections and single pages:

- **Collections** (`CollectionType`): `'programmes' | 'exhibitions' | 'contributors'`
  - These are collections of items with lists of children
  - Examples: list of programmes, list of exhibitions, list of contributors

- **Pages** (`PageType`): `'home' | 'visit'`
  - These are single pages with specific content
  - Examples: home page, visit information page

- **DataType**: Union of `CollectionType | PageType` - covers all available data endpoints

## Key Benefits

1. **Reduced Code Duplication**: From ~120 lines across 5 files to ~25 lines
2. **Better Maintainability**: Changes to loading logic only need to be made in one place
3. **Type Safety**: Full TypeScript support with generic type parameters
4. **Consistent Error Handling**: Standardized error handling across all routes
5. **Easier Testing**: Centralized logic is easier to test and debug
6. **Better Developer Experience**: Less boilerplate, more focus on business logic

## File Changes Summary

### New Files

- `/src/lib/api/serverUtils.ts` - New utility functions

### Modified Files

- `/src/lib/api/index.ts` - Added exports for server utilities
- `/src/lib/api/types.ts` - Extended `CollectionType` to include 'home' and 'visit'
- `/src/routes/+layout.server.ts` - Reduced from 32 to 17 lines
- `/src/routes/contributors/+page.server.ts` - Reduced from 30 to 5 lines
- `/src/routes/visit/+page.server.ts` - Reduced from 31 to 5 lines
- `/src/routes/exhibitions/+page.server.ts` - Reduced from 30 to 5 lines
- `/src/routes/programme/+page.server.ts` - Reduced from 30 to 5 lines

## Total Impact

- **Lines of Code**: Reduced from ~150+ lines to ~40 lines (73% reduction)
- **Maintainability**: Centralized error handling and data loading logic
- **Type Safety**: Enhanced with better TypeScript support
- **Developer Experience**: Significantly improved with less boilerplate code
