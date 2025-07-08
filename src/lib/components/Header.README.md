# GICA Header Component - Quick Start

A comprehensive SEO and social media meta tag component for SvelteKit.

## Quick Usage

```svelte
<script>
	import { Header, createSEOData } from '$lib';

	const seo = createSEOData({
		title: 'My Page Title',
		description: 'My page description for SEO',
		image: '/images/my-page.jpg'
	});
</script>

<Header {...seo} />
```

## What it includes:

✅ **SEO Meta Tags**: Title, description, keywords, canonical URL  
✅ **Open Graph**: Facebook, LinkedIn social sharing  
✅ **Twitter Cards**: Twitter social sharing  
✅ **Structured Data**: JSON-LD for rich snippets  
✅ **Article Support**: Blog posts and news articles  
✅ **Accessibility**: Proper alt text and semantic markup

## Key Features:

- 🚀 **Zero config**: Works with sensible defaults
- 🎯 **Type-safe**: Full TypeScript support
- 📱 **Mobile optimized**: Responsive meta tags
- 🔧 **Customizable**: Override any setting
- ⚡ **Performance**: Lightweight and efficient

## See `/src/lib/components/Header.md` for full documentation.
