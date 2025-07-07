/**
 * GICA Project Schema Configuration
 * Defines the specific types and structure for the GICA project
 */

import type {
	SchemaConfig,
	ProjectSchema,
	GenericEntity,
	GenericCollection,
	GenericPage,
	MediaAsset,
	GenericDateStructure,
	GenericSocialLink
} from '../core/types';

// GICA-specific content types
export interface TextContent {
	text: string;
}

export interface ImageContent {
	location: string;
	image: MediaAsset[];
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

// GICA Content blocks
export interface TextContentBlock {
	id: string;
	type: 'text';
	isHidden?: boolean;
	content: TextContent;
}

export interface ImageContentBlock {
	id: string;
	type: 'image';
	isHidden?: boolean;
	content: ImageContent;
}

export type ContentBlock = TextContentBlock | ImageContentBlock;

// GICA Page types
export interface GicaPage extends GenericPage {
	description: TextBlockValue;
}

// GICA Entity types
export interface Contributor extends GenericEntity {
	role: string;
	bio: string;
	cover: MediaAsset;
	socials: GenericSocialLink[];
}

export interface Programme extends GenericEntity {
	cover: MediaAsset;
	text: ContentBlock[];
	link: string;
	dates: GenericDateStructure[];
	contributors: Contributor[];
	tags: string[];
}

// GICA Collection types
export interface Contributors extends GenericCollection<Contributor> {
	text: ContentBlock[];
}

export interface Programmes extends GenericCollection<Programme> {
	text: ContentBlock[];
}

// GICA Page types
export interface Home {
	title: string;
	headline: string;
	about: ContentBlock[];
	carousel: MediaAsset[];
	pages: GicaPage[];
	translation: {
		language: string;
		headline: string;
		about: ContentBlock[];
	};
}

export interface OperatingHours {
	day: string;
	open: string;
	close: string;
}

export interface Visit {
	title: string;
	address: string;
	email: string;
	socials: GenericSocialLink[];
	photography: MediaAsset[];
	hours: OperatingHours[];
	pages: GicaPage[];
}

// GICA Schema definition
export interface GicaSchema extends ProjectSchema {
	collections: {
		programmes: Programmes;
		contributors: Contributors;
	};
	pages: {
		home: Home;
		visit: Visit;
	};
	details: {
		programmes: Programme;
		contributors: Contributor;
	};
}

// GICA Schema configuration
export const gicaSchemaConfig: SchemaConfig<GicaSchema> = {
	schema: {} as GicaSchema, // This is just for type inference
	collectionTypes: ['programmes', 'contributors'],
	pageTypes: ['home', 'visit'],
	detailTypes: ['programmes', 'contributors']
};

// Type guards
export function isTextContentBlock(block: ContentBlock): block is TextContentBlock {
	return block.type === 'text';
}

export function isImageContentBlock(block: ContentBlock): block is ImageContentBlock {
	return block.type === 'image';
}

// Utility types
export type CollectionType = keyof GicaSchema['collections'];
export type PageType = keyof GicaSchema['pages'];
export type DataType = CollectionType | PageType;
export type DetailType = Programme | Contributor;

// Collection mappings for backward compatibility
export interface CollectionMap {
	programmes: Programmes;
	contributors: Contributors;
}

export interface PageMap {
	home: Home;
	visit: Visit;
}

export interface DetailMap {
	programmes: Programme;
	contributors: Contributor;
}

export interface DataMap extends CollectionMap, PageMap {}
