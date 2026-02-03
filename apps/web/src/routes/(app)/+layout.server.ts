import { db, users } from '$lib/db.js';
import type { UserProfile } from '$lib/types/global';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	let user: UserProfile | null = null;
	if (locals.user) {
		const queryUser = await db.query.users.findFirst({
			where: eq(users.id, locals.user.id),
			columns: {
				email: true,
				name: true,
				id: true,
				role: true
			}
		});

		if (queryUser) {
			user = queryUser;
		}
	}

	return {
		user
	};
};
