import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const projects = pgTable(
	"projects",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		organizationId: text("organization_id").notNull(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		description: text("description"),
		apiKey: text("api_key")
			.notNull()
			.unique()
			.$defaultFn(() => `lok_${createId()}`),
		sourceLocale: text("source_locale").notNull().default("en"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("projects_org_id_idx").on(table.organizationId),
		index("projects_api_key_idx").on(table.apiKey),
	],
);
