<script setup lang="ts">
const colorMode = useColorMode();
</script>

<template>
	<div class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
		<div class="w-full max-w-md p-8">
			<div class="text-center mb-8 flex items-center justify-center gap-4">
				<div class="flex-1 text-right">
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Lokalise</h1>
					<p class="text-gray-600 dark:text-gray-300 mt-2">Open Source Translation Management</p>
				</div>
				<UButton
					:icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
					variant="ghost"
					color="neutral"
					@click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
				/>
			</div>
			<slot />
		</div>
	</div>
</template>
