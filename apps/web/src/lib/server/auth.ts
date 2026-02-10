// apps/web/src/lib/auth.ts (or wherever you initialize Lucia)
import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db, sessions, users } from '$lib/db';

// Create adapter with both tables
const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);
const isProd = process.env.NODE_ENV === 'production';

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: isProd,
			sameSite: isProd ? 'none' : 'lax'
		}
	},
	getUserAttributes: (attributes) => ({
		email: attributes.email,
		role: attributes.role
	})
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			email: string;
			role: string;
		};
	}
}
