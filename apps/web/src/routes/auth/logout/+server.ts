import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function GET({ locals, cookies }) {
	if (!locals.session) return new Response(null, { status: 401 });

	await lucia.invalidateSession(locals.session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		...sessionCookie.attributes,
		path: sessionCookie.attributes.path ?? '/'
	});

	throw redirect(302, '/');
}
