<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { data } = $props();

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	};

	const getStockStatus = (stock: number) => {
		if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
		if (stock < 10) return { label: 'Low Stock', variant: 'secondary' as const };
		return { label: 'In Stock', variant: 'default' as const };
	};
</script>

<div class="container mx-auto p-6">
	<!-- Header -->
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Products</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Browse our collection of {data.products.length} products
			</p>
		</div>
	</div>

	<!-- Empty State -->
	{#if data.products.length === 0}
		<Card class="border-dashed">
			<CardContent class="flex flex-col items-center justify-center py-16">
				<svg
					class="mb-4 h-12 w-12 text-muted-foreground"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
					/>
				</svg>
				<h3 class="mb-1 text-lg font-semibold">No products available</h3>
				<p class="text-sm text-muted-foreground">Check back later for new items</p>
			</CardContent>
		</Card>

		<!-- Products Grid -->
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each data.products as product (product.id)}
				<a
					href={`/products/${product.id}`}
					class="group rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<Card
						class="h-full overflow-hidden transition-all group-hover:border-primary/50 hover:shadow-lg"
					>
						<CardContent class="p-4">
							<!-- Image -->
							<div class="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
								{#if product.imageUrl}
									<img
										src={product.imageUrl}
										alt={product.name}
										class="h-full w-full object-contain transition-transform group-hover:scale-105"
									/>
								{:else}
									<div class="flex h-full w-full items-center justify-center text-muted-foreground">
										<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									</div>
								{/if}

								<!-- Stock Badge Overlay -->
								{#if product.stock === 0}
									<div class="absolute inset-0 flex items-center justify-center bg-black/50">
										<Badge variant="destructive">Out of Stock</Badge>
									</div>
								{/if}
							</div>

							<!-- Product Info -->
							<div class="space-y-2">
								<h3
									class="line-clamp-2 text-sm leading-tight font-semibold transition-colors group-hover:text-primary"
								>
									{product.name}
								</h3>

								<div class="flex items-center justify-between">
									<p class="text-lg font-bold">
										{formatPrice(product.price)}
									</p>

									{#if product.stock > 0}
										<Badge variant={getStockStatus(product.stock).variant} class="text-xs">
											{product.stock}
										</Badge>
									{/if}
								</div>
							</div>
						</CardContent>
					</Card>
				</a>
			{/each}
		</div>
	{/if}
</div>
