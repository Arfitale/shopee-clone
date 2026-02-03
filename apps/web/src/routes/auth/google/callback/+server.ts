import { lucia } from '$lib/server/auth';
import { and, eq } from 'drizzle-orm';
import { redirect, error } from '@sveltejs/kit';
import { googleProvider } from '$lib/server/oauth/google.js';
import { authProviders, db, users } from '$lib/db.js';
import { randomId } from '$lib/utils/random-id.js';

export async function GET({ url, cookies, fetch }) {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	const storedState = cookies.get('google_oauth_state');
	const codeVerifier = cookies.get('google_code_verifier');

	if (!code || !state || !storedState || !codeVerifier) {
		throw error(400, 'Invalid OAuth request');
	}

	if (state !== storedState) {
		throw error(400, 'Invalid OAuth state');
	}

	// Exchange code for tokens
	const tokens = await googleProvider.validateAuthorizationCode(code, codeVerifier);

	// Fetch Google profile
	const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});

	const googleUser = await res.json();

	// Find or create user
	const [providerAccount] = await db
		.select()
		.from(authProviders)
		.where(
			and(eq(authProviders.provider, 'GOOGLE'), eq(authProviders.providerUserId, googleUser.id))
		);

	let user;

	if (!providerAccount) {
		let [existingUser] = await db.select().from(users).where(eq(users.email, googleUser.email));

		if (!existingUser) {
			// 🆕 Create new user
			const [createdUser] = await db
				.insert(users)
				.values({
					email: googleUser.email,
					role: 'USER',
					name: googleUser.name || `user-${randomId({ length: 6 })}`
				})
				.returning();
			existingUser = createdUser;
		}

		// 🔗 Link provider to user
		await db.insert(authProviders).values({
			userId: existingUser.id,
			provider: 'GOOGLE',
			providerUserId: googleUser.id
		});

		user = existingUser;
	} else {
		[user] = await db.select().from(users).where(eq(users.id, providerAccount.userId));
	}

	// Create Lucia session
	const session = await lucia.createSession(user.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	cookies.set(sessionCookie.name, sessionCookie.value, {
		...sessionCookie.attributes,
		path: sessionCookie.attributes.path ?? '/'
	});

	// Cleanup OAuth cookies
	cookies.delete('google_oauth_state', { path: '/' });
	cookies.delete('google_code_verifier', { path: '/' });

	throw redirect(302, '/');
}
