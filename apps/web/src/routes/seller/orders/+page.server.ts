import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { orderItems, orders, products } from '$lib/db';
import { eq, desc } from 'drizzle-orm';

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
			createdAt: orders.createdAt
		})
		.from(orderItems)
		.innerJoin(products, eq(orderItems.productId, products.id))
		.innerJoin(orders, eq(orderItems.orderId, orders.id))
		.where(eq(products.sellerId, locals.user.id))
		.orderBy(desc(orders.createdAt));

	return { items };
};
