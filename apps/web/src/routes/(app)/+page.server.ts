import { db, products } from '$lib/db.js';

export const load = async () => {
	const productTotal = await db.$count(products);

	return {
		productTotal: productTotal ?? 0
	};
};
