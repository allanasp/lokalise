<script setup lang="ts">
const route = useRoute();
const api = useApi();
const projectId = route.params.projectId as string;

const { data: projectData, refresh } = await useAsyncData(`project-settings-${projectId}`, () =>
	api.getProject(projectId),
);

const project = computed(() => projectData.value?.project);
const copied = ref(false);

function copyApiKey() {
	if (!project.value?.apiKey) return;
	navigator.clipboard.writeText(project.value.apiKey);
	copied.value = true;
	setTimeout(() => (copied.value = false), 2000);
}

async function rotateKey() {
	if (!confirm("Rotate API key? This will invalidate the current key.")) return;
	await api.rotateApiKey(projectId);
	await refresh();
}

async function deleteProject() {
	if (!confirm(`Delete "${project.value?.name}"? This cannot be undone.`)) return;
	await api.deleteProject(projectId);
	navigateTo("/projects");
}
</script>

<template>
	<div class="p-8 max-w-2xl" v-if="project">
		<div class="flex items-center gap-3 mb-8">
			<NuxtLink :to="`/projects/${projectId}`" class="text-gray-400 hover:text-gray-600">
				<UIcon name="i-lucide-arrow-left" />
			</NuxtLink>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
		</div>

		<div class="space-y-8">
			<!-- Project info -->
			<UCard>
				<template #header>
					<h2 class="font-semibold">Project Details</h2>
				</template>
				<div class="space-y-3">
					<div>
						<span class="text-sm text-gray-500">Name</span>
						<p class="font-medium">{{ project.name }}</p>
					</div>
					<div>
						<span class="text-sm text-gray-500">Slug</span>
						<p class="font-mono text-sm">{{ project.slug }}</p>
					</div>
					<div>
						<span class="text-sm text-gray-500">Source Language</span>
						<p>{{ project.sourceLocale }}</p>
					</div>
				</div>
			</UCard>

			<!-- API Key -->
			<UCard>
				<template #header>
					<h2 class="font-semibold">API Key</h2>
					<p class="text-sm text-gray-500">Use this key in your app's SDK to fetch translations.</p>
				</template>

				<div class="flex items-center gap-3">
					<code class="flex-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm font-mono">
						{{ project.apiKey }}
					</code>
					<UButton
						:icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
						variant="outline"
						@click="copyApiKey"
					/>
					<UButton
						icon="i-lucide-refresh-cw"
						variant="outline"
						color="warning"
						@click="rotateKey"
					/>
				</div>

				<div class="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm">
					<p class="text-gray-500 mb-2">Usage example:</p>
					<pre class="font-mono text-xs">curl -H "x-api-key: {{ project.apiKey }}" \
  "{{ useRuntimeConfig().public.apiUrl }}/api/public/v1/translations?locale=en"</pre>
				</div>
			</UCard>

			<!-- Danger zone -->
			<UCard>
				<template #header>
					<h2 class="font-semibold text-red-600">Danger Zone</h2>
				</template>
				<div class="flex items-center justify-between">
					<div>
						<p class="font-medium">Delete Project</p>
						<p class="text-sm text-gray-500">Permanently delete this project and all its data.</p>
					</div>
					<UButton color="error" variant="outline" @click="deleteProject">
						Delete Project
					</UButton>
				</div>
			</UCard>
		</div>
	</div>
</template>
