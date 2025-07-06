# Portable API Library - Migration Guide

This guide explains how to use the new portable API library structure and how to migrate it to different projects.

## Overview

The API library has been refactored into a modular, project-agnostic structure:

```
src/lib/api/
├── core/                    # Generic, reusable functionality
│   ├── types.ts            # Generic interfaces and types
│   ├── dataManager.ts      # Generic data management
│   └── serverUtils.ts      # Generic SvelteKit utilities
├── schemas/                # Project-specific type definitions
│   └── gicaSchema.ts       # GICA project schema
├── adapters/               # Project-specific implementations
│   └── gicaAdapter.ts      # GICA project adapter
├── index.new.ts           # New modular entry point
├── index.ts               # Legacy entry point (backward compatibility)
└── [other files]          # Existing utilities (cache, client, etc.)
```

## How to Use with Current GICA Project

### 1. Using the New GICA Adapter (Recommended)

```typescript
// In your +page.server.ts files
import {
	gicaDataManager,
	getHome,
	getContributors,
	preloadGicaData
} from '$lib/api/adapters/gicaAdapter';

// Simple usage
export const load = async () => {
	const home = await getHome();
	return { home };
};

// Or using the data manager directly
export const load = async () => {
	const contributors = await gicaDataManager.getCollection('contributors');
	return { contributors };
};
```

### 2. Using Generic Server Utils

```typescript
import { createSimpleLoader } from '$lib/api/core/serverUtils';
import { gicaDataManager } from '$lib/api/adapters/gicaAdapter';

// Create a load function
export const load = createSimpleLoader(gicaDataManager, 'contributors', 'contributors');
```

## How to Port to a New Project

### 1. Define Your Project Schema

Create `src/lib/api/schemas/yourProjectSchema.ts`:

```typescript
import type {
	SchemaConfig,
	ProjectSchema,
	GenericEntity,
	GenericCollection,
	GenericPage,
	MediaAsset
} from '../core/types';

// Define your entities
export interface BlogPost extends GenericEntity {
	content: string;
	author: string;
	publishedAt: string;
	tags: string[];
	featuredImage?: MediaAsset;
}

export interface Category extends GenericEntity {
	description: string;
	color: string;
}

// Define your collections
export interface BlogPosts extends GenericCollection<BlogPost> {
	description: string;
	featuredPosts: BlogPost[];
}

export interface Categories extends GenericCollection<Category> {
	description: string;
}

// Define your pages
export interface HomePage {
	title: string;
	hero: {
		title: string;
		subtitle: string;
		image: MediaAsset;
	};
	featuredPosts: BlogPost[];
}

export interface AboutPage {
	title: string;
	content: string;
	team: {
		name: string;
		role: string;
		bio: string;
		photo: MediaAsset;
	}[];
}

// Define your project schema
export interface BlogSchema extends ProjectSchema {
	collections: {
		posts: BlogPosts;
		categories: Categories;
	};
	pages: {
		home: HomePage;
		about: AboutPage;
	};
	details: {
		posts: BlogPost;
		categories: Category;
	};
}

// Create schema configuration
export const blogSchemaConfig: SchemaConfig<BlogSchema> = {
	schema: {} as BlogSchema,
	collectionTypes: ['posts', 'categories'],
	pageTypes: ['home', 'about'],
	detailTypes: ['posts', 'categories']
};
```

### 2. Create Your Project Adapter

Create `src/lib/api/adapters/blogAdapter.ts`:

```typescript
import { createDataManager } from '../core/dataManager';
import { blogSchemaConfig } from '../schemas/blogSchema';
import type { FallbackFactory } from '../core/types';

// Define fallback data for your project
const blogFallbacks: Record<string, FallbackFactory> = {
	home: () => ({
		title: 'My Blog',
		hero: {
			title: 'Welcome',
			subtitle: 'A place for thoughts',
			image: { url: '/default-hero.jpg' }
		},
		featuredPosts: []
	}),
	about: () => ({
		title: 'About',
		content: 'Loading...',
		team: []
	}),
	posts: () => ({
		title: 'Blog Posts',
		description: 'All blog posts',
		pages: [],
		children: [],
		featuredPosts: []
	}),
	categories: () => ({
		title: 'Categories',
		description: 'All categories',
		pages: [],
		children: []
	})
};

// Create your data manager
export function createBlogDataManager() {
	return createDataManager(blogSchemaConfig, blogFallbacks);
}

// Singleton instance
export const blogDataManager = createBlogDataManager();

// Helper functions for common operations
export async function getHome() {
	return blogDataManager.getPage('home');
}

export async function getAbout() {
	return blogDataManager.getPage('about');
}

export async function getAllPosts() {
	return blogDataManager.getCollection('posts');
}

export async function getPost(id: string) {
	return blogDataManager.getDetail('posts', id);
}

export async function getAllCategories() {
	return blogDataManager.getCollection('categories');
}

export async function getCategory(id: string) {
	return blogDataManager.getDetail('categories', id);
}

// Preload function
export async function preloadBlogData(options?: {
	includeDetails?: boolean;
	cacheImages?: boolean;
}) {
	return blogDataManager.preloadAll(options);
}
```

### 3. Use in Your SvelteKit Pages

```typescript
// src/routes/+page.server.ts
import { getHome } from '$lib/api/adapters/blogAdapter';

export const load = async () => {
	const home = await getHome();
	return { home };
};
```

```typescript
// src/routes/blog/+page.server.ts
import { getAllPosts } from '$lib/api/adapters/blogAdapter';

export const load = async () => {
	const posts = await getAllPosts();
	return { posts };
};
```

```typescript
// src/routes/blog/[slug]/+page.server.ts
import { getPost } from '$lib/api/adapters/blogAdapter';

export const load = async ({ params }) => {
	const post = await getPost(params.slug);
	return { post };
};
```

### 4. Using Generic Server Utils

For more advanced scenarios:

```typescript
import { createGenericServerLoader } from '$lib/api/core/serverUtils';
import { blogDataManager } from '$lib/api/adapters/blogAdapter';

const { createLoadFunction, createBatchLoader } = createGenericServerLoader(blogDataManager);

// Single data load
export const load = createLoadFunction({
	dataType: 'posts',
	returnKey: 'posts',
	errorPrefix: '[Blog Posts]'
});

// Batch load multiple data types
export const load = createBatchLoader([
	{ dataType: 'home', returnKey: 'home' },
	{ dataType: 'posts', returnKey: 'featuredPosts' },
	{ dataType: 'categories', returnKey: 'categories' }
]);
```

## Migration Steps

### From GICA to New Project:

1. **Copy the core folder** - This contains all the generic functionality
2. **Create your schema** - Define your project's data structure
3. **Create your adapter** - Implement project-specific logic
4. **Update your routes** - Replace old imports with new adapter functions
5. **Update your components** - Use the new typed data structures

### Key Benefits:

- **Type Safety**: Full TypeScript support with your specific data types
- **Portability**: Easy to move between projects
- **Backward Compatibility**: Existing GICA code continues to work
- **Extensibility**: Easy to add new data types and functionality
- **Performance**: Built-in caching and optimization
- **Error Handling**: Robust error handling with fallbacks

## Advanced Usage

### Custom Data Transformations

```typescript
// In your adapter
export async function getPostsWithCategories() {
	const [posts, categories] = await Promise.all([
		blogDataManager.getCollection('posts'),
		blogDataManager.getCollection('categories')
	]);

	// Transform data as needed
	return {
		...posts,
		children: posts.children.map((post) => ({
			...post,
			categoryNames:
				post.categoryIds
					?.map((id) => categories.children.find((cat) => cat.id === id)?.title)
					.filter(Boolean) || []
		}))
	};
}
```

### Environment-Specific Configuration

```typescript
// In your adapter
const isDev = process.env.NODE_ENV === 'development';

export const blogDataManager = createDataManager(blogSchemaConfig, blogFallbacks, {
	cacheEnabled: !isDev,
	retryAttempts: isDev ? 1 : 3
});
```

This new structure makes your API library truly portable and maintainable while preserving all existing functionality.
