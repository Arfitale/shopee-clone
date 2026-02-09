import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db, users } from '$lib/db';
import { orderItems, orders, products } from '$lib/db';
import { eq, desc, sql } from 'drizzle-orm';
import { syncOrderStatus } from '$lib/db';
import type { OrderItemStatus } from '$lib/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.role !== 'SELLER') {
		throw redirect(302, '/');
	}

	const items = await db
		.select({
			orderItemId: orderItems.id,
			orderId: orderItems.orderId,
			productName: products.name,
			quantity: orderItems.quantity,
			price: orderItems.price,
			status: orderItems.status,
			createdAt: orders.createdAt,
			buyerName: users.name
		})
		.from(orderItems)
		.innerJoin(products, eq(orderItems.productId, products.id))
		.innerJoin(orders, eq(orderItems.orderId, orders.id))
		.innerJoin(users, eq(users.id, orders.userId))
		.where(eq(products.sellerId, locals.user.id))
		.orderBy(desc(orders.createdAt));

	return { items };
};

export const actions = {
	updateStatus: async ({ locals, request }) => {
		if (!locals.user || locals.user.role !== 'SELLER') {
			throw redirect(302, '/');
		}

		const data = await request.formData();
		const orderItemId = data.get('orderItemId')?.toString();
		const status = data.get('status')?.toString() as OrderItemStatus;

		if (!orderItemId || !status) return;

		await db.transaction(async (tx) => {
			let [item] = await tx
				.select()
				.from(orderItems)
				.where(eq(orderItems.id, orderItemId))
				.limit(1);

			if (item.status === 'CANCELLED') {
				return;
			}

			[item] = await tx
				.update(orderItems)
				.set({ status })
				.where(eq(orderItems.id, orderItemId))
				.returning();

			if (status === 'CANCELLED') {
				await tx
					.update(products)
					.set({
						stock: sql`${products.stock} + ${item.quantity}`
					})
					.where(eq(products.id, item.productId));
			}

			await syncOrderStatus(tx, item.orderId);
		});
	}
} satisfies Actions;
