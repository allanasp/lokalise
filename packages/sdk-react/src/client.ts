import { CacheManager } from "./storage";
import type { LokaliseConfig, Manifest, TranslationMap } from "./types";

export class LokaliseClient {
	private config: LokaliseConfig;
	private cache: CacheManager;
	private pollTimer: ReturnType<typeof setInterval> | null = null;
	private listeners = new Set<() => void>();

	constructor(config: LokaliseConfig) {
		this.config = config;
		this.cache = new CacheManager(config.apiKey, config.storage);
	}

	/** Initialize: load cache from storage, then fetch updates in background */
	async init(): Promise<void> {
		await this.cache.load();
		// Fetch in background - don't block initial render
		this.refresh().catch(() => {});
		this.startPolling();
	}

	/** Fetch manifest and update translations if version changed */
	async refresh(): Promise<void> {
		try {
			const manifest = await this.fetchManifest();
			const cachedVersion = this.cache.getVersion();

			if (manifest.version === cachedVersion) {
				return; // No changes
			}

			// Fetch translations for configured locales/namespaces
			const namespaces = this.config.namespaces ?? ["default"];
			const promises: Promise<TranslationMap>[] = [];

			for (const ns of namespaces) {
				promises.push(this.fetchTranslations(this.config.defaultLocale, ns));
			}

			await Promise.all(promises);
			this.cache.setVersion(manifest.version);
			await this.cache.save();
			this.notifyListeners();
		} catch (error) {
			// Silently fail - we still have cached data
			console.warn("[lokalise] Failed to refresh translations:", error);
		}
	}

	/** Fetch translations for a specific locale + namespace */
	async fetchTranslations(locale: string, namespace: string): Promise<TranslationMap> {
		const url = new URL(`${this.config.baseUrl}/api/public/v1/translations`);
		url.searchParams.set("locale", locale);
		url.searchParams.set("namespace", namespace);

		const headers: Record<string, string> = {
			"x-api-key": this.config.apiKey,
		};

		const etag = this.cache.getEtag(locale, namespace);
		if (etag) {
			headers["If-None-Match"] = etag;
		}

		const response = await fetch(url.toString(), { headers });

		if (response.status === 304) {
			// Not modified - cache is still valid
			return this.cache.getTranslations(locale, namespace);
		}

		if (!response.ok) {
			throw new Error(`Failed to fetch translations: ${response.status}`);
		}

		const data = (await response.json()) as TranslationMap;
		const newEtag = response.headers.get("ETag");

		this.cache.setTranslations(locale, namespace, data);
		if (newEtag) {
			this.cache.setEtag(locale, namespace, newEtag);
		}
		await this.cache.save();

		return data;
	}

	/** Fetch the manifest to check for version changes */
	private async fetchManifest(): Promise<Manifest> {
		const response = await fetch(`${this.config.baseUrl}/api/public/v1/manifest`, {
			headers: { "x-api-key": this.config.apiKey },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch manifest: ${response.status}`);
		}

		return (await response.json()) as Manifest;
	}

	/** Get translations for a locale + namespace from cache */
	getTranslations(locale: string, namespace: string): TranslationMap {
		return this.cache.getTranslations(locale, namespace);
	}

	/** Subscribe to translation updates */
	subscribe(listener: () => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	private notifyListeners(): void {
		for (const listener of this.listeners) {
			listener();
		}
	}

	private startPolling(): void {
		const interval = this.config.pollInterval ?? 30_000;
		if (interval <= 0) return;

		this.pollTimer = setInterval(() => {
			this.refresh().catch(() => {});
		}, interval);
	}

	/** Stop polling and cleanup */
	destroy(): void {
		if (this.pollTimer) {
			clearInterval(this.pollTimer);
			this.pollTimer = null;
		}
		this.listeners.clear();
	}
}
