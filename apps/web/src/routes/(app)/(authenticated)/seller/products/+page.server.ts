import { redirect } from '@sveltejs/kit';
import { db, products } from '$lib/db';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	if (locals.user.role !== 'SELLER') throw redirect(302, '/');

	const sellerProducts = await db
		.select()
		.from(products)
		.where(eq(products.sellerId, locals.user.id));

	return {
		products: sellerProducts || []
	};
};
