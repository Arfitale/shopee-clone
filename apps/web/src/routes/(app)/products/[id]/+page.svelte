<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import {
		ShoppingCart,
		Package,
		CircleAlert,
		ArrowLeft,
		Truck,
		Shield,
		RefreshCw,
		CheckCircle2,
		Info
	} from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	};

	const getStockStatus = $derived(() => {
		if (!data.product) return null;
		const stock = data.product.stock;
		if (stock === 0)
			return { label: 'Out of Stock', variant: 'destructive' as const, color: 'text-destructive' };
		if (stock < 10)
			return { label: 'Low Stock', variant: 'secondary' as const, color: 'text-orange-600' };
		return { label: 'In Stock', variant: 'default' as const, color: 'text-green-600' };
	});

	// Calculate available quantity (stock minus what's already in cart)
	const availableToAdd = $derived(() => {
		if (!data.product) return 0;
		return Math.max(0, data.product.stock - (data.cartItemQuantity || 0));
	});

	const canAddToCart = $derived(availableToAdd() > 0);

	let isAdding = $state(false);
	let quantity = $state(1);

	// Update max quantity when available changes
	$effect(() => {
		const maxAvailable = availableToAdd();
		if (quantity > maxAvailable && maxAvailable > 0) {
			quantity = maxAvailable;
		}
	});

	const incrementQuantity = () => {
		const maxAvailable = availableToAdd();
		if (quantity < maxAvailable) {
			quantity++;
		}
	};

	const decrementQuantity = () => {
		if (quantity > 1) {
			quantity--;
		}
	};
</script>

{#if !data.product}
	<div class="container mx-auto max-w-6xl px-6 py-20">
		<Card>
			<CardContent class="flex flex-col items-center justify-center py-16">
				<Package class="mb-4 h-16 w-16 text-muted-foreground" />
				<h2 class="mb-2 text-xl font-semibold">Product Not Found</h2>
				<p class="mb-6 text-muted-foreground">The product you're looking for doesn't exist.</p>
				<Button href="/products">
					<ArrowLeft class="mr-2 h-4 w-4" />
					Back to Products
				</Button>
			</CardContent>
		</Card>
	</div>
{:else}
	<div class="min-h-screen bg-muted/40">
		<div class="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<!-- Breadcrumb -->
			<div class="mb-6">
				<Button variant="ghost" href="/products" class="gap-2 pl-0">
					<ArrowLeft class="h-4 w-4" />
					Back to Products
				</Button>
			</div>

			<!-- Product Details -->
			<div class="grid gap-8 lg:grid-cols-2">
				<!-- Image Section -->
				<div class="space-y-4">
					<Card class="overflow-hidden">
						<div class="relative aspect-square bg-muted">
							{#if data.product}
								<img
									src={'https://www.wirelessplace.com/cdn/shop/files/redmi_note_14_pro-3_700x700.png?v=1748488010'}
									alt={data.product.name}
									class="h-full w-full object-cover"
								/>
							{:else}
								<div
									class="flex h-full w-full flex-col items-center justify-center text-muted-foreground"
								>
									<Package class="mb-4 h-24 w-24" />
									<p class="text-sm">No image available</p>
								</div>
							{/if}

							<!-- Stock Badge Overlay -->
							{#if getStockStatus()}
								<Badge variant={getStockStatus()?.variant} class="absolute top-4 right-4">
									{getStockStatus()?.label}
								</Badge>
							{/if}
						</div>
					</Card>

					<!-- Product Features -->
					<Card>
						<CardContent class="grid grid-cols-3 gap-4 p-6">
							<div class="flex flex-col items-center text-center">
								<div
									class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<Truck class="h-5 w-5 text-primary" />
								</div>
								<p class="text-xs font-medium">Fast Delivery</p>
								<p class="text-xs text-muted-foreground">2-3 days</p>
							</div>
							<div class="flex flex-col items-center text-center">
								<div
									class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<Shield class="h-5 w-5 text-primary" />
								</div>
								<p class="text-xs font-medium">Secure Payment</p>
								<p class="text-xs text-muted-foreground">Protected</p>
							</div>
							<div class="flex flex-col items-center text-center">
								<div
									class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<RefreshCw class="h-5 w-5 text-primary" />
								</div>
								<p class="text-xs font-medium">Easy Returns</p>
								<p class="text-xs text-muted-foreground">7 days</p>
							</div>
						</CardContent>
					</Card>
				</div>

				<!-- Product Info Section -->
				<div class="space-y-6">
					<div>
						{#if data.product}
							<Badge variant="outline" class="mb-3">Category</Badge>
						{/if}

						<h1 class="mb-3 text-3xl font-bold tracking-tight lg:text-4xl">
							{data.product.name}
						</h1>

						<div class="flex items-baseline gap-3">
							<p class="text-3xl font-bold text-primary">
								{formatPrice(data.product.price)}
							</p>
						</div>
					</div>

					<Separator />

					<!-- Description -->
					{#if data.product.description}
						<div>
							<h2 class="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
								Description
							</h2>
							<p class="leading-relaxed text-muted-foreground">
								{data.product.description}
							</p>
						</div>
					{/if}

					<!-- Stock Info -->
					<div class="space-y-3">
						<div class="rounded-lg border bg-card p-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<Package class="h-5 w-5 text-muted-foreground" />
									<span class="font-medium">Total Stock:</span>
								</div>
								<span class={getStockStatus()?.color}>
									{data.product.stock > 0 ? `${data.product.stock} units` : 'Out of stock'}
								</span>
							</div>
						</div>

						<!-- Cart Status -->
						{#if data.cartItemQuantity && data.cartItemQuantity > 0}
							<Alert>
								<Info class="h-4 w-4" />
								<AlertDescription>
									<div class="flex flex-col gap-1">
										<p class="font-medium">
											You have {data.cartItemQuantity}
											{data.cartItemQuantity === 1 ? 'item' : 'items'} in your cart
										</p>
										<p class="text-sm text-muted-foreground">
											{availableToAdd() > 0
												? `You can add ${availableToAdd()} more ${availableToAdd() === 1 ? 'item' : 'items'}`
												: 'Cart is full for this product'}
										</p>
									</div>
								</AlertDescription>
							</Alert>
						{/if}
					</div>

					<!-- Add to Cart Section -->
					<Card>
						<CardContent class="space-y-4 p-6">
							{#if data.product.stock > 0}
								{#if canAddToCart}
									<!-- Quantity Selector -->
									<div>
										<label for="quantity" class="mb-2 block text-sm font-medium"> Quantity </label>
										<div class="flex items-center gap-3">
											<div class="flex items-center rounded-lg border">
												<button
													type="button"
													onclick={decrementQuantity}
													disabled={quantity <= 1}
													class="px-4 py-2 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
													aria-label="Decrease quantity"
												>
													−
												</button>
												<input
													id="quantity"
													type="number"
													bind:value={quantity}
													min="1"
													max={availableToAdd()}
													class="w-16 border-x bg-transparent py-2 text-center focus:outline-none"
												/>
												<button
													type="button"
													onclick={incrementQuantity}
													disabled={quantity >= availableToAdd()}
													class="px-4 py-2 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
													aria-label="Increase quantity"
												>
													+
												</button>
											</div>
											<p class="text-sm text-muted-foreground">
												{availableToAdd()} available to add
											</p>
										</div>
									</div>

									<!-- Add to Cart Form -->
									<form
										method="POST"
										action="?/addToCart"
										use:enhance={() => {
											isAdding = true;
											return async ({ update }) => {
												await update();
												isAdding = false;
												quantity = 1;
											};
										}}
									>
										<input type="hidden" name="quantity" value={quantity} />
										<Button type="submit" size="lg" class="w-full gap-2" disabled={isAdding}>
											<ShoppingCart class="h-5 w-5" />
											{isAdding ? 'Adding...' : 'Add to Cart'}
										</Button>
									</form>
								{:else}
									<!-- Cart Full -->
									<div class="space-y-3">
										<Button variant="secondary" size="lg" class="w-full" disabled>
											<CircleAlert class="mr-2 h-5 w-5" />
											Cart Full for This Product
										</Button>
										<p class="text-center text-sm text-muted-foreground">
											You've added all available stock to your cart
										</p>
										<Button variant="outline" size="lg" class="w-full gap-2" href="/cart">
											<ShoppingCart class="h-5 w-5" />
											View Cart
										</Button>
									</div>
								{/if}
							{:else}
								<!-- Out of Stock -->
								<div class="space-y-3">
									<Button variant="destructive" size="lg" class="w-full" disabled>
										<CircleAlert class="mr-2 h-5 w-5" />
										Out of Stock
									</Button>
									<p class="text-center text-sm text-muted-foreground">
										This product is currently unavailable
									</p>
								</div>
							{/if}
						</CardContent>
					</Card>

					<!-- Additional Info -->
					<div class="text-xs text-muted-foreground">
						<p>• Free shipping on orders over Rp 500,000</p>
						<p>• Secure payment processing</p>
						<p>• 7-day return policy</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
