<script setup lang="ts">
const props = defineProps<{ open: boolean; projectId: string }>();
const emit = defineEmits<{ close: []; imported: [] }>();

const api = useApi();
const locale = ref("en");
const namespace = ref("default");
const overwrite = ref(false);
const jsonContent = ref("");
const loading = ref(false);
const error = ref("");
const result = ref<{ created: number; updated: number; total: number } | null>(null);

async function handleImport() {
	error.value = "";
	result.value = null;
	loading.value = true;

	try {
		const parsed = JSON.parse(jsonContent.value);
		const res = await api.importTranslations(props.projectId, {
			locale: locale.value,
			namespace: namespace.value,
			translations: parsed,
			overwrite: overwrite.value,
		});
		result.value = res;
		emit("imported");
	} catch (e: any) {
		error.value = e.message || "Import failed";
	} finally {
		loading.value = false;
	}
}

function handleFile(event: Event) {
	const file = (event.target as HTMLInputElement).files?.[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = (e) => {
		jsonContent.value = e.target?.result as string;
	};
	reader.readAsText(file);
}
</script>

<template>
	<UModal :open="open" @close="emit('close')">
		<template #header>
			<h3 class="text-lg font-semibold">Import Translations</h3>
		</template>

		<form @submit.prevent="handleImport" class="p-4 space-y-4">
			<UAlert v-if="error" color="error" :title="error" />
			<UAlert v-if="result" color="success" :title="`Imported: ${result.created} created, ${result.updated} updated (${result.total} total)`" />

			<div class="grid grid-cols-2 gap-4">
				<UFormField label="Locale">
					<UInput v-model="locale" placeholder="en" required />
				</UFormField>
				<UFormField label="Namespace">
					<UInput v-model="namespace" placeholder="default" />
				</UFormField>
			</div>

			<UFormField label="JSON File">
				<input type="file" accept=".json" @change="handleFile" class="text-sm" />
			</UFormField>

			<UFormField label="Or paste JSON">
				<UTextarea v-model="jsonContent" :rows="8" placeholder='{"key": "value"}' />
			</UFormField>

			<div class="flex items-center gap-2">
				<UCheckbox v-model="overwrite" label="Overwrite existing translations" />
			</div>

			<div class="flex justify-end gap-2">
				<UButton variant="ghost" @click="emit('close')">Cancel</UButton>
				<UButton type="submit" :loading="loading" :disabled="!jsonContent">Import</UButton>
			</div>
		</form>
	</UModal>
</template>
