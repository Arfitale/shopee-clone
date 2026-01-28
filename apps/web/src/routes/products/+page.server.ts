import { db, products } from '$lib/db';
import { eq } from 'drizzle-orm';

export const load = async () => {
	const items = await db
		.select({
			id: products.id,
			name: products.name,
			price: products.price,
			stock: products.stock
		})
		.from(products)
		.where(eq(products.isActive, true));
	return { products: items };
};
