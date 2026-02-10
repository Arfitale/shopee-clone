import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";

import postgres from "postgres";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const environment = process.env.NODE_ENV ?? "DEVELOPMENT";

// Import everything from schema
export function createDbPg(connectionString: string) {
  const client = postgres(connectionString, {
    max: 1,
  });

  return drizzlePg(client, { schema });
}

export function createDbNeon(connectionString: string) {
  const neonClient = neon(connectionString);
  return drizzleNeon(neonClient, { schema });
}

export function createDb(connectionString: string) {
  return createDbNeon(connectionString);
}

export const db = createDbPg(process.env.NEON_CONNECTION!);
export const neonDb = createDbNeon(process.env.NEON_CONNECTION!);

// Re-export schema properly
export * from "./schema";
export * from "./helpers/order-status";
export { schema };
