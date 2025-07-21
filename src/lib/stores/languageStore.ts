import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export type SupportedLanguage = 'en' | 'rw';

export interface LanguageConfig {
	code: SupportedLanguage;
	name: string;
	nativeName: string;
	flag: string;
}

// Supported languages configuration
export const supportedLanguages: LanguageConfig[] = [
	{
		code: 'en',
		name: 'English',
		nativeName: 'English',
		flag: '🇺🇸'
	},
	{
		code: 'rw',
		name: 'Kinyarwanda',
		nativeName: 'Ikinyarwanda',
		flag: '🇷🇼'
	}
];

// Default language
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Get initial language from localStorage or default
function getInitialLanguage(): SupportedLanguage {
	if (!browser) return DEFAULT_LANGUAGE;

	try {
		const stored = localStorage.getItem('gica-language');
		if (stored && (stored === 'en' || stored === 'rw')) {
			return stored as SupportedLanguage;
		}
	} catch (error) {
		console.warn('Failed to read language from localStorage:', error);
	}

	return DEFAULT_LANGUAGE;
}

// Create the language store
export const currentLanguage = writable<SupportedLanguage>(getInitialLanguage());

// Derived store for current language config
export const currentLanguageConfig = derived(
	currentLanguage,
	($currentLanguage) =>
		supportedLanguages.find((lang) => lang.code === $currentLanguage) || supportedLanguages[0]
);

// Derived store to check if current language is RTL (for future expansion)
export const isRTL = derived(
	currentLanguage,
	() => false // None of our current languages are RTL
);

// Language switching function
export function setLanguage(language: SupportedLanguage) {
	if (!supportedLanguages.some((lang) => lang.code === language)) {
		console.warn(`Unsupported language: ${language}`);
		return;
	}

	currentLanguage.set(language);

	// Persist to localStorage
	if (browser) {
		try {
			localStorage.setItem('gica-language', language);
		} catch (error) {
			console.warn('Failed to save language to localStorage:', error);
		}
	}
}

// Toggle between languages (useful for simple bilingual setup)
export function toggleLanguage() {
	currentLanguage.update((current) => (current === 'en' ? 'rw' : 'en'));
}

// Get opposite language (for language toggle button)
export const oppositeLanguage = derived(currentLanguage, ($currentLanguage) =>
	$currentLanguage === 'en' ? 'rw' : 'en'
);

// Get opposite language config
export const oppositeLanguageConfig = derived(
	oppositeLanguage,
	($oppositeLanguage) =>
		supportedLanguages.find((lang) => lang.code === $oppositeLanguage) || supportedLanguages[1]
);
