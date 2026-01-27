import { db, products } from '$lib/db';
import { eq } from 'drizzle-orm';

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
