/**
 * Server-side API configuration setup
 * This file can safely import private environment variables
 */
import { KIRBY_BASE_URL, KIRBY_API_TOKEN } from '$env/static/private';
import { setupApiConfigWithEnv } from '$lib/api/core/config';

/**
 * Initialize API configuration from private environment variables
 * Call this from server-side code (like hooks.server.ts or +layout.server.ts)
 */
export function initializeApiConfig(): void {
	console.log(KIRBY_API_TOKEN, KIRBY_BASE_URL, 'Initializing API config with env vars');
	setupApiConfigWithEnv({
		KIRBY_BASE_URL,
		KIRBY_API_TOKEN
	});
}

/**
 * Get server configuration for passing to client
 * Only includes safe, non-sensitive config values
 */
export function getClientSafeConfig() {
	return {
		baseUrl: KIRBY_BASE_URL || 'http://localhost:3000',
		environment: process.env.NODE_ENV || 'development'
	};
}
