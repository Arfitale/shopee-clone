import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Import everything from schema
import * as schema from "./schema";

export function createDb(connectionString: string) {
  const client = postgres(connectionString, {
    max: 1,
  });

  return drizzle(client, { schema });
}

// Re-export schema properly
export * from "./schema";
export { schema };
