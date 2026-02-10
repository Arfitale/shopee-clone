import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_CONNECTION!,
  },
  schemaFilter: ["public"],
  strict: true,
  verbose: true,
} satisfies Config;
