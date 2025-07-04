import type { ContentBlock, ImageContent, MediaCover } from './types';

const isNode = typeof process !== 'undefined' && !!process.versions?.node;

/**
 * Cache image locally in Node.js or return URL in non-Node (e.g., Cloudflare) environments
 */
export async function cacheImage(url: string): Promise<string> {
	if (!isNode) {
		// In Cloudflare Worker, just return original URL
		return url;
	}

	try {
		const fs = await import('node:fs/promises');
		const path = await import('node:path');
		const destination = 'static/images/';
		const filename = path.basename(url);
		const filePath = path.resolve(process.cwd(), destination, filename);
		const metadataPath = path.resolve(process.cwd(), destination, `.${filename}.metadata`);

		await fs.mkdir(path.dirname(filePath), { recursive: true });

		let shouldDownload = true;
		try {
			const metadata = await fs.stat(metadataPath).catch(() => null);
			if (metadata) {
				const cachedAt = new Date(await fs.readFile(metadataPath, 'utf-8'));
				const now = new Date();
				const oneDay = 1000 * 60 * 60 * 24;
				if (now.getTime() - cachedAt.getTime() < oneDay) {
					shouldDownload = false;
				}
			}
		} catch {
			// continue to download
		}

		if (shouldDownload) {
			const res = await fetch(url);
			if (!res.ok) throw new Error(`Fetch failed for ${url}`);
			const buffer = await res.arrayBuffer();
			await fs.writeFile(filePath, Buffer.from(buffer));
			await fs.writeFile(metadataPath, new Date().toISOString());
			console.log(`Cached ${filename}`);
		} else {
			console.log(`Using cached ${filename}`);
		}

		return '/' + path.join('images', filename).replace(/\\/g, '/');
	} catch (e) {
		console.error(`Caching failed for ${url}:`, e);
		return url;
	}
}

// The rest of your processing helpers remain unchanged
export async function procesContentBlockImages(blocks: ContentBlock[]): Promise<ContentBlock[]> {
	return await Promise.all(
		blocks.map(async (block) => {
			if (block.type === 'image' && block.content && 'image' in block.content) {
				const imageContent = block.content as ImageContent;

				if (imageContent.image?.length) {
					try {
						imageContent.image = await Promise.all(
							imageContent.image.map(async (image) => ({
								...image,
								url: await cacheImage(image.url)
							}))
						);
					} catch (err) {
						console.error('Error processing image block:', err);
					}
				}
				return { ...block, content: imageContent };
			}
			return block;
		})
	);
}

export async function cacheMediaImages(media: MediaCover[]): Promise<MediaCover[]> {
	if (!media?.length) return media;
	return await Promise.all(
		media.map(async (item) => ({
			...item,
			url: await cacheImage(item.url)
		}))
	);
}

export async function cacheMediaImage(media: MediaCover): Promise<MediaCover> {
	if (!media?.url) return media;
	return {
		...media,
		url: await cacheImage(media.url)
	};
}
