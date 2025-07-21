# Internationalization (i18n) System

This document explains how to use the production-ready internationalization system implemented for the GICA application.

## Overview

The i18n system supports:

- **Languages**: English (en) and Kinyarwanda (rw)
- **CMS Integration**: Automatic translation of content from your CMS
- **UI Translation**: Static translations for interface elements
- **Persistent Language Selection**: Language preference stored in localStorage
- **Reactive Updates**: All content updates automatically when language changes

## Quick Start

### 1. Language Switching Component

Add the language switcher to your components:

```svelte
<script>
	import { LanguageSwitcher } from '$lib';
</script>

<!-- Button style (recommended for header/nav) -->
<LanguageSwitcher style="button" size="medium" />

<!-- Toggle style (recommended for compact spaces) -->
<LanguageSwitcher style="toggle" size="small" />

<!-- Dropdown style -->
<LanguageSwitcher style="dropdown" />
```

### 2. Using Translations in Components

#### For UI Text (Static Translations)

```svelte
<script>
	import { ui } from '$lib/i18n';
</script>

<button>{ui('readMore')}</button><h1>{ui('home')}</h1>
```

#### For CMS Content (Dynamic Translations)

```svelte
<script>
	import {
		translateHomeContent,
		getTranslatedText,
		getTranslatedContentBlocks
	} from '$lib/i18n/translate';

	let { home, content } = $props();

	// Translate entire home object
	const translatedHome = $derived(translateHomeContent(home));

	// Translate individual text
	const translatedTitle = $derived(
		getTranslatedText(content.title, content.translation?.title, content.translation?.language)
	);

	// Translate content blocks
	const translatedBlocks = $derived(
		getTranslatedContentBlocks(
			content.blocks,
			content.translation?.blocks,
			content.translation?.language
		)
	);
</script>

<h1>{translatedHome.headline}</h1>
<p>{translatedTitle}</p>

{#each translatedBlocks as block}
	<!-- Render block content -->
{/each}
```

## Language Store

### Available Stores

```typescript
import {
	currentLanguage, // Current language ('en' | 'rw')
	currentLanguageConfig, // Full language config object
	oppositeLanguage, // The other language
	oppositeLanguageConfig, // Config for the other language
	isRTL, // Whether current language is RTL (always false for en/rw)
	setLanguage, // Function to change language
	toggleLanguage // Function to toggle between languages
} from '$lib/stores/languageStore';
```

### Usage Examples

```svelte
<script>
	import { currentLanguage, setLanguage, toggleLanguage } from '$lib/stores/languageStore';
</script>

<!-- Display current language -->
<p>Current language: {$currentLanguage}</p>

<!-- Change to specific language -->
<button onclick={() => setLanguage('rw')}>Switch to Kinyarwanda</button>

<!-- Toggle between languages -->
<button onclick={toggleLanguage}>Toggle Language</button>
```

## Adding New UI Translations

Edit `/src/lib/i18n/index.ts` and add to the `uiTranslations` object:

```typescript
export const uiTranslations = {
	// ... existing translations

	// Add your new translations
	newButton: {
		en: 'New Button',
		rw: 'Buto Nshya'
	},
	welcomeMessage: {
		en: 'Welcome to GICA',
		rw: 'Murakaza neza muri GICA'
	}
};
```

Then use them in components:

```svelte
<script>
	import { ui } from '$lib/i18n';
</script>

<button>{ui('newButton')}</button><h1>{ui('welcomeMessage')}</h1>
```

## CMS Translation Structure

Your CMS should return content with this structure:

```typescript
{
  // Original content (English)
  title: "Welcome",
  content: "Hello world",
  blocks: [...],

  // Translation object
  translation: {
    language: "rw",  // Target language
    title: "Murakaza neza",
    content: "Muraho isi",
    blocks: [...]
  }
}
```

## Advanced Usage

### Custom Translation Function

For specific use cases, create custom translation functions:

```typescript
import { get } from 'svelte/store';
import { currentLanguage } from '$lib/stores/languageStore';

export function translateCustomContent<T>(original: T, translations: Record<string, T>): T {
	const lang = get(currentLanguage);
	return translations[lang] || original;
}
```

### Reactive Translation Helper

For use in components that need multiple translations:

```svelte
<script>
	import { createTranslationHelper } from '$lib/i18n/translate';

	let { content } = $props();

	const translate = createTranslationHelper();

	const translatedContent = $derived({
		title: translate.text(content.title, content.translation?.title, content.translation?.language),
		blocks: translate.blocks(
			content.blocks,
			content.translation?.blocks,
			content.translation?.language
		)
	});
</script>

<h1>{translatedContent.title}</h1>
{#each translatedContent.blocks as block}
	<!-- Content -->
{/each}
```

### URL-based Language Switching (Future Extension)

The system is prepared for URL-based language switching. To implement:

1. Update your routing structure (e.g., `/en/about`, `/rw/about`)
2. Modify `getLocalizedPath` function in `/src/lib/i18n/index.ts`
3. Update your `+layout.server.ts` to detect language from URL
4. Set initial language in stores based on URL

## Navigation Translation

Navigation items are automatically translated using the `translatedNavItems` store:

```svelte
<script>
	import { translatedNavItems } from '$lib/stores/navStore';
</script>

{#each $translatedNavItems as item}
	<a href={item.href}>{item.title}</a>
{/each}
```

## Best Practices

### 1. Consistent Translation Keys

- Use descriptive keys for UI translations
- Group related translations together
- Use camelCase for consistency

### 2. Fallback Strategy

- Always provide English text as fallback
- Handle missing translations gracefully
- Log missing translation keys in development

### 3. Performance

- Use `$derived` for reactive translations in components
- Avoid calling translation functions in loops
- Cache translated content when possible

### 4. Accessibility

- Update `lang` attribute when language changes
- Provide `aria-label` for language switcher
- Test with screen readers

## Testing Language Changes

1. **Manual Testing**:
   - Use the language switcher component
   - Verify content updates immediately
   - Check localStorage persistence

2. **Automated Testing**:

   ```typescript
   import { setLanguage, currentLanguage } from '$lib/stores/languageStore';
   import { get } from 'svelte/store';

   // Test language switching
   setLanguage('rw');
   expect(get(currentLanguage)).toBe('rw');
   ```

## Troubleshooting

### Language Not Changing

- Check if language switcher is properly imported
- Verify translation data structure from CMS
- Check browser localStorage for saved language

### Missing Translations

- Add missing keys to `uiTranslations`
- Verify CMS returns translation object
- Check translation language matches target language

### Performance Issues

- Use `$derived` instead of functions in templates
- Avoid nested translation calls
- Consider memoization for complex translations

## Integration with Existing Code

The system is designed to be backward compatible:

1. **Existing components** work without changes
2. **Gradual migration** - add translations incrementally
3. **No breaking changes** - original content still displays
4. **Optional features** - language switching can be added where needed

## Example Implementation

See the updated components for examples:

- `/src/lib/components/Nav.svelte` - Navigation with language switcher
- `/src/lib/components/Footer.svelte` - CMS content translation
- `/src/routes/+page.svelte` - Home page translation
- `/src/routes/+layout.svelte` - Layout with translated footer

This system provides a solid foundation for internationalization that can be extended as your needs grow.
