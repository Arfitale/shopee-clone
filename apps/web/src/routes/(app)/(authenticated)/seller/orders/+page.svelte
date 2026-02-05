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
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import {
		Package,
		ShoppingBag,
		CircleCheck,
		CircleX,
		Clock,
		Truck,
		CircleAlert,
		Filter,
		Search,
		Calendar
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
			month: 'short',
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
				description: 'Awaiting processing'
			},
			PACKED: {
				label: 'Packed',
				variant: 'default' as const,
				icon: Package,
				color: 'text-blue-600',
				bgColor: 'bg-blue-100',
				description: 'Ready to ship'
			},
			SHIPPED: {
				label: 'Shipped',
				variant: 'default' as const,
				icon: Truck,
				color: 'text-purple-600',
				bgColor: 'bg-purple-100',
				description: 'In transit'
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

	let filterStatus = $state<string>('all');
	let searchQuery = $state('');
	let updatingItemId = $state<string | null>(null);

	const filteredItems = $derived(() => {
		let items = data.items;

		if (filterStatus !== 'all') {
			items = items.filter((item) => item.status === filterStatus);
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			items = items.filter(
				(item) =>
					item.productName.toLowerCase().includes(query) ||
					item.orderId.toLowerCase().includes(query)
			);
		}

		return items;
	});

	const statusCounts = $derived(() => {
		const counts = {
			all: data.items.length,
			PENDING: 0,
			PACKED: 0,
			SHIPPED: 0,
			CANCELLED: 0
		};

		data.items.forEach((item) => {
			counts[item.status]++;
		});

		return counts;
	});
</script>

<div class="min-h-screen bg-muted/40 p-6">
	<div class="container mx-auto max-w-7xl space-y-6">
		<!-- Page Header -->
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 class="text-3xl font-bold tracking-tight">Seller Orders</h1>
				<p class="text-muted-foreground">Manage and fulfill your customer orders</p>
			</div>
			<div class="flex items-center gap-2">
				<Badge variant="secondary" class="gap-1">
					<ShoppingBag class="h-3 w-3" />
					{data.items.length} Total Orders
				</Badge>
			</div>
		</div>

		<!-- Filters and Search -->
		<Card>
			<CardContent class="pt-6">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<!-- Search -->
					<div class="relative max-w-md flex-1">
						<Search class="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search by product or order ID..."
							bind:value={searchQuery}
							class="flex h-10 w-full rounded-md border border-input bg-background py-2 pr-3 pl-10 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
						/>
					</div>

					<!-- Status Filter -->
					<div class="flex items-center gap-2">
						<Filter class="h-4 w-4 text-muted-foreground" />
						<div class="flex gap-1">
							<Button
								variant={filterStatus === 'all' ? 'default' : 'outline'}
								size="sm"
								onclick={() => (filterStatus = 'all')}
							>
								All ({statusCounts().all})
							</Button>
							<Button
								variant={filterStatus === 'PENDING' ? 'default' : 'outline'}
								size="sm"
								onclick={() => (filterStatus = 'PENDING')}
							>
								Pending ({statusCounts().PENDING})
							</Button>
							<Button
								variant={filterStatus === 'PACKED' ? 'default' : 'outline'}
								size="sm"
								onclick={() => (filterStatus = 'PACKED')}
							>
								Packed ({statusCounts().PACKED})
							</Button>
							<Button
								variant={filterStatus === 'SHIPPED' ? 'default' : 'outline'}
								size="sm"
								onclick={() => (filterStatus = 'SHIPPED')}
							>
								Shipped ({statusCounts().SHIPPED})
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Empty State -->
		{#if filteredItems().length === 0}
			<Card class="border-dashed">
				<CardContent class="flex flex-col items-center justify-center py-16">
					<div class="mb-4 rounded-full bg-muted p-4">
						<ShoppingBag class="h-12 w-12 text-muted-foreground" />
					</div>
					<h3 class="mb-2 text-lg font-semibold">
						{searchQuery || filterStatus !== 'all' ? 'No orders found' : 'No orders yet'}
					</h3>
					<p class="mb-6 text-center text-sm text-muted-foreground">
						{searchQuery || filterStatus !== 'all'
							? 'Try adjusting your filters or search query'
							: 'Orders will appear here once customers make purchases'}
					</p>
					{#if searchQuery || filterStatus !== 'all'}
						<Button
							variant="outline"
							onclick={() => {
								searchQuery = '';
								filterStatus = 'all';
							}}
						>
							Clear Filters
						</Button>
					{/if}
				</CardContent>
			</Card>
		{:else}
			<!-- Orders List -->
			<div class="space-y-4">
				{#each filteredItems() as item (item.orderItemId)}
					{@const statusConfig = getStatusConfig(item.status)}
					<Card class="overflow-hidden transition-shadow hover:shadow-md">
						<div class="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
							<!-- Order Info -->
							<div class="flex-1 space-y-3">
								<div class="flex items-start justify-between">
									<div>
										<div class="mb-1 flex items-center gap-2">
											<h3 class="text-lg font-semibold">{item.productName}</h3>
											<Badge variant={statusConfig.variant} class="gap-1">
												<statusConfig.icon />
												{statusConfig.label}
											</Badge>
										</div>
										<div
											class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground"
										>
											<span class="flex items-center gap-1">
												<Package class="h-3.5 w-3.5" />
												Order #{item.orderId.slice(0, 8).toUpperCase()}
											</span>
											<span class="flex items-center gap-1">
												<Calendar class="h-3.5 w-3.5" />
												{formatDate(item.createdAt.toISOString())}
											</span>
										</div>
									</div>
								</div>

								<Separator />

								<div class="flex items-center justify-between text-sm">
									<div class="space-y-1">
										<p class="text-muted-foreground">
											Quantity: <span class="font-medium text-foreground"
												>{item.quantity} units</span
											>
										</p>
										<p class="text-muted-foreground">
											Buyer: <span class="font-medium text-foreground">buyer@email.com</span>
										</p>
									</div>
									<div class="text-right">
										<p class="text-xs text-muted-foreground">Total Amount</p>
										<p class="text-2xl font-bold text-primary">
											{formatPrice(item.price * item.quantity)}
										</p>
									</div>
								</div>
							</div>

							<!-- Status Update -->
							{#if item.status !== 'CANCELLED'}
								<div class="lg:border-l lg:pl-6">
									<form
										method="POST"
										action="?/updateStatus"
										class="space-y-3"
										use:enhance={() => {
											updatingItemId = item.orderItemId;
											return async ({ update }) => {
												await update();
												updatingItemId = null;
											};
										}}
									>
										<input type="hidden" name="orderItemId" value={item.orderItemId} />

										<div class="space-y-2">
											<label class="text-sm font-medium"
												>Update Status

												<select
													name="status"
													class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:w-48"
													value={item.status}
												>
													<option value="PENDING">Pending</option>
													<option value="PACKED">Packed</option>
													<option value="SHIPPED">Shipped</option>
													<option value="CANCELLED">Cancelled</option>
												</select>
											</label>
										</div>

										<Button
											type="submit"
											size="sm"
											class="w-full gap-2 lg:w-48"
											disabled={updatingItemId === item.orderItemId}
										>
											<CircleCheck class="h-4 w-4" />
											{updatingItemId === item.orderItemId ? 'Updating...' : 'Update Status'}
										</Button>
									</form>
								</div>
							{:else}
								<div class="lg:border-l lg:pl-6">
									<div
										class="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center"
									>
										<CircleX class="mx-auto mb-2 h-8 w-8 text-destructive" />
										<p class="text-sm font-medium text-destructive">Order Cancelled</p>
										<p class="mt-1 text-xs text-muted-foreground">No actions available</p>
									</div>
								</div>
							{/if}
						</div>
					</Card>
				{/each}
			</div>
		{/if}
	</div>
</div>
