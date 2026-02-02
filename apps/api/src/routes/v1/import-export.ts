import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "../../lib/types";
import { db, translationKeys, translations, locales } from "@lokalise/db";
import { eq, and } from "drizzle-orm";
import { sessionMiddleware } from "../../middleware/auth";

const app = new Hono<AppEnv>();

app.use("/*", sessionMiddleware);

function flattenJson(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
	const result: Record<string, string> = {};
	for (const [key, value] of Object.entries(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key;
		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			Object.assign(result, flattenJson(value as Record<string, unknown>, fullKey));
		} else {
			result[fullKey] = String(value);
		}
	}
	return result;
}

function unflattenJson(flat: Record<string, string>): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(flat)) {
		const parts = key.split(".");
		let current = result;
		for (let i = 0; i < parts.length - 1; i++) {
			if (!(parts[i] in current)) {
				current[parts[i]] = {};
			}
			current = current[parts[i]] as Record<string, unknown>;
		}
		current[parts[parts.length - 1]] = value;
	}
	return result;
}

const importSchema = z.object({
	locale: z.string().min(2),
	namespace: z.string().default("default"),
	translations: z.record(z.unknown()),
	overwrite: z.boolean().default(false),
});

app.post("/:projectId/import", zValidator("json", importSchema), async (c) => {
	const projectId = c.req.param("projectId");
	const body = c.req.valid("json");
	const user = c.get("user");

	let [locale] = await db
		.select()
		.from(locales)
		.where(and(eq(locales.projectId, projectId), eq(locales.code, body.locale)))
		.limit(1);

	if (!locale) {
		[locale] = await db
			.insert(locales)
			.values({ projectId, code: body.locale, name: body.locale })
			.returning();
	}

	const flat = flattenJson(body.translations as Record<string, unknown>);
	let created = 0;
	let updated = 0;

	for (const [key, value] of Object.entries(flat)) {
		const [dbKey] = await db
			.insert(translationKeys)
			.values({ projectId, key, namespace: body.namespace })
			.onConflictDoNothing()
			.returning();

		const keyRow =
			dbKey ||
			(
				await db
					.select()
					.from(translationKeys)
					.where(
						and(
							eq(translationKeys.projectId, projectId),
							eq(translationKeys.namespace, body.namespace),
							eq(translationKeys.key, key),
						),
					)
					.limit(1)
			)[0];

		if (!keyRow) continue;

		const [existing] = await db
			.select()
			.from(translations)
			.where(and(eq(translations.keyId, keyRow.id), eq(translations.localeId, locale.id)))
			.limit(1);

		if (existing) {
			if (body.overwrite && existing.value !== value) {
				await db
					.update(translations)
					.set({
						value,
						version: existing.version + 1,
						updatedBy: user.id,
						updatedAt: new Date(),
					})
					.where(eq(translations.id, existing.id));
				updated++;
			}
		} else {
			await db.insert(translations).values({
				keyId: keyRow.id,
				localeId: locale.id,
				value,
				status: "draft",
				updatedBy: user.id,
			});
			created++;
		}
	}

	return c.json({ created, updated, total: Object.keys(flat).length });
});

app.get("/:projectId/export", async (c) => {
	const projectId = c.req.param("projectId");
	const localeCode = c.req.query("locale");
	const namespace = c.req.query("namespace") || "default";
	const format = c.req.query("format") || "nested";

	if (!localeCode) {
		return c.json({ error: "locale query parameter is required" }, 400);
	}

	const [locale] = await db
		.select()
		.from(locales)
		.where(and(eq(locales.projectId, projectId), eq(locales.code, localeCode)))
		.limit(1);

	if (!locale) return c.json({ error: "Locale not found" }, 404);

	const rows = await db
		.select({ key: translationKeys.key, value: translations.value })
		.from(translations)
		.innerJoin(translationKeys, eq(translations.keyId, translationKeys.id))
		.where(
			and(
				eq(translations.localeId, locale.id),
				eq(translationKeys.projectId, projectId),
				eq(translationKeys.namespace, namespace),
			),
		);

	const flat: Record<string, string> = {};
	for (const row of rows) {
		flat[row.key] = row.value;
	}

	if (format === "flat") {
		return c.json(flat);
	}

	return c.json(unflattenJson(flat));
});

export default app;
