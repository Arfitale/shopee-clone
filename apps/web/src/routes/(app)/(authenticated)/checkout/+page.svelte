<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { ShoppingBag, CreditCard, MapPin, CircleAlert, CircleCheck, Truck } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	};

	const shippingCost = $derived(15000);
	const tax = $derived(Math.round(data.total * 0.11)); // 11% PPN
	const grandTotal = $derived(data.total + shippingCost + tax);

	let isSubmitting = $state(false);
	let paymentMethod = $state('cod');
</script>

<div class="container mx-auto max-w-6xl p-6">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold tracking-tight">Checkout</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Complete your order by providing shipping information
		</p>
	</div>

	{#if form?.error}
		<Alert variant="destructive" class="mb-6">
			<CircleAlert class="h-4 w-4" />
			<AlertDescription>
				{form.error}
			</AlertDescription>
		</Alert>
	{/if}

	<form
		method="POST"
		action="?/confirm"
		id="checkout-form"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}}
	>
		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Left Column - Forms -->
			<div class="space-y-6 lg:col-span-2">
				<div>
					<!-- Shipping Information -->
					<Card>
						<CardHeader>
							<CardTitle class="flex items-center gap-2">
								<MapPin class="h-5 w-5" />
								Shipping Information
							</CardTitle>
							<CardDescription>Where should we deliver your order?</CardDescription>
						</CardHeader>
						<CardContent class="space-y-4">
							<div class="grid gap-4 sm:grid-cols-2">
								<div class="space-y-2">
									<Label for="firstName">First Name</Label>
									<Input id="firstName" name="firstName" placeholder="John" required />
								</div>
								<div class="space-y-2">
									<Label for="lastName">Last Name</Label>
									<Input id="lastName" name="lastName" placeholder="Doe" required />
								</div>
							</div>

							<div class="space-y-2">
								<Label for="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="john.doe@example.com"
									required
								/>
							</div>

							<div class="space-y-2">
								<Label for="phone">Phone Number</Label>
								<Input
									id="phone"
									name="phone"
									type="tel"
									placeholder="+62 812-3456-7890"
									required
								/>
							</div>

							<div class="space-y-2">
								<Label for="address">Street Address</Label>
								<Textarea
									id="address"
									name="address"
									placeholder="Jl. Contoh No. 123"
									rows={3}
									required
								/>
							</div>

							<div class="grid gap-4 sm:grid-cols-3">
								<div class="space-y-2">
									<Label for="city">City</Label>
									<Input id="city" name="city" placeholder="Jakarta" required />
								</div>
								<div class="space-y-2">
									<Label for="province">Province</Label>
									<Input id="province" name="province" placeholder="DKI Jakarta" required />
								</div>
								<div class="space-y-2">
									<Label for="postalCode">Postal Code</Label>
									<Input id="postalCode" name="postalCode" placeholder="12345" required />
								</div>
							</div>

							<div class="space-y-2">
								<Label for="notes">Order Notes (Optional)</Label>
								<Textarea
									id="notes"
									name="notes"
									placeholder="Any special instructions for delivery?"
									rows={2}
								/>
							</div>
						</CardContent>
					</Card>

					<!-- Payment Method -->
					<Card class="mt-6">
						<CardHeader>
							<CardTitle class="flex items-center gap-2">
								<CreditCard class="h-5 w-5" />
								Payment Method
							</CardTitle>
							<CardDescription>Select your preferred payment method</CardDescription>
						</CardHeader>
						<CardContent>
							<RadioGroup bind:value={paymentMethod} name="paymentMethod" class="space-y-3">
								<div
									class="flex items-center space-x-3 rounded-lg border p-4 transition-colors has-checked:border-primary has-checked:bg-muted"
								>
									<RadioGroupItem value="cod" id="cod" />
									<Label for="cod" class="flex flex-1 cursor-pointer items-center justify-between">
										<div>
											<div class="font-semibold">Cash on Delivery</div>
											<div class="text-sm text-muted-foreground">Pay when you receive</div>
										</div>
										<Truck class="h-5 w-5 text-muted-foreground" />
									</Label>
								</div>

								<div
									class="flex items-center space-x-3 rounded-lg border p-4 transition-colors has-checked:border-primary has-checked:bg-muted"
								>
									<RadioGroupItem value="bank_transfer" id="bank_transfer" />
									<Label
										for="bank_transfer"
										class="flex flex-1 cursor-pointer items-center justify-between"
									>
										<div>
											<div class="font-semibold">Bank Transfer (Mock)</div>
											<div class="text-sm text-muted-foreground">Simulated payment</div>
										</div>
										<CreditCard class="h-5 w-5 text-muted-foreground" />
									</Label>
								</div>

								<div
									class="flex items-center space-x-3 rounded-lg border p-4 transition-colors has-checked:border-primary has-checked:bg-muted"
								>
									<RadioGroupItem value="e_wallet" id="e_wallet" />
									<Label
										for="e_wallet"
										class="flex flex-1 cursor-pointer items-center justify-between"
									>
										<div>
											<div class="font-semibold">E-Wallet (Mock)</div>
											<div class="text-sm text-muted-foreground">GoPay, OVO, Dana</div>
										</div>
										<div
											class="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
										>
											₹
										</div>
									</Label>
								</div>
							</RadioGroup>
						</CardContent>
					</Card>

					<!-- Submit Button (Mobile) -->
					<div class="lg:hidden">
						<Button type="submit" class="w-full" size="lg" disabled={isSubmitting}>
							{isSubmitting ? 'Processing...' : 'Place Order'}
						</Button>
					</div>
				</div>
			</div>

			<!-- Right Column - Order Summary -->
			<div class="lg:col-span-1">
				<Card class="sticky top-6">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<ShoppingBag class="h-5 w-5" />
							Order Summary
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<!-- Items List -->
						<div class="space-y-3">
							{#each data.items as item (item.cartItemId)}
								<div class="flex items-start justify-between gap-3 text-sm">
									<div class="flex flex-1 items-start gap-2">
										<div
											class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted"
										>
											{#if item.imageUrl}
												<img
													src={item.imageUrl}
													alt={item.name}
													class="h-full w-full rounded-md object-cover"
												/>
											{:else}
												<ShoppingBag class="h-5 w-5 text-muted-foreground" />
											{/if}
										</div>
										<div class="flex-1">
											<p class="line-clamp-2 font-medium">{item.name}</p>
											<p class="text-muted-foreground">Qty: {item.quantity}</p>
										</div>
									</div>
									<p class="font-semibold">
										{formatPrice(item.price * item.quantity)}
									</p>
								</div>
							{/each}
						</div>

						<Separator />

						<!-- Cost Breakdown -->
						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-muted-foreground">Subtotal</span>
								<span>{formatPrice(data.total)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-muted-foreground">Shipping</span>
								<span>{formatPrice(shippingCost)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-muted-foreground">Tax (PPN 11%)</span>
								<span>{formatPrice(tax)}</span>
							</div>
						</div>

						<Separator />

						<!-- Grand Total -->
						<div class="flex justify-between text-base">
							<span class="font-semibold">Total</span>
							<span class="text-xl font-bold">
								{formatPrice(grandTotal)}
							</span>
						</div>

						<!-- Info -->
						<Alert>
							<CircleAlert class="h-4 w-4" />
							<AlertDescription class="text-xs">
								This is a mock checkout. No real payment will be processed.
							</AlertDescription>
						</Alert>
					</CardContent>

					<!-- Submit Button (Desktop) -->
					<CardFooter class="hidden lg:flex">
						<Button type="submit" class="w-full" size="lg" disabled={isSubmitting}>
							{isSubmitting ? 'Processing...' : 'Place Order'}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	</form>
</div>

<style>
	/* Custom style for radio group checked state */
	:global(.has-\[\:checked\]\:border-primary:has(:checked)) {
		border-color: hsl(var(--primary));
	}

	:global(.has-\[\:checked\]\:bg-muted:has(:checked)) {
		background-color: hsl(var(--muted));
	}
</style>
