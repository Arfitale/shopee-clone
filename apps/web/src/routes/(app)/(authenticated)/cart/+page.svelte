<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';
	import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	};

	const totalItems = $derived(data.items.reduce((sum, item) => sum + item.quantity, 0));
</script>

<div class="container mx-auto max-w-6xl p-6">
	<!-- Header -->
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Shopping Cart</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				{data.items.length === 0
					? 'Your cart is empty'
					: `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart`}
			</p>
		</div>

		<Button variant="outline" href="/products" class="w-full sm:w-auto">
			<ArrowLeft class="mr-2 h-4 w-4" />
			Continue Shopping
		</Button>
	</div>

	{#if data.items.length === 0}
		<!-- Empty State -->
		<Card class="border-dashed">
			<CardContent class="flex flex-col items-center justify-center py-16">
				<div class="mb-4 rounded-full bg-muted p-4">
					<ShoppingBag class="h-12 w-12 text-muted-foreground" />
				</div>
				<h3 class="mb-2 text-lg font-semibold">Your cart is empty</h3>
				<p class="mb-6 text-sm text-muted-foreground">Add items to your cart to get started</p>
				<Button href="/products">Browse Products</Button>
			</CardContent>
		</Card>
	{:else}
		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Cart Items -->
			<div class="lg:col-span-2">
				<Card>
					<CardHeader>
						<CardTitle>Cart Items</CardTitle>
					</CardHeader>
					<CardContent class="p-0">
						<div class="divide-y">
							{#each data.items as item, index (item.cartItemId)}
								<div class="p-6 transition-colors hover:bg-muted/50">
									<div class="flex gap-4">
										<!-- Product Image -->
										<div class="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
											{#if item}
												<img
													src="https://www.wirelessplace.com/cdn/shop/files/redmi_note_14_pro-3_700x700.png?v=1748488010"
													alt={item.name}
													class="h-full w-full object-cover"
												/>
											{:else}
												<div class="flex h-full w-full items-center justify-center">
													<ShoppingBag class="h-8 w-8 text-muted-foreground" />
												</div>
											{/if}
										</div>

										<!-- Product Details -->
										<div class="flex flex-1 flex-col justify-between">
											<div class="flex justify-between gap-4">
												<div class="flex-1">
													<h3 class="leading-tight font-semibold">
														{item.name}
													</h3>
													<p class="mt-1 text-sm text-muted-foreground">
														{formatPrice(item.price)}
													</p>

													{#if item.quantity !== undefined}
														<Badge variant="secondary" class="mt-2 text-xs">
															Only {item.stock} left
														</Badge>
													{/if}
												</div>

												<div class="text-right">
													<p class="font-semibold">
														{formatPrice(item.price * item.quantity)}
													</p>
												</div>
											</div>

											<!-- Quantity Controls & Remove -->
											<div class="flex items-center justify-between">
												<div class="flex items-center gap-2">
													<form method="POST" action="?/decrease" use:enhance>
														<input type="hidden" name="cartItemId" value={item.cartItemId} />
														<Button
															type="submit"
															variant="outline"
															size="icon"
															class="h-8 w-8"
															disabled={item.quantity <= 1}
														>
															<Minus class="h-4 w-4" />
														</Button>
													</form>

													<span class="w-12 text-center font-medium">
														{item.quantity}
													</span>

													<form method="POST" action="?/increase" use:enhance>
														<input type="hidden" name="cartItemId" value={item.cartItemId} />
														<Button
															type="submit"
															variant="outline"
															size="icon"
															class="h-8 w-8"
															disabled={item.quantity !== undefined && item.quantity >= item.stock}
														>
															<Plus class="h-4 w-4" />
														</Button>
													</form>
												</div>

												<form method="POST" action="?/remove" use:enhance>
													<input type="hidden" name="cartItemId" value={item.cartItemId} />
													<Button
														type="submit"
														variant="ghost"
														size="icon"
														class="h-8 w-8 text-muted-foreground hover:text-destructive"
													>
														<Trash2 class="h-4 w-4" />
														<span class="sr-only">Remove item</span>
													</Button>
												</form>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</CardContent>
				</Card>
			</div>

			<!-- Order Summary -->
			<div class="lg:col-span-1">
				<Card class="sticky top-6">
					<CardHeader>
						<CardTitle>Order Summary</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="space-y-2">
							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">Subtotal</span>
								<span>{formatPrice(data.total)}</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">Shipping</span>
								<span class="text-muted-foreground">Calculated at checkout</span>
							</div>
						</div>

						<Separator />

						<div class="flex justify-between">
							<span class="font-semibold">Total</span>
							<span class="text-lg font-bold">
								{formatPrice(data.total)}
							</span>
						</div>

						<div class="space-y-2 text-xs text-muted-foreground">
							<p>• Taxes calculated at checkout</p>
							<p>• Free shipping on orders over Rp 500,000</p>
						</div>
					</CardContent>
					<CardFooter class="flex-col gap-2">
						<Button href="/checkout" class="w-full" size="lg">Proceed to Checkout</Button>
						<Button variant="outline" href="/products" class="w-full">Continue Shopping</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	{/if}
</div>
