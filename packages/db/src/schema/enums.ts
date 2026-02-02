import { pgEnum } from "drizzle-orm/pg-core";

export const translationStatusEnum = pgEnum("translation_status", [
	"draft",
	"review",
	"published",
]);
