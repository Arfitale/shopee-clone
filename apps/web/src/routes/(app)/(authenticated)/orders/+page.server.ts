import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { orders, orderItems, products, db } from '$lib/db';
import { eq, desc, inArray, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Fetch orders
	const userOrders = await db
		.select()
		.from(orders)
		.where(eq(orders.userId, locals.user.id))
		.orderBy(desc(orders.createdAt));

	// Fetch order items for all orders
	const items = await db
		.select({
			orderId: orderItems.orderId,
			productName: products.name,
			price: orderItems.price,
			quantity: orderItems.quantity
		})
		.from(orderItems)
		.innerJoin(products, eq(orderItems.productId, products.id))
		.where(
			inArray(
				orderItems.orderId,
				userOrders.map((o) => o.id)
			)
		);

	// Group items by orderId
	const orderItemsMap = new Map<string, typeof items>();

	for (const item of items) {
		const list = orderItemsMap.get(item.orderId) ?? [];
		list.push(item);
		orderItemsMap.set(item.orderId, list);
	}

	return {
		orders: userOrders.map((order) => ({
			...order,
			items: orderItemsMap.get(order.id) ?? []
		}))
	};
};

export const actions = {
	cancelOrder: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(303, '/');
		}

		const data = request.formData();
		const orderId = (await data).get('orderId') as string;

		if (!orderId) {
			throw fail(500, { error: 'invalid order id' });
		}

		try {
			await db.transaction(async (tx) => {
				const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).for('update');

				if (!order || order.userId !== locals.user!.id) {
					throw new Error('Order not found');
				}

				if (order.status === 'SHIPPED') {
					throw new Error('Order already shipped');
				}

				const items = await tx
					.select({
						productId: orderItems.productId,
						quantity: orderItems.quantity,
						status: orderItems.status
					})
					.from(orderItems)
					.where(eq(orderItems.orderId, orderId))
					.for('update');

				if (items.some((item) => item.status === 'SHIPPED')) {
					throw new Error('Some items already shipped');
				}

				for (const item of items) {
					if (item.status === 'CANCELLED') {
						continue;
					}

					await tx
						.update(products)
						.set({
							stock: sql`${products.stock} + ${item.quantity}`
						})
						.where(eq(products.id, item.productId));
				}

				await tx
					.update(orderItems)
					.set({ status: 'CANCELLED' })
					.where(eq(orderItems.orderId, orderId));

				await tx.update(orders).set({ status: 'CANCELLED' }).where(eq(orders.id, orderId));
			});
		} catch (err) {
			return fail(400, {
				error: err instanceof Error ? err.message : 'Cancellation failed'
			});
		}

		throw redirect(302, '/orders');
	}
} satisfies Actions;
