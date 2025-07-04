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

export interface Contributors {
	id: string;
	title: string;
	children: Contributor[];
}
export interface Programme {
	id: string;
	cover: MediaCover;
	title: string;
	description: string;
	text: ContentBlock[];
	type: string;
	link: string;
	date: string;
	contributors: Contributor[];
	startTime: string;
	endTime: string;
	venue: string;
}

export interface Programmes {
	title: string;
	text: ContentBlock[];
	children: Programme[];
}

export interface Home {
	title: string;
	headline: string;
	about: ContentBlock[];
	carousel: MediaCover[];
	pages: {
		title: string;
		slug: string;
		description: string;
	};
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
	width?: number;
	height?: number;
	srcset?: SrcSet;
}

export interface TextContent {
	text: string;
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
