# i18n Quick Reference

## Basic Usage

### Language Switcher Component

```svelte
<LanguageSwitcher style="toggle" size="small" />
```

### UI Translations

```svelte
<script>
	import { ui } from '$lib/i18n';
</script>

<button>{ui('readMore')}</button>
```

### CMS Content Translation

```svelte
<script>
	import { translateHomeContent } from '$lib/i18n/translate';

	const translatedHome = $derived(translateHomeContent(data.home));
</script>

<h1>{translatedHome.headline}</h1>
```

## Language Store

```typescript
import {
	currentLanguage, // 'en' | 'rw'
	setLanguage, // (lang: 'en' | 'rw') => void
	toggleLanguage // () => void
} from '$lib/stores/languageStore';

// Change language
setLanguage('rw');

// Toggle between languages
toggleLanguage();

// Get current language
console.log($currentLanguage);
```

## Adding New UI Translations

Edit `src/lib/i18n/index.ts`:

```typescript
export const uiTranslations = {
	newKey: {
		en: 'English Text',
		rw: 'Kinyarwanda Text'
	}
};
```

Use in components:

```svelte
{ui('newKey')}
```

## CMS Translation Format

```json
{
	"title": "English Title",
	"content": "English content...",
	"translation": {
		"language": "rw",
		"title": "Kinyarwanda Title",
		"content": "Kinyarwanda content..."
	}
}
```

## Files Modified

- ✅ Language store: `src/lib/stores/languageStore.ts`
- ✅ i18n utilities: `src/lib/i18n/index.ts`
- ✅ Translation helpers: `src/lib/i18n/translate.ts`
- ✅ Language switcher: `src/lib/components/LanguageSwitcher.svelte`
- ✅ Updated Nav: `src/lib/components/Nav.svelte`
- ✅ Updated Footer: `src/lib/components/Footer.svelte`
- ✅ Updated navigation store: `src/lib/stores/navStore.ts`
- ✅ Updated layout: `src/routes/+layout.svelte`
- ✅ Updated home page: `src/routes/+page.svelte`
