import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@lokalise/db";

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg" }),
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
	secret: process.env.BETTER_AUTH_SECRET!,
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		organization({
			creatorRole: "owner",
		}),
	],
	trustedOrigins: (process.env.CORS_ORIGINS || "http://localhost:3001").split(","),
});
