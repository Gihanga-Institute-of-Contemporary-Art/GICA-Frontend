export interface Contributor {
	id: string;
	title: string;
	role: string;
	bio: string;
	cover: MediaCover;
	socials: {
		name: string;
		url: string;
	}[];
}

export interface Page {
	title: string;
	slug: string;
	description: TextBlock;
}

export interface Contributors {
	id: string;
	title: string;
	pages: Page[];
	children: Contributor[];
}

export interface DateStructure {
	date: string;
	from_time: string;
	to_time: string;
	has_end_date: boolean;
	end_date?: string;
	end_from_time?: string;
	end_to_time?: string;
}
export interface Programme {
	id: string;
	cover: MediaCover;
	title: string;
	text: ContentBlock[];
	link: string;
	dates: DateStructure[];
	contributors: Contributor[];
	tags: string[];
}

export interface Programmes {
	title: string;
	text: ContentBlock[];
	pages: Page[];
	children: Programme[];
}

export interface Exhibition {
	id: string;
	title: string;
	text: ContentBlock[];
	dates: DateStructure[];
	cover: MediaCover;
	image: MediaCover[];
}

export interface Exhibitions {
	title: string;
	text: ContentBlock[];
	pages: Page[];
	children: Exhibition[];
}

export interface Home {
	title: string;
	headline: string;
	about: ContentBlock[];
	carousel: MediaCover[];
	pages: Page[];
}

interface SrcSet {
	[key: string]: string;
	default: string;
	webp: string;
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

export interface MediaCover {
	url: string;
	alt?: string | null;
	caption?: string;
	width?: number;
	height?: number;
	srcset?: SrcSet;
}

export interface TextContent {
	text: string;
}

export interface TextBlock {
	value: string;
}

export interface Visit {
	title: string;
	address: string;
	email: string;
	socials: {
		platform: string;
		url: string;
	}[];
	photography: MediaCover[];
	hours: {
		day: string;
		open: string;
		close: string;
	}[];
	pages: Page[];
}

// Update the ContentBlock definition to reflect the actual structure
export interface ContentBlock {
	content: TextContent | ImageContent;
	id: string;
	isHidden: boolean;
	type: string;
}

// For stronger typing with type discrimination
export interface TextBlock {
	content: TextContent;
	id: string;
	isHidden: boolean;
	type: 'text';
}

export interface ImageBlock {
	content: ImageContent;
	id: string;
	isHidden: boolean;
	type: 'image';
}
