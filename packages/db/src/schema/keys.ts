import { index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const translationKeys = pgTable(
	"translation_keys",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		projectId: uuid("project_id")
			.notNull()
			.references(() => projects.id, { onDelete: "cascade" }),
		key: text("key").notNull(),
		namespace: text("namespace").notNull().default("default"),
		description: text("description"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex("keys_project_ns_key_idx").on(table.projectId, table.namespace, table.key),
		index("keys_project_ns_idx").on(table.projectId, table.namespace),
	],
);
