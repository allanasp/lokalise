import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "../../lib/types";
import { db, translations, translationHistory, translationKeys, locales } from "@lokalise/db";
import { eq, and } from "drizzle-orm";
import { sessionMiddleware } from "../../middleware/auth";

const app = new Hono<AppEnv>();

app.use("/*", sessionMiddleware);

const updateTranslationSchema = z.object({
	value: z.string(),
	status: z.enum(["draft", "review", "published"]).optional(),
});

app.get("/:projectId/translations", async (c) => {
	const projectId = c.req.param("projectId");
	const namespace = c.req.query("namespace");
	const limit = Math.min(Number(c.req.query("limit")) || 100, 500);
	const offset = Number(c.req.query("offset")) || 0;

	const conditions = [eq(translationKeys.projectId, projectId)];
	if (namespace) conditions.push(eq(translationKeys.namespace, namespace));

	const rows = await db
		.select({
			keyId: translationKeys.id,
			key: translationKeys.key,
			namespace: translationKeys.namespace,
			translationId: translations.id,
			value: translations.value,
			status: translations.status,
			localeCode: locales.code,
			localeName: locales.name,
			version: translations.version,
			updatedAt: translations.updatedAt,
		})
		.from(translationKeys)
		.leftJoin(translations, eq(translations.keyId, translationKeys.id))
		.leftJoin(locales, eq(translations.localeId, locales.id))
		.where(and(...conditions))
		.limit(limit)
		.offset(offset)
		.orderBy(translationKeys.key);

	return c.json({ translations: rows });
});

app.put(
	"/:projectId/translations/:keyId/:localeId",
	zValidator("json", updateTranslationSchema),
	async (c) => {
		const keyId = c.req.param("keyId");
		const localeId = c.req.param("localeId");
		const body = c.req.valid("json");
		const user = c.get("user");

		const [existing] = await db
			.select()
			.from(translations)
			.where(and(eq(translations.keyId, keyId), eq(translations.localeId, localeId)))
			.limit(1);

		if (existing) {
			await db.insert(translationHistory).values({
				translationId: existing.id,
				value: existing.value,
				status: existing.status,
				version: existing.version,
				changedBy: user.id,
			});

			const [updated] = await db
				.update(translations)
				.set({
					value: body.value,
					status: body.status || existing.status,
					version: existing.version + 1,
					updatedBy: user.id,
					updatedAt: new Date(),
				})
				.where(eq(translations.id, existing.id))
				.returning();

			return c.json({ translation: updated });
		}

		const [created] = await db
			.insert(translations)
			.values({
				keyId,
				localeId,
				value: body.value,
				status: body.status || "draft",
				updatedBy: user.id,
			})
			.returning();

		return c.json({ translation: created }, 201);
	},
);

export default app;
