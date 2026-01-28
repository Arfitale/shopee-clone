import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db, products } from '$lib/db';

export const load = async ({ locals }) => {
	const user = await locals.user;
	if (!user || !user.isSeller) {
		throw redirect(302, '/login');
	}
};

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const productName = data.get('product-name')?.toString().trim();
		const description = data.get('description')?.toString().trim();
		const price = Number(data.get('price'));
		const stock = Number(data.get('stock'));

		if (!locals.user || locals.user.role !== 'SELLER') {
			return fail(403, { error: 'Unauthorized' });
		}
		const sellerId = locals.user.id;

		// Validate input
		if (!productName || Number.isNaN(price) || price <= 0 || Number.isNaN(stock) || stock < 0) {
			return fail(400, { error: 'Invalid product data' });
		}

		try {
			await db.insert(products).values({
				name: productName,
				description,
				price: Number(price),
				sellerId,
				stock: stock
			});
		} catch (err) {
			console.log('error happen', err);
			return fail(500, { error: 'Creating product failed. Please try again.' });
		}
		throw redirect(302, '/products');
	}
} satisfies Actions;
