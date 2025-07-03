// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	// env variables

	namespace NodeJS {
		interface ProcessEnv {
			KIRBY_BASE_URL: string;
			KIRBY_API_TOKEN: string;
		}
	}
}

export {};
