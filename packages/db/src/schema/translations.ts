import { index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { translationKeys } from "./keys";
import { locales } from "./locales";
import { translationStatusEnum } from "./enums";

export const translations = pgTable(
	"translations",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		keyId: uuid("key_id")
			.notNull()
			.references(() => translationKeys.id, { onDelete: "cascade" }),
		localeId: uuid("locale_id")
			.notNull()
			.references(() => locales.id, { onDelete: "cascade" }),
		value: text("value").notNull().default(""),
		status: translationStatusEnum("status").notNull().default("draft"),
		version: integer("version").notNull().default(1),
		updatedBy: text("updated_by"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex("translations_key_locale_idx").on(table.keyId, table.localeId),
		index("translations_locale_idx").on(table.localeId),
	],
);

export const translationHistory = pgTable(
	"translation_history",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		translationId: uuid("translation_id")
			.notNull()
			.references(() => translations.id, { onDelete: "cascade" }),
		value: text("value").notNull(),
		status: translationStatusEnum("status").notNull(),
		version: integer("version").notNull(),
		changedBy: text("changed_by"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [index("history_translation_idx").on(table.translationId)],
);
