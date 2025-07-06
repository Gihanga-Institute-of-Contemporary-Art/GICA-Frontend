// src/hooks.server.ts
import { preloadAllData } from '$lib/api';
import { building } from '$app/environment';
import type { Handle, HandleServerError } from '@sveltejs/kit';

// Preload data once at build time
let dataInitialized = false;

export const handle: Handle = async ({ event, resolve }) => {
	// Preload data during build time
	if (!dataInitialized && building) {
		console.log('Preloading all API data for static site generation...');
		try {
			await preloadAllData();
			dataInitialized = true;
		} catch (error) {
			console.error('Failed to preload static data:', error);
			// Continue with the build even if preloading fails
		}
	}

	return resolve(event);
};

export const handleError: HandleServerError = async ({ event, error }) => {
	const errorId = crypto.randomUUID();

	// Safely construct path for logging, handling prerendering context
	let path = event.url.pathname;
	try {
		// Only access search params if not in prerendering context
		if (!building && event.url.search) {
			path += event.url.search;
		}
	} catch {
		// Fallback if URL properties are not accessible during prerendering
		path = event.url.pathname || 'unknown';
	}

	// Log the error with a unique ID for tracking
	console.error(`Error ID: ${errorId}`, {
		path,
		error:
			error instanceof Error
				? {
						message: error.message,
						stack: error.stack
					}
				: String(error)
	});

	// You can also send this error to an error tracking service like Sentry
	// await sendToErrorTrackingService(errorId, error, event);

	// Return an object that will be available in the +error.svelte components
	return {
		message: 'An unexpected error occurred',
		errorId,
		code: error instanceof Error && 'code' in error ? error.code : 'UNKNOWN'
	};
};
