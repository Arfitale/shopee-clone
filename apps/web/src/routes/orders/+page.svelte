<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	const { data } = $props();
</script>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-6 text-2xl font-semibold">My Orders</h1>

	{#if data.orders.length === 0}
		<p class="text-gray-500">You have no orders yet.</p>
	{:else}
		<div class="space-y-6">
			{#each data.orders as order}
				<div class="rounded-lg border p-4">
					<!-- Order header -->
					<div class="mb-3 flex justify-between text-sm">
						<div>
							<p class="font-medium">
								Order #{order.id.slice(0, 8)}
							</p>
							<p class="text-gray-500">
								{new Date(order.createdAt).toLocaleDateString()}
							</p>
						</div>

						<div class="text-right">
							<p class="font-semibold">
								Rp {order.totalAmount.toLocaleString()}
							</p>
							<p class="text-xs text-gray-500">
								Status: {order.status}
							</p>
						</div>
					</div>

					<!-- Items -->
					<div class="divide-y">
						{#each order.items as item}
							<div class="flex justify-between py-2 text-sm">
								<span>
									{item.productName} × {item.quantity}
								</span>
								<span>
									Rp {(item.price * item.quantity).toLocaleString()}
								</span>
							</div>
						{/each}
					</div>

					{#if !(order.status === 'SHIPPED' || order.status === 'PROCESSING' || order.status === 'CANCELLED')}
						<form class="flex justify-end" action="?/cancelOrder" method="POST">
							<input type="hidden" name="orderId" value={order.id} />
							<Button variant="outline" type="submit">Cancel Order</Button>
						</form>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
