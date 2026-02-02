import type { CachedData, StorageAdapter } from "./types";

const STORAGE_KEY_PREFIX = "@lokalise/";

/** In-memory fallback storage for environments without AsyncStorage */
class MemoryStorage implements StorageAdapter {
	private store = new Map<string, string>();

	async getItem(key: string): Promise<string | null> {
		return this.store.get(key) ?? null;
	}

	async setItem(key: string, value: string): Promise<void> {
		this.store.set(key, value);
	}

	async removeItem(key: string): Promise<void> {
		this.store.delete(key);
	}
}

/** Try to use AsyncStorage if available, fallback to in-memory */
function createDefaultStorage(): StorageAdapter {
	try {
		// Dynamic import to avoid hard dependency
		// biome-ignore lint/suspicious/noExplicitAny: dynamic require
		const AsyncStorage = require("@react-native-async-storage/async-storage").default;
		if (AsyncStorage?.getItem) {
			return AsyncStorage;
		}
	} catch {
		// AsyncStorage not available
	}
	return new MemoryStorage();
}

export class CacheManager {
	private storage: StorageAdapter;
	private cacheKey: string;
	private data: CachedData;

	constructor(apiKey: string, storage?: StorageAdapter) {
		this.storage = storage ?? createDefaultStorage();
		this.cacheKey = `${STORAGE_KEY_PREFIX}${apiKey}`;
		this.data = {
			translations: {},
			etags: {},
			version: null,
			updatedAt: 0,
		};
	}

	async load(): Promise<CachedData> {
		try {
			const raw = await this.storage.getItem(this.cacheKey);
			if (raw) {
				this.data = JSON.parse(raw);
			}
		} catch {
			// Corrupted cache, start fresh
		}
		return this.data;
	}

	async save(): Promise<void> {
		this.data.updatedAt = Date.now();
		await this.storage.setItem(this.cacheKey, JSON.stringify(this.data));
	}

	getData(): CachedData {
		return this.data;
	}

	getTranslations(locale: string, namespace: string): TranslationMap {
		return this.data.translations[locale]?.[namespace] ?? {};
	}

	setTranslations(locale: string, namespace: string, translations: TranslationMap): void {
		if (!this.data.translations[locale]) {
			this.data.translations[locale] = {};
		}
		this.data.translations[locale][namespace] = translations;
	}

	getEtag(locale: string, namespace: string): string | null {
		return this.data.etags[`${locale}:${namespace}`] ?? null;
	}

	setEtag(locale: string, namespace: string, etag: string): void {
		this.data.etags[`${locale}:${namespace}`] = etag;
	}

	getVersion(): string | null {
		return this.data.version;
	}

	setVersion(version: string): void {
		this.data.version = version;
	}
}

type TranslationMap = Record<string, string>;
