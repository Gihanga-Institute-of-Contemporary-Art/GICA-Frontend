// Date and time utility functions

/**
 * Formats a date string as "MONTH DAY" in uppercase
 * @param dateString - The date string to format
 * @returns Formatted date string like "JANUARY 15"
 */
export function formatProgrammeDate(dateString: string): string {
	const date = new Date(dateString);
	const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
	const day = date.getDate();
	return `${month} ${day}`;
}

/**
 * Determines the status of a programme based on its date
 * @param dateString - The date string to check
 * @returns The status of the programme
 */
export function getProgrammeStatus(dateString: string): 'past' | 'current' | 'upcoming' {
	const programmeDate = new Date(dateString);
	const today = new Date();
	const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

	if (programmeDate < todayStart) {
		return 'past';
	} else if (programmeDate >= todayStart && programmeDate < todayEnd) {
		return 'current';
	} else {
		return 'upcoming';
	}
}

/**
 * Formats a date string for display in a more readable format
 * @param dateString - The date string to format
 * @returns Formatted date string like "January 15, 2025"
 */
export function formatReadableDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * Formats a date string to a short format
 * @param dateString - The date string to format
 * @returns Formatted date string like "Jan 15"
 */
export function formatShortDate(dateString: string): string {
	const date = new Date(dateString);
	const month = date.toLocaleString('en-US', { month: 'short' });
	const day = date.getDate();
	return `${month} ${day}`;
}
