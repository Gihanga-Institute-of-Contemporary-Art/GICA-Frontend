// src/lib/api/client.ts
import { KIRBY_BASE_URL, KIRBY_API_TOKEN } from '$env/static/private';

// Error handling
class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
		this.name = 'ApiError';
	}
}

// Fetch with proper typing and authorization
export async function fetchApi<T>(endpoint: string): Promise<T> {
	const url = `${KIRBY_BASE_URL}/${endpoint}`;

	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${KIRBY_API_TOKEN}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new ApiError(`${response.statusText}`, response.status);
		}

		return (await response.json()) as T;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new Error(
			`Failed to fetch from ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
}

// Cache implementation with proper typing
const cache = new Map<string, unknown>();

export async function fetchWithCache<T>(endpoint: string): Promise<T> {
	if (cache.has(endpoint)) {
		return cache.get(endpoint) as T;
	}

	const data = await fetchApi<T>(endpoint);
	cache.set(endpoint, data);
	return data;
}
