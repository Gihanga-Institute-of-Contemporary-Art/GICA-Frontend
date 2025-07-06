/**
 * Enhanced Error Handling for API Operations
 * Provides structured error types, logging, and recovery mechanisms
 */

export enum ApiErrorType {
	NETWORK_ERROR = 'NETWORK_ERROR',
	TIMEOUT_ERROR = 'TIMEOUT_ERROR',
	AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
	AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
	NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
	VALIDATION_ERROR = 'VALIDATION_ERROR',
	SERVER_ERROR = 'SERVER_ERROR',
	RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
	UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ApiErrorContext {
	endpoint?: string;
	method?: string;
	requestId?: string;
	timestamp?: number;
	retryAttempt?: number;
	additionalInfo?: Record<string, unknown>;
}

export class ApiError extends Error {
	public readonly type: ApiErrorType;
	public readonly status?: number;
	public readonly context: ApiErrorContext;
	public readonly originalError?: Error;
	public readonly isRetryable: boolean;

	constructor(
		message: string,
		type: ApiErrorType = ApiErrorType.UNKNOWN_ERROR,
		status?: number,
		context: ApiErrorContext = {},
		originalError?: Error
	) {
		super(message);
		this.name = 'ApiError';
		this.type = type;
		this.status = status;
		this.context = {
			timestamp: Date.now(),
			...context
		};
		this.originalError = originalError;
		this.isRetryable = this.determineRetryability();

		// Maintain proper stack trace
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ApiError);
		}
	}

	private determineRetryability(): boolean {
		// Network errors and timeouts are generally retryable
		if (this.type === ApiErrorType.NETWORK_ERROR || this.type === ApiErrorType.TIMEOUT_ERROR) {
			return true;
		}

		// Server errors (5xx) are often retryable
		if (this.status && this.status >= 500 && this.status < 600) {
			return true;
		}

		// Rate limiting might be retryable with proper delay
		if (this.type === ApiErrorType.RATE_LIMIT_ERROR) {
			return true;
		}

		// Client errors (4xx) are generally not retryable
		return false;
	}

	/**
	 * Convert to a plain object for logging or serialization
	 */
	toJSON(): Record<string, unknown> {
		return {
			name: this.name,
			message: this.message,
			type: this.type,
			status: this.status,
			context: this.context,
			isRetryable: this.isRetryable,
			stack: this.stack
		};
	}

	/**
	 * Create a user-friendly error message
	 */
	toUserMessage(): string {
		switch (this.type) {
			case ApiErrorType.NETWORK_ERROR:
				return 'Network connection failed. Please check your internet connection and try again.';
			case ApiErrorType.TIMEOUT_ERROR:
				return 'Request timed out. Please try again.';
			case ApiErrorType.AUTHENTICATION_ERROR:
				return 'Authentication failed. Please check your credentials.';
			case ApiErrorType.AUTHORIZATION_ERROR:
				return 'You do not have permission to access this resource.';
			case ApiErrorType.NOT_FOUND_ERROR:
				return 'The requested resource was not found.';
			case ApiErrorType.RATE_LIMIT_ERROR:
				return 'Too many requests. Please wait a moment and try again.';
			case ApiErrorType.SERVER_ERROR:
				return 'Server error occurred. Please try again later.';
			default:
				return 'An unexpected error occurred. Please try again.';
		}
	}
}

/**
 * Error factory functions for common scenarios
 */
export class ApiErrorFactory {
	static fromResponse(response: Response, context: ApiErrorContext = {}): ApiError {
		const { status, statusText } = response;
		let type: ApiErrorType;
		let message: string;

		switch (status) {
			case 401:
				type = ApiErrorType.AUTHENTICATION_ERROR;
				message = 'Authentication failed';
				break;
			case 403:
				type = ApiErrorType.AUTHORIZATION_ERROR;
				message = 'Insufficient permissions';
				break;
			case 404:
				type = ApiErrorType.NOT_FOUND_ERROR;
				message = 'Resource not found';
				break;
			case 429:
				type = ApiErrorType.RATE_LIMIT_ERROR;
				message = 'Rate limit exceeded';
				break;
			case 408:
				type = ApiErrorType.TIMEOUT_ERROR;
				message = 'Request timeout';
				break;
			default:
				if (status >= 500) {
					type = ApiErrorType.SERVER_ERROR;
					message = `Server error: ${statusText}`;
				} else {
					type = ApiErrorType.VALIDATION_ERROR;
					message = `Client error: ${statusText}`;
				}
		}

		return new ApiError(message, type, status, context);
	}

	static fromNetworkError(error: Error, context: ApiErrorContext = {}): ApiError {
		if (error.name === 'AbortError' || error.message.includes('timeout')) {
			return new ApiError(
				'Request timed out',
				ApiErrorType.TIMEOUT_ERROR,
				undefined,
				context,
				error
			);
		}

		return new ApiError(
			`Network error: ${error.message}`,
			ApiErrorType.NETWORK_ERROR,
			undefined,
			context,
			error
		);
	}

	static fromUnknownError(error: unknown, context: ApiErrorContext = {}): ApiError {
		if (error instanceof ApiError) {
			return error;
		}

		if (error instanceof Error) {
			return new ApiError(error.message, ApiErrorType.UNKNOWN_ERROR, undefined, context, error);
		}

		return new ApiError(
			`Unknown error: ${String(error)}`,
			ApiErrorType.UNKNOWN_ERROR,
			undefined,
			context
		);
	}
}

/**
 * Error Logger with different levels and output methods
 */
export interface ErrorLogEntry {
	timestamp: number;
	level: 'error' | 'warn' | 'info';
	error: ApiError;
	context?: Record<string, unknown>;
}

export class ErrorLogger {
	private logs: ErrorLogEntry[] = [];
	private maxLogs = 100;

	/**
	 * Log an error with context
	 */
	logError(
		error: ApiError,
		level: 'error' | 'warn' | 'info' = 'error',
		context?: Record<string, unknown>
	): void {
		const entry: ErrorLogEntry = {
			timestamp: Date.now(),
			level,
			error,
			context
		};

		this.logs.push(entry);

		// Keep only the most recent logs
		if (this.logs.length > this.maxLogs) {
			this.logs = this.logs.slice(-this.maxLogs);
		}

		// Output to console in development
		if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
			console.group(`API ${level.toUpperCase()}: ${error.message}`);
			console.error('Error:', error);
			if (context) console.log('Context:', context);
			if (error.originalError) console.error('Original Error:', error.originalError);
			console.groupEnd();
		}
	}

	/**
	 * Get recent error logs
	 */
	getRecentLogs(count = 10): ErrorLogEntry[] {
		return this.logs.slice(-count);
	}

	/**
	 * Get error statistics
	 */
	getErrorStats(): Record<ApiErrorType, number> {
		const stats: Record<ApiErrorType, number> = {} as Record<ApiErrorType, number>;

		// Initialize all error types with 0
		Object.values(ApiErrorType).forEach((type) => {
			stats[type] = 0;
		});

		// Count occurrences
		this.logs.forEach((log) => {
			stats[log.error.type]++;
		});

		return stats;
	}

	/**
	 * Clear all logs
	 */
	clearLogs(): void {
		this.logs = [];
	}
}

// Export singleton logger instance
export const errorLogger = new ErrorLogger();
