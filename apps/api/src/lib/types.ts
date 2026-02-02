import type { InferSelectModel } from "drizzle-orm";
import type { projects } from "@lokalise/db";

export type Project = InferSelectModel<typeof projects>;

export type AppVariables = {
	user: { id: string; email: string; name: string };
	session: { id: string };
	project: Project;
};

export type AppEnv = { Variables: AppVariables };
