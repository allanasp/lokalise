import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "../../lib/types";
import { db, translationKeys } from "@lokalise/db";
import { eq, and, like } from "drizzle-orm";
import { sessionMiddleware } from "../../middleware/auth";

const app = new Hono<AppEnv>();

app.use("/*", sessionMiddleware);

const createKeySchema = z.object({
	key: z.string().min(1).max(500),
	namespace: z.string().default("default"),
	description: z.string().max(1000).optional(),
});

const bulkCreateSchema = z.object({
	keys: z.array(createKeySchema).min(1).max(500),
});

app.get("/:projectId/keys", async (c) => {
	const projectId = c.req.param("projectId");
	const namespace = c.req.query("namespace");
	const search = c.req.query("search");
	const limit = Math.min(Number(c.req.query("limit")) || 100, 500);
	const offset = Number(c.req.query("offset")) || 0;

	const conditions = [eq(translationKeys.projectId, projectId)];
	if (namespace) conditions.push(eq(translationKeys.namespace, namespace));
	if (search) conditions.push(like(translationKeys.key, `%${search}%`));

	const result = await db
		.select()
		.from(translationKeys)
		.where(and(...conditions))
		.limit(limit)
		.offset(offset)
		.orderBy(translationKeys.key);

	return c.json({ keys: result });
});

app.post("/:projectId/keys", zValidator("json", createKeySchema), async (c) => {
	const projectId = c.req.param("projectId");
	const body = c.req.valid("json");

	const [key] = await db
		.insert(translationKeys)
		.values({
			projectId,
			key: body.key,
			namespace: body.namespace,
			description: body.description,
		})
		.returning();

	return c.json({ key }, 201);
});

app.post("/:projectId/keys/bulk", zValidator("json", bulkCreateSchema), async (c) => {
	const projectId = c.req.param("projectId");
	const { keys } = c.req.valid("json");

	const result = await db
		.insert(translationKeys)
		.values(keys.map((k) => ({ projectId, ...k })))
		.onConflictDoNothing()
		.returning();

	return c.json({ keys: result, created: result.length }, 201);
});

app.patch(
	"/:projectId/keys/:keyId",
	zValidator(
		"json",
		z.object({
			description: z.string().max(1000).optional(),
		}),
	),
	async (c) => {
		const [key] = await db
			.update(translationKeys)
			.set({ ...c.req.valid("json"), updatedAt: new Date() })
			.where(
				and(
					eq(translationKeys.id, c.req.param("keyId")),
					eq(translationKeys.projectId, c.req.param("projectId")),
				),
			)
			.returning();

		if (!key) return c.json({ error: "Key not found" }, 404);
		return c.json({ key });
	},
);

app.delete("/:projectId/keys/:keyId", async (c) => {
	const [deleted] = await db
		.delete(translationKeys)
		.where(
			and(
				eq(translationKeys.id, c.req.param("keyId")),
				eq(translationKeys.projectId, c.req.param("projectId")),
			),
		)
		.returning();

	if (!deleted) return c.json({ error: "Key not found" }, 404);
	return c.json({ success: true });
});

export default app;
