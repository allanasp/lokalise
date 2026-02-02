import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { LokaliseClient } from "./client";
import { interpolate } from "./interpolation";
import type { InterpolationOptions, LokaliseConfig, TranslationMap } from "./types";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface LokaliseContextValue {
	client: LokaliseClient;
	locale: string;
	setLocale: (locale: string) => void;
	isReady: boolean;
}

const LokaliseContext = createContext<LokaliseContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface LokaliseProviderProps extends LokaliseConfig {
	children: ReactNode;
}

export function LokaliseProvider({ children, ...config }: LokaliseProviderProps) {
	const [locale, setLocale] = useState(config.defaultLocale);
	const [isReady, setIsReady] = useState(false);
	const clientRef = useRef<LokaliseClient | null>(null);

	// Stable client instance
	if (!clientRef.current) {
		clientRef.current = new LokaliseClient(config);
	}
	const client = clientRef.current;

	useEffect(() => {
		client.init().then(() => setIsReady(true));
		return () => client.destroy();
	}, [client]);

	const value = useMemo<LokaliseContextValue>(
		() => ({ client, locale, setLocale, isReady }),
		[client, locale, isReady],
	);

	return <LokaliseContext.Provider value={value}>{children}</LokaliseContext.Provider>;
}

// ---------------------------------------------------------------------------
// useTranslation hook
// ---------------------------------------------------------------------------

interface UseTranslationReturn {
	/** Translate a key with optional interpolation */
	t: (key: string, options?: InterpolationOptions) => string;
	/** Current locale */
	locale: string;
	/** Change locale (triggers re-fetch if needed) */
	setLocale: (locale: string) => void;
	/** Whether translations have been loaded */
	isReady: boolean;
	/** Whether a locale change is currently loading */
	isLoading: boolean;
}

export function useTranslation(namespace = "default"): UseTranslationReturn {
	const ctx = useContext(LokaliseContext);
	if (!ctx) {
		throw new Error("useTranslation must be used within a <LokaliseProvider>");
	}

	const { client, locale, setLocale: setContextLocale, isReady } = ctx;
	const [translations, setTranslations] = useState<TranslationMap>(() =>
		client.getTranslations(locale, namespace),
	);
	const [isLoading, setIsLoading] = useState(false);

	// Subscribe to updates from polling
	useEffect(() => {
		const update = () => {
			setTranslations(client.getTranslations(locale, namespace));
		};
		return client.subscribe(update);
	}, [client, locale, namespace]);

	// When locale changes, fetch translations
	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);

		client
			.fetchTranslations(locale, namespace)
			.then((data) => {
				if (!cancelled) {
					setTranslations(data);
					setIsLoading(false);
				}
			})
			.catch(() => {
				if (!cancelled) {
					// Fall back to cached
					setTranslations(client.getTranslations(locale, namespace));
					setIsLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [client, locale, namespace]);

	const t = useCallback(
		(key: string, options?: InterpolationOptions): string => {
			const value = translations[key];
			if (value === undefined) return key; // Fallback to key
			return interpolate(value, options);
		},
		[translations],
	);

	const setLocale = useCallback(
		(newLocale: string) => {
			setContextLocale(newLocale);
		},
		[setContextLocale],
	);

	return { t, locale, setLocale, isReady, isLoading };
}
