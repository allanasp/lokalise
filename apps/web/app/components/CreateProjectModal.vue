<script setup lang="ts">
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: []; created: [project: any] }>();

const api = useApi();

const name = ref("");
const slug = ref("");
const sourceLocale = ref("en");
const loading = ref(false);
const error = ref("");

// Auto-generate slug from name
watch(name, (val) => {
	slug.value = val
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
});

async function handleSubmit() {
	error.value = "";
	loading.value = true;
	try {
		const { project } = await api.createProject({
			name: name.value,
			slug: slug.value,
			sourceLocale: sourceLocale.value,
		});
		emit("created", project);
		name.value = "";
		slug.value = "";
	} catch (e: any) {
		error.value = e.message || "Failed to create project";
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<UModal :open="open" @close="emit('close')">
		<template #header>
			<h3 class="text-lg font-semibold">Create Project</h3>
		</template>

		<form @submit.prevent="handleSubmit" class="p-4 space-y-4">
			<UAlert v-if="error" color="error" :title="error" />

			<UFormField label="Project Name">
				<UInput v-model="name" placeholder="My App" required autofocus />
			</UFormField>

			<UFormField label="Slug">
				<UInput v-model="slug" placeholder="my-app" required pattern="[a-z0-9-]+" />
			</UFormField>

			<UFormField label="Source Language">
				<UInput v-model="sourceLocale" placeholder="en" required />
			</UFormField>

			<div class="flex justify-end gap-2">
				<UButton variant="ghost" @click="emit('close')">Cancel</UButton>
				<UButton type="submit" :loading="loading">Create</UButton>
			</div>
		</form>
	</UModal>
</template>
