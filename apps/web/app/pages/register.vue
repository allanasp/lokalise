<script setup lang="ts">
definePageMeta({ layout: "auth" });

const { signUp } = useAuth();

const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function handleSubmit() {
	error.value = "";
	loading.value = true;
	try {
		const { error: authError } = await signUp(email.value, password.value, name.value);
		if (authError) {
			error.value = authError.message || "Registration failed";
		} else {
			navigateTo("/projects");
		}
	} catch (e: any) {
		error.value = e.message || "Registration failed";
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<UCard class="bg-white dark:bg-gray-800">
		<template #header>
			<h2 class="text-xl font-semibold text-center text-gray-900 dark:text-white">Create Account</h2>
		</template>

		<form @submit.prevent="handleSubmit" class="space-y-4">
			<UAlert v-if="error" color="error" :title="error" />

			<UFormField label="Name" class="text-gray-900 dark:text-white">
				<UInput
					v-model="name"
					placeholder="Your name"
					required
					autofocus
					class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
				/>
			</UFormField>

			<UFormField label="Email" class="text-gray-900 dark:text-white">
				<UInput
					v-model="email"
					type="email"
					placeholder="you@example.com"
					required
					class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
				/>
			</UFormField>

			<UFormField label="Password" class="text-gray-900 dark:text-white">
				<UInput
					v-model="password"
					type="password"
					placeholder="Min. 8 characters"
					required
					minlength="8"
					class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
				/>
			</UFormField>

			<UButton type="submit" block :loading="loading">
				Create Account
			</UButton>
		</form>

		<template #footer>
			<p class="text-center text-sm text-gray-500 dark:text-gray-300">
				Already have an account?
				<NuxtLink to="/login" class="text-primary font-medium dark:text-primary-400">Sign In</NuxtLink>
			</p>
		</template>
	</UCard>
</template>
