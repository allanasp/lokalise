<script setup lang="ts">
const { session, signOut } = useAuth();
const route = useRoute();
const colorMode = useColorMode();
</script>

<template>
	<div class="min-h-screen flex bg-white dark:bg-gray-900">
		<!-- Sidebar -->
		<aside class="w-64 bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col border-r border-gray-200 dark:border-gray-800">
			<div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
				<h1 class="text-xl font-bold">Lokalise</h1>
				<UButton
					:icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
					variant="ghost"
					color="neutral"
					size="xs"
					@click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
				/>
			</div>

			<nav class="flex-1 p-4 space-y-1">
				<NuxtLink
					to="/projects"
					class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
					:class="route.path.startsWith('/projects') ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'"
				>
					<UIcon name="i-lucide-folder" />
					Projects
				</NuxtLink>
			</nav>

			<div class="p-4 border-t border-gray-200 dark:border-gray-800">
				<div class="flex items-center gap-3">
					<UAvatar
						:text="session?.data?.user?.name?.[0] || '?'"
						size="sm"
					/>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium truncate">{{ session?.data?.user?.name }}</p>
						<p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ session?.data?.user?.email }}</p>
					</div>
					<UButton
						icon="i-lucide-log-out"
						variant="ghost"
						color="neutral"
						size="xs"
						@click="signOut().then(() => navigateTo('/login'))"
					/>
				</div>
			</div>
		</aside>

		<!-- Main content -->
		<main class="flex-1 bg-white dark:bg-gray-900">
			<slot />
		</main>
	</div>
</template>
