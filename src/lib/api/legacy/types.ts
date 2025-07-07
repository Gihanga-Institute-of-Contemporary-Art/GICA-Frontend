/**
 * Enhanced Type Definitions
 * Comprehensive type system with better discriminated unions and validation
 */

// Base interfaces
export interface BaseEntity {
	id: string;
	title: string;
}

export interface BaseCollection<T extends BaseEntity> {
	title: string;
	pages: Page[];
	children: T[];
}

// Media and content types
export interface SrcSet {
	[key: string]: string;
	default: string;
	webp: string;
}

export interface MediaCover {
	url: string;
	alt?: string | null;
	caption?: string;
	photographer?: string;
	width?: number;
	height?: number;
	srcset?: SrcSet;
}

export interface TextContent {
	text: string;
}

export interface ImageContent {
	location: string;
	image: MediaCover[];
	src: string;
	alt: string;
	caption: string;
	link: string;
	ratio: string;
	crop: string;
}

export interface TextBlockValue {
	value: string;
}

// Content blocks with discriminated unions
export interface BaseContentBlock {
	id: string;
	isHidden: boolean;
}

export interface TextContentBlock extends BaseContentBlock {
	type: 'text';
	content: TextContent;
}

export interface ImageContentBlock extends BaseContentBlock {
	type: 'image';
	content: ImageContent;
}

export type ContentBlock = TextContentBlock | ImageContentBlock;

// Date structure
export interface DateStructure {
	date: string;
	from_time: string;
	to_time: string;
	has_end_date: boolean;
	end_date?: string;
	end_from_time?: string;
	end_to_time?: string;
}

// Social media
export interface SocialLink {
	name: string;
	url: string;
}

export interface SocialPlatform {
	platform: string;
	url: string;
}

// Page interface
export interface Page {
	title: string;
	slug: string;
	description: TextBlockValue;
}

// Contributor types
export interface Contributor extends BaseEntity {
	role: string;
	bio: string;
	cover: MediaCover;
	socials: SocialLink[];
}

export interface Contributors extends BaseCollection<Contributor> {
	text: ContentBlock[];
}

// Programme types
export interface Programme extends BaseEntity {
	cover: MediaCover;
	text: ContentBlock[];
	link: string;
	dates: DateStructure[];
	contributors: Contributor[];
	tags: string[];
}

export interface Programmes extends BaseCollection<Programme> {
	text: ContentBlock[];
}

// Exhibition types
export interface Exhibition extends BaseEntity {
	text: ContentBlock[];
	dates: DateStructure[];
	cover: MediaCover;
	image: MediaCover[];
}

export interface Exhibitions extends BaseCollection<Exhibition> {
	text: ContentBlock[];
}

// Home page
export interface Home {
	title: string;
	headline: string;
	about: ContentBlock[];
	carousel: MediaCover[];
	pages: Page[];
}

// Visit page
export interface OperatingHours {
	day: string;
	open: string;
	close: string;
}

export interface Visit {
	title: string;
	address: string;
	email: string;
	socials: SocialPlatform[];
	photography: MediaCover[];
	hours: OperatingHours[];
	pages: Page[];
}

// Type guards for content blocks
export function isTextContentBlock(block: ContentBlock): block is TextContentBlock {
	return block.type === 'text';
}

export function isImageContentBlock(block: ContentBlock): block is ImageContentBlock {
	return block.type === 'image';
}

// Type utilities for collections and pages
export type CollectionType = 'programmes' | 'exhibitions' | 'contributors';
export type PageType = 'home' | 'visit';
export type DataType = CollectionType | PageType;
export type DetailType = Programme | Exhibition | Contributor;

export interface CollectionMap {
	programmes: Programmes;
	exhibitions: Exhibitions;
	contributors: Contributors;
}

export interface PageMap {
	home: Home;
	visit: Visit;
}

export interface DetailMap {
	programmes: Programme;
	exhibitions: Exhibition;
	contributors: Contributor;
}

export interface DataMap extends CollectionMap, PageMap {}

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

// Legacy types for backward compatibility (deprecated)
/** @deprecated Use TextContentBlock instead */
export type TextBlock = TextContentBlock;

/** @deprecated Use ImageContentBlock instead */
export type ImageBlock = ImageContentBlock;
