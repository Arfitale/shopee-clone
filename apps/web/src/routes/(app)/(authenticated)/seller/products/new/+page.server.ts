import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db, products } from '$lib/db';
import cloudinary from '$lib/server/cloudinary';

export const load = async ({ locals }) => {
	const user = await locals.user;
	if (!user || user.role !== 'SELLER') {
		throw redirect(302, '/login');
	}
};

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const productName = data.get('product-name')?.toString().trim() as string;
		const description = data.get('description')?.toString().trim() as string;
		const price = Number(data.get('price')) as number;
		const stock = Number(data.get('stock')) as number;
		const imageFile = data.get('product-image') as File | null;
		let imageUrl: string | null = null;

		if (!(imageFile instanceof File)) {
			return fail(403, { error: 'Error uploading image' });
		}

		if (imageFile && imageFile.size > 0) {
			const buffer = Buffer.from(await imageFile.arrayBuffer());
			const result = await new Promise<any>((resolve, reject) => {
				cloudinary.uploader
					.upload_stream({ folder: 'products' }, (error, result) => {
						console.log(true);
						if (error) reject(error);
						else resolve(result);
					})
					.end(buffer);
			});
			imageUrl = result.secure_url;
		}

		if (!locals.user || locals.user.role !== 'SELLER') {
			return fail(403, { error: 'Unauthorized' });
		}
		const sellerId = locals.user.id;

		// Validate input
		const error = validateProductData(productName, price, stock);
		if (error) {
			return fail(error.status, error.data);
		}
		try {
			await db.insert(products).values({
				name: productName,
				description,
				price: Number(price),
				sellerId,
				stock: stock,
				imageUrl
			});
		} catch (err) {
			console.log('error happen', err);
			return fail(500, { error: 'Creating product failed. Please try again.' });
		}
		throw redirect(302, '/products');
	}
} satisfies Actions;

function validateProductData(productName: string, price: number, stock: number) {
	if (!productName || productName.trim() === '') {
		return fail(400, { error: 'Product name is required' });
	}

	if (Number.isNaN(price)) {
		return fail(400, { error: 'Price must be a valid number' });
	}

	if (price <= 0) {
		return fail(400, { error: 'Price must be greater than 0' });
	}

	if (Number.isNaN(stock)) {
		return fail(400, { error: 'Stock must be a valid number' });
	}

	if (stock <= 0) {
		return fail(400, { error: 'Stock must be greater than 0' });
	}
}
