import { cartItems, db, orders, users } from '$lib/db.js';
import type { UserProfile } from '$lib/types/global';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	let user: UserProfile | null = null;

	if (!locals.user) {
		return {};
	}

	const queryUser = await db.query.users.findFirst({
		where: eq(users.id, locals.user.id),
		columns: {
			email: true,
			name: true,
			id: true,
			role: true
		}
	});

	if (!queryUser) {
		return {};
	}

	user = queryUser;
	const cartItemCount = await db.$count(cartItems, eq(cartItems.userId, user.id));
	const orderCount = await db.$count(orders, eq(orders.userId, user.id));

	return {
		user,
		cartItemCount,
		orderCount
	};
};
