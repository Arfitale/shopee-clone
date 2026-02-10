// apps/web/src/lib/db.ts
import { createDbNeon } from '@shopee/db';
import { env } from '$env/dynamic/private';
export const db = createDbNeon(env.NEON_CONNECTION);

// Re-export schema
export * from '@shopee/db';
