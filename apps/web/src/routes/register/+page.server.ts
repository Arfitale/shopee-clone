import { hashPassword } from '$lib/server/password';
import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db, users, type User } from '$lib/db.js';
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

		// Validate input
		if (!email || !password) {
			return fail(400, { error: 'require email and password' });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters' });
		}

		// // Check if user already exists
		const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

		if (existingUser?.passwordHash != null) {
			return fail(400, { error: 'An account with this email already exists' });
		}

		try {
			// Hash password
			const passwordHash = await hashPassword(password);
			let user: User;

			if (existingUser) {
				user = await db
					.update(users)
					.set({
						passwordHash
					})
					.where(eq(users.id, existingUser.id))
					.returning()
					.then((res) => res[0]);
			} else {
				user = await db
					.insert(users)
					.values({
						email,
						passwordHash,
						role: 'USER'
					})
					.returning()
					.then((res) => res[0]);
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
			return fail(500, { error: 'Registration failed. Please try again.' });
		}

		throw redirect(302, '/');
	}
} satisfies Actions;
