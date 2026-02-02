export interface LokaliseConfig {
	/** Project API key (lok_xxx) */
	apiKey: string;
	/** Base URL of the Lokalise API */
	baseUrl: string;
	/** Default locale to use */
	defaultLocale: string;
	/** Namespaces to preload */
	namespaces?: string[];
	/** Poll interval in ms for checking updates (0 = disabled). Default: 30000 */
	pollInterval?: number;
	/** Custom storage adapter (defaults to AsyncStorage if available, falls back to in-memory) */
	storage?: StorageAdapter;
}

export interface StorageAdapter {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): Promise<void>;
	removeItem(key: string): Promise<void>;
}

export interface Manifest {
	locales: string[];
	namespaces: string[];
	version: string;
}

export type TranslationMap = Record<string, string>;

export interface CachedData {
	translations: Record<string, Record<string, TranslationMap>>;
	etags: Record<string, string>;
	version: string | null;
	updatedAt: number;
}

export interface InterpolationOptions {
	[key: string]: string | number | boolean;
}
