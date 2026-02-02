import type { Context, Next } from "hono";
import type { AppEnv } from "../lib/types";
import { db, projects } from "@lokalise/db";
import { eq } from "drizzle-orm";

export async function apiKeyMiddleware(c: Context<AppEnv>, next: Next) {
	const apiKey = c.req.header("x-api-key");

	if (!apiKey) {
		return c.json({ error: "Missing API key" }, 401);
	}

	const [project] = await db.select().from(projects).where(eq(projects.apiKey, apiKey)).limit(1);

	if (!project) {
		return c.json({ error: "Invalid API key" }, 401);
	}

	c.set("project", project);
	return next();
}
