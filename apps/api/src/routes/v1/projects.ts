import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "../../lib/types";
import { db, projects } from "@lokalise/db";
import { eq, and } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { sessionMiddleware } from "../../middleware/auth";

const app = new Hono<AppEnv>();

app.use("/*", sessionMiddleware);

const createProjectSchema = z.object({
	name: z.string().min(1).max(100),
	slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
	description: z.string().max(500).optional(),
	sourceLocale: z.string().default("en"),
});

app.get("/", async (c) => {
	const orgId = c.req.header("x-organization-id");
	if (!orgId) return c.json({ error: "x-organization-id header required" }, 400);

	const result = await db.select().from(projects).where(eq(projects.organizationId, orgId));
	return c.json({ projects: result });
});

app.post("/", zValidator("json", createProjectSchema), async (c) => {
	const orgId = c.req.header("x-organization-id");
	if (!orgId) return c.json({ error: "x-organization-id header required" }, 400);

	const body = c.req.valid("json");
	const [project] = await db
		.insert(projects)
		.values({
			organizationId: orgId,
			name: body.name,
			slug: body.slug,
			description: body.description,
			sourceLocale: body.sourceLocale,
		})
		.returning();

	return c.json({ project }, 201);
});

app.get("/:projectId", async (c) => {
	const orgId = c.req.header("x-organization-id");
	if (!orgId) return c.json({ error: "x-organization-id header required" }, 400);

	const projectId = c.req.param("projectId");
	const [project] = await db
		.select()
		.from(projects)
		.where(and(eq(projects.id, projectId), eq(projects.organizationId, orgId)))
		.limit(1);

	if (!project) return c.json({ error: "Project not found" }, 404);
	return c.json({ project });
});

app.patch(
	"/:projectId",
	zValidator(
		"json",
		z.object({
			name: z.string().min(1).max(100).optional(),
			description: z.string().max(500).optional(),
		}),
	),
	async (c) => {
		const orgId = c.req.header("x-organization-id");
		if (!orgId) return c.json({ error: "x-organization-id header required" }, 400);

		const projectId = c.req.param("projectId");
		const body = c.req.valid("json");
		const [project] = await db
			.update(projects)
			.set({ ...body, updatedAt: new Date() })
			.where(and(eq(projects.id, projectId), eq(projects.organizationId, orgId)))
			.returning();

		if (!project) return c.json({ error: "Project not found" }, 404);
		return c.json({ project });
	},
);

app.delete("/:projectId", async (c) => {
	const orgId = c.req.header("x-organization-id");
	if (!orgId) return c.json({ error: "x-organization-id header required" }, 400);

	const projectId = c.req.param("projectId");
	const [deleted] = await db
		.delete(projects)
		.where(and(eq(projects.id, projectId), eq(projects.organizationId, orgId)))
		.returning();

	if (!deleted) return c.json({ error: "Project not found" }, 404);
	return c.json({ success: true });
});

app.post("/:projectId/rotate-key", async (c) => {
	const orgId = c.req.header("x-organization-id");
	if (!orgId) return c.json({ error: "x-organization-id header required" }, 400);

	const projectId = c.req.param("projectId");
	const [project] = await db
		.update(projects)
		.set({ apiKey: `lok_${createId()}`, updatedAt: new Date() })
		.where(and(eq(projects.id, projectId), eq(projects.organizationId, orgId)))
		.returning();

	if (!project) return c.json({ error: "Project not found" }, 404);
	return c.json({ project });
});

export default app;
