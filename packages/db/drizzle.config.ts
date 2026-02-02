import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "drizzle-kit";

// Load root .env if DATABASE_URL not already set
if (!process.env.DATABASE_URL) {
	try {
		const envPath = resolve(__dirname, "../../.env");
		const envContent = readFileSync(envPath, "utf-8");
		for (const line of envContent.split("\n")) {
			const trimmed = line.trim();
			if (trimmed && !trimmed.startsWith("#")) {
				const [key, ...rest] = trimmed.split("=");
				if (key && !process.env[key]) {
					process.env[key] = rest.join("=");
				}
			}
		}
	} catch {}
}

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/schema/index.ts",
	out: "./migrations",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
