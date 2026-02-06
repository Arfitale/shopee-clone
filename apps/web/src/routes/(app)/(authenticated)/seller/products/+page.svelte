<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Package, CirclePlus, Trash2, Search } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	};

	let searchQuery = $state('');
	let deletingId = $state<string | null>(null);

	const filteredProducts = $derived(() => {
		if (!searchQuery) return data.products;

		const query = searchQuery.toLowerCase();
		return data.products.filter((product) => product.name.toLowerCase().includes(query));
	});

	const getStockStatus = (stock: number) => {
		if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
		if (stock < 10) return { label: 'Low Stock', variant: 'secondary' as const };
		return { label: 'In Stock', variant: 'default' as const };
	};
</script>

<div class="min-h-screen bg-muted/40 p-6">
	<div class="container mx-auto max-w-7xl space-y-6">
		<!-- Page Header -->
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 class="text-3xl font-bold tracking-tight">My Products</h1>
				<p class="text-muted-foreground">Manage your product inventory</p>
			</div>
			<Button href="/seller/products/new" class="gap-2">
				<CirclePlus class="h-5 w-5" />
				Add New Product
			</Button>
		</div>

		<!-- Search -->
		<Card>
			<CardContent class="pt-6">
				<div class="relative max-w-md">
					<Search class="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search products..."
						bind:value={searchQuery}
						class="flex h-10 w-full rounded-md border border-input bg-background py-2 pr-3 pl-10 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					/>
				</div>
			</CardContent>
		</Card>

		<!-- Empty State -->
		{#if filteredProducts().length === 0}
			<Card class="border-dashed">
				<CardContent class="flex flex-col items-center justify-center py-16">
					<div class="mb-4 rounded-full bg-muted p-4">
						<Package class="h-12 w-12 text-muted-foreground" />
					</div>
					<h3 class="mb-2 text-lg font-semibold">
						{searchQuery ? 'No products found' : 'No products yet'}
					</h3>
					<p class="mb-6 text-center text-sm text-muted-foreground">
						{searchQuery
							? 'Try a different search term'
							: 'Add your first product to start selling'}
					</p>
					{#if searchQuery}
						<Button variant="outline" onclick={() => (searchQuery = '')}>Clear Search</Button>
					{:else}
						<Button href="/seller/products/new" class="gap-2">
							<CirclePlus class="h-5 w-5" />
							Add Product
						</Button>
					{/if}
				</CardContent>
			</Card>
		{:else}
			<!-- Products Grid -->
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each filteredProducts() as product (product.id)}
					{@const stockStatus = getStockStatus(product.stock)}
					<Card class="overflow-hidden transition-shadow hover:shadow-lg">
						<div class="relative aspect-square bg-muted">
							{#if product}
								<img
									src={'https://www.wirelessplace.com/cdn/shop/files/redmi_note_14_pro-3_700x700.png?v=1748488010'}
									alt={product.name}
									class="h-full w-full object-cover"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center">
									<Package class="h-16 w-16 text-muted-foreground" />
								</div>
							{/if}

							<!-- Status Badges -->
							<div class="absolute top-2 right-2 flex flex-col gap-1">
								<Badge variant={stockStatus.variant}>
									{stockStatus.label}
								</Badge>
							</div>
						</div>

						<CardContent class="flex flex-1 flex-col gap-2 p-4">
							<!-- Product Info -->
							<div>
								<h3 class="mb-1 line-clamp-2 font-semibold">
									{product.name}
								</h3>
								{#if product.description}
									<p class="line-clamp-2 text-xs text-muted-foreground">
										{product.description}
									</p>
								{/if}
							</div>

							<!-- Price & Stock -->
							<div class="flex items-end justify-between">
								<div>
									<p class="text-xs text-muted-foreground">Price</p>
									<p class="text-lg font-bold text-primary">
										{formatPrice(product.price)}
									</p>
								</div>
								<div class="text-right">
									<p class="text-xs text-muted-foreground">Stock</p>
									<p
										class="font-semibold {product.stock === 0
											? 'text-destructive'
											: product.stock < 10
												? 'text-orange-600'
												: 'text-green-600'}"
									>
										{product.stock}
									</p>
								</div>
							</div>

							<!-- Actions -->
							<div class="mt-auto flex gap-2 pt-2">
								<form
									method="POST"
									action="?/delete"
									class="flex-1"
									use:enhance={() => {
										if (!confirm('Are you sure you want to delete this product?')) {
											return async () => {};
										}
										deletingId = product.id;
										return async ({ update }) => {
											await update();
											deletingId = null;
										};
									}}
								>
									<input type="hidden" name="productId" value={product.id} />
									<Button
										type="submit"
										variant="destructive"
										size="sm"
										class="w-full gap-2"
										disabled={deletingId === product.id}
									>
										<Trash2 class="h-3.5 w-3.5" />
										{deletingId === product.id ? 'Deleting...' : 'Delete'}
									</Button>
								</form>
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>
		{/if}
	</div>
</div>
