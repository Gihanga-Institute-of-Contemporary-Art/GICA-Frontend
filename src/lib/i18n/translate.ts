import { get } from 'svelte/store';
import { currentLanguage } from '../stores/languageStore';
import type { Home, ContentBlock } from '$lib/api/schemas/gicaSchema';

/**
 * CMS Content Translation Utilities
 * These utilities help translate content received from the CMS
 */

export interface TranslatableContent {
	original: string | ContentBlock[];
	translation?: string | ContentBlock[];
	language?: string;
}

/**
 * Get the appropriate content based on current language
 */
export function getLocalizedContent(content: TranslatableContent): string | ContentBlock[] {
	const lang = get(currentLanguage);

	// If current language is English or no translation available, return original
	if (lang === 'en' || !content.translation || content.language !== lang) {
		return content.original;
	}

	return content.translation;
}

/**
 * Translate home page content based on current language
 */
export function translateHomeContent(home: Home): Home {
	const lang = get(currentLanguage);

	// If current language is English or no translation available, return original
	if (lang === 'en' || !home.translation || home.translation.language !== lang) {
		return home;
	}

	// Return home with translated content merged
	return {
		...home,
		headline: home.translation.headline || home.headline,
		about: home.translation.about || home.about
	};
}

/**
 * Get translated text content
 */
export function getTranslatedText(
	originalText: string,
	translatedText?: string,
	translationLanguage?: string
): string {
	const lang = get(currentLanguage);

	if (lang === 'en' || !translatedText || translationLanguage !== lang) {
		return originalText;
	}

	return translatedText;
}

/**
 * Get translated content blocks
 */
export function getTranslatedContentBlocks(
	originalBlocks: ContentBlock[],
	translatedBlocks?: ContentBlock[],
	translationLanguage?: string
): ContentBlock[] {
	const lang = get(currentLanguage);

	if (lang === 'en' || !translatedBlocks || translationLanguage !== lang) {
		return originalBlocks;
	}

	return translatedBlocks;
}

/**
 * Create a reactive translation helper for use in Svelte components
 * This returns a function that can be called reactively
 */
export function createTranslationHelper() {
	return {
		text: (original: string, translated?: string, lang?: string) =>
			getTranslatedText(original, translated, lang),
		blocks: (original: ContentBlock[], translated?: ContentBlock[], lang?: string) =>
			getTranslatedContentBlocks(original, translated, lang),
		home: (home: Home) => translateHomeContent(home)
	};
}

/**
 * Check if content has translation for current language
 */
export function hasTranslationForCurrentLanguage(translationLanguage?: string): boolean {
	const lang = get(currentLanguage);
	return lang !== 'en' && translationLanguage === lang;
}

/**
 * Get the language code from translation object
 */
export function getTranslationLanguage(translation?: { language: string }): string | undefined {
	return translation?.language;
}

/**
 * Generic translation function for any translatable object
 */
export function translateObject<T extends Record<string, unknown>>(
	original: T,
	translation?: Partial<T> & { language: string }
): T {
	const lang = get(currentLanguage);

	if (lang === 'en' || !translation || translation.language !== lang) {
		return original;
	}

	// Merge translated properties into original object
	const result = { ...original } as Record<string, unknown>;

	Object.keys(translation).forEach((key) => {
		if (key !== 'language' && translation[key] !== undefined) {
			result[key] = translation[key];
		}
	});

	return result as T;
}
