import { defineConfig } from 'drizzle-kit';

if (!process.env.NEON_CONNECTION) throw new Error('NEON_CONNECTION is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url: process.env.NEON_CONNECTION },
	verbose: true,
	strict: true
});
