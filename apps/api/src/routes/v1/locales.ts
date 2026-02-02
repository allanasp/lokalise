import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "../../lib/types";
import { db, locales } from "@lokalise/db";
import { eq, and } from "drizzle-orm";
import { sessionMiddleware } from "../../middleware/auth";

const app = new Hono<AppEnv>();

app.use("/*", sessionMiddleware);

const createLocaleSchema = z.object({
	code: z.string().min(2).max(10),
	name: z.string().min(1).max(100),
	isSource: z.boolean().default(false),
});

app.get("/:projectId/locales", async (c) => {
	const projectId = c.req.param("projectId");
	const result = await db.select().from(locales).where(eq(locales.projectId, projectId));
	return c.json({ locales: result });
});

app.post("/:projectId/locales", zValidator("json", createLocaleSchema), async (c) => {
	const projectId = c.req.param("projectId");
	const body = c.req.valid("json");

	const [locale] = await db
		.insert(locales)
		.values({
			projectId,
			code: body.code,
			name: body.name,
			isSource: body.isSource,
		})
		.returning();

	return c.json({ locale }, 201);
});

app.delete("/:projectId/locales/:localeId", async (c) => {
	const [deleted] = await db
		.delete(locales)
		.where(
			and(
				eq(locales.id, c.req.param("localeId")),
				eq(locales.projectId, c.req.param("projectId")),
			),
		)
		.returning();

	if (!deleted) return c.json({ error: "Locale not found" }, 404);
	return c.json({ success: true });
});

export default app;
