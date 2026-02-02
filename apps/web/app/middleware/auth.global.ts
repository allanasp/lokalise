export default defineNuxtRouteMiddleware((to) => {
	const { session } = useAuth();

	const publicRoutes = ["/login", "/register"];

	if (!session.value?.data && !publicRoutes.includes(to.path)) {
		return navigateTo("/login");
	}

	if (session.value?.data && publicRoutes.includes(to.path)) {
		return navigateTo("/projects");
	}
});
