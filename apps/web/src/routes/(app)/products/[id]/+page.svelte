<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	const { data, form } = $props();
</script>

<a href="/products">Back to products</a>
{#if data.product}
	<div class="mx-auto max-w-6xl p-6">
		<div class="grid gap-8 md:grid-cols-2">
			<!-- Image section -->
			<div
				class="flex aspect-square items-center justify-center rounded-xl bg-gray-100 text-gray-400"
			>
				Product Image
			</div>

			<!-- Info section -->
			<div class="flex flex-col">
				<!-- Name -->
				<h1 class="mb-2 text-2xl font-semibold">
					{data.product.name}
				</h1>

				<!-- Price -->
				<p class="mb-4 text-xl font-bold">
					Rp {data.product.price.toLocaleString()}
				</p>

				<!-- Description -->
				{#if data.product.description}
					<p class="mb-6 text-sm leading-relaxed text-gray-600">
						{data.product.description}
					</p>
				{/if}

				<!-- Stock -->
				<p class="mb-4 text-sm text-gray-500">
					Stock available: {data.product.stock}
				</p>

				{#if data.product.stock > 0}
					<form method="POST" action="?/addToCart" class="flex items-center gap-4">
						<button
							type="submit"
							class="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/90"
						>
							Add to Cart
						</button>
					</form>
				{:else}
					<Button variant="destructive">Out of Stock</Button>
				{/if}
				<!-- Add to cart -->

				<!-- Error -->
				{#if form?.error}
					<p class="mt-3 text-sm text-red-600">
						{form.error}
					</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
