import { createAuthClient } from "better-auth/vue";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: import.meta.client
		? `${window.location.origin}/api/auth`
		: "http://localhost:3000/api/auth",
	plugins: [organizationClient()],
});
