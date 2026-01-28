import { cartItems, db, products } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

export const load = async ({ params }) => {
	const items = await db
		.select()
		.from(products)
		.where(eq(products.id, params.id))
		.limit(1)
		.then((res) => res[0]);
	if (!items) {
		return {
			status: 404,
			error: new Error('Product not found')
		};
	}
	return { product: items };
};

export const actions = {
	addToCart: async ({ locals, params }) => {
		// 1. Must be logged in
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const userId = locals.user.id;
		const productId = params.id;

		// 2. Ensure product exists (optional but recommended)
		const product = await db
			.select({ id: products.id, stock: products.stock })
			.from(products)
			.where(eq(products.id, productId))
			.limit(1)
			.then((r) => r[0]);

		if (!product) {
			return fail(404, { error: 'Product not found' });
		}

		// 3. Insert or update quantity
		try {
			await db
				.insert(cartItems)
				.values({
					userId,
					productId,
					quantity: 1
				})
				.onConflictDoUpdate({
					target: [cartItems.userId, cartItems.productId],
					set: {
						quantity: sql`${cartItems.quantity} + 1`
					}
				});
		} catch (err) {
			console.error('Add to cart error:', err);
			return fail(500, { error: 'Failed to add to cart' });
		}

		// 4. Redirect (MVP choice)
		throw redirect(302, '/cart');
	}
};
