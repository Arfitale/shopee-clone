import { googleProvider } from '$lib/server/oauth/google';
import { redirect } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';

export async function GET({ cookies }) {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = googleProvider.createAuthorizationURL(state, codeVerifier, ['email', 'profile']);

	// Store state + verifier securely
	cookies.set('google_oauth_state', state, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 10
	});

	cookies.set('google_code_verifier', codeVerifier, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 10
	});

	throw redirect(302, url.toString());
}
