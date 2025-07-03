import fs from 'fs/promises';
import path from 'path';
import type { ContentBlock, ImageContent, MediaCover } from './types';

/**
 * Cache an image from a URL to the local filesystem
 * @param url The URL of the image to cache
 * @returns The local path to the cached image
 */
export async function cacheImage(url: string): Promise<string> {
	const destination = 'static/images/';
	const filename = path.basename(url);
	const filePath = path.resolve(process.cwd(), destination, filename);
	const metadataPath = path.resolve(process.cwd(), destination, `.${filename}.metadata`);

	try {
		// Create destination directory if it doesn't exist
		await fs.mkdir(path.dirname(filePath), { recursive: true });

		// Check if image is already cached and not expired
		let shouldDownload = true;
		try {
			const metadataExists = await fs.stat(metadataPath).catch(() => null);

			if (metadataExists) {
				const metadata = await fs.readFile(metadataPath, 'utf-8');
				const cacheDate = new Date(metadata.trim());
				const now = new Date();
				const oneDayMs = 24 * 60 * 60 * 1000;

				// If cached less than a day ago, don't download again
				if (now.getTime() - cacheDate.getTime() < oneDayMs) {
					shouldDownload = false;
				}
			}
		} catch (error) {
			// If any error checking cache, proceed with download
			console.log(`Metadata check failed for ${filename}, will download: `, error);
		}

		if (shouldDownload) {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Failed to fetch image: ${response.status}`);
			}
			const buffer = await response.arrayBuffer();

			// Save image file
			await fs.writeFile(filePath, Buffer.from(buffer));

			// Save metadata with current date
			await fs.writeFile(metadataPath, new Date().toISOString());

			console.log(`Cached image ${filename} from ${url}`);
		} else {
			console.log(`Using cached image ${path.join(destination, filename)}, cache is still valid`);
		}

		// Return the path to the cached image
		return '/' + path.join('images', filename).replace(/\\/g, '/');
	} catch (error) {
		console.error(`Image caching error for ${url}:`, error);
		throw error;
	}
}

/**
 * Process and cache images in content blocks
 */
export async function procesContentBlockImages(blocks: ContentBlock[]): Promise<ContentBlock[]> {
	return await Promise.all(
		blocks.map(async (block) => {
			// Only process image blocks
			if (block.type === 'image' && block.content && 'image' in block.content) {
				const imageContent = block.content as ImageContent;

				// Process all images in the image block
				if (imageContent.image?.length) {
					imageContent.image = await Promise.all(
						imageContent.image.map(async (image) => ({
							...image,
							url: await cacheImage(image.url)
						}))
					);
				}

				return {
					...block,
					content: imageContent
				};
			}
			return block;
		})
	);
}

/**
 * Cache all images in a media cover array
 */
export async function cacheMediaImages(media: MediaCover[]): Promise<MediaCover[]> {
	if (!media?.length) return media;

	return Promise.all(
		media.map(async (item) => ({
			...item,
			url: await cacheImage(item.url)
		}))
	);
}

/**
 * Cache single media cover image
 */
export async function cacheMediaImage(media: MediaCover): Promise<MediaCover> {
	if (!media?.url) return media;

	return {
		...media,
		url: await cacheImage(media.url)
	};
}
