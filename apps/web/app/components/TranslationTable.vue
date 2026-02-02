<script setup lang="ts">
const props = defineProps<{
	projectId: string;
}>();

const api = useApi();
const search = ref("");
const namespace = ref("");

// Fetch locales
const { data: localesData } = await useAsyncData(`locales-${props.projectId}`, () =>
	api.getLocales(props.projectId),
);
const locales = computed(() => localesData.value?.locales || []);

// Fetch translations
const { data: translationsData, refresh } = await useAsyncData(
	`translations-${props.projectId}`,
	() => api.getTranslations(props.projectId, { namespace: namespace.value || undefined }),
	{ watch: [namespace] },
);

// Group translations by key
const keyMap = computed(() => {
	const rows = translationsData.value?.translations || [];
	const map = new Map<string, { keyId: string; key: string; namespace: string; translations: Map<string, { translationId: string; value: string; status: string; localeId: string }> }>();

	for (const row of rows) {
		if (!map.has(row.keyId)) {
			map.set(row.keyId, {
				keyId: row.keyId,
				key: row.key,
				namespace: row.namespace,
				translations: new Map(),
			});
		}
		if (row.localeCode && row.translationId) {
			map.get(row.keyId)!.translations.set(row.localeCode, {
				translationId: row.translationId,
				value: row.value || "",
				status: row.status || "draft",
				localeId: "",
			});
		}
	}
	return map;
});

const filteredKeys = computed(() => {
	const keys = Array.from(keyMap.value.values());
	if (!search.value) return keys;
	const q = search.value.toLowerCase();
	return keys.filter((k) => k.key.toLowerCase().includes(q));
});

// Save translation
async function saveTranslation(keyId: string, localeCode: string, value: string) {
	const locale = locales.value.find((l: any) => l.code === localeCode);
	if (!locale) return;

	try {
		await api.updateTranslation(props.projectId, keyId, locale.id, { value });
		await refresh();
	} catch (e) {
		console.error("Failed to save translation", e);
	}
}

// Add key
const showAddKey = ref(false);
const newKeyName = ref("");
const newKeyNamespace = ref("default");

async function addKey() {
	if (!newKeyName.value) return;
	try {
		await api.createKey(props.projectId, {
			key: newKeyName.value,
			namespace: newKeyNamespace.value,
		});
		newKeyName.value = "";
		showAddKey.value = false;
		await refresh();
	} catch (e) {
		console.error("Failed to add key", e);
	}
}

// Add locale
const showAddLocale = ref(false);
const newLocaleCode = ref("");
const newLocaleName = ref("");

async function addLocale() {
	if (!newLocaleCode.value || !newLocaleName.value) return;
	try {
		await api.createLocale(props.projectId, {
			code: newLocaleCode.value,
			name: newLocaleName.value,
		});
		newLocaleCode.value = "";
		newLocaleName.value = "";
		showAddLocale.value = false;
		// Refresh everything
		window.location.reload();
	} catch (e) {
		console.error("Failed to add locale", e);
	}
}

// Delete key
async function deleteKey(keyId: string) {
	if (!confirm("Delete this key and all its translations?")) return;
	await api.deleteKey(props.projectId, keyId);
	await refresh();
}
</script>

<template>
	<div>
		<!-- Toolbar -->
		<div class="flex items-center gap-3 mb-4">
			<UInput
				v-model="search"
				placeholder="Search keys..."
				icon="i-lucide-search"
				class="w-64"
			/>

			<UInput
				v-model="namespace"
				placeholder="Namespace filter..."
				class="w-48"
			/>

			<div class="flex-1" />

			<UButton variant="outline" icon="i-lucide-globe" @click="showAddLocale = true">
				Add Language
			</UButton>
			<UButton icon="i-lucide-plus" @click="showAddKey = true">
				Add Key
			</UButton>
		</div>

		<!-- Table -->
		<div class="border rounded-lg overflow-auto">
			<table class="w-full">
				<thead>
					<tr class="bg-gray-100 dark:bg-gray-800">
						<th class="text-left px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 w-64 sticky left-0 bg-gray-100 dark:bg-gray-800 z-10">
							Key
						</th>
						<th
							v-for="locale in locales"
							:key="locale.id"
							class="text-left px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 min-w-[250px]"
						>
							{{ locale.name }} ({{ locale.code }})
						</th>
						<th class="w-10" />
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="row in filteredKeys"
						:key="row.keyId"
						class="border-t hover:bg-gray-50 dark:hover:bg-gray-900"
					>
						<td class="px-3 py-2 text-sm font-mono text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-gray-950 z-10">
							<div class="flex items-center gap-1">
								<span>{{ row.key }}</span>
								<UBadge v-if="row.namespace !== 'default'" variant="subtle" size="xs">
									{{ row.namespace }}
								</UBadge>
							</div>
						</td>
						<td v-for="locale in locales" :key="locale.id" class="border-l">
							<TranslationCell
								:value="row.translations.get(locale.code)?.value || ''"
								:status="row.translations.get(locale.code)?.status"
								@save="(val) => saveTranslation(row.keyId, locale.code, val)"
							/>
						</td>
						<td class="px-2">
							<UButton
								icon="i-lucide-trash-2"
								variant="ghost"
								color="error"
								size="xs"
								@click="deleteKey(row.keyId)"
							/>
						</td>
					</tr>

					<tr v-if="filteredKeys.length === 0">
						<td :colspan="locales.length + 2" class="text-center py-8 text-gray-400">
							No translation keys yet. Click "Add Key" to get started.
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Add Key Modal -->
		<UModal :open="showAddKey" @close="showAddKey = false">
			<template #header>
				<h3 class="text-lg font-semibold">Add Translation Key</h3>
			</template>
			<form @submit.prevent="addKey" class="p-4 space-y-4">
				<UFormField label="Key">
					<UInput v-model="newKeyName" placeholder="common.buttons.save" required autofocus />
				</UFormField>
				<UFormField label="Namespace">
					<UInput v-model="newKeyNamespace" placeholder="default" />
				</UFormField>
				<div class="flex justify-end gap-2">
					<UButton variant="ghost" @click="showAddKey = false">Cancel</UButton>
					<UButton type="submit">Add Key</UButton>
				</div>
			</form>
		</UModal>

		<!-- Add Locale Modal -->
		<UModal :open="showAddLocale" @close="showAddLocale = false">
			<template #header>
				<h3 class="text-lg font-semibold">Add Language</h3>
			</template>
			<form @submit.prevent="addLocale" class="p-4 space-y-4">
				<UFormField label="Language Code">
					<UInput v-model="newLocaleCode" placeholder="da" required autofocus />
				</UFormField>
				<UFormField label="Language Name">
					<UInput v-model="newLocaleName" placeholder="Danish" required />
				</UFormField>
				<div class="flex justify-end gap-2">
					<UButton variant="ghost" @click="showAddLocale = false">Cancel</UButton>
					<UButton type="submit">Add Language</UButton>
				</div>
			</form>
		</UModal>
	</div>
</template>
