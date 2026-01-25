// apps/web/src/lib/db.ts
import { createDb } from '@shopee/db';
import { env } from '$env/dynamic/private';

export const db = createDb(env.DATABASE_URL);

// Re-export schema
export * from '@shopee/db';
