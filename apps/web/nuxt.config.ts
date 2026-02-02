// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },

	modules: ["@nuxt/ui"],

	css: ["~/assets/css/main.css"],

	runtimeConfig: {
		public: {
			apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:3000",
		},
	},

	// Proxy API requests to the backend in development
	nitro: {
		devProxy: {
			"/api": {
				target: process.env.NUXT_PUBLIC_API_URL || "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
});
