import { get } from 'svelte/store';
import { currentLanguage } from '../stores/languageStore';
import type { ContentBlock } from '$lib/api';

/**
 * Internationalization utilities for the GICA application
 */

// Generic translation function for simple key-value translations
export function t(translations: Record<string, string>): string {
	const lang = get(currentLanguage);
	return translations[lang] || translations['en'] || Object.values(translations)[0] || '';
}

// Translation function for content blocks (CMS content)
export function translateContentBlocks(
	blocks: ContentBlock[],
	translatedBlocks?: ContentBlock[]
): ContentBlock[] {
	const lang = get(currentLanguage);

	// If current language is English or no translations available, return original
	if (lang === 'en' || !translatedBlocks || !Array.isArray(translatedBlocks)) {
		return blocks;
	}

	// Return translated blocks
	return translatedBlocks;
}

// Translation function for simple text content
export function translateText(originalText: string, translatedText?: string): string {
	const lang = get(currentLanguage);

	// If current language is English or no translation available, return original
	if (lang === 'en' || !translatedText) {
		return originalText;
	}

	return translatedText;
}

// Helper function to get translated content from CMS translation object
export function getTranslatedContent<T>(
	originalContent: T,
	translation?: {
		language: string;
		[key: string]: unknown;
	}
): T {
	const lang = get(currentLanguage);

	// If current language is English or no translation available, return original
	if (lang === 'en' || !translation || translation.language !== lang) {
		return originalContent;
	}

	// Create a merged object with translated content
	return {
		...originalContent,
		...translation
	} as T;
}

// Helper to check if translations are available for current language
export function hasTranslation(translation?: { language: string }): boolean {
	const lang = get(currentLanguage);
	return lang !== 'en' && translation?.language === lang;
}

// Language-aware URL helper (for future use with URL-based language switching)
// export function getLocalizedPath(path: string, _language?: string): string {
// 	// For now, we don't use URL-based language switching
// 	// But this can be extended later if needed
// 	return path;
// }

// Format dates according to current language
export function formatDate(date: Date | string | number): string {
	const lang = get(currentLanguage);
	const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

	if (isNaN(dateObj.getTime())) {
		return '';
	}

	// Kinyarwanda date formatting (similar to English for now)
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};

	try {
		if (lang === 'rw') {
			// For Kinyarwanda, we'll use English formatting for now
			// This can be customized further based on local preferences
			return dateObj.toLocaleDateString('en-US', options);
		}

		return dateObj.toLocaleDateString('en-US', options);
	} catch {
		// Fallback to basic formatting
		return dateObj.toLocaleDateString();
	}
}

// Static translations for UI elements
export const uiTranslations = {
	// Navigation
	home: {
		en: 'Home',
		rw: 'Iriburiro'
	},
	programme: {
		en: 'Programme',
		rw: 'Programme'
	},
	contributors: {
		en: 'Contributors',
		rw: 'Abafashije'
	},
	visit: {
		en: 'Visit us',
		rw: 'Dusure'
	},

	// Common UI elements
	loading: {
		en: 'Loading...',
		rw: 'Biguruka...'
	},
	error: {
		en: 'Error',
		rw: 'Ikosa'
	},
	retry: {
		en: 'Retry',
		rw: 'Ongera ugerageze'
	},
	close: {
		en: 'Close',
		rw: 'Funga'
	},
	open: {
		en: 'Open',
		rw: 'Fungura'
	},
	readMore: {
		en: 'Read more',
		rw: 'Soma byinshi'
	},
	readLess: {
		en: 'Read less',
		rw: 'Soma bike'
	},

	// Language switching
	switchLanguage: {
		en: 'Switch to Kinyarwanda',
		rw: 'Hindura mu Cyongereza'
	},
	currentLanguage: {
		en: 'English',
		rw: 'Ikinyarwanda'
	},

	// Footer
	about: {
		en: 'About',
		rw: 'Ibyerekeye'
	},
	contact: {
		en: 'Contact',
		rw: 'Twandikire'
	},

	// Date and time
	today: {
		en: 'Today',
		rw: 'Uyu munsi'
	},
	yesterday: {
		en: 'Yesterday',
		rw: 'Ejo hashize'
	},
	tomorrow: {
		en: 'Tomorrow',
		rw: 'Ejo hazaza'
	}
};

// Helper function to get UI translation
export function ui(key: keyof typeof uiTranslations): string {
	const translations = uiTranslations[key];
	if (!translations) {
		console.warn(`Translation key not found: ${key}`);
		return key;
	}
	return t(translations);
}
