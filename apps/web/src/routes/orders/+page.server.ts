import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { orders, orderItems, products, db } from '$lib/db';
import { eq, desc, inArray } from 'drizzle-orm';

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
