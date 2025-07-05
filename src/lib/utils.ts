// Date and time utility functions

import type { DateStructure } from './api/types';

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

/**
 * Gets the primary date from a programme's dates array (first date entry)
 * @param dates - Array of DateStructure objects
 * @returns The date of the first date entry, or empty string if no dates
 */
export function getPrimaryDate(dates: DateStructure[]): string {
	return dates.length > 0 ? dates[0].date : '';
}

/**
 * Gets the primary time from a programme's dates array (first date entry) formatted for display
 * @param dates - Array of DateStructure objects
 * @returns The formatted from_time of the first date entry, or empty string if no dates
 */
export function getPrimaryTime(dates: DateStructure[]): string {
	const rawTime = dates.length > 0 ? dates[0].from_time : '';
	return formatTime12Hour(rawTime);
}

/**
 * Formats the primary date from a programme's dates array as "MONTH DAY" in uppercase
 * @param dates - Array of DateStructure objects
 * @returns Formatted date string like "JANUARY 15"
 */
export function formatProgrammeDateFromArray(dates: DateStructure[]): string {
	const primaryDate = getPrimaryDate(dates);
	return primaryDate ? formatProgrammeDate(primaryDate) : '';
}

/**
 * Determines the status of a programme based on its dates array
 * @param dates - Array of DateStructure objects
 * @returns The status of the programme
 */
export function getProgrammeStatusFromArray(
	dates: DateStructure[]
): 'past' | 'current' | 'upcoming' {
	const primaryDate = getPrimaryDate(dates);
	return primaryDate ? getProgrammeStatus(primaryDate) : 'upcoming';
}

/**
 * Formats a date range for display
 * @param dates - Array of DateStructure objects
 * @returns Formatted date range string
 */
export function formatDateRange(dates: DateStructure[]): string {
	if (dates.length === 0) return '';

	if (dates.length === 1) {
		const date = dates[0];
		const formattedDate = formatReadableDate(date.date);
		if (date.from_time) {
			const formattedTime = formatTime12Hour(date.from_time);
			return `${formattedDate} at ${formattedTime}`;
		}
		return formattedDate;
	}

	// Multiple dates - show range
	const firstDate = formatReadableDate(dates[0].date);
	const lastDate = formatReadableDate(
		dates[dates.length - 1].end_date || dates[dates.length - 1].date
	);
	return `${firstDate} - ${lastDate}`;
}

/**
 * Formats a time string from 24-hour format to 12-hour format with AM/PM
 * @param timeString - Time string in format "HH:MM:SS" or "HH:MM"
 * @returns Formatted time string like "9:00 PM" or empty string if invalid
 */
export function formatTime12Hour(timeString: string): string {
	if (!timeString) return '';

	// Handle both "HH:MM:SS" and "HH:MM" formats
	const timeParts = timeString.split(':');
	if (timeParts.length < 2) return timeString; // Return original if not in expected format

	const hours = parseInt(timeParts[0], 10);
	const minutes = parseInt(timeParts[1], 10);

	if (isNaN(hours) || isNaN(minutes)) return timeString; // Return original if invalid

	const period = hours >= 12 ? 'PM' : 'AM';
	const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
	const displayMinutes = minutes.toString().padStart(2, '0');

	return `${displayHours}:${displayMinutes}${period}`;
}

/**
 * Formats a single DateStructure to show date and time range in the specified format
 * @param dateStructure - Single DateStructure object
 * @returns Formatted string with date and time range
 */
export function formatSingleDateTimeRange(dateStructure: DateStructure): string {
	const date = formatProgrammeDate(dateStructure.date);
	const fromTime = formatTime12Hour(dateStructure.from_time);
	const toTime = formatTime12Hour(dateStructure.to_time);

	let result = date;

	// Add time range for main date
	if (fromTime) {
		if (toTime && toTime !== fromTime) {
			result += `\n${fromTime} – ${toTime}`;
		} else {
			result += `\n${fromTime}`;
		}
	}

	// Handle end date if it exists
	if (dateStructure.has_end_date && dateStructure.end_date) {
		const endDate = formatProgrammeDate(dateStructure.end_date);
		result += `\n${endDate}`;

		// Add end time range if available
		const endFromTime = formatTime12Hour(dateStructure.end_from_time || '');
		const endToTime = formatTime12Hour(dateStructure.end_to_time || '');

		if (endFromTime) {
			if (endToTime && endToTime !== endFromTime) {
				result += `\n${endFromTime} — ${endToTime}`;
			} else {
				result += `\n${endFromTime}`;
			}
		}
	}

	return result;
}

/**
 * Formats all dates from a programme's dates array with full details
 * @param dates - Array of DateStructure objects
 * @returns Array of formatted date/time strings
 */
export function formatAllDateTimeRanges(dates: DateStructure[]): string[] {
	return dates.map((date) => formatSingleDateTimeRange(date));
}

/**
 * Gets a comprehensive time range for display (from and to times)
 * @param dates - Array of DateStructure objects
 * @returns Formatted time range string
 */
export function getTimeRange(dates: DateStructure[]): string {
	if (dates.length === 0) return '';

	const firstDate = dates[0];
	const fromTime = formatTime12Hour(firstDate.from_time);
	const toTime = formatTime12Hour(firstDate.to_time);

	if (!fromTime) return '';

	if (toTime && toTime !== fromTime) {
		return `${fromTime} — ${toTime}`;
	}

	return fromTime;
}

/**
 * Formats a single DateStructure for compact display (single line)
 * @param dateStructure - Single DateStructure object
 * @returns Formatted string with date and time in compact format
 */
export function formatCompactDateTimeRange(dateStructure: DateStructure): string {
	const date = formatReadableDate(dateStructure.date);
	const fromTime = formatTime12Hour(dateStructure.from_time);
	const toTime = formatTime12Hour(dateStructure.to_time);

	let result = date;

	// Add time range for main date
	if (fromTime) {
		if (toTime && toTime !== fromTime) {
			result += ` ${fromTime} — ${toTime}`;
		} else {
			result += ` ${fromTime}`;
		}
	}

	// Handle end date if it exists
	if (dateStructure.has_end_date && dateStructure.end_date) {
		const endDate = formatReadableDate(dateStructure.end_date);
		result += ` to ${endDate}`;

		// Add end time range if available
		const endFromTime = formatTime12Hour(dateStructure.end_from_time || '');
		const endToTime = formatTime12Hour(dateStructure.end_to_time || '');

		if (endFromTime) {
			if (endToTime && endToTime !== endFromTime) {
				result += ` ${endFromTime} — ${endToTime}`;
			} else {
				result += ` ${endFromTime}`;
			}
		}
	}

	return result;
}
