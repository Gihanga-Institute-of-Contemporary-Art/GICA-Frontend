# Header Component - SEO and Social Media Meta Tags

The Header component provides comprehensive SEO and social media meta tag management for your SvelteKit application. It automatically handles Open Graph, Twitter Cards, structured data, and other essential meta tags.

## Features

- 🎯 **Complete SEO coverage**: Title, description, keywords, canonical URL
- 📱 **Social media optimization**: Open Graph and Twitter Card meta tags
- 🔍 **Structured data**: JSON-LD for rich snippets
- 📖 **Article support**: Special handling for blog posts and articles
- 🌐 **Automatic URL handling**: Smart canonical URL and image URL resolution
- ♿ **Accessibility**: Proper alt text and semantic markup
- 🎨 **Customizable**: Flexible configuration for different page types

## Basic Usage

### Simple Page SEO

```svelte
<script lang="ts">
	import { Header } from '$lib';
</script>

<Header
	title="About Us"
	description="Learn more about our company and mission"
	keywords="about, company, team, mission"
/>
```

### Using SEO Utilities

```svelte
<script lang="ts">
	import { Header, createSEOData } from '$lib';

	const seoData = createSEOData({
		title: 'Our Services',
		description: 'Comprehensive solutions for your business needs',
		image: '/images/services-hero.jpg',
		imageAlt: 'Our comprehensive business services'
	});
</script>

<Header {...seoData} />
```

### Article/Blog Post SEO

```svelte
<script lang="ts">
	import { Header, createArticleSEO } from '$lib';

	const articleSEO = createArticleSEO(
		'How to Build Better Web Applications',
		'A comprehensive guide to modern web development best practices',
		{
			author: 'John Doe',
			image: '/images/blog/web-apps-guide.jpg',
			imageAlt: 'Modern web development illustration',
			tags: ['web development', 'javascript', 'best practices'],
			section: 'Technology'
		}
	);
</script>

<Header {...articleSEO} />
```

## Configuration Options

### SEOData Interface

```typescript
interface SEOData {
	title?: string; // Page title
	description?: string; // Meta description
	keywords?: string; // SEO keywords (comma-separated)
	image?: string; // Social media image URL
	imageAlt?: string; // Image alt text
	url?: string; // Canonical URL (auto-detected if not provided)
	type?: 'website' | 'article' | 'product' | 'profile'; // Page type
	siteName?: string; // Site name for Open Graph
	locale?: string; // Page locale (default: 'en_US')
	author?: string; // Article author
	publishedTime?: string; // Article publish date (ISO string)
	modifiedTime?: string; // Article modified date (ISO string)
	section?: string; // Article section/category
	tags?: string[]; // Article tags
	twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
	twitterSite?: string; // Twitter site handle (@username)
	twitterCreator?: string; // Twitter creator handle (@username)
}
```

## Utility Functions

### `createSEOData(seoData?: Partial<SEOData>): SEOData`

Merges provided SEO data with sensible defaults.

### `createArticleSEO(title: string, description: string, options?: Partial<SEOData>): SEOData`

Creates article-specific SEO data with proper type and timestamp.

### `createSlug(title: string): string`

Generates URL-friendly slug from title.

### `formatSEODate(date: Date): string`

Formats date for meta tags (ISO format).

### `truncateDescription(description: string, maxLength?: number): string`

Truncates description to optimal length (default: 160 characters).

## Examples by Page Type

### Homepage

```svelte
<Header
	title="GICA"
	description="Your gateway to innovative experiences and cutting-edge technology"
	type="website"
	image="/images/homepage-hero.jpg"
	imageAlt="GICA - Innovation and Technology"
/>
```

### Product Page

```svelte
<Header
	title="Premium Widget - GICA Store"
	description="High-quality widgets designed for maximum efficiency and durability"
	type="product"
	image="/images/products/premium-widget.jpg"
	imageAlt="Premium Widget product showcase"
	keywords="widget, premium, quality, efficiency"
/>
```

### Blog Article

```svelte
<script lang="ts">
	const articleData = createArticleSEO(
		'The Future of Web Development',
		'Exploring emerging trends and technologies shaping the web',
		{
			author: 'Jane Smith',
			publishedTime: '2024-01-15T10:00:00Z',
			modifiedTime: '2024-01-16T14:30:00Z',
			section: 'Technology',
			tags: ['web development', 'trends', 'future tech'],
			image: '/images/blog/future-web-dev.jpg',
			imageAlt: 'Futuristic web development concept illustration'
		}
	);
</script>

<Header {...articleData} />
```

### Profile Page

```svelte
<Header
	title="John Doe - Developer Profile"
	description="Full-stack developer specializing in modern web technologies"
	type="profile"
	image="/images/profiles/john-doe.jpg"
	imageAlt="John Doe - Full-stack Developer"
	author="John Doe"
/>
```

## Best Practices

### Image Optimization

- Use 1200x630px images for optimal social media display
- Provide descriptive alt text for accessibility
- Use absolute URLs for images when possible

### Title Guidelines

- Keep titles under 60 characters for optimal display
- Include your brand name: "Page Title | Brand Name"
- Make titles descriptive and keyword-rich

### Description Guidelines

- Keep descriptions between 150-160 characters
- Include primary keywords naturally
- Write compelling copy that encourages clicks

### Article-Specific Tips

- Always include publish date for articles
- Use relevant tags and categories
- Provide author information
- Update modified date when content changes

## Integration with SvelteKit

### Dynamic SEO from Server Data

```svelte
<!-- +page.svelte -->
<script lang="ts">
	import { Header } from '$lib';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const seoData = createSEOData({
		title: data.post.title,
		description: data.post.excerpt,
		image: data.post.featured_image,
		imageAlt: data.post.featured_image_alt,
		type: 'article',
		author: data.post.author.name,
		publishedTime: data.post.published_at,
		tags: data.post.tags.map((tag) => tag.name)
	});
</script>

<Header {...seoData} />
```

### Route-Specific Defaults

```svelte
<!-- +layout.svelte -->
<script lang="ts">
	import { Header, defaultSEO } from '$lib';
	import { page } from '$app/stores';

	const routeSEO = $derived(() => {
		const path = $page.route.id;

		switch (path) {
			case '/about':
				return createSEOData({
					title: 'About Us',
					description: 'Learn about our mission and team'
				});
			case '/contact':
				return createSEOData({
					title: 'Contact Us',
					description: 'Get in touch with our team'
				});
			default:
				return defaultSEO;
		}
	});
</script>

<Header {...routeSEO} />
```

## Testing Your SEO

### Tools for Validation

- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/
- **Google Rich Results Test**: https://search.google.com/test/rich-results

### Chrome DevTools

Check the `<head>` section to verify all meta tags are properly rendered:

1. Open DevTools (F12)
2. Go to Elements tab
3. Expand `<head>` element
4. Verify meta tags are present and correct

## Common Issues and Solutions

### Images Not Displaying

- Ensure images use absolute URLs
- Check image dimensions (recommended: 1200x630px)
- Verify image file accessibility

### Missing Meta Tags

- Check that the Header component is properly imported
- Ensure props are being passed correctly
- Verify no conflicts with other meta tag sources

### Duplicate Meta Tags

- Only use one Header component per page
- Remove any manual meta tags that might conflict
- Check for meta tags in app.html that might duplicate

## Migration from Manual Meta Tags

If you're currently using manual meta tags, replace them with the Header component:

### Before (Manual)

```html
<svelte:head>
	<title>My Page Title</title>
	<meta name="description" content="Page description" />
	<meta property="og:title" content="My Page Title" />
	<meta property="og:description" content="Page description" />
	<!-- ... many more manual tags -->
</svelte:head>
```

### After (Header Component)

```svelte
<Header title="My Page Title" description="Page description" />
```

The Header component automatically generates all the necessary meta tags, including Open Graph, Twitter Cards, and structured data.
