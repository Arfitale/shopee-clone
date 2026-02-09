import { db, products } from '$lib/db';
import { and, eq, gt } from 'drizzle-orm';

export const load = async () => {
	const items = await db
		.select({
			id: products.id,
			name: products.name,
			price: products.price,
			stock: products.stock,
			imageUrl: products.imageUrl
		})
		.from(products)
		.where(and(eq(products.isActive, true), gt(products.stock, 0)));
	return { products: items };
};
