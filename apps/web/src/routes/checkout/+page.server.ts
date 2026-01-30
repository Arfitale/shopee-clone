import { cartItems, db, orderItems, orders, products } from '$lib/db';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const items = await db
		.select({
			cartItemId: cartItems.id,
			productId: products.id,
			name: products.name,
			price: products.price,
			quantity: cartItems.quantity
		})
		.from(cartItems)
		.innerJoin(products, eq(cartItems.productId, products.id))
		.where(eq(cartItems.userId, locals.user.id));

	if (items.length === 0) {
		throw redirect(302, '/cart');
	}

	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	return { items, total };
};

export const actions = {
	confirm: async ({ locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const items = await db
			.select({
				productId: products.id,
				productName: products.name,
				price: products.price,
				quantity: cartItems.quantity
			})
			.from(cartItems)
			.innerJoin(products, eq(cartItems.productId, products.id))
			.where(eq(cartItems.userId, locals.user.id));

		if (items.length === 0) {
			throw fail(400, { message: 'Cart is empty' });
		}

		const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

		try {
			await db.transaction(async (tx) => {
				const [order] = await tx
					.insert(orders)
					.values({
						userId: locals.user.id,
						totalAmount: total,
						status: 'PAID'
					})
					.returning();

				await tx.insert(orderItems).values(
					items.map((item) => ({
						orderId: order.id,
						productId: item.productId,
						productName: item.productName,
						price: item.price,
						quantity: item.quantity
					}))
				);

				await tx.delete(cartItems).where(eq(cartItems.userId, locals.user.id));
			});
		} catch (err) {
			console.log('Error processing order:', err);
			return fail(500, { message: 'Failed to process order' });
		}

		throw redirect(303, '/orders');
	}
} satisfies Actions;
