import type { InterpolationOptions } from "./types";

/**
 * Interpolate variables in a translation string.
 * Supports {{variable}} syntax.
 *
 * @example
 * interpolate("Hello {{name}}, you have {{count}} items", { name: "Allan", count: 5 })
 * // => "Hello Allan, you have 5 items"
 */
export function interpolate(text: string, options?: InterpolationOptions): string {
	if (!options) return text;

	return text.replace(/\{\{(\s*\w+\s*)\}\}/g, (match, key) => {
		const trimmed = key.trim();
		if (trimmed in options) {
			return String(options[trimmed]);
		}
		return match;
	});
}
