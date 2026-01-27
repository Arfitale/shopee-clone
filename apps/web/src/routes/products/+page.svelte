<script lang="ts">
	const { data } = $props();
</script>

{#if data.products.length === 0}
	<p>No products available.</p>
{:else}
	<ul>
		{#each data.products as product}
			<li style="margin-bottom: 1rem;">
				<h3>{product.name}</h3>
				<p>Price: Rp {product.price.toLocaleString()}</p>
				<p>Stock: {product.stock}</p>

				<a href={`/products/${product.id}`}>View detail</a>
			</li>
		{/each}
	</ul>
{/if}
