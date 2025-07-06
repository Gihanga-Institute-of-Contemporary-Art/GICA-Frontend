/**
 * Core Generic Types
 * These are project-agnostic types that can be used across different projects
 */

// Generic base interfaces
export interface GenericEntity {
	id: string;
	title: string;
	slug?: string;
}

export interface GenericCollection<T extends GenericEntity> {
	title: string;
	children: T[];
	pages?: GenericPage[];
}

export interface GenericPage {
	title: string;
	slug: string;
	description?: string | { value: string };
}

// Media and content types (these are usually consistent across projects)
export interface MediaAsset {
	url: string;
	alt?: string | null;
	caption?: string;
	width?: number;
	height?: number;
	srcset?: Record<string, string>;
}

export interface GenericContentBlock {
	id: string;
	type: string;
	isHidden?: boolean;
	content: Record<string, unknown>;
}

// Date and time structures
export interface GenericDateStructure {
	date: string;
	from_time?: string;
	to_time?: string;
	has_end_date?: boolean;
	end_date?: string;
	end_from_time?: string;
	end_to_time?: string;
}

// Social media
export interface GenericSocialLink {
	name: string;
	url: string;
	platform?: string;
}

// API response wrapper
export interface ApiResponseMeta {
	timestamp: number;
	version?: string;
	requestId?: string;
}

export interface ApiResponse<T> {
	data: T;
	meta?: ApiResponseMeta;
}

// Validation types
export interface ValidationError {
	field: string;
	message: string;
	code: string;
}

export interface ValidationResult {
	isValid: boolean;
	errors: ValidationError[];
}

// Utility types
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Configuration types for project setup
export interface ProjectSchema<
	TCollections extends Record<string, unknown> = Record<string, unknown>,
	TPages extends Record<string, unknown> = Record<string, unknown>,
	TDetails extends Record<string, unknown> = Record<string, unknown>
> {
	collections: TCollections;
	pages: TPages;
	details: TDetails;
}

export interface SchemaConfig<T extends ProjectSchema = ProjectSchema> {
	schema: T;
	collectionTypes: (keyof T['collections'])[];
	pageTypes: (keyof T['pages'])[];
	detailTypes: (keyof T['details'])[];
}

export interface PreloadOptions {
	includeDetails?: boolean;
	cacheImages?: boolean;
	concurrency?: number;
	onProgress?: (stage: string, progress: number, total: number) => void;
}

export interface PreloadResult {
	success: boolean;
	loadedCollections: string[];
	loadedDetails: string[];
	cachedImages: number;
	errors: Array<{ stage: string; error: string }>;
	executionTime: number;
}

// Generic data manager interface
export interface DataManager<T extends ProjectSchema = ProjectSchema> {
	getCollection<K extends keyof T['collections']>(type: K): Promise<T['collections'][K]>;
	getPage<K extends keyof T['pages']>(type: K): Promise<T['pages'][K]>;
	getDetail<K extends keyof T['details']>(type: K, id: string): Promise<T['details'][K]>;
	preloadAll(options?: PreloadOptions): Promise<PreloadResult>;
	clearCache(): void;
}

// Fallback factory type
export type FallbackFactory<T = unknown> = () => T;

// Load configuration for server utilities
export interface GenericLoadConfig<T = unknown> {
	dataType: string;
	returnKey: string;
	fallbackFactory?: FallbackFactory<T>;
	errorPrefix?: string;
}
