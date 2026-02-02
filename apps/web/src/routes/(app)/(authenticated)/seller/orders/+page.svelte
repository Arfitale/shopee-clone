<script lang="ts">
	const { data } = $props();
</script>

<div class="mx-auto max-w-5xl p-6">
	<h1 class="mb-6 text-2xl font-semibold">Seller Orders</h1>

	{#if data.items.length === 0}
		<p class="text-gray-500">No orders yet.</p>
	{:else}
		<div class="space-y-4">
			{#each data.items as item}
				<div class="rounded-lg border p-4 text-sm">
					<div class="mb-2 flex justify-between">
						<div>
							<p class="font-medium">{item.productName}</p>
							<p class="text-gray-500">
								Order #{item.orderId.slice(0, 8)}
							</p>
						</div>

						<div class="text-right">
							<p class="font-semibold">
								Rp {(item.price * item.quantity).toLocaleString()}
							</p>
							<p class="text-xs text-gray-500">
								Qty: {item.quantity}
							</p>
						</div>
					</div>

					<div class="flex items-center justify-between">
						<span class="text-xs">
							Status: <strong>{item.status}</strong>
						</span>

						{#if item.status !== 'CANCELLED'}
							<form method="POST" action="?/updateStatus">
								<input type="hidden" name="orderItemId" value={item.orderItemId} />
								<select
									name="status"
									class="rounded border px-2 py-1 text-xs"
									value={item.status ?? 'PENDING'}
								>
									<option value="PENDING">Pending</option>
									<option value="PACKED">Packed</option>
									<option value="SHIPPED">Shipped</option>
									<option value="CANCELLED">Cancelled</option>
								</select>
								<button type="submit" class="ml-2 rounded bg-black px-3 py-1 text-xs text-white">
									Update
								</button>
							</form>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
