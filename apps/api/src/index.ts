import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { AppEnv } from "./lib/types";
import { auth } from "./auth";
import projectRoutes from "./routes/v1/projects";
import localeRoutes from "./routes/v1/locales";
import keyRoutes from "./routes/v1/keys";
import translationRoutes from "./routes/v1/translations";
import importExportRoutes from "./routes/v1/import-export";
import publicTranslationRoutes from "./routes/public/translations";

const app = new Hono<AppEnv>();

// Global middleware
app.use("*", logger());
app.use(
	"*",
	cors({
		origin: (process.env.CORS_ORIGINS || "http://localhost:3001").split(","),
		credentials: true,
	}),
);

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

// Better Auth routes
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

// Admin API routes (session auth) - all sub-routes define their own :projectId
app.route("/api/v1/projects", projectRoutes);
app.route("/api/v1/projects", localeRoutes);
app.route("/api/v1/projects", keyRoutes);
app.route("/api/v1/projects", translationRoutes);
app.route("/api/v1/projects", importExportRoutes);

// Public API routes (API key auth)
app.route("/api/public/v1", publicTranslationRoutes);

const port = Number(process.env.PORT) || 3000;
console.log(`Lokalise API running on port ${port}`);

export default {
	port,
	fetch: app.fetch,
};
