<script setup lang="ts">
import { authClient } from "~/lib/auth-client";

const api = useApi();
const showCreateModal = ref(false);
const showOrgModal = ref(false);
const orgName = ref("");
const orgSlug = ref("");
const orgLoading = ref(false);

// Check if user has an organization
const { data: orgs, refresh: refreshOrgs } = await useAsyncData("orgs", () =>
	authClient.organization.list().then((r) => r.data),
);

// Set active organization
watch(
	orgs,
	(val) => {
		if (val && val.length > 0 && !api.organizationId.value) {
			api.organizationId.value = val[0].id;
		}
	},
	{ immediate: true },
);

const needsOrg = computed(() => !orgs.value || orgs.value.length === 0);

// Projects
const { data: projectsData, refresh: refreshProjects } = await useAsyncData(
	"projects",
	() => (api.organizationId.value ? api.getProjects() : Promise.resolve({ projects: [] })),
	{ watch: [() => api.organizationId.value] },
);

const projects = computed(() => projectsData.value?.projects || []);

// Auto-slug for org
watch(orgName, (val) => {
	orgSlug.value = val
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
});

async function createOrg() {
	orgLoading.value = true;
	try {
		const { data } = await authClient.organization.create({
			name: orgName.value,
			slug: orgSlug.value,
		});
		if (data) {
			api.organizationId.value = data.id;
			await refreshOrgs();
			showOrgModal.value = false;
		}
	} finally {
		orgLoading.value = false;
	}
}

function onProjectCreated() {
	showCreateModal.value = false;
	refreshProjects();
}
</script>

<template>
	<div class="p-8">
		<!-- Need to create org first -->
		<div v-if="needsOrg" class="max-w-md mx-auto mt-20">
			<UCard>
				<template #header>
					<h2 class="text-xl font-semibold">Create Organization</h2>
					<p class="text-sm text-gray-500 mt-1">You need an organization to get started.</p>
				</template>

				<form @submit.prevent="createOrg" class="space-y-4">
					<UFormField label="Organization Name">
						<UInput v-model="orgName" placeholder="My Company" required autofocus />
					</UFormField>
					<UFormField label="Slug">
						<UInput v-model="orgSlug" placeholder="my-company" required />
					</UFormField>
					<UButton type="submit" block :loading="orgLoading">Create Organization</UButton>
				</form>
			</UCard>
		</div>

		<!-- Projects list -->
		<div v-else>
			<div class="flex items-center justify-between mb-8">
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
				<UButton icon="i-lucide-plus" @click="showCreateModal = true">
					New Project
				</UButton>
			</div>

			<div v-if="projects.length === 0" class="text-center py-20">
				<UIcon name="i-lucide-folder-open" class="text-4xl text-gray-400 mb-4" />
				<p class="text-gray-500 mb-4">No projects yet</p>
				<UButton @click="showCreateModal = true">Create your first project</UButton>
			</div>

			<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<NuxtLink
					v-for="project in projects"
					:key="project.id"
					:to="`/projects/${project.id}`"
				>
					<UCard class="hover:ring-2 hover:ring-primary transition-all cursor-pointer">
						<div>
							<h3 class="font-semibold text-lg">{{ project.name }}</h3>
							<p class="text-sm text-gray-500 mt-1">{{ project.slug }}</p>
							<div class="flex items-center gap-2 mt-3">
								<UBadge variant="subtle">{{ project.sourceLocale }}</UBadge>
							</div>
						</div>
					</UCard>
				</NuxtLink>
			</div>

			<CreateProjectModal
				:open="showCreateModal"
				@close="showCreateModal = false"
				@created="onProjectCreated"
			/>
		</div>
	</div>
</template>
