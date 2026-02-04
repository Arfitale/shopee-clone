import { db, orderItems, products, users } from '$lib/db.js';
import { redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	const [seller] = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			role: users.role
		})
		.from(users)
		.where(and(eq(users.id, locals.user.id), eq(users.role, 'SELLER')))
		.limit(1);

	if (!seller) {
		throw redirect(302, '/');
	}

	const productCount = await db.$count(products, eq(products.sellerId, seller.id));
	const orderItemCount = await db.$count(orderItems, eq(orderItems.sellerId, seller.id));

	return {
		seller,
		stats: {
			productCount,
			orderItemCount
		},
		hideMainNav: true
	};
};
