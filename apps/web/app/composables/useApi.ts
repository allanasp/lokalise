export function useApi() {
	const organizationId = useCookie("lokalise-org-id");

	async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
		const headers = new Headers(options.headers);
		headers.set("Content-Type", "application/json");

		if (organizationId.value) {
			headers.set("x-organization-id", organizationId.value);
		}

		const res = await $fetch<T>(path, {
			...options,
			headers: Object.fromEntries(headers.entries()),
		});

		return res;
	}

	return {
		organizationId,

		// Projects
		getProjects: () => apiFetch<{ projects: any[] }>("/api/v1/projects"),

		createProject: (data: { name: string; slug: string; sourceLocale?: string }) =>
			apiFetch<{ project: any }>("/api/v1/projects", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		getProject: (id: string) => apiFetch<{ project: any }>(`/api/v1/projects/${id}`),

		deleteProject: (id: string) =>
			apiFetch(`/api/v1/projects/${id}`, { method: "DELETE" }),

		rotateApiKey: (id: string) =>
			apiFetch<{ project: any }>(`/api/v1/projects/${id}/rotate-key`, { method: "POST" }),

		// Locales
		getLocales: (projectId: string) =>
			apiFetch<{ locales: any[] }>(`/api/v1/projects/${projectId}/locales`),

		createLocale: (projectId: string, data: { code: string; name: string; isSource?: boolean }) =>
			apiFetch<{ locale: any }>(`/api/v1/projects/${projectId}/locales`, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		deleteLocale: (projectId: string, localeId: string) =>
			apiFetch(`/api/v1/projects/${projectId}/locales/${localeId}`, { method: "DELETE" }),

		// Keys
		getKeys: (projectId: string, params?: { namespace?: string; search?: string }) => {
			const query = new URLSearchParams();
			if (params?.namespace) query.set("namespace", params.namespace);
			if (params?.search) query.set("search", params.search);
			const qs = query.toString();
			return apiFetch<{ keys: any[] }>(`/api/v1/projects/${projectId}/keys${qs ? `?${qs}` : ""}`);
		},

		createKey: (projectId: string, data: { key: string; namespace?: string; description?: string }) =>
			apiFetch<{ key: any }>(`/api/v1/projects/${projectId}/keys`, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		deleteKey: (projectId: string, keyId: string) =>
			apiFetch(`/api/v1/projects/${projectId}/keys/${keyId}`, { method: "DELETE" }),

		// Translations
		getTranslations: (projectId: string, params?: { namespace?: string }) => {
			const query = new URLSearchParams();
			if (params?.namespace) query.set("namespace", params.namespace);
			const qs = query.toString();
			return apiFetch<{ translations: any[] }>(
				`/api/v1/projects/${projectId}/translations${qs ? `?${qs}` : ""}`,
			);
		},

		updateTranslation: (projectId: string, keyId: string, localeId: string, data: { value: string; status?: string }) =>
			apiFetch<{ translation: any }>(`/api/v1/projects/${projectId}/translations/${keyId}/${localeId}`, {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		// Import/Export
		importTranslations: (projectId: string, data: { locale: string; namespace?: string; translations: Record<string, unknown>; overwrite?: boolean }) =>
			apiFetch<{ created: number; updated: number; total: number }>(`/api/v1/projects/${projectId}/import`, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		exportTranslations: (projectId: string, locale: string, namespace = "default", format = "nested") =>
			apiFetch<Record<string, unknown>>(
				`/api/v1/projects/${projectId}/export?locale=${locale}&namespace=${namespace}&format=${format}`,
			),
	};
}
