import { Hono } from "hono";
import type { AppEnv } from "../../lib/types";
import { db, translations, translationKeys, locales } from "@lokalise/db";
import { eq, and } from "drizzle-orm";
import { apiKeyMiddleware } from "../../middleware/api-key";

const app = new Hono<AppEnv>();

app.use("/*", apiKeyMiddleware);

// GET /api/public/v1/translations?locale=en&namespace=default
app.get("/translations", async (c) => {
	const project = c.get("project");
	const locale = c.req.query("locale");
	const namespace = c.req.query("namespace") || "default";

	if (!locale) {
		return c.json({ error: "locale query parameter is required" }, 400);
	}

	const [localeRow] = await db
		.select()
		.from(locales)
		.where(and(eq(locales.projectId, project.id), eq(locales.code, locale)))
		.limit(1);

	if (!localeRow) {
		return c.json({ error: "Locale not found" }, 404);
	}

	const rows = await db
		.select({
			key: translationKeys.key,
			value: translations.value,
			updatedAt: translations.updatedAt,
		})
		.from(translations)
		.innerJoin(translationKeys, eq(translations.keyId, translationKeys.id))
		.where(
			and(
				eq(translations.localeId, localeRow.id),
				eq(translations.status, "published"),
				eq(translationKeys.projectId, project.id),
				eq(translationKeys.namespace, namespace),
			),
		);

	const result: Record<string, string> = {};
	let maxUpdated = 0;
	for (const row of rows) {
		result[row.key] = row.value;
		const ts = row.updatedAt?.getTime() || 0;
		if (ts > maxUpdated) maxUpdated = ts;
	}

	const etag = `"${maxUpdated.toString(36)}"`;
	const ifNoneMatch = c.req.header("if-none-match");

	if (ifNoneMatch === etag) {
		return c.body(null, 304);
	}

	c.header("ETag", etag);
	c.header("Cache-Control", "no-cache");
	return c.json({ translations: result });
});

// GET /api/public/v1/manifest
app.get("/manifest", async (c) => {
	const project = c.get("project");

	const projectLocales = await db
		.select({ code: locales.code, name: locales.name, isSource: locales.isSource })
		.from(locales)
		.where(eq(locales.projectId, project.id));

	const keys = await db
		.select({ namespace: translationKeys.namespace })
		.from(translationKeys)
		.where(eq(translationKeys.projectId, project.id))
		.groupBy(translationKeys.namespace);

	return c.json({
		locales: projectLocales,
		namespaces: keys.map((k) => k.namespace),
	});
});

export default app;
