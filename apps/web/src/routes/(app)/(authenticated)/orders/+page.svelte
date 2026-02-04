<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import {
		Package,
		ShoppingBag,
		CircleCheck,
		Clock,
		CircleX,
		Truck,
		CircleAlert,
		Calendar,
		CreditCard
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

	const formatDate = (dateString: string) => {
		return new Intl.DateTimeFormat('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(dateString));
	};

	const getStatusConfig = (status: string) => {
		const configs = {
			PENDING: {
				label: 'Pending',
				variant: 'secondary' as const,
				icon: Clock,
				color: 'text-yellow-600',
				bgColor: 'bg-yellow-100',
				description: 'Awaiting confirmation'
			},
			PROCESSING: {
				label: 'Processing',
				variant: 'default' as const,
				icon: Package,
				color: 'text-blue-600',
				bgColor: 'bg-blue-100',
				description: 'Being prepared'
			},
			SHIPPED: {
				label: 'Shipped',
				variant: 'default' as const,
				icon: Truck,
				color: 'text-purple-600',
				bgColor: 'bg-purple-100',
				description: 'On the way'
			},
			DELIVERED: {
				label: 'Delivered',
				variant: 'default' as const,
				icon: CircleCheck,
				color: 'text-green-600',
				bgColor: 'bg-green-100',
				description: 'Successfully delivered'
			},
			CANCELLED: {
				label: 'Cancelled',
				variant: 'destructive' as const,
				icon: CircleX,
				color: 'text-red-600',
				bgColor: 'bg-red-100',
				description: 'Order cancelled'
			}
		};
		return configs[status as keyof typeof configs] || configs.PENDING;
	};

	const canCancelOrder = (status: string) => {
		return status === 'PENDING';
	};

	let cancellingOrderId = $state<string | null>(null);
</script>

<div class="min-h-screen bg-muted/40">
	<div class="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold tracking-tight">My Orders</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				{data.orders.length === 0
					? 'No orders yet'
					: `${data.orders.length} ${data.orders.length === 1 ? 'order' : 'orders'}`}
			</p>
		</div>

		<!-- Empty State -->
		{#if data.orders.length === 0}
			<Card class="border-dashed">
				<CardContent class="flex flex-col items-center justify-center py-16">
					<div class="mb-4 rounded-full bg-muted p-4">
						<ShoppingBag class="h-12 w-12 text-muted-foreground" />
					</div>
					<h3 class="mb-2 text-lg font-semibold">No orders yet</h3>
					<p class="mb-6 text-center text-sm text-muted-foreground">
						Start shopping to see your orders here
					</p>
					<Button href="/products">Browse Products</Button>
				</CardContent>
			</Card>
		{:else}
			<!-- Orders List -->
			<div class="space-y-4">
				{#each data.orders as order (order.id)}
					{@const statusConfig = getStatusConfig(order.status)}
					<Card class="overflow-hidden transition-shadow hover:shadow-md">
						<CardHeader class="bg-muted/50 pb-4">
							<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
								<div class="space-y-1">
									<div class="flex items-center gap-2">
										<CardTitle class="text-lg">
											Order #{order.id.slice(0, 8).toUpperCase()}
										</CardTitle>
										<Badge variant={statusConfig.variant} class="gap-1">
											<statusConfig.icon />
											{statusConfig.label}
										</Badge>
									</div>
									<CardDescription class="flex items-center gap-1.5">
										<Calendar class="h-3.5 w-3.5" />
										{formatDate(order.createdAt.toISOString())}
									</CardDescription>
								</div>

								<div class="text-left sm:text-right">
									<p class="text-xs text-muted-foreground">Total Amount</p>
									<p class="text-2xl font-bold text-primary">
										{formatPrice(order.totalAmount)}
									</p>
								</div>
							</div>
						</CardHeader>

						<CardContent class="pt-6">
							<!-- Status Description -->
							<div
								class="mb-4 flex items-start gap-3 rounded-lg border p-3 {statusConfig.bgColor}/20"
							>
								<div
									class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full {statusConfig.bgColor}"
								>
									<statusConfig.icon />
								</div>
								<div>
									<p class="font-medium {statusConfig.color}">{statusConfig.label}</p>
									<p class="text-sm text-muted-foreground">{statusConfig.description}</p>
								</div>
							</div>

							<Separator class="my-4" />

							<!-- Order Items -->
							<div class="space-y-1">
								<p class="mb-2 text-sm font-semibold text-muted-foreground">Order Items</p>
								{#each order.items as item, idx (idx)}
									<div
										class="flex items-center justify-between rounded-md px-1 py-2 transition-colors hover:bg-muted/50"
									>
										<div class="flex items-start gap-3">
											<div
												class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted"
											>
												<Package class="h-5 w-5 text-muted-foreground" />
											</div>
											<div>
												<p class="leading-tight font-medium">{item.productName}</p>
												<p class="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
											</div>
										</div>
										<p class="font-semibold">
											{formatPrice(item.price * item.quantity)}
										</p>
									</div>
								{/each}
							</div>

							<!-- Actions -->
							{#if canCancelOrder(order.status)}
								<div class="mt-6 flex justify-end">
									<form
										method="POST"
										action="?/cancelOrder"
										use:enhance={() => {
											cancellingOrderId = order.id;
											return async ({ update }) => {
												await update();
												cancellingOrderId = null;
											};
										}}
									>
										<input type="hidden" name="orderId" value={order.id} />
										<Button
											type="submit"
											variant="outline"
											size="sm"
											class="gap-2"
											disabled={cancellingOrderId === order.id}
										>
											<CircleX class="h-4 w-4" />
											{cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
										</Button>
									</form>
								</div>
							{/if}
						</CardContent>
					</Card>
				{/each}
			</div>
		{/if}
	</div>
</div>
