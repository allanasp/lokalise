import type { Context, Next } from "hono";
import type { AppEnv } from "../lib/types";
import { auth } from "../auth";

export async function sessionMiddleware(c: Context<AppEnv>, next: Next) {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	c.set("user", session.user as AppEnv["Variables"]["user"]);
	c.set("session", session.session as AppEnv["Variables"]["session"]);
	return next();
}
