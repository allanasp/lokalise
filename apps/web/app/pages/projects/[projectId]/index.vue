<script setup lang="ts">
const route = useRoute();
const api = useApi();
const projectId = route.params.projectId as string;

const { data: projectData } = await useAsyncData(`project-${projectId}`, () =>
	api.getProject(projectId),
);

const project = computed(() => projectData.value?.project);

const showImport = ref(false);

function onImported() {
	showImport.value = false;
	// Force refresh of translation table
	window.location.reload();
}

// Export
const exportLocale = ref("en");
const showExport = ref(false);

async function handleExport() {
	try {
		const data = await api.exportTranslations(projectId, exportLocale.value);
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${project.value?.slug || "translations"}-${exportLocale.value}.json`;
		a.click();
		URL.revokeObjectURL(url);
		showExport.value = false;
	} catch (e) {
		console.error("Export failed", e);
	}
}
</script>

<template>
	<div class="p-8" v-if="project">
		<div class="flex items-center justify-between mb-6">
			<div>
				<div class="flex items-center gap-3">
					<NuxtLink to="/projects" class="text-gray-400 hover:text-gray-600">
						<UIcon name="i-lucide-arrow-left" />
					</NuxtLink>
					<h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ project.name }}</h1>
				</div>
				<p class="text-sm text-gray-500 mt-1 ml-9">{{ project.slug }}</p>
			</div>

			<div class="flex items-center gap-2">
				<UButton variant="outline" icon="i-lucide-upload" @click="showImport = true">
					Import
				</UButton>
				<UButton variant="outline" icon="i-lucide-download" @click="showExport = true">
					Export
				</UButton>
				<NuxtLink :to="`/projects/${projectId}/settings`">
					<UButton variant="ghost" icon="i-lucide-settings" />
				</NuxtLink>
			</div>
		</div>

		<TranslationTable :project-id="projectId" />

		<ImportModal
			:open="showImport"
			:project-id="projectId"
			@close="showImport = false"
			@imported="onImported"
		/>

		<!-- Export Modal -->
		<UModal :open="showExport" @close="showExport = false">
			<template #header>
				<h3 class="text-lg font-semibold">Export Translations</h3>
			</template>
			<form @submit.prevent="handleExport" class="p-4 space-y-4">
				<UFormField label="Locale">
					<UInput v-model="exportLocale" placeholder="en" required />
				</UFormField>
				<div class="flex justify-end gap-2">
					<UButton variant="ghost" @click="showExport = false">Cancel</UButton>
					<UButton type="submit">Download JSON</UButton>
				</div>
			</form>
		</UModal>
	</div>
</template>
