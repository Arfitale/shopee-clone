import { verifyPassword } from '$lib/server/password';
import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db, users } from '$lib/db.js';
import type { Actions } from './$types';

export const load = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase();
		const password = data.get('password')?.toString().trim();

		try {
			// Validate input
			if (!email || !password) {
				return fail(400, { error: 'require email and password' });
			}

			// Check if user exists
			const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
			if (!user) {
				return fail(404, { error: 'User not found' });
			}

			// Check if password login is available
			if (!user.passwordHash) {
				return fail(401, { error: 'Password login not available. Please use OAuth login.' });
			}

			// Verify password
			const isPasswordValid = await verifyPassword(user.passwordHash, password);
			if (!isPasswordValid) {
				return fail(401, { error: 'Invalid password' });
			}

			// Create session
			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			// Set cookie
			cookies.set(sessionCookie.name, sessionCookie.value, {
				...sessionCookie.attributes,
				path: sessionCookie.attributes.path ?? '/'
			});
		} catch {
			return fail(500, { error: 'login failed. Please try again.' });
		}
		throw redirect(302, '/');
	}
} satisfies Actions;
