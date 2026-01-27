<script lang="ts">
	const { data } = $props();
</script>

<a href="/products">Back to products</a>
{#if data.product}
	<div>
		<h3>{data.product.name}</h3>
		<p>Price: Rp {data.product.price.toLocaleString()}</p>
		<p>Stock: {data.product.stock}</p>
	</div>
{/if}
