/**
 * @grim/translator - AI-powered translation engine for localization files
 *
 * This package provides utilities for translating localization files using AI.
 * It supports batch processing with automatic retry logic for rate limiting.
 *
 * @packageDocumentation
 */

export {
	translateMessages,
	verifyApiKey,
	getAvailableModels,
	RateLimitError,
	type TranslateOptions,
	type Model,
} from './translator.js';
