import { cartItems, db, products } from '$lib/db';
import { eq, sql, and } from 'drizzle-orm';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
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
	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	return { items, total };
};

export const actions = {
	increase: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');

		const data = await request.formData();
		const cartItemId = data.get('cartItemId') as string;

		if (!cartItemId) return;

		await db
			.update(cartItems)
			.set({
				quantity: sql`${cartItems.quantity} + 1`
			})
			.where(and(eq(cartItems.id, cartItemId), eq(cartItems.userId, locals.user.id)));
	},

	decrease: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const data = await request.formData();
		const cartItemId = data.get('cartItemId')?.toString();

		if (!cartItemId) return;

		// Decrease quantity
		await db
			.update(cartItems)
			.set({
				quantity: sql`${cartItems.quantity} - 1`
			})
			.where(
				and(
					eq(cartItems.id, cartItemId),
					eq(cartItems.userId, locals.user.id),
					sql`${cartItems.quantity} > 1`
				)
			);
	},

	remove: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const data = await request.formData();
		const cartItemId = data.get('cartItemId')?.toString();

		if (!cartItemId) return;

		await db
			.delete(cartItems)
			.where(and(eq(cartItems.id, cartItemId), eq(cartItems.userId, locals.user.id)));
	}
} satisfies Actions;
