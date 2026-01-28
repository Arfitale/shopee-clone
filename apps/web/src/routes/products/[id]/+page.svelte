<script lang="ts">
	const { data } = $props();
</script>

<a href="/products">Back to products</a>
{#if data.product}
	<div>
		<h3>{data.product.name}</h3>
		<p>Price: Rp {data.product.price.toLocaleString()}</p>
		<p>Stock: {data.product.stock}</p>
		<form method="POST" action="?/addToCart">
		<button
			type="submit"
			class="mt-4 px-4 py-2 rounded-md bg-black text-white hover:bg-black/90"
		>
			Add to Cart
		</button>
</form>
	</div>
{/if}
