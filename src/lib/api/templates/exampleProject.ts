/**
 * Example Project Template
 * Copy this as a starting point for new projects
 */

// STEP 1: Define your project schema
import type {
	SchemaConfig,
	ProjectSchema,
	GenericEntity,
	GenericCollection,
	GenericPage,
	MediaAsset
} from '../core/types';

// Define your entities (customize these)
export interface Product extends GenericEntity {
	price: number;
	description: string;
	images: MediaAsset[];
	category: string;
	inStock: boolean;
}

export interface Category extends GenericEntity {
	description: string;
	image?: MediaAsset;
}

// Define your collections (customize these)
export interface Products extends GenericCollection<Product> {
	featured: Product[];
}

export interface Categories extends GenericCollection<Category> {
	description: string;
}

// Define your pages (customize these)
export interface HomePage {
	title: string;
	hero: {
		title: string;
		subtitle: string;
		backgroundImage: MediaAsset;
	};
	featuredProducts: Product[];
}

export interface AboutPage {
	title: string;
	content: string;
	mission: string;
	vision: string;
}

// STEP 2: Define your project schema
export interface ExampleSchema extends ProjectSchema {
	collections: {
		products: Products;
		categories: Categories;
	};
	pages: {
		home: HomePage;
		about: AboutPage;
	};
	details: {
		products: Product;
		categories: Category;
	};
}

// STEP 3: Create schema configuration
export const exampleSchemaConfig: SchemaConfig<ExampleSchema> = {
	schema: {} as ExampleSchema,
	collectionTypes: ['products', 'categories'],
	pageTypes: ['home', 'about'],
	detailTypes: ['products', 'categories']
};

// STEP 4: Create adapter (put this in adapters/exampleAdapter.ts)
/*
import { createDataManager } from '../core/dataManager';
import { exampleSchemaConfig } from '../schemas/exampleSchema';
import type { FallbackFactory } from '../core/types';

const exampleFallbacks: Record<string, FallbackFactory> = {
  home: () => ({
    title: 'Example Store',
    hero: {
      title: 'Welcome',
      subtitle: 'Find amazing products',
      backgroundImage: { url: '/hero.jpg' }
    },
    featuredProducts: []
  }),
  about: () => ({
    title: 'About Us',
    content: 'Loading...',
    mission: 'Our mission',
    vision: 'Our vision'
  }),
  products: () => ({
    title: 'Products',
    pages: [],
    children: [],
    featured: []
  }),
  categories: () => ({
    title: 'Categories',
    description: 'Product categories',
    pages: [],
    children: []
  })
};

export function createExampleDataManager() {
  return createDataManager(exampleSchemaConfig, exampleFallbacks);
}

export const exampleDataManager = createExampleDataManager();

export async function getHome() {
  return exampleDataManager.getPage('home');
}

export async function getProducts() {
  return exampleDataManager.getCollection('products');
}

export async function getProduct(id: string) {
  return exampleDataManager.getDetail('products', id);
}
*/

// STEP 5: Use in your SvelteKit routes
/*
// src/routes/+page.server.ts
import { getHome } from '$lib/api/adapters/exampleAdapter';

export const load = async () => {
  const home = await getHome();
  return { home };
};

// src/routes/products/+page.server.ts
import { getProducts } from '$lib/api/adapters/exampleAdapter';

export const load = async () => {
  const products = await getProducts();
  return { products };
};

// src/routes/products/[id]/+page.server.ts
import { getProduct } from '$lib/api/adapters/exampleAdapter';

export const load = async ({ params }) => {
  const product = await getProduct(params.id);
  return { product };
};
*/
